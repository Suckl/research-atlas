/* Widget: specdec — speculative decoding: expected tokens / speedup curves + modified rejection sampling.
 * Usage: <div data-widget="specdec"></div>
 * Formulas (Leviathan et al. 2023):
 *   E[tokens per step] = (1 − α^(γ+1)) / (1 − α)
 *   speedup ≈ (1 − α^(γ+1)) / ((1 − α)(γc + 1))     c = draft-step time / target-step time
 * Sampling (per drafted token x ~ q):  accept with prob min(1, p(x)/q(x)); on rejection sample x ~ norm(max(0, p − q)).
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  const VOCAB = ["the", "a", "an", "of", "to", "in", "cat", "dog"];
  const PRESETS = {
    "接近（α≈0.8）": { p: [0.40, 0.25, 0.10, 0.08, 0.07, 0.05, 0.03, 0.02], q: [0.35, 0.30, 0.12, 0.06, 0.08, 0.04, 0.03, 0.02] },
    "一般（α≈0.6）": { p: [0.40, 0.25, 0.10, 0.08, 0.07, 0.05, 0.03, 0.02], q: [0.20, 0.15, 0.25, 0.15, 0.05, 0.10, 0.05, 0.05] },
    "很差（α≈0.3）": { p: [0.40, 0.25, 0.10, 0.08, 0.07, 0.05, 0.03, 0.02], q: [0.05, 0.05, 0.05, 0.05, 0.10, 0.10, 0.30, 0.30] },
  };

  W.specdec = function (el, A) {
    let alpha = 0.75, c = 0.05, preset = Object.keys(PRESETS)[0];
    const rand = A.rng(7);
    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：投机解码的收益公式与修正拒绝采样</div>
      <div class="w-sub">左：给定接受率 α 与草稿/目标耗时比 c，每步期望产出与加速比随 γ 的变化。右：一个 8 词词表上的目标分布 p、草稿分布 q，看“接受概率”和“残差分布”如何保证最终采样恰好服从 p。</div>
      <div class="w-controls">
        <label>α <input type="range" data-k="alpha" min="0.1" max="0.95" step="0.01" value="0.75"> <b data-v="alpha">0.75</b></label>
        <label>c <input type="range" data-k="c" min="0.01" max="0.5" step="0.01" value="0.05"> <b data-v="c">0.05</b></label>
        <label>p / q 预设 <select data-k="preset">${Object.keys(PRESETS).map((k) => `<option>${k}</option>`).join("")}</select></label>
        <button class="btn primary" type="button" data-act="sample">采样 20000 次验证</button>
      </div>
      <div class="w-row">
        <div class="w-stage" data-slot="curves"></div>
        <div class="w-stage" data-slot="dist"></div>
      </div>
      <dl class="stat"></dl>
      <p class="w-note"></p>`;
    const curves = A.s("svg", { viewBox: "0 0 460 260", class: "dg", role: "img", "aria-label": "期望 token 与加速比曲线" });
    const dist = A.s("svg", { viewBox: "0 0 460 260", class: "dg", role: "img", "aria-label": "拒绝采样分布" });
    el.querySelector('[data-slot="curves"]').append(curves);
    el.querySelector('[data-slot="dist"]').append(dist);
    const stat = el.querySelector(".stat"), note = el.querySelector(".w-note");
    let empirical = null;

    const E = (g, a) => (1 - Math.pow(a, g + 1)) / (1 - a);
    const S = (g, a, cc) => E(g, a) / (g * cc + 1);

    function drawCurves() {
      curves.replaceChildren();
      const X0 = 40, X1 = 440, Y0 = 220, Y1 = 20, G = 12;
      const lx = (g) => X0 + (g / G) * (X1 - X0);
      const ymax = Math.max(4, Math.ceil(Math.max(E(G, alpha), S(G, alpha, c)) + 0.5));
      const ly = (v) => Y0 - (v / ymax) * (Y0 - Y1);
      A.s("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, class: "axis" }, curves);
      A.s("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, class: "axis" }, curves);
      for (let g = 0; g <= G; g += 2) A.s("text", { x: lx(g), y: Y0 + 14, class: "t-c t-xs", text: String(g) }, curves);
      for (let v = 1; v <= ymax; v++) { A.s("line", { x1: X0, x2: X1, y1: ly(v), y2: ly(v), class: "grid-ln" }, curves); A.s("text", { x: X0 - 4, y: ly(v), class: "t-r t-xs", text: String(v) }, curves); }
      A.s("text", { x: (X0 + X1) / 2, y: Y0 + 30, class: "t-c t-xs", text: "γ（每步草稿 token 数）" }, curves);
      const path = (f) => Array.from({ length: G + 1 }, (_, g) => `${g ? "L" : "M"}${lx(g)},${ly(f(g))}`).join("");
      A.s("path", { d: path((g) => E(g, alpha)), fill: "none", stroke: "var(--c-enc)", "stroke-width": 2.5 }, curves);
      A.s("path", { d: path((g) => S(g, alpha, c)), fill: "none", stroke: "var(--c-pred)", "stroke-width": 2.5 }, curves);
      A.s("line", { x1: X0, x2: X1, y1: ly(1 / (1 - alpha)), y2: ly(1 / (1 - alpha)), stroke: "var(--c-enc)", "stroke-dasharray": "4 4" }, curves);
      let best = 0; for (let g = 0; g <= G; g++) if (S(g, alpha, c) > S(best, alpha, c)) best = g;
      A.s("circle", { cx: lx(best), cy: ly(S(best, alpha, c)), r: 6, fill: "var(--c-pred)", stroke: "var(--surface)", "stroke-width": 2 }, curves);
      A.s("text", { x: lx(best) + 9, y: ly(S(best, alpha, c)) - 10, class: "t-xs", style: "fill:var(--c-pred);font-weight:650", text: `最优 γ=${best}：${S(best, alpha, c).toFixed(2)}×` }, curves);
      A.s("text", { x: X0 + 6, y: Y1 + 4, class: "t-xs", style: "fill:var(--c-enc)", text: `蓝：期望每步 token 数 → 上限 1/(1−α) = ${(1 / (1 - alpha)).toFixed(2)}` }, curves);
      A.s("text", { x: X0 + 6, y: Y1 + 18, class: "t-xs", style: "fill:var(--c-pred)", text: "橙：加速比 =（期望 token 数）/（γc + 1）" }, curves);
      return best;
    }

    function drawDist() {
      dist.replaceChildren();
      const { p, q } = PRESETS[preset];
      const acc = p.map((pi, i) => Math.min(pi, q[i]));          // mass accepted via drafts
      const alphaPQ = acc.reduce((s, v) => s + v, 0);
      const resid = p.map((pi, i) => Math.max(0, pi - q[i]));
      const rsum = resid.reduce((s, v) => s + v, 0);
      const residN = resid.map((v) => v / rsum);
      const X0 = 30, bw = 46, Y0 = 200, H = 150;
      const ly = (v) => Y0 - (v / 0.5) * H;
      A.s("line", { x1: X0, y1: Y0, x2: 450, y2: Y0, class: "axis" }, dist);
      VOCAB.forEach((w, i) => {
        const x = X0 + i * (bw + 6);
        A.s("rect", { x, y: ly(p[i]), width: 14, height: Y0 - ly(p[i]), fill: "var(--c-loss)", opacity: 0.85 }, dist);
        A.s("rect", { x: x + 15, y: ly(q[i]), width: 14, height: Y0 - ly(q[i]), fill: "var(--c-data)", opacity: 0.85 }, dist);
        A.s("rect", { x: x + 30, y: ly(residN[i] * rsum), width: 14, height: Y0 - ly(residN[i] * rsum), fill: "var(--c-reg)", opacity: 0.9 }, dist);
        if (empirical) A.s("circle", { cx: x + 7, cy: ly(empirical[i]), r: 4, fill: "none", stroke: "var(--text)", "stroke-width": 2 }, dist);
        A.s("text", { x: x + 22, y: Y0 + 12, class: "t-c t-xs", text: w }, dist);
      });
      A.s("text", { x: X0, y: 16, class: "t-xs", text: "红 = 目标 p　灰 = 草稿 q　青 = 残差 max(0, p−q)（未归一化）　○ = 投机采样的经验频率" }, dist);
      A.s("text", { x: X0, y: 34, class: "t-xs", text: `α = Σ min(p, q) = ${alphaPQ.toFixed(3)}（接受的总概率质量）；残差质量 = 1 − α = ${rsum.toFixed(3)}` }, dist);
      A.s("text", { x: X0, y: 230, class: "t-xs", text: "接受 x~q 的概率 min(1, p(x)/q(x))：q 高估的词被按比例拒绝；" }, dist);
      A.s("text", { x: X0, y: 246, class: "t-xs", text: "被拒后从残差分布补采，恰好填回 p 比 q 多出的部分。" }, dist);
      return alphaPQ;
    }

    function sampleOnce(p, q) {
      // draw x ~ q, accept w.p. min(1, p/q), else draw from normalized residual
      let r = rand(), x = 0; while (r > q[x] && x < q.length - 1) { r -= q[x]; x++; }
      if (rand() < Math.min(1, p[x] / q[x])) return x;
      const resid = p.map((pi, i) => Math.max(0, pi - q[i])); const s = resid.reduce((a, b) => a + b, 0);
      let r2 = rand() * s, y = 0; while (r2 > resid[y] && y < resid.length - 1) { r2 -= resid[y]; y++; }
      return y;
    }

    function render() {
      const best = drawCurves();
      const a2 = drawDist();
      stat.innerHTML = `
        <dt>当前 α, c</dt><dd>${alpha.toFixed(2)}, ${c.toFixed(2)}（论文：T5-XXL 翻译 α=0.75、c&lt;0.05，γ=7 实测 3.4×）</dd>
        <dt>γ=${best} 时</dt><dd>每步期望 ${E(best, alpha).toFixed(2)} 个 token；目标模型前向次数减少到 1/${E(best, alpha).toFixed(2)}</dd>
        <dt>右图的 α</dt><dd>${a2.toFixed(3)}：换预设看 α 如何随 p、q 的接近程度变化</dd>`;
      note.innerHTML = `α 越高、c 越小，最优 γ 越大；但 γ 再大也顶不过 1/(1−α) 这个上限，而且每多一个草稿 token 目标模型就要多验证一个位置——这些验证在<b>算力有余</b>时免费，在算力吃紧（大 batch）时就是净开销。`;
    }
    el.querySelector('[data-k="alpha"]').addEventListener("input", (e) => { alpha = +e.target.value; el.querySelector('[data-v="alpha"]').textContent = alpha.toFixed(2); render(); });
    el.querySelector('[data-k="c"]').addEventListener("input", (e) => { c = +e.target.value; el.querySelector('[data-v="c"]').textContent = c.toFixed(2); render(); });
    el.querySelector('[data-k="preset"]').addEventListener("change", (e) => { preset = e.target.value; empirical = null; render(); });
    el.querySelector('[data-act="sample"]').addEventListener("click", () => {
      const { p, q } = PRESETS[preset]; const cnt = new Array(p.length).fill(0);
      for (let i = 0; i < 20000; i++) cnt[sampleOnce(p, q)]++;
      empirical = cnt.map((v) => v / 20000); render();
    });
    render();
  };
})();
