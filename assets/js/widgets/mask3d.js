/* Widget: mask-3d — V-JEPA spatio-temporal (tubelet) masking.
 * Usage:  <div data-widget="mask-3d"></div>
 * Token grid: T'=8 (16 frames / tubelet 2) × 14 × 14 (224 / patch 16) = 1568 tokens.
 * Modes:
 *   short  — union of 8 blocks, spatial scale 0.15 each, aspect ∈ (0.75,1.5), spanning all time (V-JEPA)
 *   long   — union of 2 blocks, spatial scale 0.70 each (V-JEPA)
 *   tube   — random-tube[0.9]: 90% random spatial positions, repeated over time (paper ablation baseline)
 *   frame  — counter-example: independent 90% random mask per time slice (information leaks across time)
 * Block sampling mirrors facebookresearch/jepa src/masks/multiblock3d.py (one block size per sample).
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W["mask-3d"] = function (el, A) {
    const T = 8, H = 14, Wd = 14, N = T * H * Wd;
    const CELL = 8, SW = Wd * CELL, GAP = 18, COLS = 4, LABEL = 18;
    const VW = COLS * SW + (COLS - 1) * GAP, VH = 2 * (SW + LABEL) + GAP;
    let mode = "short", seed = 11;

    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：V-JEPA 的时空掩码</div>
      <div class="w-sub">16 帧 × 224² 的视频 → 2×16×16 tubelet → <b>8 × 14 × 14 = 1568</b> 个 token。每个小方格是一个 token，8 个面板是 8 个时间位置。</div>
      <div class="w-controls">
        <span class="seg" role="group" aria-label="掩码类型">
          <button type="button" data-m="short">短程 8×0.15</button>
          <button type="button" data-m="long">长程 2×0.7</button>
          <button type="button" data-m="tube">随机 tube 90%（消融）</button>
          <button type="button" data-m="frame">逐帧独立（反例）</button>
        </span>
        <button class="btn primary" type="button" data-act="resample">↻ 重新采样</button>
      </div>
      <div class="w-row">
        <div class="w-stage scroll-x"></div>
        <div class="w-side"><dl class="stat"></dl><p class="w-note"></p></div>
      </div>`;
    const stage = el.querySelector(".w-stage");
    const stat = el.querySelector(".stat");
    const note = el.querySelector(".w-note");
    const segBtns = [...el.querySelectorAll(".seg button")];
    const svg = A.s("svg", { viewBox: `0 0 ${VW} ${VH}`, class: "dg", role: "img", "aria-label": "时空掩码示意" });
    svg.style.minWidth = "420px";
    stage.append(svg);

    function blockSize(rand, sScale, ar) {
      rand(); // temporal scale draw (temporal_scale = (1.0, 1.0) → t = T)
      const s = sScale[0] + rand() * (sScale[1] - sScale[0]);
      const keep = Math.floor(H * Wd * s);
      const a = ar[0] + rand() * (ar[1] - ar[0]);
      return { t: T, h: Math.min(H, Math.round(Math.sqrt(keep * a))), w: Math.min(Wd, Math.round(Math.sqrt(keep / a))) };
    }
    function sample() {
      const rand = A.rng(seed * 104729 + mode.length * 31);
      const masked = new Uint8Array(N); // 1 = masked (prediction target)
      if (mode === "short" || mode === "long") {
        const [nb, sc] = mode === "short" ? [8, 0.15] : [2, 0.7];
        const size = blockSize(rand, [sc, sc], [0.75, 1.5]);
        for (let b = 0; b < nb; b++) {
          const top = Math.floor(rand() * (H - size.h + 1)), left = Math.floor(rand() * (Wd - size.w + 1));
          for (let t = 0; t < T; t++) for (let y = top; y < top + size.h; y++) for (let x = left; x < left + size.w; x++) masked[t * H * Wd + y * Wd + x] = 1;
        }
        return { masked, size, nb };
      }
      if (mode === "tube") {
        const idx = [...Array(H * Wd).keys()];
        for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const k = Math.round(0.9 * H * Wd);
        for (let i = 0; i < k; i++) for (let t = 0; t < T; t++) masked[t * H * Wd + idx[i]] = 1;
        return { masked };
      }
      for (let t = 0; t < T; t++) {
        const idx = [...Array(H * Wd).keys()];
        for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
        const k = Math.round(0.9 * H * Wd);
        for (let i = 0; i < k; i++) masked[t * H * Wd + idx[i]] = 1;
      }
      return { masked };
    }

    function frameContent(g, t, ox, oy) {
      // background + a static "table" + a ball moving left→right over time
      A.s("rect", { x: ox, y: oy, width: SW, height: SW, fill: "#dfe9f3" }, g);
      A.s("rect", { x: ox, y: oy + SW * 0.7, width: SW, height: SW * 0.3, fill: "#c9b48f" }, g);
      A.s("rect", { x: ox + SW * 0.62, y: oy + SW * 0.42, width: SW * 0.22, height: SW * 0.28, fill: "#8b6b4a" }, g);
      const bx = ox + SW * (0.12 + 0.09 * t), by = oy + SW * (0.6 - 0.25 * Math.sin((Math.PI * t) / (T - 1)));
      A.s("circle", { cx: bx, cy: by, r: SW * 0.09, fill: "#d9480f" }, g);
    }

    function render() {
      const s = sample();
      svg.replaceChildren();
      for (let t = 0; t < T; t++) {
        const col = t % COLS, row = Math.floor(t / COLS);
        const ox = col * (SW + GAP), oy = row * (SW + LABEL + GAP) + LABEL;
        A.s("text", { x: ox, y: oy - 9, class: "t-xs", text: `t'=${t}（第 ${2 * t + 1}–${2 * t + 2} 帧）` }, svg);
        const g = A.s("g", {}, svg);
        frameContent(g, t, ox, oy);
        for (let y = 0; y < H; y++) for (let x = 0; x < Wd; x++) {
          const m = s.masked[t * H * Wd + y * Wd + x];
          const r = { x: ox + x * CELL, y: oy + y * CELL, width: CELL, height: CELL };
          if (m) {
            A.s("rect", Object.assign({ fill: "var(--surface-3)", opacity: 0.94 }, r), g);
            A.s("rect", Object.assign({ fill: "url(#hatch)", opacity: 0.85 }, r), g);
          } else {
            A.s("rect", Object.assign({ fill: "none", stroke: "var(--c-enc)", "stroke-width": 1 }, r), g);
          }
        }
        A.s("rect", { x: ox, y: oy, width: SW, height: SW, fill: "none", stroke: "var(--border-strong)" }, svg);
      }
      const nm = s.masked.reduce((a, v) => a + v, 0);
      // leakage: masked tokens whose same spatial location is visible in some other time slice
      let leak = 0;
      for (let p = 0; p < H * Wd; p++) {
        let vis = 0;
        for (let t = 0; t < T; t++) if (!s.masked[t * H * Wd + p]) vis++;
        if (vis > 0) for (let t = 0; t < T; t++) if (s.masked[t * H * Wd + p]) leak++;
      }
      stat.innerHTML = `
        <dt>掩码比例</dt><dd>${((100 * nm) / N).toFixed(1)}%（${nm} / ${N}）</dd>
        <dt>可见 token</dt><dd>${N - nm}（只有它们进上下文编码器）</dd>
        ${s.size ? `<dt>每块大小</dt><dd>${s.size.h}×${s.size.w} × 全部 ${T} 个时间位置，共 ${s.nb} 块取并集</dd>` : ""}
        <dt>可“抄邻帧”的目标</dt><dd>${leak}（${nm ? ((100 * leak) / nm).toFixed(0) : 0}% 的被遮 token）</dd>`;
      note.innerHTML = {
        short: "短程掩码：8 个小块（各占一帧面积的 15%）取并集，并沿时间贯穿整个片段。V-JEPA 每个片段同时采样短程与长程两种掩码，目标编码器只算一次。",
        long: "长程掩码：2 个大块（各占 70%）取并集，同样贯穿时间。被遮区域大，迫使模型做更“远”的推断。",
        tube: "随机 tube（VideoMAE 风格）：90% 的空间位置随机遮挡并贯穿时间。论文消融中它明显更差（K400 51.5 vs multi-block 72.9）。直觉上，随机散点让被遮 token 几乎总有可见的空间邻居，任务退化成局部插值。",
        frame: "反例（示意）：每个时间位置独立随机遮挡。同一空间位置在别的时刻往往可见，模型只要“抄相邻帧”就能降低损失——这就是为什么 V-JEPA 的掩码要贯穿整段时间。",
      }[mode];
      segBtns.forEach((b) => b.classList.toggle("on", b.dataset.m === mode));
    }

    segBtns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; render(); }));
    el.querySelector('[data-act="resample"]').addEventListener("click", () => { seed++; render(); });
    render();
  };
})();
