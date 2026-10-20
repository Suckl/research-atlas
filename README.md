# Research Atlas

论文精读站：每篇论文一页**逐节精读**。从动机讲起，先把前置知识讲清楚，再按原文章节逐节讲方法、实验和局限。每页都配图：许可证允许时用原文配图，否则用自己画的示意图。
纯静态 HTML，无构建步骤；为人阅读，也为 agent 扩展（见 [AGENTS.md](AGENTS.md)）。

在线阅读：https://suckl.github.io/research-atlas/

## 论文书架

首页（[index.html](index.html)）就是书架，按类别或年份分组，可按首版日期或引用数排序。每张卡片显示：

- 首版日期和会议；
- 引用数和高影响力引用数（Semantic Scholar 快照，见 `papers/metrics.js`）；
- 有没有精读页。

论文可以放进“未读 / 在读 / 已读 / 收藏”书架，精读页的阅读进度会自动记录。这些都只保存在本机浏览器里。

已有精读页（`papers/`）：

- AI Infra：
  - [vLLM / PagedAttention](papers/vllm.html)，另附逐段对照原文的全文翻译
  - [FlashAttention](papers/flashattention.html)
  - [RoFormer / RoPE](papers/roformer.html)
  - [Megatron-LM](papers/megatron-lm.html)
  - [ZeRO](papers/zero.html)
  - [投机解码](papers/speculative-decoding.html)
  - [SGLang](papers/sglang.html)
  - [DistServe](papers/distserve.html)
  - [HybridFlow / verl](papers/hybridflow.html)
  - [DeepSeek-V3](papers/deepseek-v3.html)
  - 2024 年以后的高引用工作。每页都有“结果的份量”一节，写明每个对比用的是什么基线系统、硬件、指标和精度代价。
    - 调度与架构：[Sarathi-Serve](papers/sarathi-serve.html)、[Mooncake](papers/mooncake.html)
    - 算子与注意力：[FlashAttention-3](papers/flashattention-3.html)、[NSA 原生稀疏注意力](papers/native-sparse-attention.html)
    - KV cache 与量化：[SnapKV](papers/snapkv.html)、[KIVI](papers/kivi.html)、[QuaRot](papers/quarot.html)
    - 投机解码：[Medusa](papers/medusa.html)、[EAGLE 1 / 2 / 3](papers/eagle.html)
    - 训练系统：[MegaScale](papers/megascale.html)
- 统一多模态：[视觉生成能扩展 UMM 的知识吗](papers/visual-generation-knowledge.html)
- 扩散 LLM。每页的“结果的份量”写明和自回归模型比时对齐了什么（参数、训练 token、步数、批大小、对照系统）。
  - 噪声与目标：
    - [D3PM](papers/d3pm.html)
    - [Diffusion-LM](papers/diffusion-lm.html)
    - [SEDD](papers/sedd.html)
    - [MDLM（含 MD4）](papers/mdlm.html)
    - [Discrete Flow Matching](papers/discrete-flow-matching.html)
  - 规模：
    - [LLaDA](papers/llada.html)
    - [Dream 7B](papers/dream.html)
    - [LLaDA2.0](papers/llada2.html)
  - 块扩散与加速：
    - [Block Diffusion](papers/block-diffusion.html)
    - [Fast-dLLM](papers/fast-dllm.html)
    - [DFlash](papers/dflash.html)
  - 后训练与局限：
    - [d1](papers/d1.html)
    - [Train for the Worst, Plan for the Best](papers/token-ordering.html)
  - 多模态与工业：
    - [MMaDA](papers/mmada.html)
    - [Mercury](papers/mercury.html)
- 循环 Transformer（looped / recurrent-depth）。每页都有“结果的份量”一节，写明每个比较到底对齐了什么（参数、训练算力、推理算力、KV 缓存还是数据）。
  - 奠基与理论：
    - [Universal Transformer](papers/universal-transformers.html)
    - [循环 Transformer 作为可编程计算机](papers/looped-programmable-computers.html)
    - [潜在思考](papers/reasoning-latent-thoughts.html)
  - 规模化语言模型：
    - [Huginn](papers/huginn.html)
    - [Ouro](papers/ouro.html)
    - [Mixture-of-Recursions](papers/mixture-of-recursions.html)
  - 小网络递归推理：[TRM / HRM](papers/tiny-recursive-model.html)
  - 稳定性与扩展律：
    - [Parcae](papers/parcae.html)
    - [等深度扩展律](papers/iso-depth-scaling.html)
    - [SMELT](papers/smelt.html)
  - ICLR 2027 在审的匿名投稿：
    - [Loop-μP](papers/loop-mup.html)
    - [ELR](papers/elastic-latent-recurrence.html)
    - [循环能替代多少参数](papers/loops-vs-parameters.html)
    - [ARLoop](papers/arloop.html)

## 每个精读页的结构

1. **标题区**：作者与单位、引用数、首版日期、会议、代码链接、阅读状态。
2. **逐节精读**：
   - 先是“0 导读”，然后按原文章节逐节展开，最后是“后来怎么样了”。
   - 每节开头先说清这一节要回答什么问题，以及这个问题从哪里来。
   - 用到的前置知识先单独讲。
   - 每张图都附“怎么看”，并标出容易误读的地方。
3. **作者**：单位和可公开核实的背景。
4. **影响力**：会议、采用情况、代码 star 数。
5. **延伸阅读**。

## 旧版路线（[legacy/](legacy/index.html)）

改版前的五条研究路线仍然保留：

- JEPA（12 页）
- AI Infra（24 页）
- 少步生成（17 页）
- 视频记忆（18 页）
- 扩散 LLM（19 页）

每条路线都有一个总览页，包括演化图、完整时间线、逐维度对比表和简答题汇总；每个节点有一页结构拆解，包括可交互的架构图、张量形状、目标函数和交互演示。

旧链接 `/tracks/…` 会自动跳转到 `/legacy/tracks/…`。新论文只做精读页；如果对应旧路线里的某个节点，就在这个节点上挂 `reading` 字段，让书架指向精读页。

## 打开

直接双击 `index.html`，或者在仓库根目录运行：

```bash
python scripts/serve.py
```

然后访问 http://127.0.0.1:8765/ 。

唯一的外部依赖是 KaTeX（jsDelivr CDN）。离线时公式会显示成源码，其余功能不受影响。

## 扩展

- **元数据**：只写在 `registry.js` 一处，包括类别 / 路线、论文节点和边。书架、总览页的演化图、时间线和对比表都由它生成。
- **新精读页**：按 AGENTS.md 里“论文精读页（固定做法）”的步骤，从 `templates/reading-page.html` 复制。
- **引用数**：运行 `python scripts/fetch_metrics.py` 刷新。
- **提交前**：运行 `python scripts/check.py`，必须 0 错误。它检查 registry、链接、精读页文件、组件说明配对和 widget 脚本加载。

## 目录

```
index.html  registry.js  AGENTS.md  404.html
papers/<slug>.html  papers/<slug>/fig/  papers/metrics.js
assets/css/atlas.css  assets/js/{atlas,papers}.js  assets/js/widgets/*.js
templates/{reading-page,model-page}.html
legacy/index.html  legacy/tracks/{jepa,ai-infra,few-step,video-memory,dllm}/…
scripts/{check,serve,fetch_metrics,arxiv_blocks}.py
```
