/* Widget: paged-kv — PagedAttention memory layout: blocks, block tables, prefix sharing, copy-on-write.
 * Usage: <div data-widget="paged-kv"></div>
 * Scenario (vLLM paper §4.4, parallel sampling): sequences A and B share the SAME prompt of P tokens, then
 * generate independently. Prompt blocks are shared (ref count 2); the partially-filled last prompt block is
 * shared too, until the first sequence appends a token into it — that triggers copy-on-write.
 * Compare against "pre-allocate max_len per sequence" (the paper's baselines).
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});

  W["paged-kv"] = function (el, A) {
    const MAXLEN = 2048;
    let bs = 16, P = 40, gA = 10, gB = 0;
    el.classList.add("widget");
    el.innerHTML = `
      <div class="w-title">交互：PagedAttention 的块、块表与写时复制</div>
      <div class="w-sub">同一个 prompt 的两路采样 A、B（论文 §4.4 的 parallel sampling）。上面是“按最大长度预分配”，下面是分页分配；每个方格是一个 KV 块，填充比例 = 块内已用 token。</div>
      <div class="w-controls">
        <label>block_size <select data-k="bs">${[1, 8, 16, 32, 64, 128].map((v) => `<option ${v === 16 ? "selected" : ""}>${v}</option>`).join("")}</select></label>
        <label>prompt 长度 <input type="range" data-k="P" min="1" max="256" value="40"> <b data-v="P">40</b></label>
        <label>A 已生成 <input type="range" data-k="gA" min="0" max="256" value="10"> <b data-v="gA">10</b></label>
        <label>B 已生成 <b data-v="gB">0</b></label>
        <button class="btn primary" type="button" data-act="gen">B 生成 1 个 token</button>
        <button class="btn" type="button" data-act="reset">B 重置</button>
      </div>
      <div class="w-row"><div class="w-stage scroll-x"></div><div class="w-side"><dl class="stat"></dl><p class="w-note"></p></div></div>`;
    const stage = el.querySelector(".w-stage"), stat = el.querySelector(".stat"), note = el.querySelector(".w-note");

    function layout() {
      const blocks = [], tableA = [], tableB = [];
      const add = (b) => { blocks.push(b); return blocks.length - 1; };
      const full = Math.floor(P / bs), rem = P % bs;
      for (let i = 0; i < full; i++) { const id = add({ owner: "S", fill: bs, ref: 2 }); tableA.push(id); tableB.push(id); }
      let usedA = full * bs, usedB = full * bs, cowEvents = 0;
      const lenA = P + gA, lenB = P + gB;
      if (rem > 0) {
        // the boundary block holds the last `rem` prompt tokens; shared until someone appends into it
        if (gA === 0 && gB === 0) {
          const id = add({ owner: "S", fill: rem, ref: 2 }); tableA.push(id); tableB.push(id); usedA = usedB = P;
        } else if (gA > 0 && gB === 0) {
          // A appended first: ref was 2 → A got a private copy (CoW); original now belongs to B alone
          const orig = add({ owner: "B", fill: rem, ref: 1 }); tableB.push(orig); usedB = P;
          const copy = add({ owner: "A", fill: Math.min(bs, lenA - full * bs), ref: 1, cow: true }); tableA.push(copy); usedA = full * bs + blocks[copy].fill; cowEvents = 1;
        } else if (gA === 0 && gB > 0) {
          const orig = add({ owner: "A", fill: rem, ref: 1 }); tableA.push(orig); usedA = P;
          const copy = add({ owner: "B", fill: Math.min(bs, lenB - full * bs), ref: 1, cow: true }); tableB.push(copy); usedB = full * bs + blocks[copy].fill; cowEvents = 1;
        } else {
          // both appended: first writer copied, the second then wrote into the (now ref=1) original in place
          const orig = add({ owner: "B", fill: Math.min(bs, lenB - full * bs), ref: 1 }); tableB.push(orig); usedB = full * bs + blocks[orig].fill;
          const copy = add({ owner: "A", fill: Math.min(bs, lenA - full * bs), ref: 1, cow: true }); tableA.push(copy); usedA = full * bs + blocks[copy].fill; cowEvents = 1;
        }
      }
      const run = (table, used, total, owner) => { while (used < total) { const fill = Math.min(bs, total - used); table.push(add({ owner, fill, ref: 1 })); used += fill; } };
      run(tableA, usedA, lenA, "A"); run(tableB, usedB, lenB, "B");
      return { blocks, tableA, tableB, lenA, lenB, full, rem, cowEvents };
    }

    function render() {
      const { blocks, tableA, tableB, lenA, lenB, full, rem, cowEvents } = layout();
      const cols = 16, cell = 30, gap = 4, rowH = cell + gap;
      const rows = Math.ceil(Math.max(blocks.length, 1) / cols);
      const H = 150 + rows * rowH + 24;
      const svg = A.s("svg", { viewBox: `0 0 ${cols * (cell + gap) + 20} ${H}`, class: "dg", role: "img", "aria-label": "KV 块布局" });
      svg.style.minWidth = "520px";
      const barW = cols * (cell + gap) - 10;
      A.s("text", { x: 10, y: 14, class: "t-sm t-b", text: `基线：每条序列预留 max_len = ${MAXLEN} 个 token 的连续空间（prompt 也各存一份）` }, svg);
      [["A", lenA], ["B", lenB]].forEach(([nm, len], i) => {
        const y = 24 + i * 26;
        A.s("rect", { x: 10, y, width: barW, height: 18, rx: 3, fill: "var(--surface-3)", stroke: "var(--border-strong)" }, svg);
        A.s("rect", { x: 10, y, width: (barW * Math.min(len, MAXLEN)) / MAXLEN, height: 18, rx: 3, fill: nm === "A" ? "var(--c-enc)" : "var(--c-act)", opacity: 0.8 }, svg);
        A.s("text", { x: 16 + (barW * Math.min(len, MAXLEN)) / MAXLEN, y: y + 9.5, class: "t-xs", text: `${nm}: 用 ${len} / 预留浪费 ${Math.max(0, MAXLEN - len)}` }, svg);
      });
      A.s("text", { x: 10, y: 96, class: "t-sm t-b", text: `分页：block_size = ${bs}，共 ${blocks.length} 个物理块（紫 = 共享 ×2，蓝 = A，绿 = B，橙框 = 写时复制产生的副本）` }, svg);
      blocks.forEach((b, i) => {
        const x = 10 + (i % cols) * (cell + gap), y = 108 + Math.floor(i / cols) * rowH;
        const col = b.owner === "S" ? "var(--c-tgt)" : b.owner === "A" ? "var(--c-enc)" : "var(--c-act)";
        A.s("rect", { x, y, width: cell, height: cell, rx: 4, fill: "var(--surface-2)", stroke: b.cow ? "var(--c-pred)" : "var(--border-strong)", "stroke-width": b.cow ? 2.5 : 1 }, svg);
        A.s("rect", { x: x + 2, y: y + cell - 2 - (cell - 4) * (b.fill / bs), width: cell - 4, height: (cell - 4) * (b.fill / bs), rx: 2, fill: col, opacity: 0.85 }, svg);
        if (b.ref > 1) A.s("text", { x: x + cell / 2, y: y + cell / 2 + 1, class: "t-c t-xs", style: "fill:#fff;font-weight:700", text: "×2" }, svg);
        A.s("text", { x: x + cell / 2, y: y + cell + 9, class: "t-c t-xs", text: String(i) }, svg);
      });
      const yT = 108 + rows * rowH + 14;
      A.s("text", { x: 10, y: yT, class: "t-mono", text: `块表 A: [${tableA.join(", ")}]` }, svg);
      A.s("text", { x: 10, y: yT + 16, class: "t-mono", text: `块表 B: [${tableB.join(", ")}]` }, svg);
      stage.replaceChildren(svg);

      const alloc = blocks.length * bs, unique = P + gA + gB;
      const waste = blocks.reduce((s, b) => s + (bs - b.fill), 0);
      const dup = blocks.filter((b) => b.cow).length ? rem : 0;   // prompt tokens stored twice after CoW
      const baseWaste = 2 * MAXLEN - lenA - lenB;
      stat.innerHTML = `
        <dt>真实 token（去重）</dt><dd>${unique}</dd>
        <dt>分页分配槽位</dt><dd>${alloc}：内部碎片 ${waste}（${((100 * waste) / alloc).toFixed(1)}%）${dup ? `，CoW 复制的 prompt 尾部 ${dup}` : ""}</dd>
        <dt>每条序列最大浪费</dt><dd>&lt; ${bs} 个 token（只在最后一块）</dd>
        <dt>基线浪费</dt><dd>${baseWaste} / ${2 * MAXLEN}（${((100 * baseWaste) / (2 * MAXLEN)).toFixed(1)}%），且 prompt 存两份</dd>
        <dt>共享</dt><dd>${full} 个整块（ref 2）${rem ? `；半满的边界块（${rem} 个 prompt token）${cowEvents ? "已被写时复制" : "仍共享"}` : ""}</dd>`;
      note.innerHTML = `prompt 有 ${P} 个 token = ${full} 个整块 + ${rem} 个零头。${rem ? `零头所在的边界块一开始也共享（ref 2）；${gA > 0 ? "A" : "B"} 往里追加第一个生成 token 时，vLLM 发现 ref &gt; 1，先复制一份再写——这就是写时复制；之后另一条序列直接写入 ref 已变为 1 的原块。` : "prompt 恰好整块，无需 CoW。"} 块越大：块表越短、内核读得更连续，但每条序列最后一块平均空 ${bs / 2} 个槽位，且共享只能按整块。论文在 ShareGPT 上 16–128 都好、Alpaca 上 16/32 最好，默认 16。`;
      ["P", "gA", "gB"].forEach((k) => (el.querySelector(`[data-v="${k}"]`).textContent = { P, gA, gB }[k]));
    }
    el.querySelector('[data-k="bs"]').addEventListener("change", (e) => { bs = +e.target.value; render(); });
    el.querySelector('[data-k="P"]').addEventListener("input", (e) => { P = +e.target.value; render(); });
    el.querySelector('[data-k="gA"]').addEventListener("input", (e) => { gA = +e.target.value; render(); });
    el.querySelector('[data-act="gen"]').addEventListener("click", () => { gB++; render(); });
    el.querySelector('[data-act="reset"]').addEventListener("click", () => { gB = 0; render(); });
    render();
  };
})();
