/* Widget: dllm-decode — parallel unmasking on a 16-token canvas whose joint distribution is known exactly.
 * Usage: <div data-widget="dllm-decode" data-focus="steps|threshold|block"></div>
 *   steps     → fixed step budget N (LLaDA-style top-k by confidence; k = tokens per step inside a block)
 *   threshold → unmask every position whose confidence ≥ τ, at least the most confident one (Fast-dLLM style)
 *   block     → same samplers, block size B (semi-AR: blocks left to right) emphasised; starts at N = 8, B = 4
 *
 * Toy data (prompt "Book a flight :"): the canvas is a product of independent factors.
 *   - 9 fixed tokens (from, to, on, at, ",", seat, please, ".", <eos>): probability 1.
 *   - one coupled factor over positions 1,2,4,5 = origin city (2 words) and destination city (2 words):
 *     p(o, d) = w_o · w_d / (1 − w_o) for o ≠ d, cities New York .30, New Orleans .10, San Diego .25,
 *     San Jose .10, Los Angeles .15, Las Vegas .10. Two halves of a city are perfectly correlated, and
 *     origin ≠ destination couples the two cities.
 *   - three independent single tokens: day (Friday .7 / Monday .3), time (9am .55 / 6pm .45),
 *     seat (window .6 / aisle .4) — uncertain but uncorrelated, so parallel sampling is harmless.
 * The "model" is the exact conditional p(x_0^i | unmasked tokens), computed by enumerating the factor's
 * support. Confidence = max marginal probability. Selected positions are sampled independently from their
 * marginals (temperature 1) — exactly the conditional-independence step of parallel decoding. If a factor's
 * evidence is already impossible (e.g. "New Diego"), its remaining positions fall back to the factor's prior
 * (the run is invalid regardless; only the NFE after that point depends on this fallback).
 * Statistics: P(invalid) and E[NFE] are computed exactly by recursion over all sampler outcomes (memoised;
 * values of independent tokens never affect selection or validity, so they are collapsed). The shown run is
 * one deterministic sample from A.rng(seed). AR reference = leftmost masked token, one per step.
 * No fetch, no randomness outside A.rng; colours only via CSS variables.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});
  const L = 16, PROMPT = ["Book", "a", "flight", ":"];
  const CITIES = [["New", "York", 0.30], ["New", "Orleans", 0.10], ["San", "Diego", 0.25],
    ["San", "Jose", 0.10], ["Los", "Angeles", 0.15], ["Las", "Vegas", 0.10]];
  const FIXED = { 0: "from", 3: "to", 6: "on", 8: "at", 10: ",", 12: "seat", 13: "please", 14: ".", 15: "<eos>" };
  const F = [];
  Object.entries(FIXED).forEach(([i, w]) => F.push({ pos: [+i], tup: [[w]], p: [1] }));
  const trip = { pos: [1, 2, 4, 5], tup: [], p: [] };
  CITIES.forEach((o) => CITIES.forEach((d) => {
    if (o !== d) { trip.tup.push([o[0], o[1], d[0], d[1]]); trip.p.push(o[2] * d[2] / (1 - o[2])); }
  }));
  F.push(trip);
  F.push({ pos: [7], tup: [["Friday"], ["Monday"]], p: [0.7, 0.3] });
  F.push({ pos: [9], tup: [["9am"], ["6pm"]], p: [0.55, 0.45] });
  F.push({ pos: [11], tup: [["window"], ["aisle"]], p: [0.6, 0.4] });
  const FOF = [], SLOT = [];
  F.forEach((f, k) => f.pos.forEach((q, j) => { FOF[q] = k; SLOT[q] = j; }));
  const COUPLED = (i) => F[FOF[i]].pos.length > 1;
  const NAMES = { 1: "出发地前半", 2: "出发地后半", 4: "目的地前半", 5: "目的地后半" };

  // ---- exact model: conditional marginals of one factor given the unmasked tokens ----
  const cache = new Map();
  function post(f, st) {
    const key = FOF[f.pos[0]] + ":" + f.pos.map((q) => st[q] == null ? "_" : st[q]).join("|");
    if (cache.has(key)) return cache.get(key);
    let z = 0;
    const w = f.p.map((p, k) => {
      const ok = f.pos.every((q, j) => st[q] == null || st[q] === f.tup[k][j]);
      if (ok) z += p;
      return ok ? p : 0;
    });
    const ok = z > 1e-12, ww = ok ? w : f.p, zz = ok ? z : f.p.reduce((s, v) => s + v, 0);
    const res = { ok, marg: {} };
    f.pos.forEach((q, j) => {
      const m = new Map();
      f.tup.forEach((t, k) => { if (ww[k] > 0) m.set(t[j], (m.get(t[j]) || 0) + ww[k] / zz); });
      res.marg[q] = [...m.entries()].sort((a, b) => b[1] - a[1]);
    });
    cache.set(key, res);
    return res;
  }
  const marg = (st, i) => post(F[FOF[i]], st).marg[i];
  const conf = (st, i) => marg(st, i)[0][1];
  const valid = (st) => F.every((f) => post(f, st).ok);

  function select(st, c) {
    let lo = 0, hi = L;
    if (c.mode === "ar") { const i = st.findIndex((v) => v == null); return [i]; }
    if (c.B < L) for (let b = 0; b < L; b += c.B) {
      if (st.slice(b, b + c.B).some((v) => v == null)) { lo = b; hi = b + c.B; break; }
    }
    const cand = [];
    for (let i = lo; i < hi; i++) if (st[i] == null) cand.push({ i, c: conf(st, i) });
    cand.sort((a, b) => b.c - a.c || a.i - b.i);
    if (c.mode === "threshold") {
      const s = cand.filter((x) => x.c >= c.tau - 1e-9);
      return (s.length ? s : cand.slice(0, 1)).map((x) => x.i);
    }
    const spb = Math.max(1, Math.floor(c.N / (L / c.B))), done = c.B - cand.length;
    let cum = 0, k = 1;
    for (let j = 0; j < spb; j++) {
      const n = Math.floor(c.B / spb) + (j < c.B % spb ? 1 : 0);
      if (cum === done) { k = n; break; }
      cum += n;
    }
    return cand.slice(0, k).map((x) => x.i);
  }
  // enumerate joint outcomes of the selected positions (independent marginals); uncoupled ones collapsed
  function outcomes(st, S, collapse) {
    let outs = [{ st: st.slice(), q: 1 }];
    S.forEach((i) => {
      const m = collapse && !COUPLED(i) ? [[F[FOF[i]].tup[0][0], 1]] : marg(st, i);
      const nx = [];
      outs.forEach((o) => m.forEach(([v, p]) => { const s = o.st.slice(); s[i] = v; nx.push({ st: s, q: o.q * p }); }));
      outs = nx;
    });
    return outs;
  }
  function exact(c) {
    const memo = new Map();
    const key = (st) => st.map((v, i) => v == null ? "_" : COUPLED(i) ? v : "#").join("|");
    function rec(st) {
      const k = key(st);
      if (memo.has(k)) return memo.get(k);
      let r;
      if (!st.some((v) => v == null)) r = { bad: valid(st) ? 0 : 1, nfe: 0 };
      else {
        r = { bad: 0, nfe: 1 };
        outcomes(st, select(st, c), true).forEach((o) => {
          const s = rec(o.st); r.bad += o.q * s.bad; r.nfe += o.q * s.nfe;
        });
      }
      memo.set(k, r);
      return r;
    }
    return rec(new Array(L).fill(null));
  }
  function run(c, seed, A) {
    const rand = A.rng(seed), st = new Array(L).fill(null), steps = [];
    while (st.some((v) => v == null) && steps.length < 40) {
      const before = st.slice(), S = select(before, c);
      const pBreak = valid(before) ? outcomes(before, S, true).reduce((s, o) => s + (valid(o.st) ? 0 : o.q), 0) : 0;
      const toks = S.map((i) => {
        const m = marg(before, i); let u = rand(), acc = 0;
        for (const [v, p] of m) { acc += p; if (u < acc) return v; }
        return m[m.length - 1][0];
      });
      S.forEach((i, j) => { st[i] = toks[j]; });
      const pair = S.filter(COUPLED);
      steps.push({ S, toks, confs: S.map((i) => conf(before, i)), pBreak, sync: pair.length > 1 ? pair : [], st: st.slice() });
    }
    return steps;
  }
  function verdict(st) {
    const city = (a, b) => CITIES.findIndex((x) => x[0] === a && x[1] === b);
    const o = city(st[1], st[2]), d = city(st[4], st[5]), bad = [];
    if (o < 0) bad.push(`“${st[1]} ${st[2]}” 不是城市`);
    if (d < 0) bad.push(`“${st[4]} ${st[5]}” 不是城市`);
    if (o >= 0 && o === d) bad.push("出发地与目的地相同");
    return bad;
  }
  const pct = (x) => x < 0.0005 ? "0%" : (100 * x).toFixed(x < 0.1 ? 2 : 1) + "%";

  W["dllm-decode"] = (el, A) => {
    const focus = ["steps", "threshold", "block"].includes(el.dataset.focus) ? el.dataset.focus : "steps";
    const cfg = { mode: focus === "threshold" ? "threshold" : "steps", N: 8, tau: 0.9, B: focus === "block" ? 4 : 16 };
    let seed = 1, steps = [], shown = 0, timer = null, stats = null;
    el.classList.add("widget", "dllm-decode");
    const seg = (name, opts) => `<span class="seg" role="group">${opts.map(([v, t]) =>
      `<button type="button" data-${name}="${v}">${t}</button>`).join("")}</span>`;
    el.innerHTML = `
      <div class="w-title">交互：并行去掩码为什么会写出 “New Diego”</div>
      <div class="w-sub">画布 16 位，联合分布可精确计算：城市的两个词完全相关，出发地 ≠ 目的地；日期、时间、座位彼此独立。“模型”就是精确条件边缘分布，所以这里的错误全部来自<b>同一步内各位置独立采样</b>，与网络拟合无关。</div>
      <div class="w-controls" data-row="mode"><span>采样器</span>${seg("mode", [["steps", "固定步数 N"], ["threshold", "置信度阈值 τ"], ["ar", "左到右 AR（参照）"]])}</div>
      <div class="w-controls" data-row="steps"><span>步数 N</span>${seg("n", [[16, "16"], [8, "8"], [4, "4"], [2, "2"]])}<span class="dd-hint" data-out="k"></span></div>
      <div class="w-controls" data-row="threshold"><label>阈值 τ <input type="range" min="0.2" max="1" step="0.05" data-ctl="tau" aria-label="置信度阈值"> <b data-out="tau"></b></label></div>
      <div class="w-controls" data-row="block"><span>块长 B（块间左到右）</span>${seg("b", [[16, "16 全序列"], [8, "8"], [4, "4"], [2, "2"]])}</div>
      <div class="w-controls"><button class="btn primary" type="button" data-act="play">▶ 播放</button>
        <button class="btn" type="button" data-act="step">下一步</button><button class="btn" type="button" data-act="reset">↺ 重置</button>
        <button class="btn" type="button" data-act="seed">换随机种子</button><span class="dd-hint" data-out="seed"></span></div>
      <div class="dd-canvas" data-out="canvas" aria-live="polite"></div>
      <div class="dd-legend"><i class="dd-tk mask"></i>[M] 未定稿（小字：最可能的词与置信度） <i class="dd-tk done new"></i>本步定稿 <i class="dd-tk done"></i>已定稿（#步号） <i class="dd-tk done sync"></i>相关位置同一步定稿 <i class="dd-tk bad"></i>无效组合</div>
      <ol class="dd-log" data-out="log"></ol>
      <dl class="stat" data-out="stat"></dl>
      <p class="w-note" data-out="note"></p>`;
    el.append(A.h("style", { text: `
      .dllm-decode [hidden]{display:none!important}
      .dllm-decode .seg{flex-wrap:wrap;max-width:100%}
      .dllm-decode .seg button{white-space:nowrap}
      .dllm-decode .w-controls label{display:flex;align-items:center;gap:8px;flex:1;min-width:0;flex-wrap:wrap}
      .dllm-decode input[type=range]{flex:1;min-width:120px}
      .dllm-decode .focus{border-left:3px solid var(--c-pred);padding-left:8px}
      .dllm-decode .dd-hint{color:var(--text-2);font-size:.8rem}
      .dllm-decode .dd-canvas{display:flex;flex-wrap:wrap;gap:6px;align-items:stretch;margin:10px 0 4px}
      .dllm-decode .dd-blk{display:flex;flex-wrap:wrap;gap:4px;padding:4px;border:1px dashed var(--border-strong);border-radius:7px;max-width:100%}
      .dllm-decode .dd-blk.cur{border:1.5px solid var(--c-enc)}
      .dllm-decode .dd-tk{display:inline-block;min-width:50px;padding:2px 5px;border:1px solid var(--border-strong);border-radius:5px;text-align:center;font:.76rem/1.3 var(--font-mono);background:var(--surface);color:var(--text)}
      .dllm-decode .dd-tk small{display:block;font-size:.64rem;color:var(--text-2)}
      .dllm-decode .dd-tk.prompt{background:var(--c-act-bg);border-color:var(--c-act)}
      .dllm-decode .dd-tk.mask{background:repeating-linear-gradient(45deg,var(--surface-3) 0 3px,var(--c-mask) 3px 5px)}
      .dllm-decode .dd-tk.mask b,.dllm-decode .dd-tk.mask small{background:var(--surface);border-radius:3px;padding:0 3px;font-weight:500}
      .dllm-decode .dd-tk.mask small{margin-top:2px}
      .dllm-decode .dd-tk.done{background:var(--c-enc-bg);border-color:var(--c-enc)}
      .dllm-decode .dd-tk.new{box-shadow:0 0 0 2px var(--c-enc)}
      .dllm-decode .dd-tk.sync{border:2px dashed var(--warn)}
      .dllm-decode .dd-tk.bad{background:var(--c-loss-bg);border:2px solid var(--c-loss)}
      .dllm-decode .dd-legend{font-size:.78rem;color:var(--text-2);display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center}
      .dllm-decode .dd-legend i{min-width:18px;height:12px;padding:0;vertical-align:middle}
      .dllm-decode .dd-log{font-size:.8rem;margin:8px 0;padding-left:1.6em;max-height:11em;overflow-y:auto}
      .dllm-decode .dd-log .warn{color:var(--c-loss)}
      .dllm-decode .stat dd{font-family:var(--font-sans);overflow-wrap:anywhere}` }));
    const $ = (s) => el.querySelector(s), out = (n) => $(`[data-out="${n}"]`);
    const play = $('[data-act="play"]'), tauIn = $('[data-ctl="tau"]');
    tauIn.value = cfg.tau;

    function recompute() {
      stop();
      steps = run(cfg, seed, A);
      stats = exact(cfg);
      shown = 0;
      draw();
    }
    function chip(i, st, stepOf) {
      if (st[i] == null) {
        const m = marg(st, i)[0];
        return `<span class="dd-tk mask" title="位置 ${i + 1}"><b>[M]</b><small>${A.esc(m[0])} ${m[1].toFixed(2).replace(/^0/, "")}</small></span>`;
      }
      const s = stepOf[i], cur = s === shown;
      const sync = steps[s - 1].sync.includes(i), bad = !post(F[FOF[i]], st).ok;
      return `<span class="dd-tk done${cur ? " new" : ""}${sync ? " sync" : ""}${bad ? " bad" : ""}" title="${NAMES[i] || "位置 " + (i + 1)}">${A.esc(st[i])}<small>#${s}</small></span>`;
    }
    function draw() {
      const st = shown ? steps[shown - 1].st : new Array(L).fill(null), stepOf = [];
      steps.slice(0, shown).forEach((s, k) => s.S.forEach((i) => { stepOf[i] = k + 1; }));
      el.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("on", b.dataset.mode === cfg.mode));
      el.querySelectorAll("[data-n]").forEach((b) => b.classList.toggle("on", +b.dataset.n === cfg.N));
      el.querySelectorAll("[data-b]").forEach((b) => b.classList.toggle("on", +b.dataset.b === cfg.B));
      $('[data-row="steps"]').hidden = cfg.mode !== "steps";
      $('[data-row="threshold"]').hidden = cfg.mode !== "threshold";
      $('[data-row="block"]').hidden = cfg.mode === "ar";
      ["steps", "threshold", "block"].forEach((r) => $(`[data-row="${r}"]`).classList.toggle("focus", r === focus));
      out("tau").textContent = cfg.tau.toFixed(2);
      const nb = L / cfg.B, spb = Math.max(1, Math.floor(cfg.N / nb));
      out("k").textContent = spb * nb > cfg.N ? `块数 ${nb} > N：每块至少 1 步，实际 NFE = ${spb * nb}` : `每步约 ${cfg.B / spb} 个 token`;
      out("seed").textContent = `种子 ${seed}`;
      // canvas, grouped into blocks (AR: one group)
      const curBlk = cfg.mode === "ar" ? -1 : Math.floor(Math.max(0, st.findIndex((v) => v == null)) / cfg.B);
      let html = `<span class="dd-blk">${PROMPT.map((t) => `<span class="dd-tk prompt">${A.esc(t)}<small>prompt</small></span>`).join("")}</span>`;
      const B = cfg.mode === "ar" ? L : cfg.B;
      for (let b = 0; b < L; b += B) {
        const live = st.slice(b, b + B).some((v) => v == null) && b / B === curBlk && B < L;
        html += `<span class="dd-blk${live ? " cur" : ""}">${Array.from({ length: B }, (_, j) => chip(b + j, st, stepOf)).join("")}</span>`;
      }
      out("canvas").innerHTML = html;
      out("log").innerHTML = steps.slice(0, shown).map((s, k) => {
        const words = s.S.map((i, j) => `${A.esc(s.toks[j])}`).join(" · ");
        const warn = s.sync.length ? ` <span class="warn">⚠ 相关位置同步定稿（${s.sync.map((i) => NAMES[i]).join("、")}）；本步制造无效组合的精确概率 ${pct(s.pBreak)}</span>` : "";
        return `<li>第 ${k + 1} 次前向：定稿 ${s.S.length} 个 — ${words}${warn}</li>`;
      }).join("") || "<li>尚未开始：整张画布都是 [M]，下一次前向会给出所有位置的边缘分布。</li>";
      const doneAll = shown === steps.length, nfe = shown, dec = st.filter((v) => v != null).length;
      const bad = doneAll ? verdict(st) : [];
      out("stat").innerHTML = `<dt>本次运行</dt><dd>NFE ${nfe}${doneAll ? "（完成）" : ` / ${steps.length}`}，已定稿 ${dec} 个，TPF ${nfe ? (dec / nfe).toFixed(2) : "—"}</dd>
        <dt>结果</dt><dd>${!doneAll ? "进行中" : bad.length ? "无效样本：" + bad.join("；") : "有效样本（在联合分布的支撑集内）"}</dd>
        <dt>精确 P(结果无效)</dt><dd>${pct(stats.bad)}（对采样器所有随机结果求和，不是抽样估计）</dd>
        <dt>精确 E[NFE]</dt><dd>${stats.nfe.toFixed(2)}，即平均每次前向约 ${(L / stats.nfe).toFixed(2)} 个 token</dd>`;
      out("note").innerHTML = cfg.mode === "ar"
        ? "左到右逐个定稿：每一步都从精确条件分布采样，因此 P(无效) = 0，但需要 16 次前向。真实 AR 模型有 KV cache，每次前向只算一个新 token；这里只比较前向次数。"
        : cfg.mode === "threshold"
          ? "阈值只看单个位置的置信度：固定词（置信度 1）会一次性全部定稿，这是并行的“免费”部分；τ 降到城市词的置信度以下时，同一城市的两半可能在同一步各自采样。注意日期 / 时间 / 座位置信度不高却彼此独立，同步定稿不会出错——误差来自相关性，而不是不确定性本身。"
          : "固定步数时每步定稿的个数由 N 和 B 决定，与内容难度无关；N 越小，越可能被迫在同一步定稿两个相关位置。块长 B 把画布切成左到右的块：块内步数固定时，块里仅有的不确定词会被挤进同一步（B = 4、N = 8：出发城市两半同步定稿）；相关位置落在不同块则不可能同步定稿（B = 2：出发城市跨块，目的城市仍在同一块）。块解决的是变长与 KV cache，不是相关性。";
      $('[data-act="step"]').disabled = doneAll;
    }
    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null; play.textContent = "▶ 播放"; play.setAttribute("aria-pressed", "false");
    }
    function step() { if (shown < steps.length) shown++; draw(); if (shown >= steps.length) stop(); }
    play.addEventListener("click", () => {
      if (timer !== null) return stop();
      if (shown >= steps.length) shown = 0;
      play.textContent = "❚❚ 暂停"; play.setAttribute("aria-pressed", "true");
      timer = setInterval(() => { if (!el.isConnected) stop(); else step(); }, 800);
      draw();
    });
    $('[data-act="step"]').addEventListener("click", () => { stop(); step(); });
    $('[data-act="reset"]').addEventListener("click", () => { stop(); shown = 0; draw(); });
    $('[data-act="seed"]').addEventListener("click", () => { seed++; recompute(); });
    el.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => { cfg.mode = b.dataset.mode; recompute(); }));
    el.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => { cfg.N = +b.dataset.n; recompute(); }));
    el.querySelectorAll("[data-b]").forEach((b) => b.addEventListener("click", () => { cfg.B = +b.dataset.b; recompute(); }));
    tauIn.addEventListener("input", () => { cfg.tau = +tauIn.value; recompute(); });
    recompute();
  };
})();
