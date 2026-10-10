/* Widget: attn-mask — which tokens can each token attend to?
 * Usage:  <div data-widget="attn-mask" data-mode="vjepa2ac" data-steps="3" data-patches="4"></div>
 *   data-mode = "vjepa2ac" (block-causal over interleaved (a_k, s_k, z_k^1..P) tokens)
 *             | "lewm"     (plain causal over one embedding per frame; actions enter via AdaLN, not as tokens)
 * Hover / tap a row (query token) to see its receptive field.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W["attn-mask"] = function (el, A) {
    let mode = el.dataset.mode || "vjepa2ac";
    const steps = +el.dataset.steps || 3;
    const P = +el.dataset.patches || 4;
    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：预测器的注意力掩码</div>
      <div class="w-sub">行 = 查询 token（query），列 = 可被看到的 token（key）。悬停或点击某一行。</div>
      <div class="w-controls">
        <span class="seg" role="group">
          <button type="button" data-m="vjepa2ac">V-JEPA 2-AC：块因果</button>
          <button type="button" data-m="lewm">LeWM：因果 + AdaLN</button>
        </span>
      </div>
      <div class="w-row"><div class="w-stage scroll-x"></div><div class="w-side"><p class="w-info"></p><dl class="stat"></dl></div></div>`;
    const stage = el.querySelector(".w-stage");
    const info = el.querySelector(".w-info");
    const stat = el.querySelector(".stat");
    const segBtns = [...el.querySelectorAll(".seg button")];

    function tokens() {
      const out = [];
      if (mode === "vjepa2ac") {
        for (let k = 1; k <= steps; k++) {
          out.push({ k, kind: "act", label: `a${k}` });
          out.push({ k, kind: "act", label: `s${k}`, state: true });
          for (let p = 1; p <= P; p++) out.push({ k, kind: "enc", label: `z${k}·${p}` });
        }
      } else {
        for (let k = 1; k <= steps + 1; k++) out.push({ k, kind: "enc", label: `z${k}` });
      }
      return out;
    }
    const allowed = (q, key) => key.k <= q.k && (mode === "vjepa2ac" || true);

    function render() {
      const tk = tokens();
      const n = tk.length;
      const C = mode === "vjepa2ac" ? 18 : 34, L = 46;
      const VW = L + n * C + 4, VH = L + n * C + (mode === "lewm" ? 46 : 4);
      const svg = A.s("svg", { viewBox: `0 0 ${VW} ${VH}`, class: "dg", role: "img", "aria-label": "注意力掩码矩阵" });
      svg.style.maxWidth = (mode === "vjepa2ac" ? 440 : 300) + "px";
      svg.style.minWidth = "260px";
      const color = (t) => (t.kind === "act" ? "var(--c-act)" : "var(--c-enc)");
      const cells = [];
      tk.forEach((t, i) => {
        const tx = A.s("text", { x: L - 6, y: L + i * C + C / 2, class: "t-r t-xs", style: `fill:${color(t)};font-weight:600` }, svg);
        tx.textContent = t.label;
        const ty = A.s("text", { x: L + i * C + C / 2, y: L - 8, class: "t-xs", transform: `rotate(-60 ${L + i * C + C / 2} ${L - 8})`, style: `fill:${color(t)};font-weight:600` }, svg);
        ty.textContent = t.label;
      });
      tk.forEach((q, i) => {
        tk.forEach((key, j) => {
          const ok = allowed(q, key);
          const r = A.s("rect", {
            x: L + j * C + 1, y: L + i * C + 1, width: C - 2, height: C - 2, rx: 2,
            fill: ok ? (key.kind === "act" ? "var(--c-act)" : "var(--c-enc)") : "var(--surface-3)",
            opacity: ok ? 0.55 : 1,
          }, svg);
          cells.push({ r, i, j, ok });
        });
        const hit = A.s("rect", { x: 0, y: L + i * C, width: VW, height: C, fill: "transparent", style: "cursor:pointer" }, svg);
        const focus = () => {
          cells.forEach((c) => c.r.setAttribute("opacity", c.i === i ? (c.ok ? 1 : 1) : c.ok ? 0.22 : 0.6));
          const seen = tk.filter((key) => allowed(q, key));
          info.innerHTML = `<b>${q.label}</b> 可以看到 <b>${seen.length}</b> 个 token：${seen.map((s) => s.label).join(", ")}`;
        };
        hit.addEventListener("mouseenter", focus);
        hit.addEventListener("click", focus);
      });
      // block separators
      if (mode === "vjepa2ac") {
        for (let k = 1; k < steps; k++) {
          const p = L + k * (2 + P) * C;
          A.s("line", { x1: p, x2: p, y1: L, y2: L + n * C, stroke: "var(--text-2)", "stroke-width": 1.2 }, svg);
          A.s("line", { y1: p, y2: p, x1: L, x2: L + n * C, stroke: "var(--text-2)", "stroke-width": 1.2 }, svg);
        }
      } else {
        // AdaLN conditioning row
        const y0 = L + n * C + 12;
        tk.forEach((t, i) => {
          if (i === tk.length - 1) return;
          const cx = L + i * C + C / 2;
          A.s("rect", { x: cx - 13, y: y0, width: 26, height: 18, rx: 4, fill: "var(--c-act-bg)", stroke: "var(--c-act)" }, svg);
          A.s("text", { x: cx, y: y0 + 9.5, class: "t-c t-xs", style: "fill:var(--c-act);font-weight:600", text: `a${t.k}` }, svg);
        });
        A.s("text", { x: 4, y: y0 + 9, class: "t-xs", text: "AdaLN" }, svg);
      }
      svg.addEventListener("mouseleave", () => {
        cells.forEach((c) => c.r.setAttribute("opacity", c.ok ? 0.55 : 1));
        info.innerHTML = defaultInfo();
      });
      stage.replaceChildren(svg);
      info.innerHTML = defaultInfo();
      stat.innerHTML = mode === "vjepa2ac"
        ? `<dt>每步 token</dt><dd>1（动作）+ 1（状态）+ 256（16×16 patch）= 258</dd>
           <dt>训练序列</dt><dd>15 步 × 258 ≈ 3.9K token</dd>
           <dt>位置编码</dt><dd>patch：3D-RoPE；a/s：仅时间 RoPE</dd>
           <dt>输出</dt><dd>第 k 步 z 位置 → 预测 ẑ(k+1)</dd>`
        : `<dt>每帧 token</dt><dd>1（192 维 [CLS] 嵌入）</dd>
           <dt>历史长度</dt><dd>3（PushT / Cube），1（TwoRoom）</dd>
           <dt>动作注入</dt><dd>AdaLN-zero：每层由 aₜ 生成 shift/scale/gate</dd>
           <dt>输出</dt><dd>第 t 位置 → 预测 ẑ(t+1)</dd>`;
      segBtns.forEach((b) => b.classList.toggle("on", b.dataset.m === mode));
    }
    function defaultInfo() {
      return mode === "vjepa2ac"
        ? "<b>块因果（block-causal）</b>：同一时间步内的动作、状态、patch 互相全可见；只能看过去、不能看未来。图中每个 z 只画了 4 个 patch，实际是 256 个。"
        : "<b>标准因果</b>：每帧只有一个 token，第 t 个位置只能看 z₁…zₜ。动作不占序列位置，而是通过 AdaLN 调制每一层的归一化参数。";
    }
    segBtns.forEach((b) => b.addEventListener("click", () => { mode = b.dataset.m; render(); }));
    render();
  };
})();
