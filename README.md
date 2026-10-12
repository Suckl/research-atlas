# Research Atlas

把研究方法的演化路线拆开来看：可交互的架构图、张量形状、目标函数、设计取舍。
纯静态 HTML，无构建步骤；为人阅读，也为 agent 扩展（见 [AGENTS.md](AGENTS.md)）。

在线阅读：https://suckl.github.io/research-atlas/

**路线一：JEPA** — [从头讲起](tracks/jepa/00-foundations.html) → [I-JEPA](tracks/jepa/01-i-jepa.html) → [V-JEPA](tracks/jepa/02-v-jepa.html) → [V-JEPA 2 / V-JEPA 2-AC](tracks/jepa/03-v-jepa-2.html) → [LeWorldModel](tracks/jepa/04-le-world-model.html)。总览：[tracks/jepa/index.html](tracks/jepa/index.html)。

**路线二：AI Infra（LLM 推理与训练系统）** — 15 个节点，以论文为单位：[推理计算特征](tracks/ai-infra/00-inference-basics.html)、FlashAttention、FlashInfer、vLLM、SGLang、投机解码、PD 分离、Megatron 并行、FP8、DeepSeek-V3、RoPE、Gated DeltaNet、DSA 稀疏注意力、批不变性与训推一致、AMD/ROCm。每页末尾附简答题，用论文作答；总览页有[简答题汇总](tracks/ai-infra/index.html#questions)。

## 打开

直接双击 `index.html`，或：

```bash
python scripts/serve.py
```

然后访问 http://127.0.0.1:8765/ 。唯一的外部依赖是 KaTeX（jsDelivr CDN）；离线时公式显示为源码，其余功能不受影响。

## 每个节点页的结构

动机 → 全局架构（点击组件看说明，「逐步讲解」按前向/反向顺序高亮）→ 组件拆解（含交互演示）→ 张量形状追踪 → 训练目标与防坍塌 → 伪代码 → 关键超参 → 关键结果 → 承上启下 → 参考。

交互演示：I-JEPA 多块掩码采样器、V-JEPA 时空掩码、块因果 / AdaLN 注意力掩码、CEM + MPC 玩具规划器、SIGReg（Epps–Pulley）二维梯度下降。

## 扩展

- 元数据只写一处：`registry.js`（tracks / nodes / edges / facts）。总览页的演化图、时间线、对比表由它生成。
- 新页面从 `templates/model-page.html` 复制。
- 提交前运行 `python scripts/check.py`（registry 校验、链接、组件说明配对、widget 脚本加载）。
- 每条路线的数字出处写在 `tracks/<track>/SOURCES.md`。

## 目录

```
index.html  registry.js  AGENTS.md
assets/css/atlas.css  assets/js/atlas.js  assets/js/widgets/*.js
templates/model-page.html
tracks/jepa/{index,00-foundations,01-i-jepa,02-v-jepa,03-v-jepa-2,04-le-world-model}.html
tracks/jepa/SOURCES.md
scripts/{check,serve}.py
```
