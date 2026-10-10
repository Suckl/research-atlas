/* Widget: mask-2d — I-JEPA multi-block masking sampler.
 * Usage:  <div data-widget="mask-2d" data-grid="16" data-targets="4"></div>
 * Mirrors the sampling logic of facebookresearch/ijepa src/masks/multiblock.py:
 *   - one target-block size per sample (shared by all M target blocks), scale∈(0.15,0.2), aspect∈(0.75,1.5)
 *   - one context block, scale∈(0.85,1.0), aspect=1, then overlap with ANY target removed
 *   - same uniform draw used for scale and aspect ratio (quirk of the reference code)
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W["mask-2d"] = function (el, A) {
    const G = +el.dataset.grid || 16;
    const M = +el.dataset.targets || 4;
    const T_SCALE = [0.15, 0.2], T_AR = [0.75, 1.5], C_SCALE = [0.85, 1.0], MIN_KEEP = 10;
    const CELL = 20, S = G * CELL;
    let seed = 3, view = "task", state = null;

    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：I-JEPA 多块掩码（multi-block masking）采样器</div>
      <div class="w-sub">${G}×${G} = ${G * G} 个 patch（相当于 ViT-H/14 @ 224²）。切换视角，看三个网络分别“看到”什么。</div>
      <div class="w-controls">
        <span class="seg" role="group" aria-label="视角">
          <button type="button" data-v="task">预测任务</button>
          <button type="button" data-v="ctx">上下文编码器输入</button>
          <button type="button" data-v="tgt">目标编码器输入</button>
        </span>
        <button class="btn primary" type="button" data-act="resample">↻ 重新采样</button>
      </div>
      <div class="w-row">
        <div class="w-stage"></div>
        <div class="w-side"><dl class="stat"></dl><p class="w-note"></p></div>
      </div>`;
    const stage = el.querySelector(".w-stage");
    const stat = el.querySelector(".stat");
    const note = el.querySelector(".w-note");
    const segBtns = [...el.querySelectorAll(".seg button")];

    const svg = A.s("svg", { viewBox: `0 0 ${S} ${S}`, class: "dg", role: "img", "aria-label": "掩码采样示意" });
    svg.style.maxWidth = "380px";
    stage.append(svg);

    /* ---- the "image": a fixed little scene so blocks have semantic content ---- */
    function drawScene(g) {
      const defs = A.s("defs", {}, g);
      const lg = A.s("linearGradient", { id: "m2d-sky", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      A.s("stop", { offset: "0", "stop-color": "#8ec3ef" }, lg);
      A.s("stop", { offset: "1", "stop-color": "#e6f2fb" }, lg);
      A.s("rect", { x: 0, y: 0, width: S, height: S, fill: "url(#m2d-sky)" }, g);
      A.s("circle", { cx: S * 0.8, cy: S * 0.17, r: S * 0.08, fill: "#f6c443" }, g);
      A.s("path", { d: `M0,${S * 0.55} L${S * 0.22},${S * 0.3} L${S * 0.42},${S * 0.52} L${S * 0.6},${S * 0.36} L${S},${S * 0.6} L${S},${S} L0,${S} Z`, fill: "#8a9cc0" }, g);
      A.s("path", { d: `M0,${S * 0.68} Q${S * 0.5},${S * 0.55} ${S},${S * 0.7} L${S},${S} L0,${S} Z`, fill: "#6eab5a" }, g);
      // house
      A.s("rect", { x: S * 0.18, y: S * 0.56, width: S * 0.26, height: S * 0.2, fill: "#ead9b8" }, g);
      A.s("path", { d: `M${S * 0.15},${S * 0.57} L${S * 0.31},${S * 0.44} L${S * 0.47},${S * 0.57} Z`, fill: "#c4553b" }, g);
      A.s("rect", { x: S * 0.28, y: S * 0.65, width: S * 0.06, height: S * 0.11, fill: "#7a4b2a" }, g);
      A.s("rect", { x: S * 0.21, y: S * 0.6, width: S * 0.05, height: S * 0.045, fill: "#7fb5e0" }, g);
      // tree
      A.s("rect", { x: S * 0.71, y: S * 0.62, width: S * 0.03, height: S * 0.14, fill: "#7a4b2a" }, g);
      A.s("circle", { cx: S * 0.725, cy: S * 0.57, r: S * 0.09, fill: "#3f8a3a" }, g);
      // path / road
      A.s("path", { d: `M${S * 0.31},${S * 0.76} Q${S * 0.42},${S * 0.9} ${S * 0.36},${S}`, stroke: "#d8c49a", "stroke-width": S * 0.04, fill: "none" }, g);
    }

    /* ---- sampling (reference-code faithful) ---- */
    function blockSize(rand, scale, ar) {
      const r = rand();
      const s = scale[0] + r * (scale[1] - scale[0]);
      const maxKeep = Math.floor(G * G * s);
      const a = ar[0] + r * (ar[1] - ar[0]);
      let h = Math.round(Math.sqrt(maxKeep * a)), w = Math.round(Math.sqrt(maxKeep / a));
      while (h >= G) h--;
      while (w >= G) w--;
      return { h, w, scale: s, ar: a };
    }
    function place(rand, size) {
      const top = Math.floor(rand() * (G - size.h)), left = Math.floor(rand() * (G - size.w));
      return { top, left, h: size.h, w: size.w };
    }
    function sample() {
      const rand = A.rng(seed * 7919 + 13);
      const tSize = blockSize(rand, T_SCALE, T_AR);
      const cSize = blockSize(rand, C_SCALE, [1, 1]);
      const targets = [];
      const tgtMask = new Uint8Array(G * G);
      for (let i = 0; i < M; i++) {
        const b = place(rand, tSize);
        targets.push(b);
        for (let y = b.top; y < b.top + b.h; y++) for (let x = b.left; x < b.left + b.w; x++) tgtMask[y * G + x]++;
      }
      let ctx, ctxMask, tries = 0;
      do {
        ctx = place(rand, cSize);
        ctxMask = new Uint8Array(G * G);
        let n = 0;
        for (let y = ctx.top; y < ctx.top + ctx.h; y++) for (let x = ctx.left; x < ctx.left + ctx.w; x++) {
          if (!tgtMask[y * G + x]) { ctxMask[y * G + x] = 1; n++; }
        }
        ctx.kept = n;
      } while (ctx.kept < MIN_KEEP && ++tries < 50);
      return { tSize, cSize, targets, tgtMask, ctx, ctxMask };
    }

    function render() {
      svg.replaceChildren();
      const s = state;
      const scene = A.s("g", {}, svg);
      drawScene(scene);
      const ov = A.s("g", {}, svg);
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
        const i = y * G + x, isT = s.tgtMask[i] > 0, isC = s.ctxMask[i] === 1;
        const r = { x: x * CELL, y: y * CELL, width: CELL, height: CELL };
        if (view === "ctx") {
          if (!isC) A.s("rect", Object.assign({ fill: "var(--surface-3)", opacity: 0.96 }, r), ov);
        } else if (view === "task") {
          if (isT) {
            A.s("rect", Object.assign({ fill: "var(--surface-3)", opacity: 0.93 }, r), ov);
            A.s("rect", Object.assign({ fill: "url(#hatch)", opacity: 0.9 }, r), ov);
          } else if (!isC) A.s("rect", Object.assign({ fill: "var(--surface-3)", opacity: 0.8 }, r), ov);
          else A.s("rect", Object.assign({ fill: "var(--c-enc)", opacity: 0.12 }, r), ov);
        }
      }
      // patch grid
      const grid = A.s("g", { opacity: 0.5 }, svg);
      for (let k = 0; k <= G; k++) {
        A.s("line", { x1: k * CELL, x2: k * CELL, y1: 0, y2: S, stroke: "var(--surface)", "stroke-width": 0.6 }, grid);
        A.s("line", { y1: k * CELL, y2: k * CELL, x1: 0, x2: S, stroke: "var(--surface)", "stroke-width": 0.6 }, grid);
      }
      // context block outline
      if (view !== "tgt") {
        A.s("rect", { x: s.ctx.left * CELL + 1, y: s.ctx.top * CELL + 1, width: s.ctx.w * CELL - 2, height: s.ctx.h * CELL - 2, fill: "none", stroke: "var(--c-enc)", "stroke-width": 2.5 }, svg);
      }
      // target outlines
      s.targets.forEach((b, i) => {
        if (view === "ctx") return;
        A.s("rect", { x: b.left * CELL + 1.5, y: b.top * CELL + 1.5, width: b.w * CELL - 3, height: b.h * CELL - 3, fill: "none", stroke: "var(--c-tgt)", "stroke-width": 2.5, "stroke-dasharray": "6 3" }, svg);
        const lx = b.left * CELL + 3, ly = b.top * CELL + 3;
        A.s("rect", { x: lx, y: ly, width: 16, height: 16, rx: 3, fill: "var(--c-tgt)" }, svg);
        A.s("text", { x: lx + 8, y: ly + 8.5, class: "t-c", style: "fill:#fff;font-size:11px;font-weight:700", text: String(i + 1) }, svg);
      });

      const nT = s.tgtMask.reduce((a, v) => a + (v > 0 ? 1 : 0), 0);
      const nC = s.ctx.kept, N = G * G;
      const pct = (n) => ((100 * n) / N).toFixed(1) + "%";
      stat.innerHTML = `
        <dt>目标块尺寸</dt><dd>${s.tSize.h}×${s.tSize.w}（scale ${s.tSize.scale.toFixed(3)}）×${M} 块</dd>
        <dt>目标并集</dt><dd>${nT} / ${N}（${pct(nT)}）</dd>
        <dt>上下文块</dt><dd>${s.ctx.h}×${s.ctx.w}（scale ${s.cSize.scale.toFixed(3)}）</dd>
        <dt>去重后上下文</dt><dd>${nC} / ${N}（${pct(nC)}）</dd>
        <dt>两者都不是</dt><dd>${N - nT - nC}</dd>`;
      note.innerHTML = {
        task: "蓝框 = 上下文块（去掉与目标重叠后的 patch 才输入上下文编码器）；紫色虚线框 + 斜纹 = 4 个目标块，预测器要在这些位置输出表征。目标块可以互相重叠。",
        ctx: "上下文编码器只接收这些可见 patch（不放 mask token），所以它的计算量只和可见 patch 数成正比。",
        tgt: "目标编码器看到的是<b>完整图像</b>：掩码作用在它的<b>输出</b>上（紫框只是“之后要取哪些输出 token”）。因此目标表征里融合了全图上下文，更偏语义。",
      }[view];
      segBtns.forEach((b) => b.classList.toggle("on", b.dataset.v === view));
    }

    segBtns.forEach((b) => b.addEventListener("click", () => { view = b.dataset.v; render(); }));
    el.querySelector('[data-act="resample"]').addEventListener("click", () => { seed++; state = sample(); render(); });
    state = sample();
    render();
  };
})();
