# Sources — Video memory track

Where the numbers and claims on this track's pages come from. "Paper" = the arXiv version listed in
`registry.js`; "Code" / "Project" = official repositories and project pages (checked 2026-10-13). All metric
values are as reported by the authors; nothing was re-run.

Legend: ✅ verified against the source · ⚠ secondary source or inferred · ❓ not verified

## 01 — 记忆与一致性 (`01-foundations.html`) — 2210.02396, 2210.02399, 2403.14773, 2408.14837, 2602.08025, 2606.00793, 2606.20545, 2606.27537, 2608.27328, 2505.20171, 2505.22976

核验日：2026-10-13。本页为概念页，框架与玩具结论不是论文实测。下列数字与指标定义跟随各自协议，不拼接为跨模型总分。页面与 SOURCES 的合并由 lead 完成，本作业没有修改共享 SOURCES.md。

| Claim | Source | Status |
|---|---|---|
| 长视频输出、长 context 与具体长程召回需要区分；短滑窗能持续出图但重新发明离屏内容 | [TECO](https://arxiv.org/html/2210.02396) §1；[FramePack v3](https://arxiv.org/html/2504.12626v3) §1；本页机制归纳 | ✅ 原文动机；⚠ 分类为讲解框架 |
| 同地点静态回访、已观察拆墙后保持为空、未观察离屏变化是不同信息任务 | [TECO](https://arxiv.org/html/2210.02396) §1；[MemoBench](https://arxiv.org/html/2606.27537) §3；[WRBench](https://arxiv.org/html/2606.20545v1) 评测协议；本页 toy | ✅ 任务边界；⚠ 拆墙为自建教学例 |
| 没有观测 / 动作 / 事件消息，存储模块无法知道任意离屏拆墙；需要额外演化模型或不确定性 | memorytoy.js：scenario B 在 t=8 改真值，writers 只接收 visible cells；信息边界推断 | ⚠ 推断，不是所有动态事件无法预测的主张 |
| generic loop：recent window、memory、query、read、write、evict 分开；符号 t 与 τ 区分 | [FramePack](https://arxiv.org/html/2504.12626v3) §3–4；[WorldMem](https://arxiv.org/html/2504.12369) §3；[GEN3C](https://arxiv.org/html/2503.03751) §4；[TinyHistory](https://arxiv.org/html/2512.23851v6) §3 | ⚠ 统一讲解骨架，非每文相同 API |
| 循环 state 存固定形状压缩历史；KV 存层级 token 投影；帧库保留帧 / latent + keys；地图存世界坐标；关键帧 / 实体存稀疏参考 | [SSM-WM](https://arxiv.org/html/2505.20171) §4；[Self Forcing](https://arxiv.org/html/2506.08009) §3；WorldMem §3；GEN3C §4；[StoryMem](https://arxiv.org/html/2512.19539) §3 | ✅ 机制对象，概念归纳；不声称每项统一 writer |
| GT / generated 与 clean / noisy 是独立轴；clean 自生成仍可包含场景错误 | Self Forcing §3.1–3.2；FramePack §4.2、§5.4；本页分布解释 | ✅ 来源 / 噪声协议；⚠ 场景真值解释 |
| GT bank 与自生成 bank 测不同错误传播 | [MAG](https://arxiv.org/html/2512.18741) §3.6；Self Forcing §1、§3 | ✅ |
| prompt re-cache 重编码条件，不能恢复已删除历史 | [LongLive](https://arxiv.org/html/2509.22622) §3 的 KV-recache；本页信息边界推断 | ✅ 重编码机制；⚠ 恢复边界推断 |
| 活跃 GPU token 预算不等于 archive、原始历史、地图与索引总存储 | FramePack §3；WorldMem §3；TinyHistory §3.4、§4.4；本页系统记账 | ⚠ 系统成本归纳；公式各项可共享存储，不重复相加 |
| 保真 / 容量 / 命中 / 更新正确性是不同轴；更大 bank 不保证正确状态 | FramePack §3；TinyHistory §4.5；WRBench 评测维度；本页机制推断 | ✅ 有损机制与评测维度；⚠ 取舍归纳 |
| 未见视角要区别已见表面、未知区域和额外 pose / depth 信息 | GEN3C §4.1–4.4；SSM-WM §5.2 | ✅ |
| 静态回访、离屏动态、动作后果、跨 shot 身份与故事状态需要不同证据 | MemoBench §3；WRBench 评测协议；[EntityBench](https://arxiv.org/html/2605.15199) §3；[MSVBench](https://arxiv.org/html/2602.23969) §3.3；本页评测归纳 | ✅ 各任务定义；⚠ “必要证据”是设计归纳 |
| flow 示意 x^τ=(1−τ)x+τε，τ=0 clean、τ=1 noise，目标 ε−x | TinyHistory v6 §3，式 (1)–(6) | ✅ 统一改写符号；并非所有视频方法使用 flow |
| MIND Long Context Memory Consistency：同动作未来 generated vs GT 的逐帧 MSE 均值，越低越好 | [MIND v2](https://arxiv.org/html/2602.08025v2) §3.5 | ✅ |
| MIND Generated Scene Consistency：对称去返生成帧之间 MSE 均值，越低越好 | MIND v2 §3.5 | ✅；自一致与物理 GT 正确性分开 |
| MIND Action Accuracy：ViPE 恢复轨迹、Sim(3) Umeyama 对齐后计算平移 / 旋转 RPE | MIND v2 §3.5 | ✅；不当作纯记忆分 |
| MIND Tab. 2 使用相同处理，评测 720p，比较 cold-start 与 clean context-memory 条件 | MIND v2 §4.1、Tab. 2 caption | ✅ 作者报告；额外历史条件不同 |
| MIND-World w/o context：GT 未来 MSE=0.1091；去返生成 MSE=0.0359 | MIND v2 Tab. 2，First Person / MIND-First 50 | ✅ 作者报告，未独立复现 |
| MIND-World w context：GT 未来 MSE=0.1035；去返生成 MSE=0.0309 | MIND v2 Tab. 2，同 First Person 协议 | ✅ 作者报告，未独立复现 |
| MBench 先用 VLM 验证触发，再对触发样本评分 | [MBench v2](https://arxiv.org/html/2606.00793v2) §4.1 | ✅ |
| MBench C=N_trigger/N_total；S 为触发样本条件平均；M-Score=2CS/(C+S) | MBench v2 §4.1，式 (1)–(3) | ✅；保留分母与覆盖率 |
| WRBench 六类诊断含相机精度 / prompt 对齐、视觉完整性、可见空间 / 状态、返回支持、返回空间 / 状态 | [WRBench v1](https://arxiv.org/html/2606.20545v1) “Evaluation Dimensions” / “Evaluation Method Suite” | ✅；六类中空间 / 状态实际分报 |
| WRBench 隐藏间隔、返回、可辨认成立才评返回状态；失败为 insufficient support / NA，并与 support 联报 | WRBench v1 返回支持 gate、式 (7)–(8) | ✅；不将缺 support 当正确或合入统一总分 |
| WRBench 状态 probes 使用 yes/no token 概率并按问题极性校正 | WRBench v1 式 (4)–(6) | ✅ |
| MemoBench 使用 V/D/R 三阶段；ORS=有效检测置信度总和 / R-phase 总帧数 | [MemoBench](https://arxiv.org/html/2606.27537) §3.4，式 (6)；SAM-3 有效 mask 过滤 | ✅；ORS 不单独验证状态更新 |
| MemoBench 有 GT 时分 V/D/R 与完整视频报告 PSNR↑、SSIM↑、LPIPS↓ | MemoBench §3.4 Pixel-Level Fidelity | ✅；主表为全视频均值，本文未混报具体分数 |
| MemoBench VQA 四柱：Instruction Following、Object & Background Consistency、Continuity of Memory、Physics Adherence | MemoBench §3.5 | ✅ |
| MemoBench motion-gated 分析排除未离屏 / 低运动捷径 | MemoBench Appendix motion-gated analysis | ✅ |
| R2M 同 rollout 取 revisit、gap-matched non-revisit、short-range pairs，先统一指标方向 | [R2M-Bench v1](https://arxiv.org/html/2608.27328v1) §4.2–4.3，式 (5)–(6) | ✅ |
| R2M MG=s_rev−s_base；DR=s_short−s_base；NMR=MG/(DR+ε) | R2M-Bench §4.3，式 (7)–(9) | ✅ |
| R2M short-range 不是上界；NMR 可超过 1，DR 小时不稳；MG 不因果辨认内部机制 | R2M-Bench §4.3、App. B | ✅；页面用文字保留解释范围 |
| R2M 指标按外观、场景、对象、局部几何、持久状态分族 | R2M-Bench §4.4 | ✅ |
| Memory Maze 是 RL 长记忆环境；原 score 是 fixed episode 内找到目标数 / reward；布局和物体位置固定 | [官方环境 README](https://github.com/jurgisp/memory-maze) Task | ✅；不是视频重建协议 |
| Memory Maze 的 SSM-WM 适配输入 position / observation，不输入 GT maze layout；逆向 retrieval 与延伸 reasoning 分开 | [SSM-WM](https://arxiv.org/html/2505.20171) §5.1–5.2 | ✅ |
| SSM-WM 视频任务使用 PSNR↑、SSIM↑、LPIPS↓ | SSM-WM §5.2、Tab. 2–3 | ✅；本文未引其模型数值 |
| LoopNav ABA / ABCA 分探索与重建，只评 B→A / C→A 段 | [LoopNav 当前原文](https://arxiv.org/html/2505.22976) §4.1 | ✅；Lian 等提出，非 WorldPack 创建 |
| LoopNav 当前版本 SGCS：SAM-3 类别 mask、质心距离与 Hungarian matching、按面积加权后平均 | LoopNav §4.3；Tab. 1 | ✅；另报 SSIM / LPIPS / FVD |
| WorldPack 在 LoopNav 适配中另报 PSNR / DreamSim，并列 LPIPS / SSIM / FVD | [WorldPack](https://arxiv.org/html/2512.02473) §5–6 | ✅；明确不是 LoopNav 原始 metric 定义 |
| TECO v1 首发 2022-10；压缩时空 / MaskGit 设计及长依赖导航评测 | [TECO abs](https://arxiv.org/abs/2210.02396) submission history；HTML §1–3；[官方代码](https://github.com/wilson1yan/teco) | ✅；页面不写未经核验的 venue |
| Phenaki v1 首发 2022-10；因果视频 tokenizer / 文本条件 masked transformer；ICLR 2023 | [Phenaki abs](https://arxiv.org/abs/2210.02399)；[ICLR 2023 原文](https://openreview.net/pdf?id=vOEXS39nOF) §3 / 首页 | ✅ |
| StreamingT2V v1 首发 2024-03；CAM 近期 chunk / APM 锚帧外观；CVPR 2025 | [StreamingT2V](https://arxiv.org/html/2403.14773) §4、Fig. 3；abs submission history；[CVF 原文](https://openaccess.thecvf.com/content/CVPR2025/html/Henschel_StreamingT2V_Consistent_Dynamic_and_Extendable_Long_Video_Generation_from_Text_CVPR_2025_paper.html) | ✅ |
| GameNGen v1 首发 2024-08；动作条件历史预测、噪声增强；单帧 teacher-forcing 质量与短 clip 判断不能替代远期回访 | [GameNGen](https://arxiv.org/html/2408.14837) §4–5、Limitations；abs submission history | ✅ 机制 / 协议；⚠ 证据边界为归纳 |
| Oasis 是 2024-10-31 官方发布；limited long-horizon memory；不虚构 arXiv 作者 | [Oasis 官方页面](https://oasis-model.github.io/) Date / Limitations / BibTeX | ✅ 官方发布，非论文 |
| Genie 3 是 2025-08-05 官方发布，展示 visual memory 和交互世界；内部存储机制未披露 | [Google DeepMind 官方发布](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/) | ✅ 官方演示证据；❓ 内部 memory 实现 |
| Toy 默认四条 window、四个 recurrent slots；回访前 t=21；A 在 t=2、B 在 t=8 拆墙；下一步才写入当前观察 | `assets/js/widgets/memorytoy.js` header、PATH、observation、replay、draw；`cache/job1-qa.json` | ✅ 自建确定性教学协议，不是论文数值 |
| Toy A：window missing；nearest bank stale；recency bank correct；map correct；state blur/missing。B：recency bank 与 map 仍 stale | memorytoy.js；Playwright / Edge 900px 与 375px 功能检查，`cache/job1-qa.json` | ✅ 玩具机制结果；非真实模型排名 |

验证：两页均无 KaTeX error、SVG 文字超盒 / 超 viewBox；widget 在 375px 宽无横向 overflow。`file://` 下两页初始化、逐步讲解与 widget 均通过，整页宽度 375 / scrollWidth 375（`cache/job1-file-qa.json`）。两页内为长来源标签添加换行样式。最终 check.py 不报本作业文件；轨道总览仍有 SOURCES.md 待合并错误。上述浏览器与代码检查不等于运行或复现任何研究模型。

## 02 — FramePack / TinyHistory (`02-history-compression.html`) — 2504.12626, 2512.23851, 2512.02473

版本锁定：FramePack **v3，2025-10-14**；TinyHistory **v6，2026-06-20**。PFP v1 仅用于保真预训练动机与更名说明。全部分数为作者报告，未运行模型；FramePack 原论文 HunyuanVideo 主表与 TinyHistory 重实现 Wan 2.1 主表分开。

| Claim | Source | Status |
|---|---|---|
| FramePack 标准题名、五名作者、Stanford / MIT 机构，v1 首发 2025-04 | [abs](https://arxiv.org/abs/2504.12626) submission history；[v3 HTML 作者栏](https://arxiv.org/html/2504.12626v3) | ✅ |
| FramePack NeurIPS 2025 venue 与官方代码 | [NeurIPS proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2bde8fef08f7ebe42b584266cbcfc909-Abstract-Conference.html)；[lllyasviel/FramePack](https://github.com/lllyasviel/FramePack) | ✅ |
| TinyHistory 首发 2025-12；v1 题名 PFP；v6 改为当前题名、日期 2026-06-20 | [submission history](https://arxiv.org/abs/2512.23851)；[v1](https://arxiv.org/html/2512.23851v1)；[v6](https://arxiv.org/html/2512.23851v6) | ✅ |
| TinyHistory 九名作者；Stanford、MIT、CMU、HKUST 机构 | TinyHistory v6 HTML 作者栏 | ✅ |
| candidates.json 写 ECCV 2026，但当前 abs / 官方结果页没有 venue 证明，因此交接 venue 为空 | [abs](https://arxiv.org/abs/2512.23851)；[官方结果页](https://lllyasviel.github.io/TinyHistory_gitpage/) | ❓ venue 未核验；不当已发表事实 |
| 当前 v6 完整训练代码未核验；只给官方结果页，不虚构 Code 链接 | 官方 TinyHistory results page 与 abs comments | ❓ 可复现代码；不声称不存在代码 |
| 遗忘与错误漂移可能互相制约；结构压缩与端点 / 历史表示的抗漂移分开 | FramePack v3 §1、§4 | ✅ |
| importance 可由 time proximity、预测目标 feature similarity 或 hybrid 排序 | FramePack §3.1–3.2，式 (1)、(3)–(5) | ✅；feature 模式用估计目标，不偷用未来 GT |
| 每帧长度 L_f/λ^i；历史 token 总量是几何级数；上限 L_f(S+λ/(λ−1)) | FramePack §3.1，式 (1)–(2) | ✅ 由式 (2) 推导；正文极限文字漏 L_f，本页保留单位 |
| 实际 tail 不可分数 token 无限压缩；delete / per-frame append / all-tail average pooling | FramePack §3.1 Tail options | ✅；append tail 仍增长 context |
| patch kernel (p_f,p_h,p_w) 控制时空粒度，同样压缩率可用不同时间 / 空间组合 | FramePack §3.1 Packing schedules、Fig. 1 | ✅ |
| 常用独立 projection kernels (2,4,4)、(4,8,8)、(8,16,16)；更大档先下采样再复用最大 kernel | FramePack §3.1 Independent patchifying parameters | ✅ |
| RoPE phases 通过平均池化与压缩 kernel 对齐；非连续时间 / gaps 跳过空白 phases | FramePack §3.1 RoPE alignment；§4.1 RoPE with random access | ✅ |
| 双向：先建两端再填空；inverted I2V 倒序靠近用户首帧；multiple endpoints 支持多 prompt 规划 | FramePack §4.1、Fig. 2(b–d) | ✅；未来端点条件与在线因果控制分开 |
| FramePack codebook 历史量化：Q(F)_p=argmin_k norm(F_p−Ω_k)，还原为量化 latent | FramePack §4.2，式 (6)、Fig. 2(e) | ✅；有损表示，不声称具体 K 为最优 |
| FramePack notation f16k4f2k2f1k1 使用历史 16+2+1 latent 帧，kernel (4,8,8)/(2,4,4)/(1,2,2)，g9 生成 9 latent 帧 | FramePack §5.1 Ablative Naming | ✅；明确 latent 帧，不能直接当视频秒数 |
| FramePack tensor token 数 N_i≈(T_i/p_f)(h/p_h)(w/p_w) | 按 FramePack §3.1 kernel 定义推算；实际含 padding / 取整 | ⚠ 符号形状追踪，不是论文指定配置 |
| TinyHistory 首版显式随机历史重建预训练，强调帧细节；v6 两阶段查询覆盖 / 内容一致性 | PFP v1 §3.1、§4.2；TinyHistory v6 §3.2–3.3 | ✅；保真非无损 |
| TinyHistory LR 复用 VAE / patchifier / first-layer projection，HR 卷积 + SiLU + attention 补残差，在投影后相加 | TinyHistory v6 §3.1、Fig. 2 | ✅ |
| TinyHistory 输出 DiT hidden channels，例如 3072 / 5120，而非 VAE 常见 4 / 16 / 64 channels | TinyHistory v6 §3.1 | ✅ 原文例值，不映射为某单一 checkpoint 的固定尺寸 |
| 编码器 hidden channels 64→128→256→512，最后投影到 DiT dimension；LoRA rank=128 | TinyHistory v6 §4.1 | ✅ |
| Stage I random Ω 保留查询位置 clean，其他历史 noise-as-mask；固定位置监督可能只记末尾 | TinyHistory v6 §3.2，式 (3)–(4)；PFP v1 §3.1 | ✅ |
| Stage II 输入完整 noise-free GT 历史，编码器与新 DiT LoRA 一起更新，不冻结 encoder | TinyHistory v6 §3.3，式 (5)–(6) | ✅ |
| 推理追加自生成 clean 段；近乎全卷积 encoder 可增量编码并拼接，不重算整个历史 | TinyHistory v6 §3.4 | ✅ 作者机制；不推断严格所有边界实现完全独立 |
| 完整历史固定压缩率 embedding 长度随历史秒数增长 | TinyHistory §3.4、§4.4 CTX/s 定义，N_h≈R×秒数为推算 | ✅ 单位与拼接；⚠ 符号增长推算 |
| TinyHistory baseline 同 Wan 2.1 基座和训练数据重实现，调参时尽量对齐 context；主实验 Wan 2.1 14B / 480p | TinyHistory v6 §4.1、§4.3 | ✅；不是 FramePack 原始 checkpoint / 主表 |
| TinyHistory rate 4×4×2 / 2×2×2 是 latent height×width×time 附加压缩率 | TinyHistory v6 §4.1、Tab. 1 | ✅；排序与 FramePack kernel (time,height,width) 不同 |
| Tab. 1：Sliding Window 6240 token/s；FramePack 2340† total；TinyHistory 4×4×2 195 token/s；2×2×2 780 token/s | TinyHistory v6 §4.3–4.4、Tab. 1 | ✅；† 全历史，不能与 /s 直接相除当总系统倍率 |
| Char / Scene / Obj / Cloth：先 existence gate，再对 gated-in videos 的子问题均值 | TinyHistory v6 §4.2 | ✅；覆盖率不能从条件分推出 |
| FaceID 用 ArcFace 与首帧 cosine similarity 超阈值的帧比例；Dynamic 用 RAFT 分类动态视频 | TinyHistory v6 §4.2 | ✅；不当作状态变化 / 事件因果分 |
| Sliding Window：Char 46.65、Scene 57.02、Obj 48.52、FaceID 57.87、ELO 1090 | TinyHistory v6 Tab. 1，Wan 2.1 / 480p，同作者协议 | ✅ 作者报告，未独立复现 |
| FramePack 作者重实现：Char 57.92、Scene 76.04、Obj 67.09、FaceID 62.01、ELO 1182 | TinyHistory v6 Tab. 1，同 Wan 协议 | ✅；不是 FramePack Hunyuan 主表 |
| TinyHistory 4×4×2：Char 80.19、Scene 72.21、Obj 74.38、FaceID 70.71、ELO 1262 | TinyHistory v6 Tab. 1，同 Wan 协议，195 token/s | ✅；Scene 低于 FramePack 76.04，页面保留差异 |
| TinyHistory 2×2×2：Char 85.90、Scene 87.11、Obj 85.45、FaceID 73.05、ELO 1332 | TinyHistory v6 Tab. 1，同 Wan 协议，780 token/s | ✅ 作者报告 |
| TinyHistory Tab. 2：Wan 2.1，所有变体训练 100k 步；节选均为 4×4×2 / 195 token/s | TinyHistory v6 §4.5、Tab. 2 caption | ✅ |
| Without Stage I：Char 52.64、FaceID 58.38 | TinyHistory v6 Tab. 2 | ✅ 作者报告 |
| Frozen Encoder：Char 61.42、FaceID 61.82 | TinyHistory v6 Tab. 2 | ✅ 作者报告 |
| 完整两阶段：Char 80.19、FaceID 70.71 | TinyHistory v6 Tab. 2 | ✅ 作者报告；支持联合适配而非冻结 |
| FramePack 主实验 HunyuanVideo；long 30s、short 5s；首尾各 15% 帧 | FramePack v3 §5.2–5.3 | ✅；页面不与 TinyHistory Wan 表混协议 |
| FramePack 漂移 Δ^M=abs(M(start)−M(end)) | FramePack §5.3，式 (7) | ✅；首尾质量差非回访记忆指标 |
| td_f16k4f2k2f1k1_g9：ΔClarity 3.18%、ΔMotion 3.42%、Dynamic 92.97%、ELO 1074 | FramePack v3 Tab. 1 | ✅ 作者报告 |
| f1k1_x_g9_f1k1f2k2f16k4_td：ΔClarity 2.35%、ΔMotion 1.95%、Dynamic 88.76%、ELO 1228 | FramePack v3 Tab. 1，同历史组 / target 长度，inverted | ✅ 作者报告；端点条件不同，非只有算法名字变更 |
| td_f16k4f2k2f1k1_g9+D：ΔClarity 2.30%、ΔMotion 2.49%、Dynamic 91.39%、ELO 1222 | FramePack v3 Tab. 1，离散化 history | ✅ 作者报告 |
| 两端同样差仍可能小 Δ；身份条件分与画质漂移不证明拆墙后保持新状态 | 各指标定义，FramePack §5.3；TinyHistory §4.2；本页推断 | ⚠ 评测逻辑边界，不是作者新增 benchmark |
| WorldPack 标准题名 Dynamic Frame Compression for Long-context Video World Modeling；按目标 FoV 分配压缩预算 | [WorldPack](https://arxiv.org/html/2512.02473) §4.2；abs title | ✅；页面链接到 09-context-as-memory.html#worldpack |
| FramePack→TinyHistory 是直接 baseline 比较与压缩范式发展，不声称权重继承 | TinyHistory §4.3、Tab. 1；PFP v1 Fig. 5 对 Large Patchifier 的说明 | ✅ 对照；⚠ 谱系边 kind=baseline |
| 微缩表示不提供显式坐标覆写；旧证据可能过时，未观察变化无法仅凭 embedding 获知 | FramePack §3；TinyHistory §3.4；信息边界推断 | ⚠ 本页机制限制，未声称论文测试了所有动态任务 |

缓存：`context_sources/2504.12626-html.html/.txt`、`context_sources/2512.23851-html.html/.txt` 为已保存原文；本作业新增下载只写 `cache/pfp-v1.html/.txt` 与 `cache/loopnav.html/.txt`。官方 venue / results 与 abs 通过网页核查。

验证：所有 data-part 对应 note，walkthrough 步骤对应 step note，defs 与模板一致；900px 图形 text bbox 无超盒，KaTeX 无错误。`file://` 下两页的初始化 / walkthrough 通过，375px 整页无横向溢出；为长来源标签加页内换行样式。最终 check.py 无本作业文件错误 / 警告，轨道总览仍有 SOURCES.md 待合并错误；记录见 `cache/job1-check.txt`。引用其他作业页的链接均保留。

## 03 — LCT / MoC（`03-lct-moc.html`）— 2503.10589、2508.21058

核查范围：LCT arXiv v1 正文 §1、§3–4；MoC arXiv v3 正文 §3–6、附录 §7–14；Captain Cinema v1 §3.3 与 §4 的骨干说明。2026-10-13 直接下载 arXiv HTML/abs，快照在 `cache/<id>-html.html` / `cache/<id>-abs.html`；不是以 SURVEY 代替原文。下列指标均为作者报告，未运行模型。字段沿用首版月份，读法引用上述版本。

| Claim | Source | Status |
|---|---|---|
| LCT 作者全名单、题名、2025-03 首版 | [arXiv abs](https://arxiv.org/abs/2503.10589)，submission history v1 2025-03-13 | ✅ verified |
| LCT 机构 CUHK / ByteDance Seed / ByteDance | [LCT v1](https://arxiv.org/html/2503.10589v1) 作者栏 | ✅ verified |
| LCT ICCV 2025 | [CVF 官方论文页](https://openaccess.thecvf.com/content/ICCV2025/html/Guo_Long_Context_Tuning_for_Video_Generation_ICCV_2025_paper.html)，快照 `cache/lct-venue.html` | ✅ verified |
| scene-level MMDiT 全注意力，沿用单镜头参数，不增加身份网络 | LCT v1 §3.2.2 | ✅ verified |
| 全局人物 ID 与逐镜头描述共享文本语义；混合单镜头数据 | LCT v1 §3.2.1、§3.4 | ✅ verified |
| text–video 对沿空间对角线交错，保留内部相对位置；global prompt 配 dummy video | LCT v1 §3.2.2、Fig. 3 | ✅ verified |
| 每镜头独立噪声，低噪声条件／联合同步去噪 | LCT v1 §3.2.3、Fig. 4 | ✅ verified |
| context-causal：镜头内双向，读前序 context；历史可缓存 | LCT v1 §3.3 | ✅ verified |
| 更长故事历史池的参考由人工按相关性选择 | LCT v1 §3.4 Multi-shot Generation with Human Selection | ✅ verified |
| Flow convention clean=0, noise=1；速度目标 ε−x，逐镜头损失平均 | LCT v1 Eq. 1、§3.4；页面公式为符号重写 | ✅ verified |
| LCT 基座 3B，训练最多 9 shot | LCT v1 §4 Training Details；不以 MoC 对照 8 shot 替换 | ✅ verified |
| LCT Tab.1 consistency/AHR：VideoStudio 95.25/2.14；StoryDiffusion+Kling 96.57/2.50；IC-LoRA+Kling 96.27/1.57；LCT 95.65/3.79 | LCT v1 Tab. 1、§4.1；不同系统原论文比较 | ✅ verified |
| LCT 自动 consistency 是主体/背景平均；人工要求优先跨镜头一致性 | LCT v1 Tab. 1 caption、§4.1 | ✅ verified |
| MoC 题名、全作者、2025-08 首版；当前读 v3 | [MoC abs](https://arxiv.org/abs/2508.21058)，v1 2025-08-28、v3 2025-12-09 | ✅ verified |
| MoC 机构与 ICLR 2026 | [官方项目](https://primecai.github.io/moc/)，机构行、venue/BibTeX | ✅ verified |
| MoC 明确从 LCT 预训练权重初始化，换 attention 后沿用同训练方案 | [MoC v3](https://arxiv.org/html/2508.21058v3) §4 Base model | ✅ verified |
| 每 query、每头、每层：mean K 作块 descriptor，top-k 后读取原始块 K/V | MoC v3 §3.1、Eq. 2–3 | ✅ verified |
| content-aligned chunk 不跨帧/shot/模态边界；强制 captions / intra-shot 不占重复动态预算 | MoC v3 §3.2–3.3 | ✅ verified |
| hard top-k 非微分；Q/K 投影通过选中块注意力间接学习；drop-in/out 增强路由鲁棒性 | MoC v3 §3.1；不沿用后文“梯度通过 top-k”的夸大概括 | ✅ verified |
| 因果约束限制动态跨块边；mandatory intra-shot 仍保留双向连接 | MoC v3 §3.2 Causality、Fixed Intra-Shot Selection | ✅ verified |
| loop closure 是稀疏路由中的互选环，不是相机回访，也不是字面循环前向计算图 | MoC v3 §3.2、Fig. 2；图有 shot 9↔11 的互选 | ✅ verified |
| 小道具或短暂事件可能被 mean descriptor 掩盖；未命中与内容删除不同 | 由 MoC Eq. 2–3 的数据流推断，不宣称为已量化的失败归因 | ⚠ inferred |
| 主实验 8 shot × 8 s、480p、12 FPS、64 s、约 180k token | MoC v3 §4 Baselines | ✅ verified |
| Q/K/V [B,N,h,d]；descriptor [B,J,h,d]；routing [B,h,N,J]；索引 [B,h,N,k] | MoC v3 Eq. 1–4、§6 的符号化形状推导 | ⚠ inferred |
| 全 KV O(Nd)，描述符 O(Jd)，routing logits O(N²/C)，内层稀疏不保证总存储常数 | MoC v3 §6；C 为块长 | ✅ verified |
| 极长设置另有外层 shot 预选；内层未选中不等于删除 | MoC v3 §14 Outer Loop Context Routing | ✅ verified |
| 多镜头块长 10240→5120→2560→1280，top-k=5；单镜头块长256、k=3、不开因果约束 | MoC v3 §11 Training Details | ✅ verified |
| 主表 LCT/MoC Subject .9378/.9421；Background .9526/.9535；Dynamic .4583/.5625；Image .5140/.5003；sparsity 0%/85% | MoC v3 Tab. 1；同 LCT 基座的多镜头协议 | ✅ verified |
| 注意力 FLOPs 1.7×10¹³→2.3×10¹²；端到端 2.2× | MoC v3 Tab. 1、§4 Quantitative Results；不把加速混为同一量 | ✅ verified |
| chunk256、k1/k3：Dynamic .1313/.4612；Subject .9994/.9916 | MoC v3 Tab. 3；单镜头消融，非主多镜头表 | ✅ verified |
| 高 consistency 可能伴随低运动；无专门任意事件召回率 | MoC v3 Tab. 3–4 与评测定义；能力边界归纳 | ⚠ inferred |
| Captain Cinema 使用 LCT 视频骨干，planner/GoldenMem 另组织关键帧 | [Captain Cinema v1](https://arxiv.org/html/2507.18634v1) §3.3、§4；链接 `16-story-keyframes.html` | ✅ verified |

交接：`03-registry.json` 为建议字段，不改共享 registry；LCT→Captain Cinema 的 inbound edge 由 16 页工作方登记。MoC 官方项目仅有论文链接，本页未伪造 Code 链接。三页 footer 暂链内部 `#references`，避免尚未生成的共享 SOURCES 文件令本页检查出错。图中公式和生成循环是机制归纳，未运行官方训练/推理。

## 04 — TTT / SSM-WM / RAD（`04-recurrent-state.html`）— 2504.05298、2505.20171、2511.12940

核查版本与范围：TTT-Video v1 §2–4.4、§6；SSM-WM v1 §3–6；RAD v2 §3–5.5、Alg.1–2；ARL2 v2 §3.2–3.4（仅后续里程碑）。直接下载的 HTML/abs 在 `cache/`。结果均为作者报告；没有运行生成模型或完整核对代码的梯度边界。

| Claim | Source | Status |
|---|---|---|
| TTT 作者全名单（含论文解释新增署名者）、首版2025-04、CVPR2025 | [arXiv abs](https://arxiv.org/abs/2504.05298)，v1 2025-04-07；正文 authorship note、comments | ✅ verified |
| TTT 机构 Stanford/NVIDIA/UCSD/Berkeley/UT Austin | [TTT v1](https://arxiv.org/html/2504.05298v1) 作者栏 | ✅ verified |
| TTT 官方项目与代码 | [项目](https://test-time-training.github.io/video-dit) 的 code 链接 → [仓库](https://github.com/test-time-training/ttt-video-dit) | ✅ verified |
| 小 MLP 权重 W 是每序列隐藏状态；内层 gradient update，外层学 Q/K/V 和主干 | TTT v1 §2.1–2.2、Eq.1–5 | ✅ verified |
| loss=‖f(Ku;W)−Vu‖²；读出 f(Qu;更新后W) | TTT v1 Eq.4–5；页面用 token i 统一记号 | ✅ verified |
| 两层 MLP 隐宽4×、GELU、LN/residual；W1[d,4d], W2[4d,d] 为推导 | TTT v1 §2.3 | ✅ verified / ⚠ shape inferred |
| 门控正反扫描共享 TTT 参数、不同门控，外侧保留原 X residual | TTT v1 §3.1 Eq.6–12 | ✅ verified |
| 每次整段 noisy-video 前向重新扫描，不是跨 diffusion time 继承 clean 帧档案 | TTT v1 §2–3 的层接口与序列状态构造；生命周期归纳 | ⚠ inferred from explicit architecture |
| 局部 attention 3s，内层 minibatch64，最长训练63s | TTT v1 §3.2–3.4 | ✅ verified |
| TTT 双向扫描能读后续 noisy 内容；storyboard 可覆盖整段，非在线仅过去输入 | TTT v1 §3.1–3.2 | ✅ verified |
| 每方法100 plots、盲测成对偏好、temporal axis 包含镜头内外一致性 | TTT v1 §4.2 | ✅ verified |
| 分钟故事 temporal/avg Elo：Mamba2 988/978；GDN1004/991；sliding975/999；TTT1042/1033；领先次优34 | TTT v1 Tab.1、§4.3 | ✅ verified |
| 18s elimination GDN领先TTT28 Elo；短长任务排名不同 | TTT v1 §4.4、App.Tab.3 | ✅ verified |
| TTT 非普遍胜负定理，且运行时间仍慢于 GDN/Mamba；动画特定域证据 | TTT v1 §4.4、Fig.6、§3.3 | ✅ verified |
| SSM 作者全名单、机构、2025-05 首版 | [abs](https://arxiv.org/abs/2505.20171)，v1 2025-05-26；[HTML作者栏](https://arxiv.org/html/2505.20171v1) | ✅ verified |
| SSM ICCV2025 | [CVF官方页](https://openaccess.thecvf.com/content/ICCV2025/html/Po_Long-Context_State-Space_Video_World_Models_ICCV_2025_paper.html)，快照 `cache/ssm-venue.html` | ✅ verified |
| 分空间块独立因果 Mamba scan；相邻时刻扫描距离由全帧面积降为块面积，状态份数增加 | SSM v1 §4.1、Fig.3 | ✅ verified |
| 不同层不同块尺寸；小块时间路径与空间通信取舍；每 Mamba 后 frame-local attention | SSM v1 §4.1 | ✅ verified |
| clean 随机长度前缀，后缀独立加噪，损失只算 noisy 帧 | SSM v1 §4.2、Fig.4 | ✅ verified |
| 每层固定局部 KV + 各块 state；固定尺寸下每帧推理成本不随历史长度增 | SSM v1 §4.3、Fig.8；不扩为全应用输出存储常数 | ✅ verified |
| SSM 未细述如 RAD 的最后 clean-pass 提交边界，本页不臆补 | 已读 SSM §4.3 的描述范围；未代码逐行核查 | ❓ implementation boundary not verified |
| Maze retrieval 400 context→400回溯；静态场景与GT观测；不输入GT maze layout | SSM v1 §5.1–5.2、Fig.5 | ✅ verified |
| Retrieval PSNR/SSIM/LPIPS：limited causal26.4/.829/.147；Mamba+local19.3/.735/.336；ours30.8/.898/.069；full32.6/.914/.057 | SSM v1 Tab.2 | ✅ verified |
| Reasoning576 context→224生成，PSNR ours28.2 vs full28.8 | SSM v1 §5.2、Tab.3 | ✅ verified |
| 超过训练 context 后记忆有限、低分辨率合成域、尚非交互帧率 | SSM v1 §6 | ✅ verified |
| RAD作者全名单、机构、2025-11首版、ECCV2026，读v2 | [RAD abs](https://arxiv.org/abs/2511.12940)，v1 2025-11-17、comments；[v2作者栏](https://arxiv.org/html/2511.12940v2) | ✅ verified |
| RAD per-frame沿时间RNN，spatial/temporal attention，动作同时条件化RNN | RAD v2 §4.1 | ✅ verified |
| chunk互不重叠 vs frame每次移一帧；细节通路与状态职责不同 | RAD v2 §4.2、§5.2–5.3 | ✅ verified |
| 推理每窗口仅第一帧推进state，最后DDIM步 clean commit；Alg.1简写由正文解释 | RAD v2 §4.2、Alg.1 | ✅ verified |
| 训练先用 GT clean 单帧窗口预取hidden bank，再并行训练 noisy windows | RAD v2 §4.3、Alg.2 | ✅ verified |
| GT训练state vs generated推理state；结构协议对齐不等于消除全部exposure bias | RAD v2 Alg.1–2与输入条件对照 | ⚠ inferred |
| RAD预取state完整跨时刻梯度是否保留 | 本页不宣称已逐行核查公开代码 | ❓ not verified |
| Minecraft共基座、各微调5000steps；60条测试轨迹 | RAD v2 §5.1 | ✅ verified |
| Minecraft PSNR/SSIM/LPIPS：DF15.65/.45/.53；Mamba-c12.72/.33/.63；TTT-c14.04/.38/.56；LSTM-c14.24/.39/.55；Mamba-f16.70/.46/.47；TTT-f16.72/.46/.47；LSTM-f16.59/.46/.46 | RAD v2 Tab.3 | ✅ verified |
| 同训练协议不等于matched计算资源：LSTM/Mamba/TTT RNN Params195/153/118M，time3.7/3.6/12.9s，GPUmem10.0/11.1/16.0GB | RAD v2 §5.5、Tab.5；8L40、batch3，same DiT | ✅ verified |
| LSTM并非所有指标最好；frame式Minecraft TTT-f最高PSNR、LSTM-f最低LPIPS | RAD v2 Tab.3；削弱正文笼统胜负措辞 | ✅ verified |
| ARL2题名、首发2026-05；同帧共用pre-update state、只最终clean pass写入 | [ARL2 abs](https://arxiv.org/abs/2605.16579)，v1 2026-05-15；[v2](https://arxiv.org/html/2605.16579v2) §3.2–3.3 | ✅ verified |
| ARL2固定state仅绑定hybrid替换层；未替换softmax KV仍计 | ARL2 v2 §3.4、Tab.1（partial replacement）；预算推断 | ⚠ inferred |

交接：节点键是 `ssm-wm`，页面 anchor 是 `ssm-world`，不要按 SURVEY 内部候选名误改。三个主方法无继承边。固定state的精确事件容量无理论保证；“状态压缩必然导致某个实测失败”未作为事实写出。关键机制与表值经独立只读审阅，根 Agent 核对了残差与提交规则。

## 05 — Self Forcing / LongLive / Rolling Forcing（`05-streaming-kv.html`）— 2506.08009、2509.22622、2509.25161

核查版本与范围：Self Forcing v2 §3.2–3.4、Alg.1–2、§4；LongLive原论文v2 §3–5；Rolling Forcing v1 §3–4、App.A、D–E。另读官方 LongLive commit `c6a27e771e803b1c12ffa28b82ba69b42472020e` 的 LongLive1.0 configs、交互/切换pipeline、causal_model、wrapper 中与cache/sink相关代码。直接下载正文/abs/代码快照保存在 `cache/`。已读仓库原有 `tracks/few-step/12-self-forcing.html`，链接其训练目标与 `#c-long`，本页不重复蒸馏推导。结果是作者报告，无独立模型复现。

| Claim | Source | Status |
|---|---|---|
| SF作者全名单、首发2025-06、NeurIPS2025 Spotlight | [SF abs](https://arxiv.org/abs/2506.08009)，v1 2025-06-09、comments；当前v2 | ✅ verified |
| SF机构Adobe Research/UT Austin | [SF v2](https://arxiv.org/html/2506.08009v2) 作者栏 | ✅ verified |
| SF completed latent以τ=0前向重新生成K/V，训练停止写入梯度 | SF v2 §3.2、Alg.1–2 | ✅ verified |
| clean代表无扩散噪声，不代表生成内容等于GT | SF Alg.1输出是generated clean prediction；术语解释 | ⚠ inferred |
| 写KV不是直接保存最后一次noisy forward的K/V；无需每帧RGB→VAE循环 | SF Alg.1–2 的GKV(x_clean,0)；RF Alg.1一致 | ✅ verified |
| SF fixed rolling FIFO，原始方案不是永久初始sink | SF v2 §3.4、Alg.2 | ✅ verified |
| 首个VAE latent只编码初图，统计不同；训练屏蔽末chunk看首chunk模拟首项被淘汰 | SF v2 §3.4 | ✅ verified |
| SF每chunk3 latent帧，4-step，基座5s训练片段 | SF v2 §4 Implementation | ✅ verified |
| LongLive题名、全作者、首发2025-09，原论文v2 | [abs](https://arxiv.org/abs/2509.22622)，v1 2025-09-26、v2 2025-10-13 | ✅ verified |
| LongLive机构NVIDIA/MIT/HKUST(GZ)/HKU/Tsinghua；ICLR2026 | LongLive v2作者栏；[官方仓库BibTeX](https://github.com/NVlabs/LongLive)；快照`cache/longlive-readme.html` | ✅ verified |
| LongLive从SF DMD pipeline建立初始少步因果模型 | [LongLive v2](https://arxiv.org/html/2509.22622v2) §4 Implementation | ✅ verified |
| cross-attention文本信号写入后续self-attention缓存，保留旧KV有prompt inertia | LongLive v2 §3.1 | ✅ verified |
| prompt切换以generated视觉上下文和新prompt重建cache，训练也纳入recache | LongLive v2 §3.1 | ✅ verified |
| efficient recache只重建最近W generated帧 | LongLive v2 §3.3 Consistency between Training and Inference | ✅ verified |
| 默认global_sink=true时recache保留sink；false时传入sink_recache_after_switch标记允许覆盖 | [官方 pinned interactive pipeline](https://github.com/NVlabs/LongLive/blob/c6a27e771e803b1c12ffa28b82ba69b42472020e/LongLive1.0/pipeline/interactive_causal_inference.py) `_recache_after_switch`；同commit `wan/modules/causal_model.py` recompute write_start_index/sink保护分支 | ✅ code verified, not executed |
| 原版配置local_attn_size12、sink_size3、context_noise0、global_sink=true | [官方 pinned config](https://github.com/NVlabs/LongLive/blob/c6a27e771e803b1c12ffa28b82ba69b42472020e/LongLive1.0/configs/longlive_interactive_inference.yaml)；cache中保存原文 | ✅ code verified |
| 永久首frame-chunk sink + recent FIFO，streaming训练也使用该设置 | LongLive v2 §3.2–3.3、§4 | ✅ verified |
| 一般描述first two frames与具体实验9recent+3sink latent帧不一致 | LongLive v2 §3.3 vs Fig.5、§4.5；按具体实验报数 | ✅ verified discrepancy |
| 9recent+3sink有效12 latent帧，与21-frame长窗口作比较 | LongLive v2 Fig.5、§4.5；未把latent换成RGB帧 | ✅ verified |
| Streaming long tuning跨迭代保留历史KV，detach旧上下文，仅当前片段loss | LongLive v2 §3.2 | ✅ verified |
| 60s训练，每次续5s，一次prompt switch | LongLive v2 §4 Implementation | ✅ verified |
| LongLive10s一次switch，5s边界；noKV92.75/89.59/28.95，KV94.77/93.69/25.92，recache94.81/94.04/27.87（background/subject/CLIP） | LongLive v2 §4.4、Tab.4 | ✅ verified |
| recache CLIP不是最高，是连续性与语义更新折中 | LongLive v2 Tab.4（27.87低于清空28.95） | ✅ verified |
| 30s单prompt quality SF83.82 vs LL85.44；60s自建多prompt SF82.46 vs LL84.38，协议不同 | LongLive v2 §4.2–4.3、Tab.2–3 | ✅ verified |
| LongLive单H10020.7FPS；最长240s展示 | LongLive v2 Tab.1、§5；不是指定事件recall | ✅ verified |
| RF作者全名单、NTU/Tencent ARC机构、首发2025-09；ICLR2026 | [abs](https://arxiv.org/abs/2509.25161)，v1 2025-09-29；[官方项目](https://kunhao-liu.github.io/Rolling_Forcing_Webpage/) | ✅ verified |
| RF多块递增噪声、窗口内双向、每roll释放最前clean块并加入新噪声 | [RF v1](https://arxiv.org/html/2509.25161v1) §3.2、Fig.3、Alg.1–2 | ✅ verified |
| RF completed历史因果读取；working window不是历史KV | RF v1 §3.2–3.3 | ✅ verified |
| RF未施RoPE global K保存，读取时将其动态放到近期context之前 | RF v1 §3.3、App.D Dynamic RoPE、Fig.7 | ✅ verified |
| RF clean writer仅读recent，排除global；初始global保留 | RF v1 App.A KV Cache | ✅ verified |
| RF active budget3recent+3global+15working latent帧；5阶段×3latent帧/chunk；和21为推导 | RF v1 §4.1、App.A KV Cache | ✅ verified / ⚠ sum inferred |
| RF训练N在21–27latent采样，loss最后21；附录RGB–VAE操作用于教师loss统计对齐，不能算KV writer | RF v1 App.A Training | ✅ verified |
| RF交替SF/RF训练；prompt修改时已有未来buffer可能增交互latency | RF v1 §3.4、App.E Limitations | ✅ verified |
| 中途帧出temporal context就丢弃，没有mid-sequence memory | RF v1 App.E Limitations；不是App.D | ✅ verified |
| RF主比较200MovieGen prompts、30s、16FPS、832×480 | RF v1 §4.1 Evaluation | ✅ verified |
| ΔDrift是首尾各5s imaging quality绝对差，不是指定事件recall | RF v1 §4.1 | ✅ verified |
| RF同协议SF subject86.48/background90.29/Δ1.66；RF92.80/93.71/.01 | RF v1 Tab.1 | ✅ verified |
| RF无sink83.22/87.99/4.63；无rolling inference86.01/89.94/5.53 | RF v1 Tab.2 | ✅ verified |
| RF15.79FPS/.76s，latency定义stable speed而非首帧 | RF v1 Tab.1、§4.1 Evaluation | ✅ verified |
| 每层KV[B,wP,h,d]，总元素2BLwPhd；output保存／recent latent另计 | 由SF Alg.2、LongLive §3.3推导；固定active预算不等于应用全部存储 | ⚠ inferred |
| 红外套→蓝外套→离屏例，re-cache不找回已丢事件，建议离窗后状态专测 | 机制推断；RF App.E确认中段丢弃，但示例不是论文实际量化案例 | ⚠ inferred |

附录索引经原文复核：RF App.C是Interactive Video Streaming，App.D是Dynamic RoPE，App.E是Limitations；全部引用已纠正。官方代码链接从项目页/原有SF页核实，LongLive上述cache/sink分支已只读核查，但未执行模型或做完整复现。LongLive当前主分支已有后续版本，本页和登记建议仅用原论文v2结果与LongLive1.0子目录。SF→RF的建议边标baseline，不能据此说RF从SF公开checkpoint直接初始化；原文ODE初始化与混合SF训练另有明确来源。

## 06 — 被逐出的 KV (`06-evicted-kv.html`) — 2605.22718 / 2610.11756

核查截止 2026-10-13。数字均为作者报告，未运行模型。WorldKV 读 arXiv v1；2026 Memory Forcing 读 v1；MAG 为 writer 对照。论文 HTML/abs 存于 `vm/cache/`。以下提供 lead 合并到轨道 SOURCES.md 的逐项清单。

| Claim | Source | Status |
|---|---|---|
| WorldKV 作者、KAIST AI/Naver AI Lab、首版 2026-05 | [abs](https://arxiv.org/abs/2605.22718) submission history；[v1 首页](https://arxiv.org/html/2605.22718v1) | ✅ verified |
| 逐出 KV 存 GPU/CPU，附 camera/action 状态；Top-k 原 KV 装入 native attention，无重编码 | WorldKV v1 §4.1–4.2、Fig.4、Eq.4 | ✅ verified |
| camera-based：平移平方距离和旋转测地距离分别按候选集归一化后相加 | WorldKV v1 §5.1 Implementation Details | ✅ verified |
| LingBot 相机直接可用；Matrix2 累计 WASD/yaw/pitch 构造伪位姿，未几何标定 | WorldKV v1 §5.1 | ✅ verified |
| query-based retrieval 是可替换策略，并非主设置 | WorldKV v1 §4.2、App.C | ✅ verified |
| Key-Key 冗余为非 anchor key 对全部 anchor keys 的平均余弦相似度；保留低分，逐层独立 | WorldKV v1 Eq.5、§4.3 | ✅ verified |
| chunk F=3，非 anchor pooled token 保留 P=25%；3n→约1.5n，约2×缓存压缩 | WorldKV v1 §4.3、§5.1 | ✅ verified |
| 活跃分区 sink/retrieval/recent/current=3/9/3/3 latent 帧等价，总18；压缩后可增加chunk覆盖 | WorldKV v1 §5.1、Tab.2下半、App.D | ✅ verified |
| 档案仍可增长，CPU offload 只改变驻留；固定活动缓存不能推出固定总存储 | WorldKV v1 §4.1–4.3、Fig.2；预算限定为本页分析 | ⚠ secondary/inferred（依据明确存储流程） |
| 60 scene–trajectory benchmark；同rollout首访/回访配对，不是GT未来重建；FPS测末chunk | WorldKV v1 §5.1 Benchmark/Metrics | ✅ verified |
| Matrix-Game-2.0 1.3B、4×H200：Sliding LPIPS/PSNR/SSIM/FPS=0.594/11.422/0.280/18.87 | WorldKV v1 Tab.1 | ✅ verified |
| 同配置 Full KV=0.529/13.748/0.364/7.82 | WorldKV v1 Tab.1 | ✅ verified |
| 同配置 WorldKV=0.462/14.101/0.405/16.25 | WorldKV v1 Tab.1 | ✅ verified |
| LingBot Full KV LPIPS 0.441，WorldKV 0.455；不宣称全部指标全面更好 | WorldKV v1 Tab.1 | ✅ verified |
| full KV 历史干扰解释是作者解释，非已隔离全部因果的定理 | WorldKV v1 §5.2；本页限定 | ⚠ secondary/inferred |
| 官方README keep_ratio=0.5，与论文非anchor25%不同；retrieval_frames=18说明为6原始chunk，不能将压缩前帧数直接和论文9帧等价预算比较；可选 retrieval_rope_correction | [官方 README](https://github.com/cvlab-kaist/WorldKV#inference) Quick Start / Arguments，2026-10-13读取 | ✅ verified（保留率差异与口径限定） |
| Memory Forcing KV 作者、机构、首版2026-10；与2510.03198不同论文 | [abs](https://arxiv.org/abs/2610.11756)、[v1首页](https://arxiv.org/html/2610.11756v1)；[空间版abs](https://arxiv.org/abs/2510.03198) | ✅ verified |
| 沿用Rolling Forcing滚动联合去噪、DMD和flow critic；改缓存、RoPE与Aligned insertion | Memory Forcing KV v1 §3开头、§3.1–3.5 | ✅ verified |
| sink固定，clean块入working；最不相似working块晋升archive，archive满后FIFO丢最老 | Memory Forcing KV v1 §3.3 Eq.5、Alg.1 | ✅ verified |
| 直接联合注意sink/archive/working/current，无外部camera Top-k；working/archive总缓存有界 | Memory Forcing KV v1 Alg.1、§3.3 | ✅ verified |
| Rolling Forcing只sink raw K可重定位；新文全部窗口raw K，每次attention旋转，V不旋转 | Memory Forcing KV v1 §3.4 | ✅ verified |
| Interpolated位置sink=0，archive(j)=(j−1)/(Na−1)，working=w；Na=1映射0 | Memory Forcing KV v1 Eq.9 | ✅ verified |
| 正文称archive(0,1)，公式实际含端点[0,1]；本页按公式，不声称全部位置互不重合 | Memory Forcing KV v1 §3.4 Eq.9、消融讨论 | ✅ verified（内部不一致已注明） |
| 训练rolling/self-forcing等概率混合；推理仅rolling；插入forward看到与denoise相同集合 | Memory Forcing KV v1 §3.5 | ✅ verified |
| 1.3B默认832×480、16 FPS；T=4、chunk3 latent帧、steps[1000,750,500,250] | Memory Forcing KV v1 §4.1 | ✅ verified |
| 训练总窗口33帧；bank3/6/12=21帧；1000步、batch32，G lr1.5e-6/fake4e-7，更新fake:G=5:1 | Memory Forcing KV v1 §4.1；21为直接相加 | ✅ verified |
| Wan2.2 5B是独立基座/因果转换设置，不与1.3B主表拼成最优配置 | Memory Forcing KV v1 §3.6、§4 | ✅ verified |
| 30s Tab.2(a) Official Total/Quality/Semantic=82.04/82.64/79.61 | Memory Forcing KV v1 Tab.2(a) | ✅ verified |
| Working=82.41/83.46/78.22；Archive+working=83.58/84.57/79.63 | Memory Forcing KV v1 Tab.2(a) | ✅ verified |
| Tab.1 VBench Total 5s83.88→60s83.20，下降0.68；非独立回访PSNR | Memory Forcing KV v1 Tab.1、§4.4 | ✅ verified |
| 未核验2026 MF官方代码；不虚构kernel/异步offload/FPS；公开主表无独立检索准确率 | Memory Forcing KV v1全文与abs；本次核查范围 | ❓ not verified（代码实现）；指标缺项如实保留 |
| MAG独立memory model，块内全注意力压至末帧KV；重建整块监督；writer冻结后训练G读缓存 | [MAG](https://arxiv.org/html/2512.18741) §3.3–3.5、Fig.2–3 | ✅ verified |
| MAG默认3倍KV压缩；逐块压缩仍增长历史；MAG-Bench分GT/generated history | MAG §3.3–3.6、Tab.4；增长限定为本页分析 | ✅ verified（压缩/协议）；⚠ secondary/inferred（总存储限定） |
| KV公式2LBnhdhb；形状[B,3n,h,dh]→[B,1.5n,h,dh]；权重/激活等另计 | 标准KV元素计数与WorldKV§4.3配置；明确标“推算/示意” | ⚠ secondary/inferred |

谱系建议只有 `vm-rolling-forcing → memory-forcing-kv`（inherit）。不画未经证实的 LongLive→WorldKV 或 WorldKV→Memory Forcing。Q11/Q12 的正文在本页，交接节点与锚点见 `06-registry.json`。

## 07 — 记忆如何被读回 (`07-addressable.html`) — 2608.07408 / 2610.11444

核查截止 2026-10-13。WorldTrace、L2R 均读 arXiv v1；VMem读取当前HTML用于实现对照。数字均为作者报告，未独立运行模型。当前 registry 节点 `l2r` 对应页内 `#learning-to-retrieve`。

| Claim | Source | Status |
|---|---|---|
| WorldTrace正式题名、全部作者、机构、首版2026-08 | [abs](https://arxiv.org/abs/2608.07408)、[v1首页](https://arxiv.org/html/2608.07408v1) | ✅ verified |
| NeurIPS2026 accepted为官方项目页声明；候选表原venue为空 | [官方项目](https://research.nvidia.com/labs/sil/projects/WorldTrace/) 顶部与BibTeX | ✅ verified（官方作者声明，未独立录用名单核查） |
| 时间RoPE相对offset超训练范围→缓存存在却难读；平均不同相位key会抵消信号 | WorldTrace v1 §2.1–2.2 | ✅ verified |
| Ns+Nr=Lattn；summary slot position=q−(Lattn−1−s)，s=0…Ns−1，rank决定固定相对offset | WorldTrace v1 Def.1 Eq.2、Rem.1 | ✅ verified |
| key去原temporal rotation、canonical平均、再转virtual position；value不旋转而平均 | WorldTrace v1 Eq.3、§3.3 | ✅ verified |
| Field保留host canonical源keys，每步从原source集合重算组均值；固定GPU不等于固定总历史 | WorldTrace v1 §3.3、App.E.6 | ✅ verified |
| 平均attention保留只约束同virtual position的平均pre-softmax score，不保证完整softmax权重/输出 | WorldTrace v1 Rem.2、App.C Prop.2 | ✅ verified |
| Landmark以相邻canonical-key距离阈值检测scene-entry；保存原样trace，满后丢最老；不足时重复最老 | WorldTrace v1 §3.4、App.G Alg.1 | ✅ verified |
| Landmark一次canonical保存，fresh rotation避免bf16反复去旋转/旋转漂移 | WorldTrace v1 §3.4 Eq.4 | ✅ verified |
| Matrix-Game-2 Field Ns/Nr=2/4；Landmark4/2；总6 latent-frame slots | WorldTrace v1 §4.1 | ✅ verified |
| LoopBench无外部GT，用几何配对首访/回访；PAC=CLIP相似度，TempSSIM=相邻decoded帧SSIM | WorldTrace v1 §4.1 | ✅ verified |
| ABA标准N=16 AR chunks，100初始scenes/condition；Sliding PAC0.723±0.013/TempSSIM0.761 | WorldTrace v1 Tab.3 Tier1、Tab.6 | ✅ verified |
| 同配置Landmark PAC0.864±0.009/TempSSIM0.786 | WorldTrace v1 Tab.3 Tier1 | ✅ verified |
| Field N=48 TempSSIM0.472→0.545，约相对15.5%；N=32 Drift0.0229→0.0250不改善 | WorldTrace v1 Tab.2 | ✅ verified |
| L2R题名、全部作者、机构、首版2026-10；不是WorldTrace后继 | [abs](https://arxiv.org/abs/2610.11444)、[v1首页](https://arxiv.org/html/2610.11444v1)；继承关系限制按全文 | ✅ verified |
| 相机条件决定what、trigger决定when；读内部recurrent state，无逐帧Top-k bank | L2R v1 §3.2 Eq.2–4 | ✅ verified |
| 每token12维Plücker ray，投影后在log-space调制gamma；不产生旧帧ID | L2R v1 §3.2 Eq.2、Eq.4 | ✅ verified |
| GLA S_j=Gamma S_{j−1}+v k^T（trigger开），关闭仍累计外积；GDN开时增加delta correction | L2R v1 App.B Eq.18–19 | ✅ verified |
| S方向dv×dk、按head状态形状[B,h,dv,dk]为讲解；固定矩阵容量仍干扰/覆盖 | L2R v1 App.B–C；按外积推得形状 | ⚠ secondary/inferred（形状）；✅ verified（容量限制讨论） |
| 离线depth、unprojection、known camera trajectory reproject给re-visibility标签；离屏再现/遮挡恢复正例 | L2R v1 Fig.2、§3.2 | ✅ verified |
| trigger weighted BCE，w+=3、lambda=0.05；仅有效target tokens；二值trigger stop-gradient | L2R v1 Eq.5–6 | ✅ verified |
| memory层Q/K/V/out继承原attention，相机路径零初始化；保留softmax层；target-only flow loss | L2R v1 §3.3 | ✅ verified |
| ratio主配置3:1；1:1 loop较好，7:1退化；不把所有attention替换说成更好 | L2R v1 §4.4、Tab.4、App.C | ✅ verified |
| memory capacity设置Wan2.1、352×640、81frames，5000steps、lr5e-5、8×A100 | L2R v1 App.A.3 | ✅ verified |
| Echo-Memory三分支replay/in-domain loop/open-domain O-V；baseline来源与*重训说明 | L2R v1 §4.1、Tab.1 caption；[Echo-Memory](https://arxiv.org/abs/2606.09803) | ✅ verified（按L2R协议说明） |
| VMem* replay PSNR13.71/LPIPS0.507；loop13.17/0.581；O-V64.73 | L2R v1 Tab.1 | ✅ verified |
| CaM K20 replay12.54/0.496；loop11.07/0.543；O-V58.63 | L2R v1 Tab.1 | ✅ verified |
| L2R-GLA replay14.74/0.430；loop13.14/0.603；O-V72.57 | L2R v1 Tab.1 | ✅ verified |
| L2R-GDN replay13.86/0.558；loop12.81/0.614；O-V69.37 | L2R v1 Tab.1 | ✅ verified |
| GLA replay/O-V优势不等于loop LPIPS领先 | L2R v1 Tab.1，对上述行直接比较 | ✅ verified |
| 一张H100 matched setting的单denoise step：GLA约0.50s/GDN0.49s，测试时长近恒定；不等于端到端FPS | L2R v1 §4.5、Fig.4(b) | ✅ verified |
| L2R§4.5 VMem测全stored frames重建；原VMem新generated+retrieved views联合point-map、App.C冻结旧depth | [VMem](https://arxiv.org/html/2506.18903) §3.1、App.C；L2R v1 §4.5 | ✅ verified（实现范围差异明确） |
| L2R官方项目URL来自abs，但本次web不可达；论文称评审后公开代码；跨denoise state协议未核验 | L2R v1 Reproducibility Statement；https://jkhu29.github.io/l2r/ | ❓ not verified（公开实现/访问状态） |
| WorldTrace与L2R无直接继承；VMem→L2R只baseline箭头 | 两篇方法/相关工作及L2R Tab.1；本页谱系判断 | ⚠ secondary/inferred（不凭时间造继承） |

正文使用 `g_j` 命名trigger，保留轨道 `r_t` 给读出；L2R论文的token索引换成 `j`，避免与视频时间 `t`、去噪时间 `tau`混淆。伪代码是机制示意，不声称公开API或clean-pass-only写入。Q13/Q14映射见 `07-registry.json`。

## 08 — 帧库与场景回访 (`08-worldmem.html`) — 2504.12369 / 2505.21996 / 2510.03198

核查截止2026-10-13。WorldMem读arXiv v3，VRAG读v4，空间版Memory Forcing读v1。数字为作者报告、未复现。当前registry节点 `memory-forcing` 对应 `#memory-forcing-spatial`；与2026 `memory-forcing-kv`不同。

| Claim | Source | Status |
|---|---|---|
| WorldMem作者机构、首版2025-04；NeurIPS2025 | [abs](https://arxiv.org/abs/2504.12369)、[v3首页](https://arxiv.org/html/2504.12369v3)、[官方proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/470629a47e2d65ce0606c40055df5d26-Abstract-Conference.html) | ✅ verified |
| memory unit=(latent,pose,time)；pose5D位置/pitch/yaw；在线保存历史，bank可增长 | WorldMem v3 §3.3 | ✅ verified |
| FoV overlap Monte Carlo，时间差confidence，贪心选最高分再过滤相似候选；过滤不删原bank | WorldMem v3 Alg.1、§7.2 Alg.2 | ✅ verified |
| dense Plücker6D、timestamp MLP、Q/K含状态V纯视觉；相对query pose/time作为零参考 | WorldMem v3 §3.4 Eq.3–5 | ✅ verified |
| train memory最低noise，context独立noise；infer memory/context最低noise，current最高；特殊memory temporal mask | WorldMem v3 §3.4 Eq.6 | ✅ verified |
| Minecraft主表simulator GT pose；预测器输入前图、前pose、下一action；RE10K给定相机注释 | WorldMem v3 §4.1、§7.1 Fig.9 | ✅ verified |
| VAE shape[B,F,16,18,32]；像素360×640，patch9×16；默认8context+8memory | WorldMem v3 §4 Experimental Details、§7.2 bankshape | ✅ verified |
| similarity threshold0.9，wo1，wt0.2/tc，kmin15/kmax1000；最低噪声非零 | WorldMem v3 §4 Experimental Details | ✅ verified |
| 窗外300测试视频，600GT history bank→100GT对应未来，8context/8memory、GTpose | WorldMem v3 §4.1 Beyond context window | ✅ verified |
| DF窗外PSNR17.32/LPIPS0.4376/rFID51.28；WorldMem23.98/0.1429/15.37 | WorldMem v3 Tab.1 | ✅ verified |
| Tab.8 GT25.32/0.1429/15.37；predicted23.13/0.1786/20.36；PSNR与主表不一致 | WorldMem v3 Tab.1、Tab.8 | ✅ verified（内部差异未解释，正文保留） |
| timestamp可区分同空间不同时刻；种植/放置/生长有展示，但非所有离屏动态正确保证 | WorldMem v3 Fig.3、§4.1；能力边界为本页限定 | ✅ verified（展示）；⚠ secondary/inferred（能力限定） |
| WorldMem代码地址与venue | [官方repo](https://github.com/xizaoqu/WorldMem) README/description | ✅ verified |
| VRAG作者机构、首版2025-05、NeurIPS2025 | [abs](https://arxiv.org/abs/2505.21996)、[v4首页](https://arxiv.org/html/2505.21996v4)、[官方项目](https://sites.google.com/view/vrag) | ✅ verified |
| 全局state=[x,y,z,yaw]；加权state相近度取旧帧排序；不是WorldMem专用cross-attn | VRAG v4 §3.3、§4.2 | ✅ verified |
| retrieved RoPE offset、较低噪声；history loss mask0、history action blank、global state保留 | VRAG v4 §3.3 Eq.6–7 | ✅ verified |
| 10retrieved+10context，20总活跃帧；主buffer称固定长度，不误用baseline124帧设置 | VRAG v4 §3.3–3.4、§4.2 | ✅ verified |
| History Buffer baseline124帧，不能充当主VRAG永久容量/淘汰规则 | VRAG v4 §4.2、App.A | ✅ verified（baseline数）；❓ not verified（主buffer实现） |
| global-state weights[10,10,10,3]，retrieved temporal offset100 | VRAG v4 App.B | ✅ verified |
| GTstate在主表training/inference可用；predicted increment输入图像+action，加到当前pose | VRAG v4 App.C.4 | ✅ verified |
| coherence60×300帧受控旋转/反向/环形，前100帧初始化、后200帧预测对GT | VRAG v4 §4.1、Fig.3 | ✅ verified |
| DF20 SSIM0.466/PSNR16.643/LPIPS0.538；VRAG0.506/17.097/0.506 | VRAG v4 Tab.1 | ✅ verified |
| VRAG no training0.455/16.670/0.528；no memory0.436/16.372/0.547；后者保留state | VRAG v4 Tab.5、§4.7 | ✅ verified |
| VRAG predicted-pose0.500/17.116/0.506，单独消融非主表条件 | VRAG v4 Tab.6、App.C.4 | ✅ verified |
| compounding errors另20×1200帧随机轨迹，平均SSIM DF20 0.321/VRAG0.349 | VRAG v4 §4.1、§4.4、Tab.2 | ✅ verified |
| VRAG code项目地址 | [官方项目](https://sites.google.com/view/vrag) Code链接→[repo](https://github.com/yeyutaihan/vrag) | ✅ verified |
| 2025 Memory Forcing题名、作者机构、首版2025-10；2510.03198与2610.11756同名不同 | [abs](https://arxiv.org/abs/2510.03198)、[v1首页](https://arxiv.org/html/2510.03198v1)、[2026 abs](https://arxiv.org/abs/2610.11756) | ✅ verified |
| memory cross-attention followsWorldMem；Q/K relativePlücker，读取历史帧而非渲染完整3D状态 | 空间版 v1 §3.2 Eq.2 | ✅ verified |
| global点云带source frame ID；投影可见点计来源，top8历史帧 | 空间版 v1 §3.4 Eq.5 | ✅ verified |
| keyframe由新覆盖或历史不足触发；重建联合keyframe/retrieved/overlap，VGGT深度与confidence，尺度对齐后反投影，voxel采样 | 空间版 v1 §3.4 Eq.6–7、App.A.1 | ✅ verified |
| 深度predicted、camera extrinsics由pose给出；未报告action-only predictor性能；不把深度估计误写pose-free | 空间版 v1 §3.4、§4.1、App.A.2 | ✅ verified（机制）；❓ not verified（action-only predictor） |
| fixed context16帧、空间top8；pixel384×224，VAE16×压缩→24×14网格 | 空间版 v1 §3.3–3.4、§4.1 | ✅ verified |
| HT：VPT探索temporal-only；MineDojo回访spatial+temporal；固定window半数recent，另半动态分配 | 空间版 v1 §3.3 Eq.3 | ✅ verified |
| CFT前窗少步无梯度预测替换后窗GTcontext，后窗仍监督denoise；不是DMD无配对训练 | 空间版 v1 §3.3 Eq.4、Alg.1 | ✅ verified |
| long-term集150轨迹，评第600–800帧；同文WorldMem/Oasis重训context16、pixel384×224 | 空间版 v1 §4.1–4.2、Tab.1 | ✅ verified |
| Oasis FVD196.8/PSNR16.83/SSIM0.5654/LPIPS0.3791 | 空间版 v1 Tab.1 long-term memory列 | ✅ verified |
| WorldMem同文对照122.2/19.32/0.5983/0.2769 | 空间版 v1 Tab.1 | ✅ verified |
| 空间MF84.9/21.41/0.6692/0.2156 | 空间版 v1 Tab.1 | ✅ verified |
| efficiency20×4000帧；WorldMem frames4000/pipeline4.27FPS；空间MF平均72.65/31.21FPS | 空间版 v1 §4.3、Tab.2 | ✅ verified |
| 98.2%是memory frame count减少；7.3×是pipeline（MF含重建+检索，WorldMem为pose retrieval）；非总bytes/生成FPS | 空间版 v1 §4.3、Tab.2 | ✅ verified |
| O(1)检索主张与地图按空间覆盖增长并存；局部密度上限≠全图常数预算 | 空间版 v1 §3.4、§4.3；本页明确限定 | ⚠ secondary/inferred（复杂度边界，未独立性能复测） |
| 空间MF官方repo与project | [作者项目](https://junchao-cs.github.io/MemoryForcing-demo/) Code→[repo](https://github.com/Junchao-cs/Memory-Forcing) | ✅ verified |
| 通用帧库bytes=N_t*C*h*w*b，selectedfeatures[B,Kn,d]，geometry[P,3]另metadata；均为示意推算 | 上述记忆对象定义及标准元素计数 | ⚠ secondary/inferred |

不把三篇不同数据、分辨率、窗口、GT/预测信息条件的原表混排。`worldmem → memory-forcing` 的组件范式沿用有§3.2依据，但不表示权重继承；lead若只用“继承”表示权重/代码可将此边改baseline。Q15/Q16映射见 `08-registry.json`。

## 09 — Context as Memory / WorldPack (`09-context-as-memory.html`) — 2506.03141 / 2512.02473

来源核对日期：2026-10-13。数字均为论文作者报告，未运行模型复现；缓存文件在 `vm/cache/`。

| Claim | Source | Status |
|---|---|---|
| CaM title、8位作者、组织、v1=2025-06-03、SIGGRAPH Asia 2025 / TOG；WorldPack title、5位作者、组织、v1=2025-12-02、TMLR09/2026 | arXiv abs metadata/submission history；各HTML作者栏；CaM v2 header Journal TOG；WorldPack当前abs comments | ✅ verified |
| CaM 原样存RGB/camera；context逐帧VAE，clean context沿帧维拼target；保留target预训练RoPE | https://arxiv.org/html/2506.03141v2 §3.1–3.3 / Fig.2 / Alg.1–2 | ✅ verified |
| CaM XY平面、绕z轴；左右射线FoV交点/距离过滤；遮挡局限；non-adj组抽一帧、远时空补充、recent锚 | CaM v2 §3.3–3.4 / Fig.4 / §5 | ✅ verified |
| CaM 训练从目标之外GT视频取context；推理仅过去生成帧；10%仅近期context；新增clean生成段与camera追加 | CaM v2 §3.3 / Alg.1–2 | ✅ verified |
| CaM target 77RGB→20latent、VAE ratio4；20独立context RGB→20latent；40帧合并是20+20推算；1B内部基座/640×352/50采样步 | CaM v2 §4.1；40帧输入按§3.2推算 | ✅ verified；合并长度是显式推算 |
| CaM噪声损失为范数形式，没有自行补平方；rule-based检索不求梯度；context保持clean | CaM v2 Eq.1、3 / §3.2 / Alg.1 | ✅ verified |
| CaM GT vs HC：random17.70/.4847/17.07/.3985；DFoT17.63/.4528/15.70/.5102；FramePack17.20/.4757/15.65/.4947；CaM20.22/.3003/18.11/.3414 | CaM v2 Tab.1；同内部backbone/data/training；GT bank与self-generated history协议分列 | ✅ verified |
| CaM retrieval：HC随机LPIPS.3985；FoV+nonadj PSNR18.19/LPIPS.3571；+far18.11/.3414，不全指标提升 | CaM v2 Tab.3 | ✅ verified |
| CaM context20→30：HC PSNR18.11→18.19，speed.97→.79FPS | CaM v2 Tab.2；自身原论文配置 | ✅ verified |
| WorldPack CDiT target self-attn/history cross-attn；rate-specific projections取FramePack设计；importance为FoV volume+time penalty；slots重新分配不是统一CaM结构 | https://arxiv.org/html/2512.02473v3 §4 / Eq.4–7 / Alg.1 | ✅ verified |
| WorldPack 10,000 MC points；wo1.0/wt.2；compression1/4/16；S2+4+16=22；4Lf预算；224²→28²latent→14²=196token | WorldPack v3 §4.2 / Eq.5–7 | ✅ verified |
| 4Lf=784为理论等效预算；实际投影各档边界rounding/padding未核验，不伪造逐档精确张量长度 | WorldPack v3 Eq.5与Lf196；本页代数推算 | ⚠ inferred；actual integer layout not verified |
| WorldPack LoopNav baseline1,000,000steps，各变体+200,000；历史帧/pose储存与活动budget分开 | WorldPack v3 App.D Tab.9 / §6.5 | ✅ verified |
| WorldPack ABA-5同budget：baselinePSNR12.2±1.7/DreamSim.31±.05/FVD1847；nearest13.0±1.1/.28±.05/1683；retrieval12.8±1.7/.30±.07/1694；WP13.3±1.8/.27±.07/1510 | WorldPack v3 Tab.3；机制重现，不是CaM原模型分 | ✅ verified |
| WorldPack ABCA-50 PSNR NWM10.8±2.2 vs WP12.1±1.9；LoopNav由Lian等提出 | WorldPack v3 §5 / Tab.2 | ✅ verified |
| WorldPack diffusion单步.255→.296s/22.7→25.4GB，排除FoV；单H100候选50→1600，FoV选择.05→.26s | WorldPack v3 §6.5 / Tab.5–6；diffusion计时与retrieval计时分开 | ✅ verified |
| WorldPack RECON先给80帧；满足长度的15/64轨迹；pose errors/occlusion局限；CaM静态/遮挡/误差累积局限 | WorldPack v3 App.C.2 / §7；CaM v2 §5 | ✅ verified |
| DecMem v1 2026-05-29；Sparse Global block retrieval + Anchored Local；CaR v1 2026-06-22；relative-pose Retrieval Attention + dual-path context compression；仅timeline | https://arxiv.org/abs/2605.31336 / https://arxiv.org/html/2605.31336v1 §3.3–3.5；https://arxiv.org/abs/2606.23105 / https://arxiv.org/html/2606.23105v1 §3.2–3.3 | ✅ verified |
| CaM官方Code链接；WorldPack OpenReview链接；未确认WorldPack Code | https://context-as-memory.github.io/ 项目页指向KwaiVGI/Context-as-Memory；WorldPack论文首页OpenReview链接 | ✅ verified；代码未逐行审计 |

## 10 — VMem (`10-vmem.html`) — 2506.18903

来源核对日期：2026-10-13。数字均为论文作者报告，未运行模型复现；缓存文件在 `vm/cache/`。

| Claim | Source | Status |
|---|---|---|
| title、4位作者、Oxford、v1=2025-06-23、ICCV2025Highlight；official code链接 | https://arxiv.org/abs/2506.18903；v3 HTML作者栏；https://v-mem.github.io/ 指向runjiali-rl/vmem | ✅ verified |
| M=(views,surfels)；views存RGB/camera；surfel存中心3D、法向3D、半径、view ID集合，octree查询 | https://arxiv.org/html/2506.18903v3 §3–3.1 / Fig.2–4 | ✅ verified |
| 平均目标pose，splat可见surfel IDs、像素频率投票TopK、pose NMS；render的是属性IDs而非RGB world | VMem v3 §3.1 / App.B | ✅ verified |
| 新+retrieved views联合point-map估计（如CUT3R）；相机固定/olddepth冻结；新surfels匹配中心/法向后合并ID，否则追加；相近camera去旧ID | VMem v3 §3.1 / App.C | ✅ verified |
| SEVA读取past RGB与reference/target Plücker camera embeddings；不是直接读取3D cache RGB；LoRA轻量训练与插拔索引职责分开 | VMem v3 Fig.2 / §3.2 / §4.1 | ✅ verified |
| 轻量K4/M4，原SEVA K17/M4/total21；8轻量views为4+4推算；图库/索引不固定 | VMem v3 §4.1；数据结构§3.1 | ✅ verified；8是显式推算 |
| LoRA rank256；600000iterations/8A40/batch24perGPU；lr3e-6/weightdecay1e-4/cosine；CFG3/alpha.2 | VMem v3 App.A | ✅ verified |
| σ语义矛盾：主文H′=H/σ是downsampling，App.Aσ=.03 scaling；没有补造实现值 | VMem v3 §3.1 / App.A | ✅ verified discrepancy；实际代码缩放未核验 |
| RE10K cycle首图+GT camera，后续generated views；前进然后逆向返回，每10帧返程评估；pose误差单列 | VMem v3 §4.2–4.3 / Tab.2 | ✅ verified |
| RE10K cycle主表MotionCtrlLPIPS.589/PSNR9.07/SSIM.096/FID26.86；ViewCrafter与SEVAK17 .401/11.82/.217/24.72；VMemK4 .397/15.72/.297/24.97；K17 .304/18.15/.377/24.18 | VMem v3 Tab.2；各自checkpoint及K配置 | ✅ verified |
| 同K4消融Temporal.794/7.52/.018；distance.422/13.27/.187；FoV.424/13.11/.192；VMem.381/14.82/.275；Tab2/4K4主方法不一致 | VMem v3 Tab.4 / §4.4；Tab.2对照文内不一致 | ✅ verified；差异原因未核验 |
| TanksAndTemples6advancedscenes/first50frames/cycle每帧；VMemK4PSNR14.11/SSIM.121，ViewCrafter13.62/.129 | VMem v3 §4.3 / Tab.3；不同采样协议 | ✅ verified |
| RTX4090 4.2s/frame vs SEVA50s/frame/约12×；App.D4.16s，非实时 | VMem v3 §4.4 / App.D；轻量LoRA版本与原SEVA不同配置 | ✅ verified |
| cycle简单且遮挡有限；低层纹理相似不充分测true multiview consistency；动对象/室外泛化限制 | VMem v3 App.D | ✅ verified |
| L2R称其VMem baseline每步allstoredframes pointmap/alignment；原VMemnew+retrieved且固定旧depth，不能将其开销写成原方法定义 | https://arxiv.org/html/2610.11444v1 §4.5；VMem v3 §3.1/App.C | ✅ verified source discrepancy；未运行两实现 |
| 投票公式、符号tensor形状、生成循环是讲解改写；无通用动态状态覆写/固定全库容量主张 | VMem v3 §3.1–3.2；本页算子示意 | ⚠ inferred/expository；非官方代码 |

## 11 — HyDRA / ActWorld (`11-dynamic-memory.html`) — 2603.25716 / 2606.17730

来源核对日期：2026-10-13。数字均为论文作者报告，未运行模型复现；缓存文件在 `vm/cache/`。

| Claim | Source | Status |
|---|---|---|
| HyDRA题名、7位作者、机构、v1=2026-03-26；ActWorld题名、14位作者、机构、v1=2026-06-16；venue未确认留空 | https://arxiv.org/abs/2603.25716 / v2作者栏；https://arxiv.org/abs/2606.17730 / v1首页 | ✅ verified；venues not verified |
| HM-World相机/subjectpaths解耦渲染；model输入historyvideo及history/targetcamera，subject路径/位置/entry时间戳不列入未来控制输入 | https://arxiv.org/html/2603.25716v2 §3.2 / §4 | ✅ verified |
| HyDRA MemoryTokenizer 3Dconv motion-aware；targetquerypooling，按temporal slice affinity TopK，flatten所选片+localK/V；选择随层/denoising变化 | HyDRA v2 §4.2–4.3 / Eq.3–6 / App.B Fig.10 | ✅ verified |
| HyDRA context77RGB/VAEtime4；kernel2×4×4/retrievallength10/localwindow5；Wan2.1T2V1.3B/10Kiterations/32GPUs/batch32 | HyDRA v2 §5.1 | ✅ verified |
| HyDRA tensor M[B,D,f′,h,w]；affinity[B,f_tgt,f′]，读K·h·w memorytokens；kernel不用于伪造stride/padding | HyDRA v2 Eq.3–6；本页维度推导 | ✅ verified；tensorlayout为讲解推导 |
| HyDRA flowmatching v=data-noise；本页τ0noise/τ1data重参数化；无单列subjecttrajectoryloss；TopK梯度边界 | HyDRA v2 §4.1 / Eq.1 / §4.3；TopK离散性为算子解读 | ✅ verified objective；⚠ gradient interpretation |
| HyDRA测试1000含unseenscene/subject；CaM/DFoT同数据同training重训，baselinecontextconcat；WorldPlayzero-shot另列 | HyDRA v2 §5.1–5.2 / Tab.2–3 | ✅ verified |
| DSC YOLOv11主体crop/CLIPfeatures，spatialalignment/temporalnormalisation，DSCctx历史对照、DSCGT真值对照 | HyDRA v2 §5.1 / Eq.7 | ✅ verified；不推物理因果保证 |
| HyDRA同训练主表Baseline18.696/.356/.812/.837；DFoT17.693/.410/.803/.826；CaM18.921/.342/.816/.839；HyDRA20.357/.289/.827/.849（PSNR/LPIPS/DSCctx/DSCGT） | HyDRA v2 Tab.2 | ✅ verified |
| HyDRA kernelT2→1/space4×4：PSNR20.357→19.076，DSCGT.849→.841；正文称降.014，表格差.008 | HyDRA v2 §5.3 / Tab.4；.008为表内推算 | ✅ verified discrepancy |
| HyDRA复杂多主体及严重遮挡退化；未定义无限persistentbank/eviction，反馈更新只为continuation接口示意 | HyDRA v2 §6/§4；生成反馈为本页扩展 | ✅ verified limitation；⚠ continuation loop expository |
| ActWorld chunkcaption、actionclass、interactionflags/phases及camera作为条件/写入来源；6phase词汇、GPT5.4offlineannotation、33帧/5keyframes | https://arxiv.org/html/2606.17730v1 §3.1–3.3 / App.D/G | ✅ verified |
| ActWorld EAFR固定phaseprior+recency重排fine/mid/coarse，保持originalRoPE；ACHAactionconditioned perhead key amplifier，bottleneck256 | ActWorld v1 §3.3 Eq.1–2 | ✅ verified |
| ActWorld event3transitiontags，phase/action/transitionembeddings+AttnPool；objectnormsaliencypatches的DINOv3anchors而非instance segmentation | ActWorld v1 §3.3 Eq.3–4 / App.D | ✅ verified |
| ActWorld bank16，selfattn前置、segmentembedding/typetag、RoPE0；FIFO删oldestunpinned，contact/manipulating/completing pin；全pin饱和未说明 | ActWorld v1 §3.3 / App.D | ✅ verified capacity/policy；❓ saturation policy not specified |
| ActWorld DINOv3B/16/224²input/14²patches/768features；5keyframes与≤3objecttokens/qualifyingchunk；trainingofflineGTanchors/inferencecompletedgeneratedchunkonline | ActWorld v1 App.D | ✅ verified |
| ActWorld initHelios14B来自Wan2.1-14B；zero-init memory/control additions；Stage3pureteacherforcing/realhistory/onechunk而非selfrollout | ActWorld v1 App.B/E/G | ✅ verified |
| ActWorld文内矛盾：eventformula含AttnPool，App.Donline称纯symbolic查表；主文100K vs App.H90,000 | ActWorld v1 §3.3/§4.1/App.D/H | ✅ verified discrepancy；实现待核对 |
| I-Bench混合action/navigation；VLM-AJLevel3success；KMF=Key-Mouse-Following，VIPEcamera恢复、不是memoryscore | ActWorld v1 §4.2–4.3 | ✅ verified |
| ActWorld同组件消融CP+Plücker IF2.326/success52.9/KMF20.29；EAFR2.345/53.8/20.45；ACHA2.413/54.0/20.58；EventMemfull2.557/57.8/20.62 | ActWorld v1 Tab.4；allrows含chunkprompts及Plücker | ✅ verified |
| ActWorld完整系统57.8%vsYume1.520.12%动作success；不是隔离memory收益或action后leave-return终态专测；未分离objectwriter消融 | ActWorld v1 Tab.2/4 / §4.2–4.5 | ✅ verified；task boundary解释 |
| HyDRA官方code/project；ActWorld项目页无确认方法repo，不把网页template当Code | https://github.com/H-EmbodVis/HyDRA；https://kj-chen666.github.io/Hybrid-Memory-in-Video-World-Models/；https://interactwm.github.io/ActWorld/ | ✅ verified links；ActWorld code not verified |

## 12 — GEN3C 与长期空间记忆 (`12-geometry-cache.html`) — 2503.03751, 2506.05284

原始论文版本与实际阅读：正文、方法、实验表与相关附录均已核对；结果为作者报告，未运行生成模型或独立复测。

[G](https://arxiv.org/html/2503.03751v1)；[S](https://arxiv.org/html/2506.05284v1)

| Claim | Source | Status |
|---|---|---|
| GEN3C 时间 × 视图的 RGB 点云；相机可提供或用 DROID-SLAM 估计 | G §4.1 | ✅ verified |
| GEN3C 分视图 VAE 条件、mask 乘法、min-pooling 与输入层之后跨视图 max-pooling | G §4.2–4.3、App. C.1 | ✅ verified |
| 动态 NVS 依赖给定动态视频，不等于自主预测所有运动 | G §4.1、§6 Limitations | ✅ verified |
| GEN3C SVD latent [L,4,H/8,W/8]；时间不压缩 | G §3 | ✅ verified |
| GEN3C 单 chunk 14 帧、重叠 1 帧；推理 25 steps、CFG 3 | G §4.5、App. A.1、B.2 | ✅ verified |
| 训练 source views V∈[1,4]，可来自 target 的过去 / 未来帧 | G §5.1 Paired Data | ✅ verified |
| GEN3C target x0 latent denoising 监督；writer 是估计 / 对齐 / 反投影 | G §4.4、App. A.1 | ✅ verified |
| GEN3C 写入：正文逐帧；附录详细示例是 chunk 末帧 | G §4.5 vs App. A.1 | ✅ verified discrepancy；官方代码粒度未核 |
| RE10K 双视图外推：显式融合 19.87 / 0.75 / 0.28；本方法 21.56 / 0.83 / 0.15（PSNR/SSIM/LPIPS） | G Tab. 6 | ✅ verified |
| 深度噪声 10%：19.64 / 0.76 / 0.22；30%：17.91 / 0.70 / 0.31，均外推；噪声由深度分位数跨度缩放 | G §5.6、Tab. 5 | ✅ verified |
| Spatial Memory 静态 TSDF 点图 + working + sparse episodic；新露出面积超过阈值触发帧写入 | S §3.2 | ✅ verified mechanism |
| episodic 面积阈值和固定容量的具体值 | S §3.2 所读正文未给出 | ❓ not verified；页内标记 |
| 训练 Mega-SaM 全片几何；在线 CUT3R 持续状态，TSDF 后合并坐标 | S §3.4、App. A | ✅ verified |
| Spatial Memory 最近 5 帧；复制前 18 条件 DiT blocks；historical Q/K/V cross-attention | S §3.3、§4 | ✅ verified |
| TSDF 数据网格最大轴长 1200，超过时调整 voxel size | S App. A | ✅ verified；数据构造口径 |
| CogVideoX-5B-I2V / DaS；49 帧 480×720；6000 steps，lr2e-5，batch8 | S §4 Implementation Details | ✅ verified |
| 500 条 MiraData held-out 正 / 反轨迹同相机生成帧回访 | S §4 Metrics and Baselines | ✅ verified |
| TrajectoryCrafter recall 11.71 / .4380 / .5996 | S Tab. 1（PSNR / SSIM / LPIPS） | ✅ verified |
| DaS recall 12.01 / .4512 / .5874 | S Tab. 1 | ✅ verified |
| Wan2.1-Inpainting recall 12.16 / .4506 / .5875 | S Tab. 1 | ✅ verified |
| Spatial Memory recall 19.10 / .6471 / .3069 | S Tab. 1 | ✅ verified |
| w/o episodic / w/o working / full Temporal Flickering .7260 / .6740 / .7580 | S Tab. 3 | ✅ verified；VBench 辅指标 |
| 急转 / 大位移重建错位，TSDF 误删静态点并产生稀疏地图 | S Fig. 6、§5 Limitations | ✅ verified 作者失败案例 |
| depth / pose → 错误投影 → generated evidence 再写入的传播链 | G §4、S §3 架构 | ⚠ mechanism inference，非独立失败归因 |
| GEN3C CVPR2025 Highlight；Spatial Memory NeurIPS2025；作者 / 机构 / 官方代码 | GEN3C project；Spatial Memory HTML author block、NeurIPS proceedings、spmem project | ✅ verified metadata |

交接说明：仅修改分配页面。两篇几何缓存方法合页是机制对照，无直接继承边。GEN3C §4.5 逐帧写与 App. A.1 末帧示例粒度不同，已 code-note；未逐行核对官方更新实现。Spatial Memory episodic 面积阈值 / 容量未核实并已 unverified 标记。浏览器连接不可用，完成静态 SVG / HTML 与 KaTeX 检查。Footer 先链本页参考，待 lead 合并 SOURCES 可改回。

## 13 — Voyager 与 Latent Spatial Memory (`13-voyager-lsm.html`) — 2506.04225, 2606.09828

原始论文版本与实际阅读：正文、方法、实验表与相关附录均已核对；结果为作者报告，未运行生成模型或独立复测。

[V](https://arxiv.org/html/2506.04225v1)；[L](https://arxiv.org/html/2606.09828v2)

| Claim | Source | Status |
|---|---|---|
| Voyager 基座 Hunyuan-Video；LSM 为 Wan2.2，非使用 Voyager 权重 | V §3；L §5.1、App. C | ✅ verified |
| Voyager RGB + placeholder + depth 沿高度布局；条件与 noisy latent 才沿 channel 拼接 | V §4.2、App. B Fig. 9 | ✅ verified |
| Voyager cache 每点 XYZ+RGB，[N,6]；生成 RGB-D 后逐帧反投影 | V §4.1、§4.3 | ✅ verified |
| 点写入覆盖检查 + 法线 / 视角超过90°检查，相对保留全部点约省40% | V §4.3、§5.4 Fig. 8 | ✅ verified；非固定总容量 |
| smooth sampling 半段重叠、上一段初始化、平均与轻噪声再去噪 | V §4.3 | ✅ verified |
| Voyager 单次生成49帧；RGB / RGB-D / frozen-DiT Control 三阶段；末阶段UE GT-depth | V App. A–B | ✅ verified |
| 训练几何 VGGT + MoGE disparity 对齐 + Metric3D scale | V §4.4、App. C | ✅ verified |
| 原 Voyager RE10K NVS PSNR18.751 / SSIM.715 / LPIPS.277；150 clips、estimated cameras | V §5.1、Tab. 1 | ✅ verified；用于 registry fact，未与重评混排 |
| LSM native-grid one-point-per-cell，scaled intrinsics；z-buffer frontmost positive-depth feature + mask | L §4.2–4.3、App. A | ✅ verified |
| LSM 写回仍 decoded RGB → depth/pose + masks → re-encode → lift；排除动态与天空 | L §4.4、App. C | ✅ verified |
| LSM 两阶段 side branch / LoRA flow training，rank32 alpha32，lr1e-5 /1e-4 | L §4.5、App. C | ✅ verified |
| LSM VAE compression4×16×16，C48；9×44×80 latent 对33帧704×1280；UniPC40steps；singleH100 efficiency | L §5.1、App. C | ✅ verified |
| 训练 ViPE / DA3 几何；实体抽取和分割用于 mask | L §5.3、App. C | ✅ verified |
| LSM 闭环 RE10K：ViewCrafter14.79/.481/.365 | L Tab. 2（PSNR_C/SSIM_C/LPIPS_C） | ✅ verified |
| LSM 闭环 RE10K：Voyager17.66/.540/.380 | L Tab. 2 | ✅ verified |
| LSM 闭环 RE10K：Spatia19.38/.579/.213 | L Tab. 2 | ✅ verified |
| LSM 闭环 RE10K：LSM20.05/.825/.228 | L Tab. 2 | ✅ verified |
| LSM 重评 NVS：Voyager17.79/.636/.297；LSM18.38/.779/.250 | L Tab. 2 | ✅ verified；非 Voyager 原表 |
| 缓存消融 RGB67.71/90.75/91.10；feature-upsample60.85/84.90/79.81 | L Tab. 3（Average/3D/Photo） | ✅ verified |
| 缓存消融 nofilter61.20/80.88/76.10；full70.36/92.21/93.95 | L Tab. 3 | ✅ verified |
| 最高端到端10.57×，3D-cache GPU footprint55×；不是整机显存 | L §5.2 Efficiency、Fig. 6 | ✅ verified 作者报告；未独立复测 |
| cache read setup后约.25s/frame，五个chunks；不是生成FPS | L Fig. 6 | ✅ verified |
| 动态过滤不保存 dynamic actors 跨chunk状态 | L §6 Limitations | ✅ verified explicit boundary |
| latent地址数随stride平方缩小但不等于whole-system字节比例 | native-grid 架构 / L App. B | ⚠ grid / budget inference |
| 2606.09828v2 abs 名 Mirage，v2 HTML仍 LSM-World；同论文元数据 | arXiv abs v2 vs HTML v2，重新取得cache/lsmv2.html | ✅ verified internal naming discrepancy |
| Voyager/LSM 作者机构首发月，官方repo/project；无已核验venue | 各abs submission history；各HTML author block；官方repo | ✅ verified；venue留空 |

交接说明：LSM registry id 必须为 lsm-world，页面 anchor latent-spatial-memory。2606.09828v2 abs 系统名 Mirage，实际 v2 HTML 和代码仍 LSM-World，页面已说明。Voyager 为 baseline，非权重来源；LSM 55× 指 3D-cache GPU footprint，不是整机。LSM v2 HTML 从 arxiv 重新获取；原有全文与其正文内容相同。全页数据来自各论文指定版本，不把 Voyager 原表与 LSM 重评混排。未独立复现生成。

## 14 — PERSIST 与 Honeycomb (`14-persistent-state.html`) — 2603.03482, 2609.37690

原始论文版本与实际阅读：正文、方法、实验表与相关附录均已核对；结果为作者报告，未运行生成模型或独立复测。

[P](https://arxiv.org/html/2603.03482v2)；[H](https://arxiv.org/html/2609.37690v2)；[L](https://arxiv.org/html/2606.09828v2)

| Claim | Source | Status |
|---|---|---|
| PERSIST动作主动预测world-frame、camera，再投影生成pixel；RGB也作为world条件 | P §4–5 | ✅ verified |
| GT3D/相机监督；默认由首帧RGB+camera生成w0，+GTw0为额外信息条件 | P §5.1、§6.2 | ✅ verified |
| 体素GT [48,48,48,2138]，world latent[12,12,12,48] | P Tab. 3 | ✅ verified |
| 3D-S/XL spatial tokens216/1728，world context8，参数数相同 | P Tab. 6–7 | ✅ verified |
| pixel latent[36,64,16]，投影stack[36,64,192,32]，context16 | P Tab. 4、8 | ✅ verified |
| 世界上下文/camera上下文8；default20steps，historynoise .02/.1 | P Tab. 5–9 | ✅ verified |
| 3D-VAE crossentropy+KL；2D-VAE MSE+KL；world/pixelflow；camera component MSE | P §3、§5、App. A.1 | ✅ verified |
| 有限agent-centered区域导致远处状态随移动丢失 | P App. E Unconstrained spatial memory | ✅ verified explicit limitation |
| GTcamera与generated世界不相容可穿墙，FVD不充分捕捉 | P §6.1、Fig. 11 | ✅ verified qualitative failure |
| 168 held-out trajectories；主定量同VAEs/data/flow重训；WorldMem额外400GT frames/cameras | P §6.1 | ✅ verified |
| 200/400/600FVD：Oasis409/687/875；WorldMem358/—/— | P Tab. 1 | ✅ verified；dash为未报告 |
| 200/400/600FVD：No3DUpscale216/231/247；S159/170/179 | P Tab. 1 | ✅ verified |
| 200/400/600FVD：PERSIST129/141/148；+GTw0 80/93/104 | P Tab. 1 | ✅ verified；不同初始化条件 |
| human study原Minecraft基线 vs Luanti；WorldMem600GT，Temporal1.5±.08 vs PERSIST2.5±.09，range1–5 | P Tab. 2、App. B.2–B.3 | ✅ verified；另一域/初始化协议 |
| 离屏碰撞/水位变化为定性案例，不是任意物理一致性证明 | P Fig. 8 | ✅ verified；边界解释 |
| Honeycomb六平面：XY×ZT、XZ×YT、YZ×XT；rank48；本文write-time改s避免diffusiontau冲突 | H §3.2、§4.1 | ✅ verified |
| writer bilinear splat，只处理新chunk；bounds扩大warp旧plane/confidence，置信pool+zero-init residual | H §3.3–3.4 | ✅ verified |
| reader投影点position/sourcewrite-time，nearestpositive-depth，ray+camera解码latent | H §3.5 | ✅ verified |
| Honeycomb不filterdynamic/sky；write-time观测记录非主动离屏动力学 | H §3.1、§3.5 | ✅ verified mechanism；能力界限为解释 |
| memory writer/fusion/reader GTlatent reconstruction；frozen memory readout适配生成器 | H §3.3、§3.6 | ✅ verified |
| defaultplanes512rank48；9latent44×80→33RGB704×1280；branch10K,LoRArank64 5K,UniPC40 | H §4.1、Tab. 3 | ✅ verified |
| 100WorldScore闭环；RAFT Flow_C单位pixels；与LSM RE10K闭环不同 | H §4.2、Tab. 2 | ✅ verified |
| 闭环 Voyager15.99/.459/.423/7.11 | H Tab. 2（PSNR_C/SSIM_C/LPIPS_C/Flow_C） | ✅ verified |
| 闭环 Spatia15.67/.488/.353/6.64 | H Tab. 2 | ✅ verified |
| 闭环 LSM15.12/.460/.463/27.05 | H Tab. 2 | ✅ verified |
| 闭环 Honeycomb17.22/.504/.311/3.00 | H Tab. 2 | ✅ verified |
| WorldScore LSM61.20 是nofilter vs完整LSM70.36 | H §4.2 Tab. 1；L Tab. 3 | ✅ verified protocol distinction |
| planes512/256/128: MB73.9/19.8/5.8；PSNR17.22/17.10/16.77；LPIPS.311/.319/.338 | H Tab. 3 | ✅ verified feature-storage ablation |
| chunk2/5/9 recurrentwrite13.1/13.2/13.2ms；replacement11.2/23.3/40.1ms | H Tab. 4 | ✅ verified writer-time only |
| 129GTframes memoryprobe：write2 16.71PSNR，write5 16.30 | H App. C Memory Retention | ✅ verified one-sequence / GTwrite condition |
| HexMemory feature sizeconstant不是whole-systemconstant：geometry/write-time/read buffers仍需计入 | H §3.5、§5，未给系统总上界 | ✅ feature boundary；⚠ total-budget inference |
| 扩域固定格数导致Lx/(n−1)格距增加，插值/低秩融合限制精细地址 | H §3.4机制与网格定义 | ⚠ mathematical / mechanism inference |
| PERSIST ICML2026；Honeycomb作者机构首发月/代码；Honeycomb venue未知 | PERSIST officialproject；各HTMLauthorblock、abs submissionhistory、officialrepo | ✅ verified metadata |

交接说明：PERSIST v2 GT3D 训练，首帧推理和 +GTw0 分开；主定量 WorldMem 400 GT observations，human study 为原模型且 600 GT，与 Luanti/Minecraft 域差异已说明。Honeycomb v2 feature-only constant-size；§3.5 几何点与源写时元数据仍用于 visibility，全系统界限未确立。Honeycomb WorldScore 表 LSM 61.20 是无动态过滤变体，不替代完整 LSM 70.36。Honeycomb 时间轴改记 s，避免与 flow tau 混淆。

## 15 — Matrix-Game 的游戏世界记忆 (`15-matrix-game.html`) — 2604.08995 / 2608.29910

核读版本：Matrix-Game 3.0 arXiv v3（2026-09-29）、3.5 v1（2026-08-30）；timeline 日期取 abs 的 v1。全部性能均为作者报告，没有独立运行生成器复现。下表按页面的每个带来源段落 / 表格事实记录；合并多个指标仅发生在同一行、同一协议内。

原始下载仅保存在 `vm/cache/job6-*`。

| Claim | Source | Status |
|---|---|---|
| Matrix-Game 3.0 作者 / 组织 / 首发日期；当前核读 v3 | abs citation metadata / v1 2026-04-10，v3 2026-09-29；HTML 作者栏 Skywork AI | ✅ verified |
| Matrix-Game 3.5 作者 / 组织 / 首发日期；当前核读 v1 | abs citation metadata / v1 2026-08-30；HTML 作者栏 Riemann Dynamics | ✅ verified |
| 基座 Matrix-Game / 2.0 的首发日期为2025-06 / 2025-08 | [Matrix-Game abs](https://arxiv.org/abs/2506.18701) v1 2025-06-23；[Matrix2 abs](https://arxiv.org/abs/2508.13009) v1 2025-08-18 | ✅ verified |
| Q29 的自一致 / GT 解释与 Q30 的离屏持续状态边界 | 3.5 §4.2、§6；3.0 Fig.9；GameNGen §7 | ⚠ 指标与能力范围的解释 |
| 玩家转身、绕路、再回到同一地点时，生成器面对的是两个要求：新动作要及时改变画面，旧场景要在当前窗口之外仍可找回。只把上一段末尾当条件，可以延续运动，却不能保证远处建筑、角色外观或已经发生的变化被保存。Matrix-Game 3.0 用相机寻址历史帧；Matrix-Game 3.5 进一步把历史拆成可重投影的静态 patch 与独立的主体外观参考。 | 3.0 §3.2；3.5 §1、§2.2；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| Matrix-Game · 2025-06 / 参考图像、MMDiT 与动作注入 / 把上一 clip 的末帧 latent 作为 motion condition；解决段间连续性，尚无独立远程检索库。 | v1 提交记录；Matrix-Game §3、Fig. 5；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Matrix-Game 2.0 · 2025-08 / 因果自回归、KV cache、Self Forcing 蒸馏 / 让动作控制与流式少步生成结合；训练自身历史的原则见 滚动缓存页。 | v1 提交记录；2.0 v5 §3；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Matrix-Game 3.0 · 2026-04 / Wan2.2-TI2V-5B；基模与学生均用双向窗口 / 相机检索、joint self-attention、误差注入、多段自生成蒸馏。 | v1 提交记录；3.0 v3 §3、§5.1；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Matrix-Game 3.5 · 2026-08 / 同类 Wan 基座；蒸馏转为因果 chunk / 三维 patch、tiled PRoPE、静动分离；“沿用 3.0”由作者明确说明。 | v1 提交记录；3.5 摘要、§2；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 定位上，GameNGen 展示 DOOM 的神经游戏循环，也明确承认有限历史与 HUD 状态线索；Oasis 用动态加噪抑制漂移，其官方发布仍列出长程记忆和物品栏控制困难。Hunyuan-GameCraft 的混合历史条件揭示“更多历史提高连续性、也可能削弱新动作响应”；Yume 则把 FramePack 式历史压缩带入可交互探索。 Genie 3 的官方回访演示是能力定位，内部记忆结构未披露，不能据此给它画检索或地图模块。 | GameNGen §7；Oasis Future Explorations；GameCraft §4.2；Yume §3.2；DeepMind 官方发布，2025-08；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910)；[GameNGen](https://arxiv.org/html/2408.14837) §7；[GameCraft](https://arxiv.org/html/2506.17201) §4.2；[Yume](https://arxiv.org/html/2507.17744) §3.2；[Oasis official](https://oasis-model.github.io/)，官方发布，非论文；[DeepMind official](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)，官方发布，非论文 | ⚠ 作者报告 / 解释与范围限定 |
| 这是比较骨架：3.0 显式注入键鼠动作；3.5 以键鼠映射的相机轨迹和文本驱动生成，另有固定的主体参考 prefix。写入必须先获得新帧的几何估计，不能仅由 latent 自动得到世界坐标。 | 3.0 §3.1；3.5 §2.2、App. C；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 3.0 用相机 pose / FoV 相交度稳定选择旧帧；3.5 用目标相机查询投影覆盖，并通过 tiled PRoPE 将相机几何放入注意力。两者均依赖可用且相容的相机参数。 | 3.0 §3.2、§3.4；3.5 §2.1–2.2；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 的 anchor 紧邻目标窗口，另有少量未经 warp 的旧 context；它们保留真实历史时间和相机 pose。主体区域被同场景背景 patch 替换，减少从 context 偷读身份的捷径。 | 3.5 §2.1.2、§2.2.2–2.2.3；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 参考图在推理时仅取自可用初始化与过去，并保持固定。它保存可控主体身份和外观，没有为所有离屏实体维护持续运动状态；作者将后者列为未来方向。 | 3.5 §2.2.3、§6；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.0 保留历史 latent 及相机、时间信息，读回完整旧视角；3.5 存 VAE latent cell 的特征和三维地址。patch memory 的重投影本身无新增可训练参数，参考 prefix 的附加 embeddings 则可训练。 | 3.0 §3.2；3.5 §2.2.1、§2.2.3；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 贪心选增量覆盖最多的历史帧，将其 patch 投影至目标；z-buffer 仅保留靠近目标相机的表面。无效、遮挡和不可靠投影被舍弃，空洞由生成器补全。这是读取过滤，不是全局删除过时状态。 | 3.5 §2.2.1、Eq. 2；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.0 将旧帧、recent latent 和 noisy target 拼入同一双向 DiT，辅以相对 Plücker；3.5 为 context、patch、reference 分配不同时间 / 相机坐标，再用同一 self-attention 读取。学生的因果掩码仅开放已生成历史。 | 3.0 §3.2–3.3；3.5 §2.1.2、§2.3；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 当前段去噪完成后，clean latent / 解码帧用于后续历史与在线记忆。因此读写错误会闭环传播；训练真值库与推理自生成库必须区分。 | 3.0 §3.3；3.5 §4.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 用外部几何估计，并以 YOLO 分割 / tracking 和跨帧深度重投影判定运动。动态或不确定 tracks 不进入静态库。推理在完成一段后登记，论文实时预算没有把该过滤放入逐帧去噪环。 | 3.5 §2.2.3、§3.1、§4.4；[3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 3.5 构造目标对齐的 patch 证据；3.0 的对应操作是 FoV 帧检索。 | 3.0 §3.2；3.5 §2.2.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 保存合格观察；读取时的遮挡过滤并未提供“道具被删除后永久覆写”的通用规则。 | 3.5 §2.2、§6；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.0 不把记忆做成额外 cross-attention 分支，而将检索旧 latent、recent latent 和当前噪声共同送入 DiT。作者报告曾尝试基于噪声特征的稀疏路由与外部 memory branch，前者在高噪声阶段选择不稳，后者对齐与收敛较慢；这是本系统的设计观察，不是所有内容检索都必然失效的结论。 | 3.0 §3.2；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| \(\mathcal F_i\) 是目标视锥，\(\mathcal C_t\) 是历史候选。CPU 精确求视锥交集；GPU 在目标视锥采样，估计落入旧视锥的比例。候选库随迭代增长，GPU 优化因此关系到持续吞吐量，但它没有把总候选存储变成常数。相对 Plücker 告诉网络旧证据与当前视角的关系；原始帧号与 head-wise RoPE base 扰动则帮助区分远近历史。 | 3.0 §3.2、§3.4、Eq. 7、9–11；[3.0 v3](https://arxiv.org/html/2604.08995) | ⚠ 作者报告 / 解释与范围限定 |
| 完整旧帧可能混入无关区域，而且需要生成器自行学跨视角对应。3.5 明确采用 MosaicMem 的 patch 粒度：以深度、内参、相机 pose 将旧 latent cell 抬升到世界坐标，再投影至目标视图。保留的是 latent 特征，作为 detached condition 读入，不必把 RGB 渲染后重新 VAE 编码。 | 3.5 §2.2.1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 此式是论文抬升 / 重投影的讲解写法；齐次坐标与 perspective divide 按实现处理。每个目标先选择能增加有效覆盖的历史帧，再用 z-buffer 消除遮挡竞争。patch 获得目标帧的时间、相机与浮点空间位置，不是沿用其旧存储顺序；原视角 context 则保留真正的历史时间。 | 3.5 §2.1.2、§2.2.1、Fig. 3–4；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| YOLO 检出的“可移动类别”不一律删除：将 mask 用深度和相机重投影后，与邻帧 mask 做双向重叠检查。稳定物体可保留；移动或不确定 track 不进入静态库，避免同一角色的不同位置被当成多处静态表面。动态分支用固定参考 tokens 保存可控角色外观，并以主体区域附加 flow loss 强化训练。 | 3.5 §2.2.3、Eq. 3–5；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 边界：过滤旧动态像素可以减少 ghosting，却没有为离屏角色的速度、目标、交互后果建立持续更新的 state。论文结论也把“离屏时继续演化并正确返回”的动态状态列为后续方向。全片 prompt 的 VLM 重写还提供额外语义状态，不能把其贡献全部归给 patch memory。 | 3.5 §4.3、Fig. 10、§6；[3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 令 \(P_i=\mathrm{lift}(K_i)T_i^{wc}\)，\(R_i\) 为原生时空 RoPE。3.5 保留预训练 RoPE 通道布局，再叠加 tiled camera transform；注意力 logit 同时依赖时间与相对投影。patch memory / tiled PRoPE 不增加可训练参数，reference-index、type、spatial embeddings 是另外的可训练部分。 | 3.5 §2.1.1、§2.2.3、App. B；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 存什么（内容与粒度） / 历史 frame latent，配相机 / 全局时间；可选首 latent sink。 / 静态 latent patch + 三维对应；原视角 context；主体参考 prefix。 | §3.2；§2.2；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 何时写（GT / generated、clean / noisy） / 基模条件源于 GT，再注入预测残差；多段蒸馏 / 推理在线写生成历史，不写当前未完成噪声。 / 基模 / causal adaptation 用真值历史；self-rollout / 推理在生成段完成后登记，动态过滤与几何估计先行。 | §3.2–3.3；§2.2.3、§4.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 如何寻址（时间、位姿、内容） / 目标相机 / FoV overlap；相对 Plücker 与原始时间辅助解释。 / 目标视锥、增量覆盖、深度可见性；patch 重定位到目标坐标。 | §3.2、§3.4；§2.2.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 如何读（注意力 / 拼接） / memory + recent + noisy target 联合 self-attention。 / patch / context / reference / anchor / target 组成 pose-aware 序列；主体参考随 anchor pose。 | §3.2；§2.1.2；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 何时淘汰或覆盖 / 活动检索量有限；全文未给统一 archive 容量与 FIFO 规则，不能补成固定总内存。 / 动态过滤发生在登记；z-buffer / 无效投影筛选发生在读取。全文未定义通用事件状态覆写与全局库容量上限。 | §2.2、§6；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 历史库 / latent [B,F,C,hℓ,wℓ]；pose / depth 索引 / F 随历史增长；活动窗口有限不约束 F。 | 3.0 §3.4；3.5 §2.2.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 3.0 基模序列 / [B,(5+4+10)n,D] / 5 memory、4 recent、10 noisy latent；首段 I2V 条件不同。 | 3.0 §5.1；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 patch 读取 / world entries → [B,Kmem,D] + 投影坐标 / 每目标 latent 最多选 5 个候选帧；遮挡 / 空洞剔除，Kmem 随覆盖变化。 | 3.5 §2.2.1、§4.1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 基模序列 / 21n + n + ≤5n + ≈n + Kmem / 目标、anchor、context、reference、patch；论文给总活动长度约 ≤2.3×目标 track。 | 3.5 §4.1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 主体参考 / 4 个视图 → 约 n tokens / 每图约四分之一帧预算；prefix 固定，不存完整轨迹。 | 3.5 §2.2.3；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 稀疏 patch 读出降低的是进入生成器的活动序列；历史候选、几何、源索引、估计模型和已输出视频另计。3.5 的对齐条件依赖外部深度 / pose：训练数据用 VGGT-Omega、Depth Anything 3 metric anchoring 与跨段 Sim(3) 对齐，不能把估计几何当作无误差 GT。 | 3.5 §3.1、§6；[3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| 使用 \(\tau=0\) 为 clean、\(\tau=1\) 为 noise 的约定，\(x^\tau=(1-\tau)x+\tau\epsilon\)。3.0 只对当前目标回归 flow；GT recent 与 memory 加入误差库中的残差，训练模型应对推理时不完美的历史。 | 3.0 Eq. 4–6；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 这里的误差注入仍以真值条件为底，和完整 self-generated rollout 不同。蒸馏阶段才让学生连续生成多段、从在线库检索，随机停止于一段做 DMD；3.0 保持师生窗口架构一致。3.5 则先用 teacher-forced perceptual flow matching 做因果初始化，再用 self-rollout DMD 逐步开放记忆条件。 | 3.0 §3.3；3.5 §2.3；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| subject mask 增加人物区域梯度；anchor / context 的主体替换和训练时 mask 扰动迫使模型读取参考。patch correspondence 是几何计算、记忆作为 detached condition，不通过重投影学习 writer。 | 3.5 §2.2.1、§2.2.3、Eq. 5；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 的 online registration 按完成的段执行；主体参考仅供身份外观，动态位置来自近期历史、相机与文本生成。 | 3.5 §2.2.3、§4.1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 记忆基模 / Wan2.2-TI2V-5B；5 memory + 4 recent + 10 target latent。 / 同基座；1280×704；21 target、1 anchor、≤5 context；每目标 ≤5 历史候选。 | §5.1；§4.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 条件训练 / RoPE 扰动幅度 0.8；约 4.8M clips。 / patch memory 80% 开启；text dropout 0.1；VAE / text encoder 冻结，完整 DiT 微调。 | §5.1；§4.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 学生 rollout / cold start 600 steps；后续 2400 steps，多段数在 1–6 中采样。 / 每 chunk 3 latent、3 denoising steps；PFM 10000 steps 后 DMD 1000 outer steps。 | §5.1；§4.1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 实时系统 / INT8 attention projections、MG-LightVAE、GPU 检索、异步 DiT / VAE。 / INT8 student、GPU 检索、75% pruned VAE；异步 VLM prompt rewriting。 | §3.4；§4.4；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.0 自身证据：v3 的 Fig. 9 用后半段反向动作强制回访，Fig. 11 展示蒸馏后的再现；这是定性记忆证据，未给同协议的数值记忆消融表。Tab. 1 测的是系统吞吐量，不是记忆成功率。 | 3.0 §5.2、Fig. 9、11、Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) | ⚠ 作者报告 / 解释与范围限定 |
| 完整实时系统 / ≈40 / 默认异步 8 张 GPU 跑 DiT、1 张跑 VAE；75% VAE pruning。论文描述 H / A 系列，但未逐行绑定精确 GPU 型号。 | 3.0 Tab. 1；3.0 §5.2.3；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉 INT8 / 27.38 | 3.0 Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉轻量 VAE / 25.79 | 3.0 Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉 GPU 检索 / 6.60 | 3.0 Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 的 SANA-WM 协议：分钟级 Simple / Hard 轨迹，在同一生成 rollout 中按近似相同的对齐 pose 配对远隔帧，计算 PSNR / SSIM / LPIPS；不是对真实未来帧重建。相机 R / T / CMC 另测。各方法分辨率、规模和 GPU 数不同，以下保留这些条件。 | 3.5 §4.2、Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Simple · Matrix-Game 3.0 / 5B / 8 / 12.29 / 0.326 / 0.553 / 12.96 | 3.5 Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Simple · SANA-WM + refiner / 2.6B+17B / 1 / 14.46 / 0.292 / 0.479 / 4.50 | 3.5 Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Simple · Matrix-Game 3.5 base / 5B / 1 / 14.56 / 0.439 / 0.439 / 1.63 | 3.5 Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Hard · Matrix-Game 3.0 / 5B / 8 / 12.17 / 0.317 / 0.556 / 18.79 | 3.5 Tab. 1；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Hard · SANA-WM + refiner / 2.6B+17B / 1 / 14.80 / 0.312 / 0.458 / 8.34 | 3.5 Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Hard · Matrix-Game 3.5 base / 5B / 1 / 14.14 / 0.414 / 0.474 / 2.70 | 3.5 Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 3.5 的 SSIM 与相机误差改善明显，但 Hard split 的 PSNR / LPIPS 并非最佳。作者解释像素指标会同时惩罚合法场景动态与记忆错误；该解释不能替代独立动态状态评测。首尾 imaging quality drop 为 Simple 3.24、Hard 2.40，测质量漂移而非召回率。 | 3.5 §4.2、Tab. 1；[3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |
| FPS 衡量计算吞吐量，持续输出主要检验漂移控制；长程记忆还要求窗口外的具体观察被写入、在回访时找到并被采用。3.0 的 FoV 检索与 3.5 的空间 patch 才提供这种证据路径，仍应将相机执行、静态再现、动态更新和动作延迟分别测量。 | 3.0 §3.2、§5.2；3.5 §4.2、§4.4；[3.0 v3](https://arxiv.org/html/2604.08995) · [3.5 v1](https://arxiv.org/html/2608.29910) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 把同一移动对象在不同时间的位置融合成静态观察，会产生重复对象、ghosting 和错误遮挡；运动一致性过滤排除这些候选，参考 prefix 则保存主体身份。固定外观不包含离屏期间的运动或动作后果，所以它不能独立替代动态状态转移。 | 3.5 §2.2.3、§6；[3.5 v1](https://arxiv.org/html/2608.29910) | ⚠ 作者报告 / 解释与范围限定 |

验证与交接：页面的架构图 / 统一符号 / 伪代码是明确标示的讲解表达，不是官方 API。check.py 仅报缺失兄弟页与待合并 SOURCES.md 的预期链接。浏览器 inventory 为空，未完成真实页面截图 QA；SVG 坐标、文字估宽、data-part / data-note 与 step 契约已检查。没有修改共享文件。

最终验证：check.py 没有错误或警告指向本页；track index 尚有待合并 SOURCES.md 链接错误。页脚采用页内参考锚点。

## 16 — 稀疏关键帧与故事 (`16-story-keyframes.html`) — 2507.18634 / 2512.07802 / 2512.19539

核读三文 arXiv v1 方法、结果和相关附录。Captain venue 使用 ICLR 官方 proceedings，OneStory venue 使用 CVF 官方 proceedings；未声称会议修订版正文的超参均等同 v1。StoryMem 代码锁定 commit 052c68d。所有分数为作者报告，没有独立复现。下表完整记录每个带来源段落 / 同协议结果行；解释、缺失配置和估算各自注明。

原始下载仅保存在 `vm/cache/job6-*`。

| Claim | Source | Status |
|---|---|---|
| Captain Cinema 作者 / 组织 / 首发日期 | [abs](https://arxiv.org/abs/2507.18634) citation authors；v1 2025-07-24；HTML 作者栏 JHU / ByteDance Seed / Stanford / CUHK | ✅ verified |
| Captain Cinema venue 为 ICLR 2026 | [ICLR official proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/86ab3ff2c1387c895766f5c5fc2b610c-Abstract-Conference.html) | ✅ verified；本文方法与数字仍按 arXiv v1 |
| OneStory 作者 / Meta AI与Copenhagen / 首发2025-12-08 / CVPR2026 | [abs](https://arxiv.org/abs/2512.07802) metadata；[CVF official proceedings](https://openaccess.thecvf.com/content/CVPR2026/html/An_OneStory_Coherent_Multi-Shot_Video_Generation_with_Adaptive_Memory_CVPR_2026_paper.html) | ✅ verified |
| StoryMem 作者 / NTU与ByteDance / 首发2025-12-22；venue未核实 | [abs](https://arxiv.org/abs/2512.19539) metadata与HTML作者栏 | ✅ metadata；❓ venue |
| Captain / OneStory 可对应本文训练配置的官方代码未核实 | [Captain project](https://thecinema.ai/)；[OneStory project](https://zhaochongan.github.io/projects/OneStory/)；未虚构仓库链接 | ❓ not verified |
| StoryMem 公开实现版本固定到 052c68d2627a22a95f79dbb4d3376cc30c96f1a3 | [official commit](https://github.com/Kevin-thu/StoryMem/tree/052c68d2627a22a95f79dbb4d3376cc30c96f1a3) | ✅ 仅阅读代码，未运行 |
| Captain 的 >93% consistency 文句未纳入页面 | Captain §4.1 与 Tab.2；rubric 聚合口径不清 | ⚠ 保留未采用；不把不清比例当事实 |
| 唯一叙事继承边 LCT→Captain；三篇合页论文之间不加继承边 | Captain §3.3、§4.1 明确采用；OneStory/StoryMem 方法与baseline未声明沿用对方权重 | ✅ 关系核查 |
| 故事镜头不按连续时间或固定相机排列：主角离场、插入别处镜头、再以新服装或视角返回。最后一帧可能没有要回忆的人物；完整视频历史又含大量冗余。因此关键不是保存最多相邻帧，而是保存可用于下一镜头的视觉证据，并区分哪些外观应保持、哪些事件状态应变化。 | OneStory §4.2；StoryMem §3.2、§3.4；[OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain Cinema 的偏离：planner 先按图文历史生成 \(\{I_i\}\)，GoldenMem 服务的是该关键帧阶段；之后 LCT 类视频生成器读取已生成的整套关键帧，含后续镜头锚。它不是一边播放视频一边只记住生成过去的单环系统。 | Captain §3.2–3.3、§4.1；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 的 prompt 通过生成器注意力选择 bank 中有用的上下文，不使用外部 Top-k 内容检索；OneStory 则显式用当前 caption 驱动可训练 selector。 | StoryMem §3.3–3.4；OneStory §4.2；[OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 默认从空记忆开始，首镜头由文本生成；MR2V 可以预写角色 / 场景参考。后者提供额外视觉身份信息，应和在线记住自生成历史的设定分别报告。 | StoryMem §3.2、§3.5；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 保存清晰且有语义变化的关键帧，早期 sink 与近期窗口构成有限活动 bank。OneStory 保存全部先前镜头 latent 候选，再压缩少量选中帧；Captain 的 bank 是 planner 已生成的图文关键帧。 | 三文方法节；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 每张记忆图独立编码，不做跨记忆帧时间压缩；负 temporal RoPE index 将它们和从零开始的当前 shot 分开。它编码“稀疏先前证据”，不是恢复真实镜头间时间。 | StoryMem §3.3；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| M2V 适配 Wan-I2V 的 condition / mask 通道，记忆沿时间维加到当前序列，用 LoRA 学会跨上下文读取；无新增外部检索网络。OneStory 用 selected context tokens 与当前 noise tokens joint attention。 | StoryMem §3.3；OneStory §4.3；[OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| writer 处理完整生成镜头的解码帧，而不是 denoising 中间的 noisy tokens。MI2V 可用上一镜头末帧衔接无 cut 镜头；它属于邻接连续性条件，仍需 bank 支持远程回忆。 | StoryMem §3.4–3.5；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| CLIP 变化筛选寻找有新语义的帧；HPSv3 排除模糊或低审美候选；再与已存关键帧比较以去重。清晰不等于事件状态正确，语义相似也不等于同一角色。 | StoryMem §3.4、§4.4；[StoryMem v1](https://arxiv.org/html/2512.19539) | ⚠ 作者报告 / 解释与范围限定 |
| 超额时保留最早 sink，淘汰最老 short-term memory。公开 pipeline 从磁盘关键帧文件选活动子集；这些文件并未因活动淘汰而删除，不能宣称所有存储常数。 | StoryMem §3.4；官方 pipeline.py；[StoryMem v1](https://arxiv.org/html/2512.19539)；[pipeline.py](https://github.com/Kevin-thu/StoryMem/blob/052c68d2627a22a95f79dbb4d3376cc30c96f1a3/pipeline.py) / [extract_keyframes.py](https://github.com/Kevin-thu/StoryMem/blob/052c68d2627a22a95f79dbb4d3376cc30c96f1a3/extract_keyframes.py) / README 同 commit | ⚠ 作者报告 / 解释与范围限定 |
| 语义选择和画质过滤共同构造候选；与历史去重。 | StoryMem §3.4；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 输入是详细 storyline / shot descriptions，可由人或外部语言模型提供；Captain 本身不自主构思故事。planner 从 FLUX.1-dev 出发处理交错图文：早期 double-stream blocks 的 block-diagonal mask 只在各 pair 内处理，后期 single-stream blocks 才聚合跨 pair 信息；训练可双向，生成可换因果掩码。 | Captain §3.2、§5；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 检索先比较当前文字与历史图文：论文比较 CLIP text-to-image 与 T5 text-to-text，前者的检索覆盖更好。GoldenMem 将历史图像逐级降采样，压缩活动视觉条件。语义召回和分辨率分配是不同操作，不应把它概括为“只留最近帧”。 | Captain §3.2、Fig. 5；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 论文以固定长宽比的几何缩放解释该常数因子；\(t_0\) 为当前全分辨率帧的 token 数，包含当前帧。它不约束全部原始关键帧、文本 token 或检索库的存储，也不保证低分辨率历史的小字和道具细节可恢复。 | Captain §3.2、Fig. 4；[Captain v1](https://arxiv.org/html/2507.18634) | ⚠ 作者报告 / 解释与范围限定 |
| 关键帧先生成完，再交给 Seaweed / LCT 类视频模型补每镜头运动。§3.3 的条件写成全部 \(I_{1:K}\)，所以合成镜头时已有后续视觉锚；两阶段分别训练，不能把完整系统的叙事一致性说成视频基模独立学会了在线远程记忆。LCT 的跨镜头注意力见 第 03 页。 | Captain §3.3、§4.1、§5；[Captain v1](https://arxiv.org/html/2507.18634) | ⚠ 作者报告 / 解释与范围限定 |
| OneStory 从所有此前镜头构造 latent memory。可学习 queries 先 cross-attend 当前 caption，再 attend 历史视觉 tokens；根据 query–memory interaction 得到帧级 relevance，选取非连续的 Top-k 历史帧。高分帧使用较小 kernel / 较细 patchifier，低分帧更强压缩，再把所有 context tokens 与当前 noise tokens 拼接。 | OneStory §4.2–4.3、Eq. 2–8；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 这改变了时间距离决定压缩率的假设：主角所在旧镜头可能比刚结束的插入镜头重要。selector 的候选 history 仍增长，且查询需访问历史表示；“一个 latent 帧等价的活动 context”不等于完整历史只有一帧。训练时的 DINOv2 / CLIP target-shot 相似度是伪标签监督，推理 selector 不获未来目标视觉。 | OneStory §4.2、§5.3、App. A.2；[OneStory v1](https://arxiv.org/html/2512.07802) | ⚠ 作者报告 / 解释与范围限定 |
| OneStory 不要求单独的全片 global script，以当前 shot caption 的指代关联历史；第一镜头可文本或文本加图初始化。它在 inference 图中维护 prior-shot memory，并未描述一个训练过的语义写入 / 全局淘汰模块。 | OneStory §3、§4.1、Fig. 3；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 从 Wan2.2-I2V 出发，记忆帧独立 VAE 编码，沿时间维加入 condition latent，再把 noisy latent、condition latent、binary mask 沿通道维拼接。memory 区域保持为已知条件，只输出当前 shot；读取 bank 中哪个人物由文本条件与注意力完成，没有显式 selector 的 Top-k 查询。 | StoryMem §3.3；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| \(m\) 是记忆帧数，\(F\) 是当前 shot latent 帧数，\(S\) 是固定负 RoPE 间隔；当前镜头位置仍从零开始。这些位置不是真实历史时间戳，也不能恢复关键帧间未保存的运动。 | StoryMem §3.3；[StoryMem v1](https://arxiv.org/html/2512.19539) | ⚠ 作者报告 / 解释与范围限定 |
| 每生成一镜头，先用 CLIP 比较与最新选中帧的语义变化，再用 HPSv3 审美过滤；与原 bank 去重后写入。早期 sink 不随窗口淘汰，余下保留近期合格帧。它把“写什么”放在 generation 之后，和 OneStory 在 read 时决定“哪些候选值得花 token”形成对照。 | StoryMem §3.4；[OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 全片文本 / 镜头描述 / Captain planner 与视频合成；StoryMem script；OneStory 当前 caption / 提供“应发生什么”的语义控制；不会自动提供后续画面或证明模型自主推断故事。 | 三文问题定义；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 自己已生成的过去 / Captain planner 的关键帧历史；OneStory prior shots；StoryMem keyframe bank / 检验读写闭环与生成错误传播，仍须看长 gap / 回归角色的协议。 | 三文推理流程；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 预给参考图像 / OneStory 首图可选；StoryMem MR2V；Captain 外域 identity 实验的外部照片 / 额外视觉信息；需与默认文本起始 / 自写记忆分别报告。 | OneStory §4.1；StoryMem §3.5；Captain App. E；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 未来视觉锚 / Captain 完成 planner 后的底层视频合成，条件为整套 keyframes / 视频模型执行已规划外观；不能等同仅用过去视频的在线因果记忆。 | Captain §3.3；[Captain v1](https://arxiv.org/html/2507.18634) | ⚠ 作者报告 / 解释与范围限定 |
| 存什么（内容与粒度） / planner 图文关键帧；活动视觉多尺度压缩。 / 此前镜头 VAE latent 帧的全局候选库。 / 生成镜头中的稀疏语义关键帧。 | §3.2；§4.2；§3.4；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 何时写（GT / generated、clean / noisy） / 训练真值电影图文，context 可加噪；推理 planner 生成 keyframe 后成为历史。 / 训练真值 prior shots；推理完成 shot 后进入候选历史，不保存未完成噪声。 / 训练从相关真值 clips 抽 memory；推理完整生成 shot 后选清晰帧。 | §3.1–3.2、§4.2；§4、Fig. 3；§3.3–3.4；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 如何寻址（内容 / 时间） / CLIP text–image / T5 text–text 语义召回。 / 当前 caption→learned queries→帧 relevance→Top-k。 / 无外部内容召回器；生成器注意力读有限 bank，写入按 CLIP 变化与去重。 | §3.2、Fig. 5；§4.2；§3.3–3.4；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 如何读（注意力 / 拼接） / GoldenMem planner 交错图文；合成阶段另读全部 keyframe anchors。 / importance-guided patchification，与当前 noise joint attention。 / latent 时间拼接、condition / mask 通道拼接、负 RoPE。 | §3.2–3.3；§4.3；§3.3；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 何时淘汰或覆盖 / 压缩约束活动条件；全文未给统一全库淘汰 / 事件覆写规则。 / Top-k 限活动读出；全文未给全部候选的容量淘汰规则。 / 保留 sink；满时逐出最老短期帧；不按实体状态显式覆盖。 | §3.4；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ⚠ 作者报告 / 解释与范围限定 |
| Captain 图文 pair / 图像 [LI,D] + 文本 [LT,D] / 局部 mask 处理 pair，后期跨 pair 聚合；视觉压缩不压成单个身份向量。 | Captain §3.2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| GoldenMem / Tvisual ≲1.62t₀（理想几何级数） / 包括当前帧；不含全文文本 / 原始库；压缩历史图像的细节会减少。 | Captain §3.2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| OneStory 候选历史 / [B,Fhist,Ns,Dv] / Eq. 2 保留每帧空间 tokens；Fhist 随 prior shots 增长。 | OneStory Eq. 2；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| OneStory 活动 context / [B,Nc,D]；默认 Nc≈n / 当前噪声对应 21 latent 帧；单帧等价预算是压缩后的多帧内容。 | OneStory §5.3、Tab. 2(c)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 条件 / memory [B,C,m,hℓ,wℓ]；current [B,C,F,hℓ,wℓ] / 各 memory 图独立编码；时间拼接后另叠 noisy / condition / mask 通道。 | StoryMem §3.3；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain：用电影提取的交错图文微调 planner，以逐步增加 context 长度和混合噪声训练适应长条件；视频模块另训 keyframe-conditioned synthesis。分开训练意味着没有视频后续损失贯穿 planner / GoldenMem 的端到端闭环。 | Captain §3.2–3.3、§4.2、§5；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| OneStory：训练预测 triplet 最后镜头；两镜头数据通过插入无关镜头或增强首镜头变成统一 triplet。warm-up 用真实历史均匀取帧，随后才依赖 selector。target-shot 的 DINOv2 / CLIP 相似度给相关度伪标签，训练读出是有监督的，而不是只让 generator 自发学检索。 | OneStory §4.4、App. A；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem：训练从语义相关 clips 抽记忆帧、重建 target clip，用 LoRA 学 M2V 条件生成；CLIP / HPS 选帧是推理中的确定性程序，不是通过跨镜头梯度学到的 writer，也未报告训练时完全 self-generated memory rollout。 | StoryMem §3.3–3.4、§4.1；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 官方实现把选帧文件留在输出目录，再在下一次读取前选活动 bank；上面的 keep_sink_and_recent_for_next_read 表示活动截断，不承诺删除全部历史文件。 | 官方 pipeline.py、extract_keyframes.py，commit 052c68d；[StoryMem v1](https://arxiv.org/html/2512.19539)；[pipeline.py](https://github.com/Kevin-thu/StoryMem/blob/052c68d2627a22a95f79dbb4d3376cc30c96f1a3/pipeline.py) / [extract_keyframes.py](https://github.com/Kevin-thu/StoryMem/blob/052c68d2627a22a95f79dbb4d3376cc30c96f1a3/extract_keyframes.py) / README 同 commit | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain / FLUX.1-dev planner；Seaweed-3B / LCT 合成；keyframe 400×800。 / 逐级 context 8 / 16 / 32 pairs；GoldenMem stress test 延长到 48 pairs。 | §3.2、§4、App. A；§3.2、Tab. 2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| OneStory / Wan2.1 I2V；480×832；约 60K multi-shot videos。 / 默认活动 context 为 1 latent 帧等价；候选为全部 prior shots。 | §3、§5.1；§4.2、§5.3；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem / Wan2.2-I2V-A14B；rank-128 LoRA，约 0.7B active 新参数；400K 五秒训练 clips。 / 训练 memory 1–10 帧；S=5；推理 sink=3、每 shot ≤3 keyframes、初始 CLIP 阈值 0.9、HPS 阈值 3.0。 | §4.1；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 每设定生成 20 clips；Gemini 2.5 Flash 按 0–5 rubric 判断角色 / 场景 / 叙事等，另报 VBench2 Identity。它测关键帧序列的一致性，不是 online leave-return 的实体状态成功率。 | Captain §4.1、Tab. 2、App. D；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| LCT / 24 / 3.1 / 0.7 / 0.6 / 0.14 | Captain Tab. 2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain 无 GoldenMem / 32 / 4.5 / 3.8 / 3.4 / 0.37 | Captain Tab. 2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain + GoldenMem / 32 / 4.6 / 3.5 / 3.5 / 0.35 | Captain Tab. 2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| Captain + GoldenMem / 48 / 4.5 / 3.0 / 3.3 / 0.31 | Captain Tab. 2；[Captain v1](https://arxiv.org/html/2507.18634) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 同 context 的 GoldenMem 压缩并非每项都提高：scene / identity 略降。Tab. 3 的 32-pair 消融将估计计算量从 55 降到 35 PFLOPS，Visual Consistency 为 4.3→4.2；48-pair 全分辨率为 OOM，压缩版可运行。计算量由 token×steps×FLOP/token 估计，不能读成实测延迟或固定 GPU 内存。 | Captain Tab. 3；[Captain v1](https://arxiv.org/html/2507.18634) | ⚠ 作者报告 / 解释与范围限定 |
| 作者的 benchmark 包含文本 / 首图条件各 64 个六镜头 cases；指标将标注同一角色的 YOLO person 区域及同一环境的背景区域做 DINOv2 相似度，ViCLIP 另测 prompt alignment。下表是同一 latent 帧等价 context 预算的设计消融。 | OneStory §5.2–5.3、App. B、Tab. 2(a)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 仅上一镜头末帧 / 0.5153 / 0.5112 / 0.1814 | OneStory Tab. 2(a)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 仅 Adaptive Conditioner / 0.5465 / 0.5597 / 0.2172 | OneStory Tab. 2(a)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 仅 Frame Selection / 0.5526 / 0.5710 / 0.2238 | OneStory Tab. 2(a)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| OneStory：两者结合 / 0.5874 / 0.5752 / 0.2389 | OneStory Tab. 2(a)；[OneStory v1](https://arxiv.org/html/2512.07802) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 增大活动 context 从 1 到 3 帧等价，Character 为 0.5874→0.5926，Environment 为 0.5752→0.5863；这支持相关内容预算的收益，不证明全部候选历史的保存 / 查询成本不增长。 | OneStory Tab. 2(c)、§4.2；[OneStory v1](https://arxiv.org/html/2512.07802) | ⚠ 作者报告 / 解释与范围限定 |
| ST-Bench 为 30 个故事、每故事 8–12 shots、共 300 prompts；论文解释主结果使用含平滑连接的 MI2V setting。Cross-shot Overall 是全部 shot-pair 的 ViCLIP cosine 平均；Top-10 先按文本 prompt 特征挑相关 pairs，再平均视频相似度。它会受场景相似性影响，不能直接命名为角色身份准确率。 | StoryMem §4.1–4.3、Tab. 1；[StoryMem v1](https://arxiv.org/html/2512.19539) | ⚠ 作者报告 / 解释与范围限定 |
| StoryDiffusion + Wan2.2-I2V / 0.4600 / 0.4732 / keyframe + I2V 两阶段 | StoryMem Tab. 1；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| HoloCine / 0.4628 / 0.5005 / joint multi-shot baseline | StoryMem Tab. 1；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉 semantic selection / 0.4878 / 0.5287 / 仅取首帧可能漏记中途新角色 | StoryMem Tab. 2；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉 aesthetic filtering / 0.4844 / 0.5330 / 低质量候选影响后续条件 | StoryMem Tab. 2；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 去掉 memory sink / 0.4891 / 0.5241 / 全窗口滚动淘汰早期锚 | StoryMem Tab. 2；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| StoryMem 完整系统 / 0.5065 / 0.5337 / 有限 keyframe bank + 在线更新 | StoryMem Tab. 1–2；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 作者报告对 HoloCine 的 Overall 相对提升 9.4%，分母是该 embedding 分数，不是 9.4 个百分点的真实记忆成功率。复杂多角色会让纯视觉 bank 歧义，论文 Fig. 7 展示失败并说明 prompt 中明确人物细节可缓解；合法状态变化是否覆盖旧参考仍需专门评测。 | StoryMem §4.3、§5、Fig. 7；[StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 记忆所在模块、可用信息和评测对象不同。Captain 的 planner 记关键帧，视频合成已有全套视觉锚；OneStory 从全部生成过去中选择和压缩内容；StoryMem 每 shot 更新有限关键帧 bank。其 evaluator 分别测关键帧 rubric / Identity、人物背景 DINOv2、shot-pair ViCLIP，分数不是同一能力尺度。 | Captain §3–4；OneStory §4–5；StoryMem §3–4；[Captain v1](https://arxiv.org/html/2507.18634) · [OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |
| 首帧可能没有中途进入的人物、后来拿起的道具或变化后的服装。OneStory 可从完整 prior-shot 候选选择相关帧；StoryMem 的语义变化筛选把新内容写入，避免只记镜头起点。但相似度筛选、审美过滤和有限 bank 都不显式表示实体状态或保证覆盖旧事实。 | OneStory §4.2、§5.3；StoryMem §3.4、§4.4；[OneStory v1](https://arxiv.org/html/2512.07802) · [StoryMem v1](https://arxiv.org/html/2512.19539) | ✅ 论文 / 指定代码已核实；结果为作者报告 |

验证与交接：页面的架构图 / 统一符号 / 伪代码是明确标示的讲解表达，不是官方 API。check.py 仅报缺失兄弟页与待合并 SOURCES.md 的预期链接。浏览器 inventory 为空，未完成真实页面截图 QA；SVG 坐标、文字估宽、data-part / data-note 与 step 契约已检查。没有修改共享文件。

最终验证：check.py 没有错误或警告指向本页；track index 尚有待合并 SOURCES.md 链接错误。页脚采用页内参考锚点。

## 17 — IAMFlow 与 SlotMem (`17-entity-slots.html`) — 2605.18733 / 2607.15772

阅读范围：IAMFlow **v1** 全文、App. A/B/C/E/H；SlotMem **v2** 全文、App. A/B/C/E；EntityBench **v1** §3–4 / App. B.4/C。2026-10-13 下载原文缓存于 `cache/job7-<arxiv>-html.html` / `.txt`，元数据另有 `-abs.html`。论文数值均为作者报告，未运行模型或复现分数。

| Claim | Source | Status |
|---|---|---|
| IAMFlow 首版 2026-05-18；题名、8 位作者与组织栏 | [abs](https://arxiv.org/abs/2605.18733)；[v1 首页](https://arxiv.org/html/2605.18733v1) | ✅ verified；venue 未核验，registry 留空 |
| SlotMem 首版 2026-07-17；页面机制与结果取 v2（2026-08-22）；作者为 Yilai Liu / Xin Zhang / Shiyuan Zhang / Hongyang Du，HKU / Tsinghua | [abs](https://arxiv.org/abs/2607.15772)；[v2 首页](https://arxiv.org/html/2607.15772v2) | ✅ verified；byline 与 citation_author 一致；摘要自动作者计数提示不可替代名单 |
| IAMFlow 复用 MemFlow 权重，无附加训练；LLM 分配持久人物 ID，实际注入整帧 per-layer KV | IAMFlow v1 §3.1 / §4；App. A runtime state | ✅ verified；ID 是外部索引，不是 learned DiT slot |
| 人物 registry 存 canonical name、aliases、merged attributes、prompt instances；novelty marker 创建新 ID；首 chunk VLM 校正属性 | IAMFlow App. A / C | ✅ verified |
| 每 chunk 归档代表帧；未滚动时选 clean-context cache，滚动后选 evicted chunk；保存 frame / IDs / score / KV | IAMFlow App. A Algorithm 1，line 10–19；Frame archival | ✅ verified；不是仅 eviction 才写入 |
| entity score 为加权 text K 与平均 visual K 匹配；chunk 内 min–max 归一化后与 VLM 融合；λ=0.3 | IAMFlow §3.1 Eq. 5；App. A Frame archival | ✅ verified；实现单层轻量评分，未声称精确检测 |
| greedy 检索优先新增覆盖 ID 数目，entity score 打破平局；预算剩余后高分补齐；选帧 KV 按时间拼接 | IAMFlow App. A Dynamic retrieval | ✅ verified；与正文“highest score”概括区别按附录实现描述保留 |
| sink 3 / 活动 memory 2–4 / local 9 latent frames；chunk 3 latent frames；档案仍增长 | IAMFlow §4 Implementation Details；App. A/B；§3.1 growing frame archive | ✅ verified；活动帧数不含全档案 |
| Qwen3-4B-Instruct 与 Qwen3-VL-2B-Instruct；APT 在 text cross-attention K/V 插值；TinyVAE / FP8 / async 属部署路径 | IAMFlow §3.2 / §4 / App. B | ✅ verified；本页未将吞吐增益单归记忆 |
| NarraStream-Bench：324 scripts / 60 s / 6 segments，832×480；主分乘100 | IAMFlow §3.3 / §4，Tab. 2 caption | ✅ verified |
| LongLive CLC / BS / Overall = 89.97 / 49.19 / 73.17；MemFlow = 89.71 / 47.06 / 72.88；IAMFlow = 91.25 / 65.03 / 75.73 | IAMFlow Tab. 2 | ✅ verified；同原论文多 prompt 60 s 协议 |
| CLC 以 prompt occurrence groups 与首现 DINO anchor 衡量再现相似；planner / uniform 权重聚合；无 valid group 样本排除 | IAMFlow App. E Conditional Long-range Consistency | ✅ verified；需联报可评覆盖，未补造覆盖率 |
| VLM metric 另含抽样指令、顺序与状态检查；CLC 本身不能独证故事状态 | IAMFlow App. E VLM Alignment / CLC | ✅ verified；区分指标边界与“整篇无状态评测” |
| SlotMem probe 平均 character-name cross-attention、减其他角色响应、top-p / continuity filter；无 external detector / mask labels | SlotMem §3.1 Eq. 2–5 | ✅ verified；语义定位不是完美实例分割保证 |
| source chunk 在目标相同去噪阶段取 noisy 特征；Encoder 输出每角色每层 R×d slots；时间调制 | SlotMem §3.2.1 Eq. 8–11 | ✅ verified |
| Writer 使用旧slot对新slot attention；cosine > threshold × sigmoid gate；门控残差；缺席角色不更新 | SlotMem §3.2.2 Eq. 12–15 | ✅ verified；页面 γ_prec 重命名阈值，避免 τ 与去噪时间混淆 |
| 注入使用前一步 mask、当前阶段对应的历史slots；每chunk首步没有mask则跳过 | SlotMem §3.3 Eq. 16–19；App. A Algorithm 1 L20–26 | ✅ verified |
| 去噪过程中 U^k ← U^k ∪ V_s；chunk decode 后才插入 bank / Writer 更新；末步无额外 probing forward | SlotMem §3.5；App. A Algorithm 1 L5–15 | ✅ verified；未自行指定跨τ求均值 / 去重规则 |
| Stage1 = diffusion loss + slot prototype contrastive loss，λ_slot=0.02；Stage2训练update chunk / Writer | SlotMem §3.4 Eq. 20–21；App. B Additional Training Details | ✅ verified；具体Stage2冻结集合见下一行 |
| v2 §3.4 同段先称 Encoder / injection frozen，再称 fine-tune first-stage modules / DiT | SlotMem §3.4 | ❓ not verified：互相冲突的文字已放 code-note，尚未对照代码裁定 |
| Wan2.2-I2V-A14B；冻结预训练骨干，rank-128 LoRA；81帧chunk / 24FPS / overlap 5帧 | SlotMem §4.1.2 | ✅ verified |
| Probe / injection layers 0–15；top-p=0.1；仅记录符号R，不把8 heads误写为8 slots | SlotMem App. B Additional Training Details | ✅ verified；R具体数值 ❓ not verified |
| 新视频源 60 个测试样本；VLM-based metrics 用 GPT-4.1；主对照统一 Wan2.2-I2V，IAMFlow 由 Wan2.1-T2V 适配 | SlotMem App. B Evaluation / Baselines；§4.1.3；Tab. 1 caption | ✅ verified；不能与 IAMFlow 原主表拼接比较 |
| Wan2.2：CharSim / CLC / DT = .7701 / .7239 / .4550；StoryMem = .7592 / .6165 / .5235；IAMFlow = .8446 / .7313 / .5533；SlotMem = .8603 / .8363 / .4723 | SlotMem v2 Tab. 1 | ✅ verified；页内保持指标跨benchmark来源标签 |
| CharSim 消融：w/o Encoder .7852，w/o Writer .7965，Full .8603；无Encoder同时去Writer | SlotMem Tab. 2 / §4.3 | ✅ verified；是耦合消融，非纯Encoder因果贡献 |
| DT 检查 prompt 对应的动态变化轨迹，身份分不等于 DT | IAMFlow App. E Dynamic Trajectory；SlotMem Tab. 1 | ✅ verified；没有将DT自动等同完整事件终态 |
| 错caption / 相似角色可混probe区域；“保守writer拒绝合法换装”未实测 | SlotMem App. C / E；§3.2.2 | ✅ verified：前者；⚠ inferred hypothesis：后者，正文明确待测 |
| IAMFlow复杂动态动作失败，不能单靠架构归因 | IAMFlow App. H / Fig. 7 | ✅ verified：作者失败例；机制归因未确定 |
| EntityMem 为 EntityBench 2605.15199 同篇 §4 baseline/system，生成前创建 / 选择 / verify per-entity references | [EntityBench v1 §4 / App. C](https://arxiv.org/html/2605.15199v1) | ✅ verified；非独立方法论文 |
| EntityBench canonical crop + DINOv2 centroid / type-specific LLM；location full-frame；fidelity-gate-corrected aggregation计coverage | EntityBench §3.2 / App. B.4 | ✅ verified；不同metric gate细则不强行统一 |
| IAMFlow per-frame KV [L_D,P,n_h,d_h]；SlotMem [n_e,d]→[R,d]、读取map [n_e,R]；角色数增长总量另计 | IAMFlow App. A；SlotMem Eq. 8–19 | ⚠ inferred：按数据流重写形状与预算，不是显存实测 |
| 默认 R / writer阈值 / 跨去噪阶段驻留 / 源latent另存布局 | 尚未逐项核官方代码 | ❓ not verified；页面明确保留 |
| IAMFlow 与 SlotMem 官方 repo链接；未验证代码与论文逐行一致 | [IAMFlow](https://github.com/Eddie0521/IAMFlow)；[SlotMem](https://github.com/YilaiLiu-HKU/SlotMem) | ✅ verified：官方链接；复现 ❓ not verified |

交接：只写本页与 `17-registry.json` / 本来源表，不改共享 SOURCES、registry、CSS、JS。SlotMem论文算法的bank更新时序经只读证据核查修正为chunk结束提交；全部生成模型结果仅转述论文。

交付检查：`python scripts/check.py` 已运行，本页零错误；全仓剩余18个错误均为其它页 / track index 指向尚未合并的 SOURCES.md。两页88个公式均通过 pinned KaTeX 0.16.11 解析；本页8个data-part / 7个walkthrough step逐一匹配notes；SVG矩形、文字坐标与宽度估算无越界 / 文本框溢出。浏览器工具返回无可用浏览器，未完成浏览器截图视觉检查。共享registry的placeholder尚未由本job合并。

## 18 — ShotStream 与 CausalCine (`18-shotstream.html`) — 2603.25746 / 2605.12496

阅读范围：ShotStream **v1** 全文、Supp. §7–9；CausalCine **v1** 全文、App. B/C/D；官方项目 / ShotStream README。2026-10-13 下载的原文位于 `cache/job7-<arxiv>-html.html` / `.txt` 与 `-abs.html`。未运行模型、未独立复测吞吐。

| Claim | Source | Status |
|---|---|---|
| ShotStream首版2026-03-26，题名/作者；组织 Kuaishou / MMLab CUHK / CPII | [abs](https://arxiv.org/abs/2603.25746)；[v1首页](https://arxiv.org/html/2603.25746v1)；[官方项目](https://luo0207.github.io/ShotStream/) | ✅ verified |
| ShotStream ECCV2026 | 官方项目首页；[官方仓库 README Updates：2026-06-18 accepted](https://github.com/KlingAIResearch/ShotStream) | ✅ verified；官方primary声明，未另查proceedings |
| CausalCine首版2026-05-12；作者与HKUST / Ant Group / SJTU | [abs](https://arxiv.org/abs/2605.12496)；[v1首页](https://arxiv.org/html/2605.12496v1)；[官方项目](https://yihao-meng.github.io/CausalCine/) | ✅ verified |
| CausalCine NeurIPS2026；项目未给Code链接 | [官方项目首页](https://yihao-meng.github.io/CausalCine/) | ✅ verified：官方venue标注；公开代码 ❓ not verified，未猜URL |
| ShotStream global=稀疏历史镜头KV，local=当前镜头生成KV；shot boundary global重采更新/local重置 | ShotStream §4.2 / Supp. §9 Stage2 / Fig. 4 | ✅ verified |
| 动态条件采样 floor(f_context/S_hist)给各shot，余数给最近；f_context=6 | ShotStream §4.1 | ✅ verified；未为历史shot数超过预算时补造采样细则 |
| 条件帧 / 目标按时间token拼接；条件clean，目标加噪；历史条件保留自身shot caption与global caption | ShotStream §4.1 / Fig. 3 | ✅ verified |
| [B,f_context,P,d] + [B,f,P,d] → [B,f_context+f,P,d] | ShotStream §4.1 | ✅ verified：按论文记号B/P重命名 |
| temporal rotation Θ_(u,s)=φu+sθ 区分跨shot缓存；与检索后重寻址不同 | ShotStream §4.2 | ✅ verified；标量表达是论文原式重命名 |
| teacher only 3D self-attention tuning；ODE初始化；4-step causal student | ShotStream §4.1–4.2、Supp. §9 | ✅ verified |
| Intra-shot self-forcing: GT global + self-generated local；Inter-shot:两者self-generated，DMD只作用新shot | ShotStream §4.2 / Fig. 4 / Supp. §9 | ✅ verified |
| ShotStream Wan2.1-T2V-1.3B，832×480；chunk3 latent frames，global2/local7 chunks；320K训练视频 | ShotStream §5.1 / Supp. §9 | ✅ verified；缓存是活动KV，不是全部源history |
| ShotStream 15.95 FPS single H200 | ShotStream Tab. 1、§5 quantitative efficiency | ✅ verified：作者报告；非独立复测 |
| ShotStream100 test prompts；TransNetV2分shot，跨shotYOLOv11/SAM crop再DINOv2；语义ViCLIP | ShotStream §5.1 Evaluation Set/Metrics | ✅ verified；主结果不是事件终态指标 |
| LongLive inter Subject/Bg/Semantic .594/.565/.722；Full ShotStream .654/.645/.762 | ShotStream Tab. 1 | ✅ verified；自身协议 |
| w/o indicator .507/.465/.728；Stage1Only .604/.622/.758；Full .654/.645/.762 | ShotStream Tab. 4 | ✅ verified；表中先Semantic后Subject/Bg，页内明确重排列 |
| 官方代码是reference implementation，internal data / demo prompt distribution gap | [ShotStream官方 README](https://github.com/KlingAIResearch/ShotStream) | ✅ verified；没有声称复现完成 |
| CausalCine每层mean K描述符 / mean current-chunk Q，跨头dot，窗外top-k；chunk内部共享route | CausalCine §3.3 Eq. 6–8 | ✅ verified；parameter-free/non-differentiable top-k依赖learned Q/K |
| W=3 chunks、k=5 frames、L=3 latent frames；读取memory+local+current | CausalCine §3.2–3.3 | ✅ verified |
| 存unrotated K；读取后Block-Relative RoPE紧凑重排；跨度5+4×3=17，training envelope61 | CausalCine §3.3 Eq. 9 | ✅ verified；修地址不等于恢复已删内容 |
| 历史KV [F,P,n_h,d_h] / descriptors [F,n_h,d_h]随F增加；top-k只限制活动attention，候选打分另计 | CausalCine §3.3 Eq. 6–9 | ✅ verified：对象定义；⚠ inferred：总存储/计算随F分析 |
| TF用clean/noisy 2N packing，noisy仅可读前序clean；text按shot隔离；loss FM=(v−(ε−x))² | CausalCine §3.1–3.2 Eq. 1/4/5 | ✅ verified；页面τ表示flow时间，t表示视频时间 |
| full-step causal tuning → causal ODE init → self-forced DMD + auxiliaryGAN，same memory routing；无独立检索标签 | CausalCine §3.2–3.4 Eq. 10–11 | ✅ verified：流程；⚠ inferred：训练目标边界 |
| CausalCine Wan2.1-T2V-14B，832×480，100K videos，4steps，chunk3；16FPS/8H200 | CausalCine §4 / App. D；官方项目 | ✅ verified：作者报告；不能与ShotStream单卡等成本比较 |
| AR主比较同prompts/分辨率/长度；100 prompts（global +5shot captions），Tab.1不含Inter-shot列 | CausalCine §4 / Tab. 1 | ✅ verified；没有擅自补主表时长 |
| AR主表 MemFlow Text/Subject/Bg/SCA=.1587/.9293/.9483/.5092；ShotStream=.1753/.9617/.9670/.9647；CausalCine=.1980/.9717/.9675/.9732 | CausalCine Tab. 1 | ✅ verified；此处Subject/Bg是镜头内 |
| 双向模型比较另用15秒设定，不与AR表拼接 | CausalCine §4 / Tab. 2 | ✅ verified |
| Memory消融另设100个disappear/reappear prompts | CausalCine §4.1 Ablation on Memory Design | ✅ verified；专用set不是AR主比较set |
| No-memory Inter/Text/SCA=.5832/.2181/.9772；sink=.6106/.2285/.9618；routing=.7530/.2394/.9745 | CausalCine Tab. 3，Memory组 | ✅ verified；没有混用主框架.6529跨镜头分 |
| 咖啡制作跨cut的奶流/壶/手/泡沫变化不是连续物理过程；无显式细物体/接触/交互结构state | CausalCine App. D / Fig. S3 | ✅ verified：具体失败例；不扩成所有叙事失败 |
| ShotStream→CausalCine为直接AR baseline关系，未声称继承权重；Self Forcing→ShotStream为训练范式继承 | CausalCine §4 / Tab. 1；ShotStream §3.2 / §4.2 | ✅ verified |
| archive设备迁移、淘汰、总GB，以及ShotStream全部源frame驻留协议 | 本次未逐行代码核查 | ❓ not verified；页面保留提示，未宣称全系统常量存储 |

交接：`18-registry.json` 为主节点与合页锚点的独立元数据。官方venue比候选表更新；请lead合并时保留来源等级。当前检查器若报本页到 `05-streaming-kv.html` 的broken link，是并行job尚未交付导致的预期悬空，不应删掉授权链接。

最终检查更新：其它job已写入05页，`python scripts/check.py` 不再报本页任何错误；全仓剩余18项均为待合并的 SOURCES.md 链接。两页88个公式通过 pinned KaTeX 0.16.11 解析，本页8个data-part / 7步notes契约与SVG文字宽度估算通过。无可用浏览器会话，未完成截图视觉检查。未改其它job文件或共享registry/CSS/JS/checker。
