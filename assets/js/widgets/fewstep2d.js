/* Widget: fewstep-2d — why few-step generation is hard, and four ways out, on a 2-D toy.
 * Usage: <div data-widget="fewstep-2d" data-focus="sampling|regress|dmd|drift"></div>
 *
 * Data p0: mixture of 8 isotropic Gaussians on a ring (radius R, std S0, equal weights).
 * Noising (rectified-flow / flow-matching convention): x_t = (1 − t)·x0 + t·ε,  t ∈ [0, 1],  ε ~ N(0, I).
 * For a Gaussian mixture everything is closed-form. Given component k:
 *   x_t | k ~ N((1−t)μ_k, σ_k²(t) I),  σ_k²(t) = (1−t)²S0² + t²
 *   E[x0 | x_t, k] = μ_k + (1−t)S0²/σ_k² · (x_t − (1−t)μ_k)
 *   E[ε  | x_t, k] = t/σ_k² · (x_t − (1−t)μ_k)
 * Posterior weights w_k ∝ N(x_t; (1−t)μ_k, σ_k² I). Teacher velocity v = E[ε − x0 | x_t] (exact).
 *   sampling: Euler on dx/dt = v from t = 1 to 0 with NFE steps (NFE = 1 gives E[x0] = 0 for every sample).
 *   regress : one-step student fitted by L2 regression on (ε, x0) pairs. Independent pairs → optimum E[x0|ε] = E[x0];
 *             ODE pairs (x0 = teacher ODE solution from ε) → optimum is the ODE map itself.
 *   dmd     : particles x (= one-step generator outputs) follow −(x̂_fake − x̂_real)(x_t) at random t (DMD's
 *             denoiser-difference form of the reverse-KL gradient). x̂_real is exact for p0; x̂_fake is the exact
 *             denoiser of the current particle cloud (a mixture of deltas) — i.e. a perfectly trained fake score.
 *   drift   : particles follow V(x) = mean-shift towards data samples − mean-shift towards generated samples
 *             (kernel exp(−‖x−y‖/τ)); V ≡ 0 when the two sets have the same distribution. The same
 *             attraction-minus-repulsion form is the gradient of a kernel MMD.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});
  const K = 8, R = 2.2, S0 = 0.14;
  const MU = Array.from({ length: K }, (_, k) => [R * Math.cos((2 * Math.PI * k) / K), R * Math.sin((2 * Math.PI * k) / K)]);

  // exact posterior quantities for the mixture at time t
  function post(x, t) {
    const lw = [], m0 = [], me = [];
    for (let k = 0; k < K; k++) {
      const s2 = (1 - t) * (1 - t) * S0 * S0 + t * t;
      const dx = x[0] - (1 - t) * MU[k][0], dy = x[1] - (1 - t) * MU[k][1];
      lw.push(-(dx * dx + dy * dy) / (2 * s2) - Math.log(s2));
      const a = ((1 - t) * S0 * S0) / s2, b = t / s2;
      m0.push([MU[k][0] + a * dx, MU[k][1] + a * dy]);
      me.push([b * dx, b * dy]);
    }
    const mx = Math.max(...lw);
    const w = lw.map((l) => Math.exp(l - mx)), z = w.reduce((s, v) => s + v, 0);
    let x0 = [0, 0], e = [0, 0];
    for (let k = 0; k < K; k++) { const p = w[k] / z; x0[0] += p * m0[k][0]; x0[1] += p * m0[k][1]; e[0] += p * me[k][0]; e[1] += p * me[k][1]; }
    return { x0, e };
  }
  const vel = (x, t) => { const { x0, e } = post(x, Math.max(t, 1e-4)); return [e[0] - x0[0], e[1] - x0[1]]; };
  function euler(x1, nfe, keepPath) {
    let x = x1.slice(); const path = keepPath ? [x.slice()] : null;
    for (let i = 0; i < nfe; i++) {
      const t = 1 - i / nfe, dt = 1 / nfe, v = vel(x, t);
      x = [x[0] - dt * v[0], x[1] - dt * v[1]];
      if (keepPath) path.push(x.slice());
    }
    return keepPath ? path : x;
  }
  // denoiser of a particle cloud (mixture of deltas at Y): E[x0 | x_t]
  function fakeDenoise(x, t, Y) {
    const s2 = t * t; let mx = -Infinity; const lw = new Float64Array(Y.length);
    for (let j = 0; j < Y.length; j++) {
      const dx = x[0] - (1 - t) * Y[j][0], dy = x[1] - (1 - t) * Y[j][1];
      lw[j] = -(dx * dx + dy * dy) / (2 * s2); if (lw[j] > mx) mx = lw[j];
    }
    let z = 0, a = 0, b = 0;
    for (let j = 0; j < Y.length; j++) { const w = Math.exp(lw[j] - mx); z += w; a += w * Y[j][0]; b += w * Y[j][1]; }
    return [a / z, b / z];
  }
  function meanShift(x, Y, tau) {
    let z = 0, a = 0, b = 0;
    for (let j = 0; j < Y.length; j++) {
      const dx = Y[j][0] - x[0], dy = Y[j][1] - x[1], w = Math.exp(-Math.sqrt(dx * dx + dy * dy) / tau);
      z += w; a += w * dx; b += w * dy;
    }
    return z > 1e-12 ? [a / z, b / z] : [0, 0];
  }

  const TABS = {
    sampling: "多步 vs 少步采样",
    regress: "一步回归：怎么配对",
    dmd: "分布匹配（DMD）",
    drift: "漂移场（Drifting）",
  };

  W["fewstep-2d"] = function (el, A) {
    const N = 360;
    let tab = TABS[el.dataset.focus] ? el.dataset.focus : "sampling";
    let nfe = 1, coupling = "independent", tau = 0.5, lr = 0.3, iters = 0, timer = null;
    const rand = A.rng(11);
    const noise = Array.from({ length: N }, () => [A.gauss(rand), A.gauss(rand)]);
    const data = Array.from({ length: N }, () => { const k = Math.floor(rand() * K); return [MU[k][0] + S0 * A.gauss(rand), MU[k][1] + S0 * A.gauss(rand)]; });
    let odeEnds = null;                       // teacher ODE endpoints (64-step Euler), computed lazily
    const odeMap = () => odeEnds || (odeEnds = noise.map((e) => euler(e, 64, false)));
    const init = () => noise.map((e) => [0.55 * e[0] + 0.3, 0.55 * e[1] - 0.2]);  // a poor initial generator
    let parts = init();

    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：二维玩具上的“少步生成”</div>
      <div class="w-sub">数据是圆环上的 8 个高斯团（灰色圈）。教师是这个分布的<b>精确</b>概率流 ODE（混合高斯的速度场有闭式解），所以这里看到的误差只来自“步数太少”或“训练目标本身”，不来自网络拟合。</div>
      <div class="w-controls"><span class="seg" role="group" aria-label="演示">${Object.entries(TABS).map(([k, v]) => `<button type="button" data-tab="${k}">${v}</button>`).join("")}</span></div>
      <div class="w-controls" data-slot="ctl"></div>
      <div class="w-row"><div class="w-stage" data-slot="plot"></div></div>
      <dl class="stat"></dl>
      <p class="w-note"></p>`;
    const svg = A.s("svg", { viewBox: "0 0 520 400", class: "dg", style: "max-width:620px", role: "img", "aria-label": "二维少步生成演示" });
    el.querySelector('[data-slot="plot"]').append(svg);
    const ctl = el.querySelector('[data-slot="ctl"]'), stat = el.querySelector(".stat"), note = el.querySelector(".w-note");
    const S = 50, CX = 200, CY = 200;
    const X = (p) => CX + S * p[0], Y = (p) => CY - S * p[1];

    function frame(title) {
      svg.replaceChildren();
      A.s("rect", { x: 4, y: 4, width: 392, height: 392, rx: 8, fill: "var(--surface-2)", "fill-opacity": 0.5, stroke: "var(--border)" }, svg);
      MU.forEach((m) => A.s("circle", { cx: X(m), cy: Y(m), r: S * 3 * S0, fill: "none", stroke: "var(--text-3)", "stroke-dasharray": "3 3" }, svg));
      A.s("text", { x: 410, y: 22, class: "t-sm t-b", text: title }, svg);
    }
    const dots = (P, color, r = 2.2, op = 0.75) => P.forEach((p) => {
      if (Math.abs(p[0]) < 4 && Math.abs(p[1]) < 4) A.s("circle", { cx: X(p), cy: Y(p), r, fill: color, "fill-opacity": op }, svg);
    });
    const legend = (rows) => rows.forEach(([c, txt], i) => {
      A.s("circle", { cx: 416, cy: 50 + i * 20, r: 4, fill: c }, svg);
      A.s("text", { x: 426, y: 50 + i * 20, class: "t-xs", text: txt }, svg);
    });
    function metrics(P) {
      const cnt = new Array(K).fill(0); let dsum = 0;
      P.forEach((p) => {
        let best = 1e9, bk = 0;
        MU.forEach((m, k) => { const d = Math.hypot(p[0] - m[0], p[1] - m[1]); if (d < best) { best = d; bk = k; } });
        dsum += best; if (best < 0.5) cnt[bk]++;
      });
      return { covered: cnt.filter((c) => c >= 0.03 * P.length).length, onMode: cnt.reduce((s, c) => s + c, 0) / P.length, dist: dsum / P.length };
    }
    const statHTML = (m, extra) => `<dt>覆盖的模式</dt><dd>${m.covered} / 8</dd><dt>落在模式上（距中心 &lt; 0.5）</dt><dd>${(100 * m.onMode).toFixed(0)}%</dd><dt>到最近模式中心的平均距离</dt><dd>${m.dist.toFixed(2)}</dd>${extra || ""}`;

    function controls() {
      el.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
      stop();
      if (tab === "sampling") {
        ctl.innerHTML = `<span>采样步数 NFE</span><span class="seg">${[1, 2, 4, 8, 32].map((n) => `<button type="button" data-nfe="${n}" class="${n === nfe ? "on" : ""}">${n}</button>`).join("")}</span>`;
        ctl.querySelectorAll("[data-nfe]").forEach((b) => b.addEventListener("click", () => { nfe = +b.dataset.nfe; controls(); draw(); }));
      } else if (tab === "regress") {
        ctl.innerHTML = `<span>训练对 (ε, x₀) 的配对方式</span><span class="seg"><button type="button" data-c="independent" class="${coupling === "independent" ? "on" : ""}">独立随机配对</button><button type="button" data-c="ode" class="${coupling === "ode" ? "on" : ""}">教师 ODE 配对</button></span>`;
        ctl.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => { coupling = b.dataset.c; controls(); draw(); }));
      } else {
        const knob = tab === "drift"
          ? `<label>核宽 τ <input type="range" data-k="tau" min="0.1" max="1.5" step="0.05" value="${tau}"> <b data-v="tau">${tau.toFixed(2)}</b></label>`
          : `<label>步长 η <input type="range" data-k="lr" min="0.05" max="0.8" step="0.05" value="${lr}"> <b data-v="lr">${lr.toFixed(2)}</b></label>`;
        ctl.innerHTML = `<button class="btn primary" type="button" data-act="run">▶ 迭代</button><button class="btn" type="button" data-act="step">+5 步</button><button class="btn" type="button" data-act="reset">↺ 重置</button>${knob}`;
        ctl.querySelector('[data-act="run"]').addEventListener("click", () => (timer ? stop() : start()));
        ctl.querySelector('[data-act="step"]').addEventListener("click", () => { for (let i = 0; i < 5; i++) update(); draw(); });
        ctl.querySelector('[data-act="reset"]').addEventListener("click", () => { stop(); parts = init(); iters = 0; draw(); });
        const inp = ctl.querySelector("input");
        inp.addEventListener("input", () => {
          if (tab === "drift") tau = +inp.value; else lr = +inp.value;
          ctl.querySelector("[data-v]").textContent = (+inp.value).toFixed(2);
        });
      }
    }
    function start() { timer = setInterval(() => { update(); draw(); if (iters >= 300) stop(); }, 60); const b = ctl.querySelector('[data-act="run"]'); if (b) b.textContent = "❚❚ 暂停"; }
    function stop() { if (timer) clearInterval(timer); timer = null; const b = ctl.querySelector('[data-act="run"]'); if (b) b.textContent = "▶ 迭代"; }

    function update() {
      iters++;
      if (tab === "dmd") {
        const snap = parts.map((p) => p.slice());
        const g = parts.map((p, i) => {
          const t = 0.02 + 0.96 * rand(), e = [A.gauss(rand), A.gauss(rand)];
          const xt = [(1 - t) * p[0] + t * e[0], (1 - t) * p[1] + t * e[1]];
          const real = post(xt, t).x0, fake = fakeDenoise(xt, t, snap);
          const nrm = Math.max(1e-3, (Math.abs(p[0] - real[0]) + Math.abs(p[1] - real[1])) / 2);   // DMD's per-sample normalisation
          return [(fake[0] - real[0]) / nrm, (fake[1] - real[1]) / nrm];
        });
        parts = parts.map((p, i) => [p[0] - 0.1 * lr * g[i][0], p[1] - 0.1 * lr * g[i][1]]);
      } else if (tab === "drift") {
        const snap = parts.map((p) => p.slice());
        parts = parts.map((p) => {
          const vp = meanShift(p, data, tau), vq = meanShift(p, snap, tau);
          return [p[0] + 0.5 * (vp[0] - vq[0]), p[1] + 0.5 * (vp[1] - vq[1])];
        });
      }
    }

    function draw() {
      if (tab === "sampling") {
        frame(`教师 ODE，${nfe} 步 Euler`);
        const show = noise.slice(0, 14);
        show.forEach((e) => {
          const path = euler(e, nfe, true), ref = euler(e, 48, true);
          A.s("path", { d: "M" + ref.map((p) => `${X(p)},${Y(p)}`).join("L"), fill: "none", stroke: "var(--c-tgt)", "stroke-opacity": 0.35, "stroke-width": 1.2 }, svg);
          A.s("path", { d: "M" + path.map((p) => `${X(p)},${Y(p)}`).join("L"), fill: "none", stroke: "var(--c-pred)", "stroke-width": 1.4 }, svg);
        });
        const out = noise.map((e) => euler(e, nfe, false));
        dots(out, "var(--c-pred)");
        legend([["var(--c-pred)", `${nfe} 步的样本 / 轨迹`], ["var(--c-tgt)", "精确 ODE 轨迹（48 步）"]]);
        stat.innerHTML = statHTML(metrics(out), `<dt>NFE</dt><dd>${nfe}</dd>`);
        note.innerHTML = nfe === 1
          ? "1 步时每个样本都落在<b>数据均值（原点）</b>：在 t = 1 处 x₁ 与 x₀ 独立，速度场给出的是 E[x₀] 方向。这正是“直接把步数调到 1”会得到模糊平均图像的原因。"
          : `轨迹是弯的，大步长的 Euler 会切弯道、落在模式之间（${nfe} 步）。步数越多越接近精确解，但每一步都是一次完整的网络前向——少步方法要做的就是在 1–4 步内拿到右边的效果。`;
      } else if (tab === "regress") {
        frame(coupling === "ode" ? "回归 ODE 配对：学到 ODE 映射" : "回归独立配对：学到条件均值");
        const tgt = coupling === "ode" ? odeMap() : data;
        for (let i = 0; i < 40; i++) A.s("line", { x1: X(noise[i]), y1: Y(noise[i]), x2: X(tgt[i]), y2: Y(tgt[i]), stroke: "var(--text-3)", "stroke-opacity": 0.45 }, svg);
        dots(noise.slice(0, 40), "var(--c-data)", 2.4, 0.9);
        const pred = coupling === "ode" ? odeMap() : noise.map(() => [0, 0]);
        dots(pred, "var(--c-enc)", 2.6, 0.8);
        legend([["var(--c-data)", "噪声 ε（起点）"], ["var(--text-3)", "训练对 ε → x₀（40 条）"], ["var(--c-enc)", "一步学生的最优输出"]]);
        stat.innerHTML = statHTML(metrics(pred), `<dt>L2 最优解</dt><dd>${coupling === "ode" ? "ODE 映射 Φ(ε)" : "E[x₀ | ε] = E[x₀] = 0"}</dd>`);
        note.innerHTML = coupling === "ode"
          ? "用教师 ODE 的端点当目标，配对是<b>确定性</b>的：每个 ε 只对应一个 x₀，连线互不交叉，L2 回归的最优解就是 ODE 映射本身 → 一步即得正确样本。代价是要先跑完教师的多步采样（Knowledge Distillation、Progressive Distillation、Reflow 都在这条线上）。"
          : "随机配对时同一个 ε 可能连到任何一个模式，连线大量交叉；L2 回归的最优解是条件期望，这里就是数据均值 → 所有样本塌到原点。Rectified Flow 的 reflow 正是用 ODE 端点重新配对，把交叉“拉直”。";
      } else {
        const isD = tab === "dmd";
        frame(isD ? `DMD 粒子更新（第 ${iters} 步）` : `漂移场粒子更新（第 ${iters} 步）`);
        if (!isD) dots(data.slice(0, 200), "var(--c-data)", 1.6, 0.35);
        // arrows for a subset
        const snap = parts.map((p) => p.slice());
        parts.slice(0, 36).forEach((p) => {
          let v;
          if (isD) { const t = 0.5, real = post(p.map((c) => (1 - t) * c), t).x0, fake = fakeDenoise(p.map((c) => (1 - t) * c), t, snap); v = [real[0] - fake[0], real[1] - fake[1]]; }
          else { const vp = meanShift(p, data, tau), vq = meanShift(p, snap, tau); v = [vp[0] - vq[0], vp[1] - vq[1]]; }
          const L = Math.hypot(v[0], v[1]), sc = Math.min(1, 0.9 / Math.max(L, 1e-6));
          if (L > 1e-3) A.s("line", { x1: X(p), y1: Y(p), x2: X([p[0] + sc * v[0], p[1] + sc * v[1]]), y2: Y([p[0] + sc * v[0], p[1] + sc * v[1]]), stroke: isD ? "var(--c-loss)" : "var(--c-reg)", "stroke-width": 1.3 }, svg);
        });
        dots(parts, "var(--c-enc)", 2.3, 0.8);
        legend(isD
          ? [["var(--c-enc)", "学生样本（粒子）"], ["var(--c-loss)", "−(x̂_fake − x̂_real) 方向"]]
          : [["var(--c-enc)", "生成样本（负样本）"], ["var(--c-data)", "数据样本（正样本）"], ["var(--c-reg)", "漂移 V = V⁺ − V⁻"]]);
        stat.innerHTML = statHTML(metrics(parts), `<dt>迭代</dt><dd>${iters}</dd>`);
        note.innerHTML = isD
          ? "每个粒子在随机噪声水平 t 被加噪，再比较两个去噪器：真实分布的 x̂_real（冻结教师）与当前学生分布的 x̂_fake（在线训练的 fake score，这里用粒子云的精确去噪器代替）。两者之差就是反向 KL 的梯度方向；学生分布与数据一致时差为 0。真实训练里 fake score 只是近似、更新还会滞后，这正是 DMD2 要用 TTUR 的原因。"
          : "不加噪、也不需要教师：每个生成样本被核加权地拉向附近的数据样本（V⁺），同时被推离附近的其他生成样本（V⁻）。两个点集同分布时 V⁺ 与 V⁻ 抵消，V = 0。τ 太小只看到最近邻，太大则所有模式被平均。Drifting Models 在特征空间里计算这个场；RDM 用的 MMD 梯度也是“吸引 − 排斥”的同一形式。";
      }
    }

    el.querySelectorAll("[data-tab]").forEach((b) => b.addEventListener("click", () => { tab = b.dataset.tab; parts = init(); iters = 0; controls(); draw(); }));
    controls();
    draw();
  };
})();
