/* Widget: collectives — step through all-reduce / all-gather / reduce-scatter / all-to-all on N ranks.
 * Usage: <div data-widget="collectives" data-ranks="4"></div>
 * Each rank holds a vector split into N chunks. Chunk j on rank i is written "x_ij".
 * Ring all-reduce = reduce-scatter (N−1 steps) + all-gather (N−1 steps); per-rank traffic 2·(N−1)/N·D.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W.collectives = function (el, A) {
    const N = Math.min(6, Math.max(2, +el.dataset.ranks || 4));
    let op = "all-reduce", step = 0, states = [];
    const L = "abcdef";
    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：集合通信一步一步看（${N} 卡）</div>
      <div class="w-sub">每张卡持有一个向量，切成 ${N} 块。单元格里写着这一块当前是谁的数据：<code>a2</code> = 卡 a 的第 2 块，<code>a2+b2</code> = 已经归约过的部分和。</div>
      <div class="w-controls">
        <span class="seg" role="group">
          <button type="button" data-op="all-reduce">All-Reduce（环）</button>
          <button type="button" data-op="reduce-scatter">Reduce-Scatter</button>
          <button type="button" data-op="all-gather">All-Gather</button>
          <button type="button" data-op="all-to-all">All-to-All</button>
          <button type="button" data-op="broadcast">Broadcast</button>
        </span>
        <button class="btn" type="button" data-act="prev">← 上一步</button>
        <button class="btn primary" type="button" data-act="next">下一步 →</button>
        <span class="step-label"></span>
      </div>
      <div class="w-row"><div class="w-stage scroll-x"></div><div class="w-side"><dl class="stat"></dl><p class="w-note"></p></div></div>`;
    const stage = el.querySelector(".w-stage"), stat = el.querySelector(".stat"), note = el.querySelector(".w-note"), label = el.querySelector(".step-label");

    const initial = () => Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => [`${L[i]}${j}`]));
    const clone = (s) => s.map((r) => r.map((c) => c.slice()));
    const full = (j) => Array.from({ length: N }, (_, i) => `${L[i]}${j}`);

    function build() {
      const seq = [{ s: initial(), desc: "初始：每张卡各有自己的完整向量（" + N + " 块）。", sent: 0 }];
      let s = clone(seq[0].s), sent = 0;
      const push = (desc) => seq.push({ s: clone(s), desc, sent });
      if (op === "reduce-scatter" || op === "all-reduce") {
        for (let k = 0; k < N - 1; k++) {
          const ns = clone(s);
          for (let i = 0; i < N; i++) { const j = ((i - k - 1) % N + N) % N, from = (i - 1 + N) % N; ns[i][j] = [...new Set([...s[from][j], ...s[i][j]])]; }
          s = ns; sent += 1;
          push(`Reduce-Scatter 第 ${k + 1}/${N - 1} 步：每张卡把一块发给右邻并累加收到的块（每卡发 D/${N}）。`);
        }
        seq[seq.length - 1].desc += ` 完成后每张卡恰好持有 1 块<b>完整和</b>（卡 i 持有第 ${"i+1"} 块），其余块是部分和。`;
      }
      if (op === "all-gather" || op === "all-reduce") {
        if (op === "all-gather") { s = initial().map((r, i) => r.map((c, j) => (j === i ? c : ["·"]))); seq[0] = { s: clone(s), desc: "初始：卡 i 只持有自己的第 i 块（其余为空）。", sent: 0 }; }
        // After ring reduce-scatter, rank i's complete chunk is (i+1) mod N; standalone all-gather starts with chunk i.
        const off = op === "all-reduce" ? 1 : 0;
        for (let k = 0; k < N - 1; k++) {
          const ns = clone(s);
          for (let i = 0; i < N; i++) { const j = ((i - k - 1 + off) % N + N) % N, from = (i - 1 + N) % N; ns[i][j] = s[from][j]; }
          s = ns; sent += 1;
          push(`All-Gather 第 ${k + 1}/${N - 1} 步：每张卡把一块原样转发给右邻（每卡发 D/${N}）。`);
        }
      }
      if (op === "all-to-all") {
        const ns = initial().map((r, i) => r.map((c, j) => [`${L[j]}${i}`])); s = ns; sent = N - 1;
        push(`All-to-All（1 步，${N - 1} 条对等消息）：卡 i 的第 j 块发给卡 j——像矩阵转置。MoE 的 dispatch/combine 就是它：按路由结果把 token 发到专家所在的卡。`);
      }
      if (op === "broadcast") {
        s = initial().map((r, i) => (i === 0 ? r : r.map(() => ["·"]))); seq[0] = { s: clone(s), desc: "初始：只有卡 a 持有数据。", sent: 0 };
        s = initial().map(() => initial()[0].map((c) => c.slice())); sent = N - 1;
        push(`Broadcast：根卡把整个向量发给所有卡（根发 (N−1)·D，树/环实现可摊成每卡 D）。`);
      }
      return seq;
    }

    function draw() {
      const { s, desc, sent } = states[step];
      const cw = 92, ch = 30, x0 = 40, y0 = 26;
      const svg = A.s("svg", { viewBox: `0 0 ${x0 + N * cw + 10} ${y0 + N * (ch + 8) + 10}`, class: "dg", role: "img", "aria-label": "集合通信状态" });
      svg.style.minWidth = `${Math.max(380, x0 + N * cw)}px`;
      for (let j = 0; j < N; j++) A.s("text", { x: x0 + j * cw + cw / 2, y: 14, class: "t-c t-xs", text: `块 ${j}` }, svg);
      s.forEach((row, i) => {
        const y = y0 + i * (ch + 8);
        A.s("text", { x: 8, y: y + ch / 2, class: "t-sm t-b", text: `卡 ${L[i]}` }, svg);
        row.forEach((cell, j) => {
          const complete = cell.length === N, partial = cell.length > 1 && cell.length < N, empty = cell[0] === "·";
          A.s("rect", { x: x0 + j * cw, y, width: cw - 4, height: ch, rx: 5, fill: empty ? "var(--surface-2)" : complete ? "var(--c-act-bg)" : partial ? "var(--c-pred-bg)" : "var(--c-enc-bg)", stroke: complete ? "var(--c-act)" : partial ? "var(--c-pred)" : "var(--border-strong)" }, svg);
          const txt = complete && op !== "all-to-all" && op !== "broadcast" && op !== "all-gather" ? `Σ 块${j}` : cell.join("+");
          A.s("text", { x: x0 + j * cw + (cw - 4) / 2, y: y + ch / 2, class: "t-c t-mono", style: "font-size:" + (txt.length > 9 ? 9 : 11) + "px", text: txt }, svg);
        });
      });
      stage.replaceChildren(svg);
      label.textContent = `第 ${step} / ${states.length - 1} 步`;
      const D = "D";
      const perRank = { "all-reduce": `2·(N−1)/N·D = ${(2 * (N - 1) / N).toFixed(2)}·D`, "reduce-scatter": `(N−1)/N·D = ${((N - 1) / N).toFixed(2)}·D`, "all-gather": `(N−1)/N·D = ${((N - 1) / N).toFixed(2)}·D`, "all-to-all": `(N−1)/N·D = ${((N - 1) / N).toFixed(2)}·D`, broadcast: `根发 (N−1)·D；环/树实现每卡 ≈ D` }[op];
      stat.innerHTML = `
        <dt>当前状态</dt><dd>${desc}</dd>
        <dt>每卡已发送</dt><dd>${sent} × D/${N}</dd>
        <dt>总通信量（每卡）</dt><dd>${perRank}</dd>
        <dt>结果</dt><dd>${{ "all-reduce": "每张卡都得到<b>整个向量的和</b>", "reduce-scatter": "每张卡得到<b>一块</b>的和", "all-gather": "每张卡得到<b>所有块的原始值</b>（拼接，不求和）", "all-to-all": "每张卡得到所有卡发给自己的那一块（转置）", broadcast: "每张卡得到根卡的向量" }[op]}</dd>`;
      note.innerHTML = {
        "all-reduce": "All-Reduce = Reduce-Scatter + All-Gather：这正是 Megatron 序列并行能把一次 all-reduce 拆成“reduce-scatter 后按序列切开算 LayerNorm/dropout，再 all-gather”的原因——通信量不变，但中间激活只有 1/N。张量并行每层前向 2 次 all-reduce（注意力后、MLP 后）。",
        "reduce-scatter": "ZeRO-2/3、FSDP 用它来做梯度归约：每卡只保留自己负责的那一分片的完整梯度，省掉 N 倍的梯度显存。",
        "all-gather": "FSDP 在每层前向前用它把分片的权重临时拼回完整；Megatron 的“scatter/gather”流水线优化也用节点内 all-gather 代替跨节点重复发送。<b>与 All-Reduce 的区别</b>：All-Gather 只拼接不求和，输出是 N 倍大；All-Reduce 求和，输出与输入同大。",
        "all-to-all": "专家并行（EP）的通信原语：dispatch 把每个 token 的隐状态发到它路由到的专家所在卡，combine 再把专家输出按原顺序发回。通信量与被路由的 token 数、隐维度成正比，与专家数无关——DeepSeek-V3 把每个 token 限制在 ≤4 个节点内就是在控制它。",
        broadcast: "参数服务器 / 单卡读 checkpoint 后分发时使用；NCCL 的树/环算法把根卡的 (N−1)·D 摊薄。",
      }[op];
      el.querySelectorAll("[data-op]").forEach((b) => b.classList.toggle("on", b.dataset.op === op));
      el.querySelector('[data-act="prev"]').disabled = step === 0;
      el.querySelector('[data-act="next"]').disabled = step === states.length - 1;
    }
    function reset(newOp) { op = newOp; states = build(); step = 0; draw(); }
    el.querySelectorAll("[data-op]").forEach((b) => b.addEventListener("click", () => reset(b.dataset.op)));
    el.querySelector('[data-act="prev"]').addEventListener("click", () => { if (step > 0) { step--; draw(); } });
    el.querySelector('[data-act="next"]').addEventListener("click", () => { if (step < states.length - 1) { step++; draw(); } });
    reset("all-reduce");
  };
})();
