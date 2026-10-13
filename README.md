# Research Atlas

把研究方法的演化路线拆开来看：可交互的架构图、张量形状、目标函数、设计取舍。
纯静态 HTML，无构建步骤；为人阅读，也为 agent 扩展（见 [AGENTS.md](AGENTS.md)）。

在线阅读：https://suckl.github.io/research-atlas/

**路线一：JEPA**（12 个拆解页，时间线到 2026-10）— [从头讲起](tracks/jepa/00-foundations.html) → [I-JEPA](tracks/jepa/01-i-jepa.html) → [V-JEPA](tracks/jepa/02-v-jepa.html) → [DINO-WM / PLDM](tracks/jepa/05-dino-wm.html) → [V-JEPA 2 / 2-AC](tracks/jepa/03-v-jepa-2.html) → [LLM-JEPA](tracks/jepa/06-llm-jepa.html) → [VL-JEPA](tracks/jepa/07-vl-jepa.html) → [LeWorldModel（含 LeJEPA）](tracks/jepa/04-le-world-model.html) → [V-JEPA 2.1](tracks/jepa/08-v-jepa-2-1.html) → [HWM / H-JEPA](tracks/jepa/10-hierarchical-wm.html) → [LeVJEPA](tracks/jepa/09-levjepa.html) → [RoboJEPA](tracks/jepa/11-robojepa.html)。总览：[tracks/jepa/index.html](tracks/jepa/index.html)。

**路线二：AI Infra（LLM 推理与训练系统）** — 24 个节点，以论文为单位，时间线 2017 → 2026-10：[推理计算特征](tracks/ai-infra/00-inference-basics.html)、Orca / Sarathi-Serve、FlashAttention 1–3、FlashAttention-4、FlashInfer、vLLM、SGLang、KV cache 分层存储、投机解码、EAGLE 1/2/3、PD 分离、Megatron 并行、ZeRO / FSDP、FP8、FP4（NVFP4 / MXFP4）、DeepSeek-V3、RoPE、Gated DeltaNet、Kimi Linear / K3、DSA 稀疏注意力、DeepSeek-V4 / mHC、批不变性与训推一致、RL 训练系统（verl / AReaL）、AMD/ROCm。每页末尾附简答题（共 44 题），用论文作答；总览页有[简答题汇总](tracks/ai-infra/index.html#questions)。

**路线三：少步生成（扩散 / 流模型蒸馏，从图像到视频）** — 17 个拆解页、19 个节点，时间线 2020 → 2026-10，按监督信号分五个范式：[从头讲起](tracks/few-step/01-foundations.html)、轨迹蒸馏（Progressive Distillation / Rectified Flow / InstaFlow）、一致性与流映射（Consistency Models / LCM / sCM / MeanFlow）、对抗蒸馏（ADD / LADD / SDXL-Lightning）、分布匹配（DMD / DMD2）、表征空间匹配与漂移（Drifting / RDM）；以及各范式迁移到视频的工作（VideoLCM / T2V-Turbo、rCM、Seaweed-APT / APT2、CausVid、Self Forcing、Causal Forcing、ViRDM）。总览页有[图像 → 视频迁移表](tracks/few-step/index.html#transfer)，每页附简答题（共 34 题）。

三条路线的总览页都有演化图（每列一条路线、按年自上而下，悬停高亮上下游）、完整时间线（未单独成页的重要论文以虚线节点 + arXiv 链接列出）和逐维度对比表。

## 打开

直接双击 `index.html`，或：

```bash
python scripts/serve.py
```

然后访问 http://127.0.0.1:8765/ 。唯一的外部依赖是 KaTeX（jsDelivr CDN）；离线时公式显示为源码，其余功能不受影响。

## 每个节点页的结构

动机 → 全局架构（点击组件看说明，「逐步讲解」按前向/反向顺序高亮）→ 组件拆解（含交互演示）→ 张量形状追踪 → 训练目标与防坍塌 → 伪代码 → 关键超参 → 关键结果 → 承上启下 → 参考。

交互演示：I-JEPA 多块掩码采样器、V-JEPA 时空掩码、块因果 / AdaLN 注意力掩码、CEM + MPC 玩具规划器、SIGReg（Epps–Pulley）二维梯度下降；AI Infra 路线另有 roofline / KV 计算器、PagedAttention 块表、投机解码加速比、集合通信分步演示；少步生成路线有二维玩具上的少步采样 / 配对回归 / DMD / 漂移场演示。

## 扩展

- 元数据只写一处：`registry.js`（tracks / nodes / edges / facts / milestones / questions）。总览页的演化图、时间线、对比表、简答题汇总由它生成。时间线条目可指向节点页（及页内锚点）或外部论文链接。
- 新页面从 `templates/model-page.html` 复制。
- 提交前运行 `python scripts/check.py`（registry 校验、链接、组件说明配对、widget 脚本加载）。
- 每条路线的数字出处写在 `tracks/<track>/SOURCES.md`。

## 目录

```
index.html  registry.js  AGENTS.md
assets/css/atlas.css  assets/js/atlas.js  assets/js/widgets/*.js
templates/model-page.html
tracks/jepa/{index,00-foundations,01-i-jepa,…,11-robojepa}.html     tracks/jepa/SOURCES.md
tracks/ai-infra/{index,00-inference-basics,…,23-deepseek-v4}.html  tracks/ai-infra/SOURCES.md
tracks/few-step/{index,01-foundations,…,17-virdm}.html            tracks/few-step/SOURCES.md
scripts/{check,serve}.py
```
