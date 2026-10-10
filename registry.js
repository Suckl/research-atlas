/* Atlas registry — the single source of truth for tracks, nodes and edges.
 *
 * FORMAT CONTRACT (enforced by scripts/check.py):
 *   - Everything between the first "=" and the final ";" must be STRICT JSON
 *     (double quotes, no trailing commas, no comments inside the object).
 *   - Schema is documented in AGENTS.md § "registry.js schema".
 * Pages read it as window.ATLAS_REGISTRY (works over file:// — no fetch needed).
 */
window.ATLAS_REGISTRY = {
  "schema_version": 1,
  "site": {
    "title": "Research Atlas",
    "subtitle": "把方法的演化路线拆开来看：架构、张量、目标函数与设计取舍",
    "lang": "zh-CN"
  },
  "tracks": [
    {
      "id": "jepa",
      "title": "JEPA：从表征学习到潜空间世界模型",
      "short": "JEPA",
      "status": "active",
      "page": "tracks/jepa/index.html",
      "summary": "从 LeCun 的 JEPA 构想出发，经 I-JEPA（图像）→ V-JEPA（视频）→ V-JEPA 2（规模化 + 动作条件规划），再到 LeWorldModel（用 SIGReg 实现端到端、极简的像素级世界模型）。",
      "reading_order": ["jepa-foundations", "i-jepa", "v-jepa", "v-jepa-2", "le-world-model"],
      "lanes": [
        { "id": "concept", "label": "概念" },
        { "id": "meta", "label": "规模化路线（Meta FAIR）" },
        { "id": "principled", "label": "原理化防坍塌路线" }
      ],
      "milestones": [
        { "date": "2022-06", "label": "LeCun《A Path Towards Autonomous Machine Intelligence》提出 JEPA / H-JEPA 与世界模型构想", "node": "jepa-foundations" },
        { "date": "2023-01", "label": "I-JEPA：在图像上预测被遮挡区域的表征", "node": "i-jepa" },
        { "date": "2024-02", "label": "V-JEPA：扩展到视频，时空多块掩码 + L1", "node": "v-jepa" },
        { "date": "2025-06", "label": "V-JEPA 2：1B 编码器 + 百万小时视频；V-JEPA 2-AC 零样本机器人规划", "node": "v-jepa-2" },
        { "date": "2025-11", "label": "LeJEPA：证明各向同性高斯最优，提出 SIGReg", "node": "lejepa" },
        { "date": "2026-03", "label": "LeWorldModel：只用两个损失项、从像素端到端训练的 JEPA 世界模型", "node": "le-world-model" }
      ],
      "compare_fields": [
        { "key": "modality", "label": "输入" },
        { "key": "tokens", "label": "Token / 表征形式" },
        { "key": "condition", "label": "预测器的条件变量 z" },
        { "key": "encoder", "label": "编码器" },
        { "key": "target", "label": "预测目标" },
        { "key": "predictor", "label": "预测器" },
        { "key": "loss", "label": "损失" },
        { "key": "anti_collapse", "label": "防坍塌机制" },
        { "key": "data", "label": "训练数据" },
        { "key": "scale", "label": "规模 / 算力" },
        { "key": "use", "label": "用途 / 评估方式" },
        { "key": "key_result", "label": "代表性结果" }
      ]
    }
  ],
  "nodes": [
    {
      "id": "jepa-foundations",
      "track": "jepa",
      "kind": "concept",
      "lane": "concept",
      "title": "从头讲起：JEPA",
      "full_title": "A Path Towards Autonomous Machine Intelligence（JEPA 的思想来源）",
      "authors": ["Yann LeCun"],
      "org": "Meta AI / NYU",
      "date": "2022-06",
      "venue": "OpenReview position paper",
      "links": [
        { "label": "OpenReview", "url": "https://openreview.net/forum?id=BZ5a1r-kVsf" }
      ],
      "page": "tracks/jepa/00-foundations.html",
      "tldr": "三种自监督架构（联合嵌入 / 生成式 / JEPA）的对比、表征坍塌问题与四类对策、能量模型视角，以及“潜空间世界模型 + 规划”的整体构想。",
      "tags": ["概念", "能量模型", "坍塌", "世界模型"]
    },
    {
      "id": "i-jepa",
      "track": "jepa",
      "kind": "model",
      "lane": "meta",
      "title": "I-JEPA",
      "full_title": "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture",
      "authors": ["Mahmoud Assran", "Quentin Duval", "Ishan Misra", "Piotr Bojanowski", "Pascal Vincent", "Michael Rabbat", "Yann LeCun", "Nicolas Ballas"],
      "org": "Meta AI (FAIR)",
      "date": "2023-01",
      "venue": "CVPR 2023",
      "arxiv": "2301.08243",
      "links": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2301.08243" },
        { "label": "Code", "url": "https://github.com/facebookresearch/ijepa" }
      ],
      "page": "tracks/jepa/01-i-jepa.html",
      "tldr": "从同一张图像的一个大“上下文块”出发，预测若干“目标块”在目标编码器中的表征（而不是像素）。不依赖手工数据增强，靠多块掩码 + 预测器 + EMA 目标编码器学到语义表征。",
      "tags": ["图像", "多块掩码", "EMA", "ViT"],
      "facts": {
        "modality": "图像，224×224",
        "tokens": "16×16 = 256 个 patch token（ViT-H/14）",
        "condition": "目标块的空间位置（mask token = 共享可学习向量 + 位置编码）",
        "encoder": "ViT（最大 ViT-H/14 ≈ 632M），只处理上下文 patch",
        "target": "EMA 目标编码器对整图编码后，在输出上取目标块",
        "predictor": "窄 ViT：12 层、宽 384；每个目标块各跑一次（M = 4）",
        "loss": "论文：L2；官方代码：smooth-L1 + 目标 LayerNorm",
        "anti_collapse": "非对称结构：predictor + EMA 目标编码器 + stop-gradient",
        "data": "ImageNet-1K",
        "scale": "ViT-H/14：16×A100 不到 72 小时（<1200 GPU·h）",
        "use": "冻结骨干，线性探测 / 低样本 / 计数与深度",
        "key_result": "IN-1K 线性探测 79.3（ViT-H/14）、81.1（ViT-H/16@448）"
      }
    },
    {
      "id": "v-jepa",
      "track": "jepa",
      "kind": "model",
      "lane": "meta",
      "title": "V-JEPA",
      "full_title": "Revisiting Feature Prediction for Learning Visual Representations from Video",
      "authors": ["Adrien Bardes", "Quentin Garrido", "Jean Ponce", "Xinlei Chen", "Michael Rabbat", "Yann LeCun", "Mahmoud Assran", "Nicolas Ballas"],
      "org": "Meta AI (FAIR)",
      "date": "2024-02",
      "venue": "arXiv 2404.08471（2024-02 随 Meta 博客发布）",
      "arxiv": "2404.08471",
      "links": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2404.08471" },
        { "label": "Code", "url": "https://github.com/facebookresearch/jepa" }
      ],
      "page": "tracks/jepa/02-v-jepa.html",
      "tldr": "把 I-JEPA 搬到视频：用 2×16×16 的 tubelet 切出时空 token，以贯穿整段时间的多块掩码遮住约 90% 的 token，用 L1 回归 EMA 目标编码器的特征。仅靠特征预测这一个目标，就得到冻结即可用于动作与外观任务的视频表征。",
      "tags": ["视频", "时空掩码", "L1", "attentive probe"],
      "facts": {
        "modality": "视频：16 帧（stride 4），224×224",
        "tokens": "2×16×16 tubelet → 8×14×14 = 1568 个 token",
        "condition": "被遮 token 的 3D 时空位置（mask token + 3D sin-cos）",
        "encoder": "ViT-L/16、ViT-H/16（≈630M），只处理约 10% 可见 token",
        "target": "EMA 目标编码器对整段视频编码（LayerNorm）后取被遮位置",
        "predictor": "窄 ViT：12 层、宽 384",
        "loss": "L1（论文称比 L2 更稳定）",
        "anti_collapse": "predictor + EMA（0.998→1.0）+ stop-gradient",
        "data": "VideoMix2M（≈200 万视频：HowTo100M、K400/600/700、SSv2）",
        "scale": "ViT-H/16 ≈ 630M；90K 迭代，batch 3072",
        "use": "冻结骨干 + attentive probe（交叉注意力池化）",
        "key_result": "冻结评估 K400 81.9 / SSv2 72.2 / IN-1K 77.9（ViT-H/16₃₈₄）"
      }
    },
    {
      "id": "v-jepa-2",
      "track": "jepa",
      "kind": "model",
      "lane": "meta",
      "title": "V-JEPA 2",
      "full_title": "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning",
      "authors": ["Mido Assran", "Adrien Bardes", "David Fan", "Quentin Garrido", "Russell Howes", "…", "Yann LeCun", "Michael Rabbat", "Nicolas Ballas"],
      "org": "Meta FAIR",
      "date": "2025-06",
      "venue": "arXiv 2506.09985",
      "arxiv": "2506.09985",
      "links": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2506.09985" },
        { "label": "Code", "url": "https://github.com/facebookresearch/vjepa2" }
      ],
      "page": "tracks/jepa/03-v-jepa-2.html",
      "tldr": "两阶段：① 把 V-JEPA 规模化到 >100 万小时视频、1B 参数（ViT-g）并用 3D-RoPE 与渐进分辨率训练；② 冻结编码器，只用 <62 小时机器人视频训练 300M 的动作条件预测器 V-JEPA 2-AC，在潜空间里用 CEM 规划，零样本驱动 Franka 机械臂完成抓取与放置。",
      "tags": ["规模化", "3D-RoPE", "动作条件", "CEM 规划", "机器人"],
      "facts": {
        "modality": "阶段一：视频 + 图像（最终 64 帧 384²）；阶段二：机器人视频 + 动作 + 末端状态",
        "tokens": "2×16×16 tubelet；阶段二每帧 16×16 = 256 个 1408 维 token",
        "condition": "阶段一：时空位置；阶段二：动作 aₖ 与末端状态 sₖ（均为 7 维）",
        "encoder": "ViT-g/16 ≈ 1B，3D-RoPE；阶段二冻结",
        "target": "阶段一：EMA 目标编码器；阶段二：冻结编码器对下一帧的编码",
        "predictor": "阶段一：≈ViT-S；阶段二：300M、24 层、块因果（block-causal）Transformer",
        "loss": "L1；阶段二 = teacher-forcing（T=15）+ rollout（T=2）",
        "anti_collapse": "阶段一：EMA + stop-grad；阶段二：编码器冻结，无坍塌空间",
        "data": "VideoMix22M（>100 万小时视频 + 100 万图像）+ Droid <62 小时",
        "scale": "1B 编码器 + 300M 动作预测器；规划约 16 s/动作",
        "use": "视频理解 / 动作预判 / 视频问答 / 零样本机器人规划",
        "key_result": "SSv2 77.3、EK100 动作预判 R@5 39.7；抓放成功率 65–80%"
      }
    },
    {
      "id": "lejepa",
      "track": "jepa",
      "kind": "bridge",
      "lane": "principled",
      "title": "LeJEPA（SIGReg）",
      "full_title": "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics",
      "authors": ["Randall Balestriero", "Yann LeCun"],
      "date": "2025-11",
      "venue": "arXiv 2511.08544",
      "arxiv": "2511.08544",
      "links": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2511.08544" }
      ],
      "page": "tracks/jepa/04-le-world-model.html#lejepa",
      "tldr": "证明各向同性高斯是使下游预测风险最小的嵌入分布，并提出 SIGReg（随机一维投影 + Epps–Pulley 检验）把嵌入推向它；由此去掉 stop-gradient、teacher-student、调度器等启发式。本站在 LeWorldModel 页中作为前置知识讲解。",
      "tags": ["SIGReg", "各向同性高斯", "无启发式"]
    },
    {
      "id": "le-world-model",
      "track": "jepa",
      "kind": "model",
      "lane": "principled",
      "title": "LeWorldModel",
      "full_title": "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels",
      "authors": ["Lucas Maes", "Quentin Le Lidec", "Damien Scieur", "Yann LeCun", "Randall Balestriero"],
      "date": "2026-03",
      "venue": "arXiv 2603.19312",
      "arxiv": "2603.19312",
      "links": [
        { "label": "arXiv", "url": "https://arxiv.org/abs/2603.19312" },
        { "label": "Code", "url": "https://github.com/lucas-maes/le-wm" },
        { "label": "Project", "url": "https://le-wm.github.io/" }
      ],
      "page": "tracks/jepa/04-le-world-model.html",
      "tldr": "约 15M 参数、单 GPU 数小时即可从像素端到端训练的 JEPA 世界模型：每帧压成一个 192 维嵌入，损失只有“下一嵌入预测 + λ·SIGReg”两项，不用 EMA、stop-gradient 或预训练编码器；规划速度比基于 DINOv2 特征的 DINO-WM 快至 48×。",
      "tags": ["世界模型", "端到端", "SIGReg", "AdaLN", "CEM 规划"],
      "facts": {
        "modality": "像素观测 224² + 动作（离线、无奖励轨迹）",
        "tokens": "每帧 1 个 192 维嵌入（[CLS] → projector）",
        "condition": "动作（frameskip 5 打包成一个动作块），经 AdaLN-zero 注入每层",
        "encoder": "ViT-Tiny（patch 14，≈5M），与预测器一起端到端训练",
        "target": "同一编码器对下一帧的嵌入（不使用 stop-gradient）",
        "predictor": "6 层因果 Transformer，16 头（≈10M）+ projector",
        "loss": "MSE 下一嵌入预测 + λ·SIGReg（λ = 0.1，唯一有效超参）",
        "anti_collapse": "SIGReg：把每个时间步的批内嵌入推向各向同性高斯",
        "data": "每个环境 1–2 万条离线轨迹（PushT / TwoRoom / Reacher / OGBench-Cube）",
        "scale": "≈15M 参数，单 GPU 数小时",
        "use": "潜空间 CEM 规划（MPC）、物理量探测、违背预期（surprise）检测",
        "key_result": "PushT 成功率比 PLDM 高 18%；每次规划 ≈1 s（DINO-WM ≈47 s）"
      }
    }
  ],
  "edges": [
    { "from": "jepa-foundations", "to": "i-jepa", "label": "构想首次落地：图像" },
    { "from": "i-jepa", "to": "v-jepa", "label": "空间 → 时空；L2 → L1" },
    { "from": "v-jepa", "to": "v-jepa-2", "label": "规模化 + 动作条件预测器" },
    { "from": "lejepa", "to": "le-world-model", "label": "SIGReg 取代 EMA / stop-grad" },
    { "from": "v-jepa-2", "to": "le-world-model", "label": "潜空间规划：冻结大模型 → 端到端小模型" }
  ]
};
