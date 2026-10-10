/* Widget: sigreg — SIGReg (Sketched Isotropic Gaussian Regularization) in 2-D.
 * Usage: <div data-widget="sigreg"></div>
 * The statistic follows lucas-maes/le-wm module.py::SIGReg:
 *   t = linspace(0, 3, 17); phi = exp(-t²/2); w = trapezoid(dt) * phi
 *   for each random unit direction u:  h = X·u
 *     err(t) = (mean cos(t h) − phi(t))² + (mean sin(t h))²      ← |ECF − Gaussian CF|²
 *     T_u    = N · Σ_t w(t)·err(t)                               ← Epps–Pulley statistic
 *   SIGReg = mean_u T_u
 * "Optimise" runs plain gradient descent on the points with fresh random directions each step.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  const KN = 17, TMAX = 3;
  const TS = Array.from({ length: KN }, (_, i) => (i * TMAX) / (KN - 1));
  const PHI = TS.map((t) => Math.exp(-t * t / 2));
  const DT = TMAX / (KN - 1);
  const WTS = TS.map((_, i) => (i === 0 || i === KN - 1 ? DT : 2 * DT) * PHI[i]);

  function epps(X, u) {
    const n = X.length;
    const h = X.map((p) => p[0] * u[0] + p[1] * u[1]);
    const c = new Float64Array(KN), s = new Float64Array(KN);
    for (let j = 0; j < KN; j++) {
      let cs = 0, sn = 0;
      for (let i = 0; i < n; i++) { cs += Math.cos(TS[j] * h[i]); sn += Math.sin(TS[j] * h[i]); }
      c[j] = cs / n; s[j] = sn / n;
    }
    let stat = 0;
    for (let j = 0; j < KN; j++) stat += WTS[j] * ((c[j] - PHI[j]) ** 2 + s[j] ** 2);
    return { stat: stat * n, h, c, s };
  }

  W.sigreg = function (el, A) {
    const NPTS = +el.dataset.points || 256;
    const rand = A.rng(99);
    let X = [], u = [1, 0], timer = null, history = [], preset = "collapse";
    const dispDirs = Array.from({ length: 64 }, (_, i) => { const a = (Math.PI * i) / 64; return [Math.cos(a), Math.sin(a)]; });

    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：SIGReg 如何防止坍塌</div>
      <div class="w-sub">${NPTS} 个二维“嵌入”。SIGReg 把它们投影到随机方向 u 上，用 Epps–Pulley 统计量比较一维投影的经验特征函数与 N(0,1) 的特征函数。所有方向都像高斯 ⇔ 整体是各向同性高斯（Cramér–Wold）。</div>
      <div class="w-controls">
        <span class="seg" role="group" aria-label="初始分布">
          <button type="button" data-p="collapse">完全坍塌</button>
          <button type="button" data-p="line">维度坍塌</button>
          <button type="button" data-p="aniso">各向异性</button>
          <button type="button" data-p="square">均匀方块</button>
          <button type="button" data-p="gauss">各向同性高斯</button>
        </span>
      </div>
      <div class="w-controls">
        <button class="btn primary" type="button" data-act="opt">▶ 用 SIGReg 梯度下降</button>
        <button class="btn" type="button" data-act="dir">↻ 换一个投影方向 u</button>
      </div>
      <div class="w-row">
        <div class="w-stage" data-slot="scatter"></div>
        <div class="w-side"><div data-slot="hist"></div><div data-slot="ecf"></div><dl class="stat"></dl></div>
      </div>
      <p class="w-note">“均匀方块”的协方差几乎就是单位阵——只约束一二阶矩的正则（如 VICReg 的方差/协方差项）会认为它已经达标，而 SIGReg 比较的是整个分布，仍会给出明显的惩罚。</p>`;
    const segBtns = [...el.querySelectorAll(".seg button")];
    const optBtn = el.querySelector('[data-act="opt"]');
    const stat = el.querySelector(".stat");
    const SS = 300;
    const scatter = A.s("svg", { viewBox: `0 0 ${SS} ${SS}`, class: "dg", role: "img", "aria-label": "嵌入散点" });
    scatter.style.maxWidth = "340px";
    el.querySelector('[data-slot="scatter"]').append(scatter);
    const hist = A.s("svg", { viewBox: "0 0 320 150", class: "dg", role: "img", "aria-label": "投影直方图" });
    el.querySelector('[data-slot="hist"]').append(hist);
    const ecf = A.s("svg", { viewBox: "0 0 320 130", class: "dg", role: "img", "aria-label": "特征函数" });
    el.querySelector('[data-slot="ecf"]').append(ecf);

    function make(p) {
      const g = () => A.gauss(rand);
      const R = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
      return Array.from({ length: NPTS }, () => {
        if (p === "collapse") return [1.4 + 0.03 * g(), 0.9 + 0.03 * g()];
        if (p === "line") return R(1.6 * g(), 0.03 * g(), 0.5);
        if (p === "aniso") return R(2.2 * g(), 0.45 * g(), 0.5);
        if (p === "square") return [(rand() * 2 - 1) * 1.73, (rand() * 2 - 1) * 1.73];
        return [g(), g()];
      });
    }
    const sigregValue = () => dispDirs.reduce((s, d) => s + epps(X, d).stat, 0) / dispDirs.length;

    function gradStep(lr, M) {
      const n = X.length, G = X.map(() => [0, 0]);
      for (let m = 0; m < M; m++) {
        const a = rand() * Math.PI * 2, d = [Math.cos(a), Math.sin(a)];
        const { h, c, s } = epps(X, d);
        for (let i = 0; i < n; i++) {
          let gi = 0;
          for (let j = 0; j < KN; j++) {
            const t = TS[j];
            gi += WTS[j] * 2 * t * (-(c[j] - PHI[j]) * Math.sin(t * h[i]) + s[j] * Math.cos(t * h[i]));
          }
          G[i][0] += (gi * d[0]) / M; G[i][1] += (gi * d[1]) / M;
        }
      }
      for (let i = 0; i < n; i++) { X[i][0] -= lr * G[i][0]; X[i][1] -= lr * G[i][1]; }
    }

    const sx = (v) => SS / 2 + v * (SS / 8), sy = (v) => SS / 2 - v * (SS / 8);
    function draw() {
      // scatter
      scatter.replaceChildren();
      A.s("rect", { x: 0, y: 0, width: SS, height: SS, fill: "var(--surface-2)", stroke: "var(--border-strong)" }, scatter);
      [1, 2, 3].forEach((r) => A.s("circle", { cx: SS / 2, cy: SS / 2, r: r * (SS / 8), fill: "none", stroke: "var(--border)", "stroke-dasharray": "3 4" }, scatter));
      A.s("line", { x1: 0, x2: SS, y1: SS / 2, y2: SS / 2, class: "grid-ln" }, scatter);
      A.s("line", { y1: 0, y2: SS, x1: SS / 2, x2: SS / 2, class: "grid-ln" }, scatter);
      A.s("line", { x1: sx(-4 * u[0]), y1: sy(-4 * u[1]), x2: sx(4 * u[0]), y2: sy(4 * u[1]), stroke: "var(--c-reg)", "stroke-width": 2, "stroke-dasharray": "6 4" }, scatter);
      A.s("text", { x: sx(3.3 * u[0]) + 6, y: sy(3.3 * u[1]) - 8, style: "fill:var(--c-reg);font-weight:700", text: "u" }, scatter);
      X.forEach((p) => A.s("circle", { cx: sx(p[0]), cy: sy(p[1]), r: 2.4, fill: "var(--c-enc)", opacity: 0.6 }, scatter));
      A.s("text", { x: 6, y: 12, class: "t-xs", text: "虚线圆：半径 1, 2, 3（标准高斯参照）" }, scatter);

      // histogram of projections onto u
      const e = epps(X, u);
      hist.replaceChildren();
      const B = 32, lo = -4, hi = 4, bw = (hi - lo) / B, Wd = 300, Ht = 112, ox = 10, oy = 128, ymax = 0.8;
      const cnt = new Array(B).fill(0);
      e.h.forEach((v) => { const k = Math.floor((v - lo) / bw); if (k >= 0 && k < B) cnt[k]++; });
      A.s("line", { x1: ox, x2: ox + Wd, y1: oy, y2: oy, class: "axis" }, hist);
      cnt.forEach((cN, k) => {
        const dens = cN / (X.length * bw);
        const hh = Math.min(dens / ymax, 1) * Ht;
        A.s("rect", { x: ox + (k * Wd) / B + 0.5, y: oy - hh, width: Wd / B - 1, height: hh, fill: "var(--c-reg)", opacity: 0.55 }, hist);
        if (dens > ymax) A.s("text", { x: ox + (k + 0.5) * (Wd / B), y: oy - Ht - 6, class: "t-c t-xs", text: "↑" }, hist);
      });
      let d = "";
      for (let i = 0; i <= 120; i++) {
        const v = lo + (i * (hi - lo)) / 120, pdf = Math.exp(-v * v / 2) / Math.sqrt(2 * Math.PI);
        d += `${i ? "L" : "M"}${(ox + ((v - lo) / (hi - lo)) * Wd).toFixed(1)},${(oy - (pdf / ymax) * Ht).toFixed(1)}`;
      }
      A.s("path", { d, fill: "none", stroke: "var(--c-loss)", "stroke-width": 2 }, hist);
      A.s("text", { x: ox, y: 9, class: "t-xs", text: "投影 h = X·u 的直方图（红线 = N(0,1) 密度）" }, hist);
      [-3, 0, 3].forEach((v) => A.s("text", { x: ox + ((v - lo) / (hi - lo)) * Wd, y: oy + 10, class: "t-c t-xs", text: String(v) }, hist));

      // characteristic functions
      ecf.replaceChildren();
      const ex = 10, ew = 300, ey = 100, eh = 80;
      const px = (t) => ex + (t / TMAX) * ew, py = (v) => ey - ((v + 1) / 2) * eh * 1.0 - 0;
      A.s("line", { x1: ex, x2: ex + ew, y1: py(0), y2: py(0), class: "axis" }, ecf);
      const pathOf = (arr) => arr.map((v, j) => `${j ? "L" : "M"}${px(TS[j]).toFixed(1)},${py(v).toFixed(1)}`).join("");
      // shaded error between Re ECF and phi
      let area = pathOf(Array.from(e.c));
      for (let j = KN - 1; j >= 0; j--) area += `L${px(TS[j]).toFixed(1)},${py(PHI[j]).toFixed(1)}`;
      A.s("path", { d: area + "Z", fill: "var(--c-loss)", opacity: 0.12 }, ecf);
      A.s("path", { d: pathOf(PHI), fill: "none", stroke: "var(--c-loss)", "stroke-width": 2, "stroke-dasharray": "5 3" }, ecf);
      A.s("path", { d: pathOf(Array.from(e.c)), fill: "none", stroke: "var(--c-enc)", "stroke-width": 2 }, ecf);
      A.s("path", { d: pathOf(Array.from(e.s)), fill: "none", stroke: "var(--c-tgt)", "stroke-width": 1.6 }, ecf);
      A.s("text", { x: ex, y: 9, class: "t-xs", text: "特征函数 vs t∈[0,3]：蓝=Re ECF，紫=Im ECF，红虚线=e^(−t²/2)" }, ecf);
      A.s("text", { x: ex + ew, y: ey + 14, class: "t-r t-xs", text: "t = 3" }, ecf);
      A.s("text", { x: ex, y: ey + 14, class: "t-xs", text: "t = 0" }, ecf);

      const mean = X.reduce((a, p) => [a[0] + p[0] / X.length, a[1] + p[1] / X.length], [0, 0]);
      const v = X.reduce((a, p) => [a[0] + (p[0] - mean[0]) ** 2 / X.length, a[1] + (p[1] - mean[1]) ** 2 / X.length], [0, 0]);
      const val = sigregValue();
      history.push(val);
      if (history.length > 400) history.shift();
      stat.innerHTML = `
        <dt>SIGReg（64 个方向平均）</dt><dd>${val.toFixed(3)}</dd>
        <dt>沿当前 u 的统计量</dt><dd>${e.stat.toFixed(3)}</dd>
        <dt>均值</dt><dd>(${mean[0].toFixed(2)}, ${mean[1].toFixed(2)})</dd>
        <dt>各轴方差</dt><dd>(${v[0].toFixed(2)}, ${v[1].toFixed(2)})</dd>`;
      segBtns.forEach((b) => b.classList.toggle("on", b.dataset.p === preset));
    }

    function stop() { if (timer) { cancelAnimationFrame(timer); timer = null; } optBtn.textContent = "▶ 用 SIGReg 梯度下降"; }
    function load(p) { stop(); preset = p; X = make(p); history = []; draw(); }
    segBtns.forEach((b) => b.addEventListener("click", () => load(b.dataset.p)));
    el.querySelector('[data-act="dir"]').addEventListener("click", () => { const a = rand() * Math.PI; u = [Math.cos(a), Math.sin(a)]; draw(); });
    optBtn.addEventListener("click", () => {
      if (timer) return stop();
      optBtn.textContent = "⏸ 暂停";
      let n = 0;
      // lr / steps tuned offline: collapsed cloud reaches SIGReg < 0.1 in ~100 steps
      const tick = () => {
        gradStep(0.15, 16);
        gradStep(0.15, 16);
        draw();
        timer = ++n < 450 ? requestAnimationFrame(tick) : (stop(), null);
      };
      timer = requestAnimationFrame(tick);
    });
    load("collapse");
  };
})();
