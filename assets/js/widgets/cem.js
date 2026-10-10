/* Widget: cem — Cross-Entropy Method planning with MPC, on a toy 2-room world.
 * Usage: <div data-widget="cem" data-samples="300" data-elites="30" data-horizon="5" data-caption="..."></div>
 * In the real models the "dynamics" is the learned predictor in latent space and the cost is the
 * distance between the predicted final embedding and the goal-image embedding. Here dynamics are known
 * (a point that moves by its action and is blocked by a wall) so you can see what CEM itself does.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W.cem = function (el, A) {
    const N = +el.dataset.samples || 300, K = +el.dataset.elites || 30, H = +el.dataset.horizon || 5;
    const MAXSTEP = 2.5, WALLX = 5, DOOR = [4.0, 6.0];
    const START = [1.5, 2.0], GOAL = [8.5, 2.0];
    const SC = 40, S = 10 * SC;
    let rand = A.rng(2024), pos, mu, sig, iter, last, executed, timer = null, SIG0 = 2.5;

    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：CEM（交叉熵方法）+ MPC 规划</div>
      <div class="w-sub">玩具“两房间”环境：从 <b>●</b> 到 <b>★</b>，中间有墙，只能从门洞通过。每轮采样 ${N} 条长度 ${H} 的动作序列，用代价 ‖终点 − 目标‖² 选出前 ${K} 条（elite），再用它们的均值/方差重新拟合高斯分布。把初始 σ 调小试试：没有样本穿过门洞，CEM 会收敛到“贴着墙”的局部最优——代价只看终点、不看路径时，探索至关重要。</div>
      <div class="w-controls">
        <button class="btn primary" type="button" data-act="iter">迭代一次</button>
        <button class="btn" type="button" data-act="run">▶ 自动迭代</button>
        <button class="btn" type="button" data-act="mpc">执行第一步（MPC）</button>
        <button class="btn" type="button" data-act="reset">重置</button>
        <span class="seg" role="group" aria-label="初始标准差">
          <button type="button" data-sig="2.5">初始 σ = 2.5</button>
          <button type="button" data-sig="0.8">初始 σ = 0.8（探索不足）</button>
        </span>
      </div>
      <div class="w-row"><div class="w-stage"></div><div class="w-side"><dl class="stat"></dl><p class="w-note"></p></div></div>`;
    const stage = el.querySelector(".w-stage");
    const stat = el.querySelector(".stat");
    el.querySelector(".w-note").innerHTML = el.dataset.caption ||
      "对应到世界模型：动力学 = 学到的预测器（在潜空间里 rollout），代价 = 预测的最终嵌入与目标图像嵌入的距离。规划完全在潜空间里进行，不生成像素。";
    const svg = A.s("svg", { viewBox: `0 0 ${S} ${S}`, class: "dg", role: "img", "aria-label": "CEM 规划示意" });
    svg.style.maxWidth = "400px";
    stage.append(svg);

    const clipStep = (a) => {
      const n = Math.hypot(a[0], a[1]);
      return n > MAXSTEP ? [(a[0] * MAXSTEP) / n, (a[1] * MAXSTEP) / n] : a;
    };
    function step(p, a) {
      a = clipStep(a);
      let q = [Math.min(10, Math.max(0, p[0] + a[0])), Math.min(10, Math.max(0, p[1] + a[1]))];
      if ((p[0] - WALLX) * (q[0] - WALLX) < 0) {
        const t = (WALLX - p[0]) / (q[0] - p[0]);
        const yc = p[1] + t * (q[1] - p[1]);
        if (yc < DOOR[0] || yc > DOOR[1]) q = [WALLX + (p[0] < WALLX ? -0.06 : 0.06), yc];
      }
      return q;
    }
    function rollout(p, seq) {
      const path = [p];
      for (const a of seq) { p = step(p, a); path.push(p); }
      return path;
    }
    const cost = (path) => { const e = path[path.length - 1]; return (e[0] - GOAL[0]) ** 2 + (e[1] - GOAL[1]) ** 2; };

    function reset() {
      stop();
      rand = A.rng(2024);
      pos = START.slice();
      mu = Array.from({ length: H }, () => [0, 0]);
      sig = Array.from({ length: H }, () => [SIG0, SIG0]);
      iter = 0; last = null; executed = [pos.slice()];
      draw();
    }
    function iterate() {
      const cands = [];
      for (let i = 0; i < N; i++) {
        const seq = mu.map((m, h) => clipStep([m[0] + sig[h][0] * A.gauss(rand), m[1] + sig[h][1] * A.gauss(rand)]));
        const path = rollout(pos, seq);
        cands.push({ seq, path, c: cost(path) });
      }
      cands.sort((a, b) => a.c - b.c);
      const elite = cands.slice(0, K);
      for (let h = 0; h < H; h++) for (let d = 0; d < 2; d++) {
        const m = elite.reduce((s, x) => s + x.seq[h][d], 0) / K;
        const v = elite.reduce((s, x) => s + (x.seq[h][d] - m) ** 2, 0) / K;
        mu[h][d] = m; sig[h][d] = Math.max(0.05, Math.sqrt(v));
      }
      iter++;
      last = { cands, best: cands[0].c };
      draw();
    }
    function mpc() {
      if (!last) iterate();
      const a = clipStep(mu[0]);
      pos = step(pos, a);
      executed.push(pos.slice());
      mu = mu.slice(1).concat([[0, 0]]);           // warm start: shift the plan
      sig = Array.from({ length: H }, () => [SIG0, SIG0]);
      iter = 0; last = null;
      draw();
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } runBtn.textContent = "▶ 自动迭代"; }
    const X = (p) => p[0] * SC, Y = (p) => S - p[1] * SC;
    const poly = (path) => path.map((p) => `${X(p).toFixed(1)},${Y(p).toFixed(1)}`).join(" ");

    function draw() {
      svg.replaceChildren();
      A.s("rect", { x: 0, y: 0, width: S, height: S, fill: "var(--surface-2)", stroke: "var(--border-strong)" }, svg);
      for (let k = 1; k < 10; k++) {
        A.s("line", { x1: k * SC, x2: k * SC, y1: 0, y2: S, class: "grid-ln" }, svg);
        A.s("line", { y1: k * SC, y2: k * SC, x1: 0, x2: S, class: "grid-ln" }, svg);
      }
      const wall = { fill: "var(--text-2)" };
      A.s("rect", Object.assign({ x: WALLX * SC - 4, y: Y([0, DOOR[0]]), width: 8, height: DOOR[0] * SC }, wall), svg);
      A.s("rect", Object.assign({ x: WALLX * SC - 4, y: 0, width: 8, height: (10 - DOOR[1]) * SC }, wall), svg);
      if (last) {
        const g = A.s("g", {}, svg);
        last.cands.slice(K).forEach((c) => A.s("polyline", { points: poly(c.path), fill: "none", stroke: "var(--text-3)", "stroke-width": 0.7, opacity: 0.25 }, g));
        last.cands.slice(0, K).forEach((c) => A.s("polyline", { points: poly(c.path), fill: "none", stroke: "var(--c-pred)", "stroke-width": 1.4, opacity: 0.75 }, g));
      }
      const meanPath = rollout(pos, mu.map(clipStep));
      A.s("polyline", { points: poly(meanPath), fill: "none", stroke: "var(--c-enc)", "stroke-width": 3, "stroke-linejoin": "round" }, svg);
      meanPath.forEach((p) => A.s("circle", { cx: X(p), cy: Y(p), r: 3, fill: "var(--c-enc)" }, svg));
      if (executed.length > 1) A.s("polyline", { points: poly(executed), fill: "none", stroke: "var(--c-act)", "stroke-width": 3.5, "stroke-dasharray": "2 5", "stroke-linecap": "round" }, svg);
      A.s("circle", { cx: X(START), cy: Y(START), r: 6, fill: "var(--text-3)" }, svg);
      A.s("circle", { cx: X(pos), cy: Y(pos), r: 8, fill: "var(--c-act)", stroke: "var(--surface)", "stroke-width": 2 }, svg);
      A.s("text", { x: X(GOAL), y: Y(GOAL) + 1, class: "t-c", style: "font-size:24px;fill:var(--c-loss)", text: "★" }, svg);
      const d = Math.hypot(pos[0] - GOAL[0], pos[1] - GOAL[1]);
      const meanSig = sig.flat().reduce((a, b) => a + b, 0) / (2 * H);
      stat.innerHTML = `
        <dt>CEM 迭代</dt><dd>${iter}</dd>
        <dt>本轮最优代价</dt><dd>${last ? last.best.toFixed(3) : "—"}</dd>
        <dt>均值计划的代价</dt><dd>${cost(meanPath).toFixed(3)}</dd>
        <dt>平均 σ</dt><dd>${meanSig.toFixed(3)}</dd>
        <dt>已执行步数</dt><dd>${executed.length - 1}${d < 0.35 ? "（已到达 ✓）" : ""}</dd>
        <dt>图例</dt><dd><span class="c-pred">橙</span>=elite，灰=其余样本，<span class="c-enc">蓝</span>=当前均值计划，<span class="c-act">绿虚线</span>=已执行轨迹</dd>`;
    }

    const runBtn = el.querySelector('[data-act="run"]');
    el.querySelector('[data-act="iter"]').addEventListener("click", () => { stop(); iterate(); });
    runBtn.addEventListener("click", () => {
      if (timer) return stop();
      runBtn.textContent = "⏸ 暂停";
      let n = 0;
      timer = setInterval(() => { iterate(); if (++n >= 12) stop(); }, 380);
    });
    el.querySelector('[data-act="mpc"]').addEventListener("click", () => { stop(); mpc(); });
    el.querySelector('[data-act="reset"]').addEventListener("click", reset);
    const sigBtns = [...el.querySelectorAll("[data-sig]")];
    const markSig = () => sigBtns.forEach((b) => b.classList.toggle("on", +b.dataset.sig === SIG0));
    sigBtns.forEach((b) => b.addEventListener("click", () => { SIG0 = +b.dataset.sig; markSig(); reset(); }));
    markSig();
    reset();
  };
})();
