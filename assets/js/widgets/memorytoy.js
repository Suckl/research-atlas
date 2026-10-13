/* Widget: memory-toy — deterministic observed-update vs. off-screen-change toy.
 * Usage: <div data-widget="memory-toy"></div> (no optional data attributes).
 * A scripted agent leaves a landmark room and returns to its original pose.
 * Scenario A removes the wall at t=2 while visible; B at t=8 while out of view.
 * The oracle world is drawn for teaching only; writers receive visible cells only.
 * Every render replays observations strictly BEFORE t: query -> read -> compare,
 * then the current observation becomes writable at the next step. This prevents
 * the return frame itself from repairing the memory before recall is assessed.
 * Policies: four-frame window; pose/FoV nearest-frame bank (optional recency within
 * a similarity band); coordinate map with explicit empty-cell overwrite; four
 * recurrent scalar slots with exponential fading. Counts are toy items, not GPU
 * bytes or real-model scores. Blurred recurrent recall is classified as missing.
 * No off-screen transition model, learned generator, randomness, or fetch calls.
 */
(function () {
  "use strict";
  const W = (window.AtlasWidgets = window.AtlasWidgets || {});
  const POLICIES = {
    window: "滑动窗口（KV 窗口）",
    bank: "帧库检索（位姿 / FoV）",
    map: "三维地图（坐标覆写）",
    state: "定长循环状态（衰减）",
  };
  // x, y, heading (radians). The final pose exactly matches the first.
  const PATH = [
    [2, 3, 0], [2, 3, 0], [2, 4, -0.25], [2, 5, 1.2],
    [3, 6, 0], [4, 6, 0], [5, 6, 0], [6, 6, -0.5],
    [7, 5, -1.2], [7, 4, -1.2], [8, 3, -1.5], [8, 2, 3.1],
    [7, 2, 1.8], [7, 3, 1.5], [7, 4, 1.6], [7, 5, 2.4],
    [6, 6, 3.1], [5, 6, 3.1], [4, 6, 3.4], [3, 5, -2.36],
    [2, 4, -1.5], [2, 3, 0], [2, 3, 0],
  ];
  const RETURN = PATH.length - 2;
  const CELLS = [
    { id: "wall", x: 4, y: 3, label: "墙", color: "var(--c-reg)" },
    { id: "tree", x: 3, y: 2, label: "树", color: "var(--c-act)" },
    { id: "box", x: 3, y: 4, label: "箱", color: "var(--c-pred)" },
    { id: "flag", x: 8, y: 4, label: "旗", color: "var(--c-tgt)" },
  ];
  const angleDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
  function visible(cell, pose) {
    const dx = cell.x - pose[0], dy = cell.y - pose[1];
    return Math.hypot(dx, dy) <= 3.1 &&
      Math.abs(angleDiff(Math.atan2(dy, dx), pose[2])) <= 0.9;
  }
  function similarity(a, b) {
    return -Math.hypot(a[0] - b[0], a[1] - b[1]) -
      Math.abs(angleDiff(a[2], b[2]));
  }

  W["memory-toy"] = (el, A) => {
    let scenario = "seen", policy = "window", time = 0, recent = false, timer = null;
    el.classList.add("widget", "memory-toy");
    el.innerHTML = `
      <div class="w-title">交互：墙拆掉了，记忆为什么还说它在？</div>
      <div class="w-sub">先选变化是否被看见，再走出房间、探索、返回。右侧只读取当前帧写入之前的历史。</div>
      <div class="w-controls"><span class="seg" role="group" aria-label="变化场景">
        <button type="button" data-scenario="seen">A 变化被看见</button>
        <button type="button" data-scenario="unseen">B 变化在视野外</button>
      </span></div>
      <div class="w-controls"><label>记忆策略 <select data-control="policy" aria-label="记忆策略">
        ${Object.entries(POLICIES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}
      </select></label></div>
      <div class="w-controls" data-control="recency"><label>
        <input type="checkbox" data-control="recent"> 相近视角优先最新（允许稍差的位姿匹配）
      </label></div>
      <div class="w-controls">
        <button class="btn primary" type="button" data-action="play">▶ 播放</button>
        <button class="btn" type="button" data-action="step">下一步</button>
        <button class="btn" type="button" data-action="return">到回访</button>
        <button class="btn" type="button" data-action="reset">↺ 重置</button>
      </div>
      <div class="w-controls"><label class="mt-time">视频时间 t
        <input type="range" min="0" max="${PATH.length - 1}" value="0" data-control="time" aria-label="视频时间">
        <output data-output="time">0</output>
      </label></div>
      <p class="w-note" data-output="event" role="status" aria-live="polite"></p>
      <div class="w-row"><div class="w-stage" data-stage="world"></div>
        <div class="w-stage mt-views"><div data-stage="truth"></div><div data-stage="recall"></div></div></div>
      <dl class="stat"></dl>
      <p class="w-note" data-output="explain"></p>
      <p class="w-note">教学模型：以二维格点示意三维地图的坐标写入；这里的槽位衰减不是对所有 RNN 的性能结论。数量是玩具条目数。</p>`;
    el.append(A.h("style", { text: `
      .memory-toy select {max-width:100%;background:var(--surface);color:var(--text);border:1px solid var(--border-strong);border-radius:5px;padding:5px}
      .memory-toy .w-controls>label,.memory-toy .w-controls>label select {max-width:100%}
      .memory-toy .seg {flex-wrap:wrap;max-width:100%}
      .memory-toy .seg button {flex:1 1 auto;padding:6px 9px;white-space:normal}
      .memory-toy .mt-time {display:flex;align-items:center;gap:8px;width:100%;flex-wrap:wrap}
      .memory-toy .mt-time input {flex:1;min-width:110px}
      .memory-toy .w-stage {flex:1 1 280px}
      .memory-toy .mt-views {display:grid;gap:10px}
      .memory-toy .stat dd {font-family:var(--font-sans);overflow-wrap:anywhere}
      .memory-toy [data-control="recency"][hidden] {display:none}
      .memory-toy svg text {fill:var(--text);font-family:var(--font-sans);font-size:12px}
    ` }));
    const svg = (slot, w, h, label) => {
      const out = A.s("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": label });
      el.querySelector(`[data-stage="${slot}"]`).append(out);
      return out;
    };
    const world = svg("world", 320, 290, "俯视真值地图与代理视野；仅用于教学");
    const truth = svg("truth", 320, 136, "当前视野的真实状态");
    const recall = svg("recall", 320, 136, "当前帧写入前的记忆读出");
    const play = el.querySelector('[data-action="play"]');
    const slider = el.querySelector('[data-control="time"]');
    const event = el.querySelector('[data-output="event"]');
    const explain = el.querySelector('[data-output="explain"]');
    const stat = el.querySelector(".stat");
    const eventTime = () => scenario === "seen" ? 2 : 8;
    const wallValue = (t) => t < eventTime() ? 1 : 0;
    function observation(t) {
      const view = {};
      CELLS.forEach((c) => {
        if (visible(c, PATH[t])) view[c.id] = c.id === "wall" ? wallValue(t) : 1;
      });
      return { t, pose: PATH[t], view };
    }
    function replay() {
      const frames = [], map = {}, state = CELLS.map(() => ({ v: 0, weight: 0 }));
      for (let t = 0; t < time; t++) {
        const item = observation(t);
        frames.push(item);
        CELLS.forEach((c, i) => {
          // Writing an observed absence is essential: deleting a wall is a write.
          state[i].weight *= 0.86;
          if (c.id in item.view) {
            map[c.id] = { v: item.view[c.id], t };
            state[i].v = 0.65 * state[i].v + 0.35 * item.view[c.id];
            state[i].weight = 0.65 * state[i].weight + 0.35;
          }
        });
      }
      const queried = CELLS.filter((c) => visible(c, PATH[time]));
      const values = {}, provenance = [];
      let stored = 0, active = 0;
      if (policy === "window") {
        const window = frames.slice(-4);
        stored = active = window.length;
        window.forEach((f) => queried.forEach((c) => {
          if (c.id in f.view) values[c.id] = f.view[c.id];
        }));
        provenance.push("仅保留最近四条；窗口外条目已淘汰");
      } else if (policy === "bank") {
        stored = frames.length;
        let chosen = frames.slice().sort((a, b) =>
          similarity(b.pose, PATH[time]) - similarity(a.pose, PATH[time]) || a.t - b.t)[0];
        if (recent && chosen) {
          const best = similarity(chosen.pose, PATH[time]);
          chosen = frames.filter((f) => similarity(f.pose, PATH[time]) >= best - 1.3)
            .sort((a, b) => b.t - a.t)[0];
        }
        if (chosen) {
          active = 1;
          queried.forEach((c) => { if (c.id in chosen.view) values[c.id] = chosen.view[c.id]; });
          provenance.push(`读回 t=${chosen.t} 的旧帧；${recent ? "相近视角取最新" : "位姿 / 朝向最相似，同分取最早"}`);
        } else provenance.push("帧库为空");
      } else if (policy === "map") {
        stored = Object.keys(map).length;
        queried.forEach((c) => {
          if (map[c.id]) { values[c.id] = map[c.id].v; active++; }
        });
        provenance.push(map.wall ? `墙坐标最后写入 t=${map.wall.t}；空格也覆盖旧墙` : "墙坐标尚未观测");
      } else {
        stored = active = state.length;
        queried.forEach((c) => {
          const slot = state[CELLS.indexOf(c)];
          if (slot.weight > 0.14) values[c.id] = slot.v;
          else if (slot.weight > 0) values[c.id] = 0.5; // uncertain / blurred
        });
        provenance.push("固定四槽；内容混合，置信权重随时间衰减");
      }
      const targetVisible = visible(CELLS[0], PATH[time]);
      const v = values.wall;
      const missing = v == null || (v > 0.15 && v < 0.85);
      const status = !targetVisible ? "未查询墙（不在当前 FoV）" : missing ? "missing：缺失 / 模糊" :
        Math.abs(v - wallValue(time)) <= 0.15 ? "correct：正确" : "stale：过时";
      return { values, stored, active, status, provenance: provenance.join("；") };
    }
    function textAt(svg, x, y, text, attrs = {}) {
      return A.s("text", { x, y, text, ...attrs }, svg);
    }
    function panel(svg, title) {
      svg.replaceChildren();
      A.s("rect", { x: 1, y: 1, width: 318, height: 134, rx: 7,
        fill: "var(--surface-2)", stroke: "var(--border)" }, svg);
      textAt(svg, 12, 20, title, { "font-weight": 650 });
    }
    function drawView(svg, values, title) {
      panel(svg, title);
      const seen = CELLS.filter((c) => visible(c, PATH[time]));
      if (!seen.length) textAt(svg, 16, 70, "视野中暂无地标");
      seen.forEach((c, i) => {
        const x = 18 + i * 96, v = values[c.id];
        const blurred = v != null && v > 0.15 && v < 0.85;
        A.s("rect", { x, y: 38, width: 78, height: 48, rx: 5,
          fill: v == null ? "var(--surface-3)" : c.color,
          "fill-opacity": v == null || v < 0.15 ? 0.1 : blurred ? 0.35 : 0.85,
          stroke: v == null ? "var(--text-3)" : c.color,
          "stroke-dasharray": v == null || blurred || v < 0.15 ? "4 3" : "none" }, svg);
        textAt(svg, x + 39, 66, c.label, { "text-anchor": "middle" });
        const label = v == null ? "未知" : blurred ? "模糊" : v < 0.15 ? "已拆 / 空" : "存在";
        textAt(svg, x + 39, 105, label, { "text-anchor": "middle" });
      });
    }
    function drawWorld() {
      world.replaceChildren();
      textAt(world, 8, 18, "俯视真值（上帝视角，不给 writer）", { "font-weight": 650 });
      const X = (x) => 16 + 28 * x, Y = (y) => 34 + 28 * y;
      for (let x = 0; x < 10; x++) for (let y = 0; y < 8; y++) {
        A.s("rect", { x: X(x), y: Y(y), width: 28, height: 28,
          fill: "var(--surface-2)", stroke: "var(--border)" }, world);
      }
      A.s("path", { d: `M${X(5)},${Y(5.5)} V${Y(1)} H${X(1)} V${Y(7)} H${X(5)} V${Y(6.5)}`,
        fill: "none", stroke: "var(--text-2)", "stroke-width": 2 }, world);
      A.s("path", { d: PATH.slice(0, time + 1).map((p, i) =>
        `${i ? "L" : "M"}${X(p[0])},${Y(p[1])}`).join(" "),
        fill: "none", stroke: "var(--c-enc)", "stroke-width": 1.5, "stroke-dasharray": "3 3" }, world);
      const p = PATH[time], ax = X(p[0]), ay = Y(p[1]);
      const rays = [-0.9, 0.9].map((d) => [ax + 78 * Math.cos(p[2] + d), ay + 78 * Math.sin(p[2] + d)]);
      A.s("path", { d: `M${ax},${ay} L${rays[0]} A78,78 0 0 1 ${rays[1]} Z`,
        fill: "var(--c-enc)", "fill-opacity": 0.1, stroke: "var(--c-enc)", "stroke-dasharray": "4 3" }, world);
      CELLS.forEach((c) => {
        const intact = c.id !== "wall" || wallValue(time);
        A.s("rect", { x: X(c.x) - 10, y: Y(c.y) - 10, width: 20, height: 20, rx: 3,
          fill: c.color, "fill-opacity": intact ? 0.7 : 0.1, stroke: c.color,
          "stroke-dasharray": intact ? "none" : "3 2" }, world);
        textAt(world, X(c.x), Y(c.y) + 4, intact ? c.label : "空", { "text-anchor": "middle" });
      });
      A.s("circle", { cx: ax, cy: ay, r: 6, fill: "var(--c-enc)", stroke: "var(--surface)" }, world);
      A.s("line", { x1: ax, y1: ay, x2: ax + 13 * Math.cos(p[2]), y2: ay + 13 * Math.sin(p[2]),
        stroke: "var(--c-enc)", "stroke-width": 3 }, world);
      textAt(world, 8, 281, "虚线：已走路径 · 扇区：当前 FoV");
    }
    function draw() {
      const result = replay();
      drawWorld();
      drawView(truth, observation(time).view, "真实视野（当前观测）");
      drawView(recall, result.values, "记忆读出（当前观测写入前）");
      slider.value = time;
      el.querySelector('[data-output="time"]').textContent = `${time} / ${PATH.length - 1}`;
      el.querySelector('[data-control="recency"]').hidden = policy !== "bank";
      el.querySelectorAll('[data-scenario]').forEach((b) => {
        b.classList.toggle("on", b.dataset.scenario === scenario);
        b.setAttribute("aria-pressed", String(b.dataset.scenario === scenario));
      });
      event.textContent = time >= RETURN ? (time === RETURN ? "回访：先查询旧记忆，还没写入返回帧。" : "返回帧已写入：比较更新后的读出。") :
        time === eventTime() ? (scenario === "seen" ? "墙正在视野中被拆除；下一步会写入这个观测。" : "墙在视野外被拆除；writer 收不到这个事件。") :
        time < 3 ? "先看完好的墙与地标，随后离开房间。" : "离开 → 探索 → 返回；墙的旧记录逐渐远离窗口。";
      stat.innerHTML = `<dt>存储条目 / 槽位</dt><dd>${result.stored}</dd>
        <dt>活跃读取条目</dt><dd>${result.active}</dd>
        <dt>墙的召回判定</dt><dd>${result.status}</dd>
        <dt>读取依据</dt><dd>${result.provenance}</dd>`;
      explain.textContent = scenario === "unseen" ?
        "B：没有观测或动作消息，旧地图与新近旧帧也不知道墙已拆。正确预测需要离屏动力学或事件输入；仅加大记忆容量不够。" :
        "A：窗口会忘；帧库可能找回最像当前位姿的完好旧墙；地图须写入“空”来覆盖旧墙；固定衰减槽位会丢失清晰细节。";
      el.querySelector('[data-action="step"]').disabled = time === PATH.length - 1;
    }
    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null;
      play.textContent = "▶ 播放";
      play.setAttribute("aria-pressed", "false");
    }
    function step() {
      if (time < PATH.length - 1) time++;
      draw();
      if (time === PATH.length - 1) stop();
    }
    play.addEventListener("click", () => {
      if (timer !== null) return stop();
      if (time === PATH.length - 1) time = 0;
      play.textContent = "❚❚ 暂停";
      play.setAttribute("aria-pressed", "true");
      timer = setInterval(() => { if (!el.isConnected) stop(); else step(); }, 650);
      draw();
    });
    el.querySelector('[data-action="step"]').addEventListener("click", () => { stop(); step(); });
    el.querySelector('[data-action="return"]').addEventListener("click", () => { stop(); time = RETURN; draw(); });
    el.querySelector('[data-action="reset"]').addEventListener("click", () => { stop(); time = 0; draw(); });
    slider.addEventListener("input", () => { stop(); time = +slider.value; draw(); });
    el.querySelector('[data-control="policy"]').addEventListener("change", (e) => { policy = e.target.value; draw(); });
    el.querySelector('[data-control="recent"]').addEventListener("change", (e) => { recent = e.target.checked; draw(); });
    el.querySelectorAll('[data-scenario]').forEach((b) => b.addEventListener("click", () => {
      stop(); scenario = b.dataset.scenario; time = 0; draw();
    }));
    draw();
  };
})();
