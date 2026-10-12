/* Widget: roofline — where prefill / decode sit on the GPU roofline, and how big the KV cache is.
 * Usage: <div data-widget="roofline" data-panel="both|roofline|kv"></div>
 * Model of one decode step for batch B at context S (per-token FLOPs ≈ 2·params_active + attention 4·L·S·H·d):
 *   FLOPs  = B · (2·P_active + 4·L·S·d_model)
 *   Bytes  = weights (P_active·bytes_w) + KV read (B·S·kv_per_token·bytes_kv)
 *   time   ≈ max(FLOPs / peak, Bytes / bandwidth)        ← roofline
 * Prefill of S tokens is the same formulas with B·S tokens in flight and no KV read (KV is written instead).
 * Numbers for GPUs/models are vendor peak specs / public configs (see tracks/ai-infra/SOURCES.md).
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  const GPUS = {
    "H100 SXM": { tflops: 989, bw: 3.35, note: "BF16 稠密 989 TFLOPS，HBM3 3.35 TB/s" },
    "A100 SXM": { tflops: 312, bw: 2.0, note: "BF16 312 TFLOPS，HBM2e 2.0 TB/s" },
    "MI300X": { tflops: 1307, bw: 5.3, note: "FP16 稠密 1307 TFLOPS，HBM3 5.3 TB/s" },
    "B200": { tflops: 2250, bw: 8.0, note: "BF16 稠密 ≈2.25 PFLOPS，HBM3e 8 TB/s（厂商峰值）" },
  };
  // kv_per_token = number of cached values per token per layer-stack (before dtype bytes)
  const MODELS = {
    "Llama-3-8B": { P: 8.0e9, L: 32, dm: 4096, kvh: 8, dh: 128, kind: "GQA" },
    "Llama-3-70B": { P: 70e9, L: 80, dm: 8192, kvh: 8, dh: 128, kind: "GQA" },
    "OPT-13B (MHA)": { P: 13e9, L: 40, dm: 5120, kvh: 40, dh: 128, kind: "MHA" },
    "DeepSeek-V3 (MLA)": { P: 37e9, L: 61, dm: 7168, kvh: 0, dh: 0, mla: 576, kind: "MLA" },
    "Qwen3-32B": { P: 32e9, L: 64, dm: 5120, kvh: 8, dh: 128, kind: "GQA" },
  };
  const LINKS = { "NVLink (H100, 450 GB/s)": 450, "InfiniBand 400 Gb/s (50 GB/s)": 50, "RoCE 100 Gb/s (12.5 GB/s)": 12.5, "25 GbE (3.1 GB/s)": 3.1 };

  const kvPerToken = (m) => (m.mla ? m.L * m.mla : 2 * m.L * m.kvh * m.dh);
  const fmt = (v, u = "") => (v >= 1e12 ? (v / 1e12).toFixed(2) + " T" : v >= 1e9 ? (v / 1e9).toFixed(2) + " G" : v >= 1e6 ? (v / 1e6).toFixed(2) + " M" : v >= 1e3 ? (v / 1e3).toFixed(1) + " K" : v.toFixed(1) + " ") + u;

  W.roofline = function (el, A) {
    const panel = el.dataset.panel || "both";
    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：Roofline 与 KV cache 计算器</div>
      <div class="w-sub">改 batch、上下文、模型与 GPU，看 prefill / decode 分别落在带宽受限还是算力受限区，以及 KV cache 有多大、传一次要多久。</div>
      <div class="w-controls">
        <label>GPU <select data-k="gpu">${Object.keys(GPUS).map((k) => `<option>${k}</option>`).join("")}</select></label>
        <label>模型 <select data-k="model">${Object.keys(MODELS).map((k) => `<option>${k}</option>`).join("")}</select></label>
        <label>dtype <select data-k="bytes"><option value="2">BF16 (2 B)</option><option value="1">FP8 (1 B)</option></select></label>
      </div>
      <div class="w-controls">
        <label>batch B <input type="range" data-k="B" min="0" max="10" value="0"> <b data-v="B">1</b></label>
        <label>上下文 S <input type="range" data-k="S" min="7" max="17" value="11"> <b data-v="S">2048</b> token</label>
        <label>链路 <select data-k="link">${Object.keys(LINKS).map((k) => `<option>${k}</option>`).join("")}</select></label>
      </div>
      <div class="w-row">
        <div class="w-stage" data-slot="plot" ${panel === "kv" ? 'style="display:none"' : ""}></div>
        <div class="w-side"><dl class="stat" data-slot="stat"></dl></div>
      </div>
      <p class="w-note" data-slot="note"></p>`;
    const q = (s) => el.querySelector(s);
    const get = (k) => q(`[data-k="${k}"]`).value;
    const svg = A.s("svg", { viewBox: "0 0 520 320", class: "dg", role: "img", "aria-label": "roofline 图" });
    q('[data-slot="plot"]').append(svg);

    function render() {
      const gpu = GPUS[get("gpu")], m = MODELS[get("model")], bytes = +get("bytes");
      const B = 2 ** +get("B"), S = 2 ** +get("S"), link = LINKS[get("link")];
      q('[data-v="B"]').textContent = B; q('[data-v="S"]').textContent = S;
      const peak = gpu.tflops * 1e12, bw = gpu.bw * 1e12, ridge = peak / bw;
      const kvTok = kvPerToken(m) * bytes;                       // bytes per token
      const wBytes = m.P * bytes;
      // decode: one step
      const dFlops = B * (2 * m.P + 4 * m.L * S * m.dm);
      const dBytes = wBytes + B * S * kvTok;
      const dAI = dFlops / dBytes, dT = Math.max(dFlops / peak, dBytes / bw);
      // prefill: S tokens per request, B requests
      const pFlops = B * S * (2 * m.P + 2 * m.L * S * m.dm);     // causal attention ≈ half of 4·L·S·dm per token
      const pBytes = wBytes + B * S * kvTok;                      // write KV once
      const pAI = pFlops / pBytes, pT = Math.max(pFlops / peak, pBytes / bw);
      // KV transfer (PD disaggregation): one request of S tokens
      const kvReq = S * kvTok, tXfer = kvReq / (link * 1e9);

      // ---- plot (log-log) ----
      svg.replaceChildren();
      const X0 = 56, X1 = 500, Y0 = 280, Y1 = 20;
      const lx = (ai) => X0 + ((Math.log10(ai) + 1) / 5) * (X1 - X0);      // AI 0.1 … 1e4
      const ly = (f) => Y0 - ((Math.log10(f) - 11) / 5) * (Y0 - Y1);       // 1e11 … 1e16 FLOP/s
      A.s("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, class: "axis" }, svg);
      A.s("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, class: "axis" }, svg);
      [0.1, 1, 10, 100, 1000, 1e4].forEach((v) => { A.s("text", { x: lx(v), y: Y0 + 14, class: "t-c t-xs", text: v >= 1 ? String(v) : "0.1" }, svg); A.s("line", { x1: lx(v), x2: lx(v), y1: Y1, y2: Y0, class: "grid-ln" }, svg); });
      [1e11, 1e12, 1e13, 1e14, 1e15, 1e16].forEach((v) => { A.s("text", { x: X0 - 4, y: ly(v), class: "t-r t-xs", text: "1e" + Math.log10(v) }, svg); });
      A.s("text", { x: (X0 + X1) / 2, y: Y0 + 30, class: "t-c t-xs", text: "算术强度 FLOP / byte（对数）" }, svg);
      A.s("text", { x: 14, y: Y1 + 6, class: "t-xs", text: "FLOP/s" }, svg);
      // roof: y = min(bw·x, peak)
      const xr = Math.max(0.1, Math.min(1e4, ridge));
      A.s("path", { d: `M${lx(0.1)},${ly(bw * 0.1)} L${lx(xr)},${ly(peak)} L${lx(1e4)},${ly(peak)}`, fill: "none", stroke: "var(--c-loss)", "stroke-width": 2.5 }, svg);
      A.s("text", { x: lx(xr) + 6, y: ly(peak) - 8, class: "t-xs", style: "fill:var(--c-loss)", text: `脊点 ${ridge.toFixed(0)} FLOP/B · 峰值 ${gpu.tflops} TFLOPS` }, svg);
      const mark = (ai, label, cls) => {
        const att = Math.min(peak, bw * ai);
        const x = lx(Math.max(0.1, Math.min(1e4, ai))), y = ly(att);
        A.s("circle", { cx: x, cy: y, r: 7, fill: `var(--c-${cls})`, stroke: "var(--surface)", "stroke-width": 2 }, svg);
        A.s("text", { x: x + (cls === "enc" ? 10 : -10), y: y - 12, class: "t-sm " + (cls === "enc" ? "" : "t-r"), style: `fill:var(--c-${cls});font-weight:650`, text: label }, svg);
      };
      mark(dAI, `decode  B=${B}`, "enc");
      mark(pAI, `prefill  S=${S}`, "pred");

      q('[data-slot="stat"]').innerHTML = `
        <dt>每 token KV（${m.kind}）</dt><dd>${fmt(kvTok, "B")}  = ${m.mla ? `${m.L} 层 × ${m.mla}` : `2 × ${m.L} 层 × ${m.kvh} KV 头 × ${m.dh}`} × ${bytes} B</dd>
        <dt>一条 S=${S} 请求的 KV</dt><dd>${fmt(kvReq, "B")}；经 ${get("link").split(" (")[0]} 传输 ≈ <b>${(tXfer * 1e3).toFixed(1)} ms</b></dd>
        <dt>B×S 的 KV 总量</dt><dd>${fmt(B * kvReq, "B")}（权重 ${fmt(wBytes, "B")}）</dd>
        <dt>decode 一步</dt><dd>${fmt(dFlops, "FLOP")} / ${fmt(dBytes, "B")} → 强度 <b>${dAI.toFixed(1)}</b>，≈ ${(dT * 1e3).toFixed(2)} ms（${dAI < ridge ? "带宽受限" : "算力受限"}）</dd>
        <dt>prefill</dt><dd>${fmt(pFlops, "FLOP")} / ${fmt(pBytes, "B")} → 强度 <b>${pAI.toFixed(0)}</b>，≈ ${(pT * 1e3).toFixed(1)} ms（${pAI < ridge ? "带宽受限" : "算力受限"}）</dd>
        <dt>每输出 token 成本</dt><dd>decode 理想 ≈ ${(dT * 1e3 / B).toFixed(3)} ms/token/请求</dd>`;
      q('[data-slot="note"]').innerHTML = `GPU：${gpu.note}。${dAI < ridge ? `decode 在脊点左侧：每读一次权重 + KV 只算 ${B} 个 token，<b>把 batch 加大、或用投机解码一次验证多个 token</b>，都是在把这个点往右推。` : `batch 已足够大，decode 进入算力受限区——此时投机解码不再有收益。`} 当 B·S 很大时 KV 读取（${fmt(B * S * kvTok, "B")}）超过权重读取，算术强度又会掉回来：这就是长上下文解码的瓶颈，也是 PagedAttention / MLA / 稀疏注意力要解决的问题。`;
    }
    el.querySelectorAll("select, input").forEach((c) => c.addEventListener("input", render));
    render();
  };
})();
