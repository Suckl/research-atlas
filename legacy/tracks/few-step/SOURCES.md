# Sources — Few-step generation track

Where the numbers and claims on this track's pages come from. "Paper" = the arXiv version listed in
`registry.js`; "Code" = the official repository at its default branch (checked 2026-10-13).

Legend: ✅ verified against the source · ⚠ secondary source, vendor spec, or inferred · ❓ not verified

## 01 — 少步生成基础 (`01-foundations.html`) — 2006.11239 / 2010.02502 / 2011.13456 / 2206.00364 / 2210.02747 / 2207.12598

| Claim | Source | Status |
|---|---|---|
| DDPM 噪声回归及与 score 的联系；网络学习局部去噪方向 | [DDPM §3.2、Eq. (11)](https://arxiv.org/abs/2006.11239)；[Score SDE §3](https://arxiv.org/abs/2011.13456) | ✅ |
| DDIM η=0 给出确定噪声—端点采样映射 | [DDIM §4、Eq. (12)](https://arxiv.org/abs/2010.02502) | ✅ |
| PF ODE `dx/dt = a − b² score / 2` 与 SDE 共享时间边缘分布，不共享逐样本随机路径 | [Score SDE §4.3、Eq. (13)](https://arxiv.org/abs/2011.13456) | ✅ |
| 线性路径写为 `x_t=(1−t)x_0+t ε`，条件速度 `ε−x_0`，生成从 t=1 到 t=0 | [Flow Matching §3–4](https://arxiv.org/abs/2210.02747)；[Rectified Flow §2.1–2.2](https://arxiv.org/abs/2209.03003)；按 track 约定反向改写 | ⚠ 记号重写 |
| 条件直线的边缘最优速度为条件期望；实际 ODE 轨迹未必直 | [Flow Matching §3–4](https://arxiv.org/abs/2210.02747)；[Rectified Flow Eq. (2)、§2.2](https://arxiv.org/abs/2209.03003) | ✅ |
| 曲率影响截断误差，少步直接减采样网格不同于训练大跳跃映射 | [EDM §3、Fig. 3](https://arxiv.org/abs/2206.00364) | ✅ |
| Heun 预测 / 校正分别需速度评价，末端可退回 Euler | [EDM Alg. 1](https://arxiv.org/abs/2206.00364) | ✅ |
| 普通 CFG 条件 / 无条件两分支；合 batch 不消除两份样本计算量 | [CFG §3、Alg. 1](https://arxiv.org/abs/2207.12598)；合 batch 的算量解释是计算图推导 | ✅ / ⚠ 推导 |
| 统一 CFG `uncond+w(cond−uncond)` 与原文 `(1+ω)cond−ω uncond` 的系数关系 w=1+ω | [CFG Alg. 1](https://arxiv.org/abs/2207.12598)；代数重写 | ⚠ 推导 |
| 二维组件数据为八个等权环形高斯；解析后验提供精确速度场 | `assets/js/widgets/fewstep2d.js` 文件头、`K=8`、`MU`、`post`、`vel` | ✅ 官方本仓库组件 |
| 演示参考轨迹采用 48 步 Euler，回归页 `odeMap` 也是该近似；没有神经网络训练 | 同文件 `euler`、`odeMap`、`draw`；并非精确 ODE 解 | ✅ 官方本仓库组件 |
| 组件单步恰好输出原点只适用于独立配对、对称 GMM 的特例 | 同文件 `post`、`vel`、`draw`；结合条件期望恒等式 | ✅ / ⚠ 数学解释 |
| 轨迹回归用教师端点或局部 ODE；CM CD 用局部邻居、CT 可直接数据训练 | [PD §3](https://arxiv.org/abs/2202.00512)；[CM §4–5](https://arxiv.org/abs/2303.01469) | ✅ |
| sCM 直接数据与自身目标；MeanFlow 用区间平均速度 / 自身导数目标，不必在线 score 教师 | [sCM §3](https://arxiv.org/abs/2410.11081)；[MeanFlow §4](https://arxiv.org/abs/2505.13447) | ✅ |
| DMD/VSD 的带噪反向 KL 监督涉及 real 与 fake score；原 DMD 还带端点回归 | [DMD §3](https://arxiv.org/abs/2311.18828)；[VSD §3](https://arxiv.org/abs/2305.16213) | ✅ |
| DMD2 去除端点回归的具体改进，ADD / APT 的混合或对抗后训练 | 本 track `06-dmd2.html`、`04-adversarial-distillation.html`、`10-apt.html`；本页仅概念分类，没有借用新结果数值 | ⚠ 引用对应专页 |
| Drifting 特征空间场、RDM MMD / 固定参考；编码器冻结仍需生成侧输入梯度 | [Drifting §3、§3.4](https://arxiv.org/abs/2602.04770)；[RDM §3、§4.2](https://arxiv.org/abs/2607.02375) | ✅ |
| Drifting 归一化场与原始 MMD 梯度不能直接等同；共享核吸引 / 排斥直觉 | Drifting §3.3 Eq. (11)；RDM §3.1；本页文字刻意区分 | ✅ |
| 平方回归最优输出为条件期望；独立配对变成条件均值，确定 ODE 配对理论上可保留模式 | 条件期望的平方损失恒等式（推导）；[PD §3](https://arxiv.org/abs/2202.00512)；RF §2.2 | ⚠ 数学推导，论文解释支持 |
| 反向 / 正向 KL 分别有 mode-seeking / mode-covering 倾向，理想可表达最优解都是 q=p | [DMD §3](https://arxiv.org/abs/2311.18828) 确认方向；性质按 KL 定义推导，未宣称必然坍塌 | ⚠ 推导 |
| 图像 `[B,C,H,W]`、视频 `[B,C,F,H,W]`、完整轨迹 `[B,N+1,C,F,H,W]`、注意力 L×L 与存储增长 | 按计算图与张量元素数推导；局部 CD 不需完整轨迹由 CM §4 支持 | ⚠ 符号级推导，不是实测显存 |
| FID 使用 Inception 特征均值 / 协方差 Fréchet 距离，公式平方均值差加协方差迹 | [FID 原始论文 Eq. (6)](https://arxiv.org/abs/1706.08500) | ✅ |
| CLIPScore 使用图像 / 文本嵌入余弦与缩放；不同编码器和缩放不可直接比较 | [CLIPScore §3](https://arxiv.org/abs/2104.08718)；对跨协议比较的结论为推断 | ✅ / ⚠ 推断 |
| GenEval 用检测器与属性评估组合条件遵循，复杂组合比单项相似度更细 | [GenEval §3、Tab. 1](https://arxiv.org/abs/2310.11513) | ✅ |
| VBench 视频质量与语义维度；总分是归一化分项后 quality:semantic=4:1 | [VBench §3](https://arxiv.org/abs/2311.17982)；[scripts/cal_final_score.py](https://github.com/Vchitect/VBench/blob/master/scripts/cal_final_score.py) 的 `get_quality_score/get_semantic_score/get_final_score`；[scripts/constant.py](https://github.com/Vchitect/VBench/blob/master/scripts/constant.py) 的 `QUALITY_WEIGHT=4`、`SEMANTIC_WEIGHT=1`；2026-10-13 核对 | ✅ |
| 学生可能在特定指标超过基座：RDM 将 FLUX.2 [klein] 4 步→1 步，GenEval 0.794→0.826 | [RDM Tab. 2](https://arxiv.org/abs/2607.02375) | ✅ |
| 指标更高不能推广为所有条件、覆盖与人类偏好更优 | 基于监督资源、评估器盲区与协议差异的研究判断，本页明确限制结论 | ⚠ 推断 |
| 因果视频训练真实历史、部署生成历史引起 exposure bias；rollout 与首帧延迟不同于总采样速度 | [Self Forcing §1、§3](https://arxiv.org/abs/2506.08009) | ✅ |
| 未来噪声依赖导致因果学生回归条件不完整 | 本 track `14-causal-forcing.html`，本页为阅读预告而非独立复现实验 | ⚠ 引用专页 |
| 概念节点日期 2020-10；背景里 DDPM 2020-06、Score SDE 2020-11、EDM 2022-06、CFG 2022-07、Flow Matching 2022-10 | 对应 arXiv 首版 submission history；概念日期按任务指定、DDIM 首版月份 | ✅ 元数据 / 指定日期 |

此页没有新增实测性能值；符号推导、教学组件与论文测量已分开标注。

## 02 — 轨迹蒸馏：PD、Rectified Flow 与 InstaFlow (`02-trajectory-distillation.html`) — 2101.02388 / 2202.00512 / 2210.03142 / 2209.03003 / 2309.06380

| Claim | Source | Status |
|---|---|---|
| Denoising Student 为本线早期单步 DDIM / ODE 映射蒸馏，固定同一初始噪声回归教师端点 | [Denoising Student §3、Eq. (11)](https://arxiv.org/abs/2101.02388) | ✅ |
| 预生成 1.024 million 合成配对；CIFAR-10 与 CelebA 教师 100 步 DDIM，LSUN 50 步 | Denoising Student §3.1、§4 | ✅ |
| 完整端点配对成本随教师采样步数线性增长；PD 每个更新只需两次局部教师评价 | [PD §3、§6](https://arxiv.org/abs/2202.00512)；Denoising Student §3.1 | ✅ |
| PD 一步匹配教师两步，训练后学生成为下一轮冻结教师，每轮采样步数减半 | PD Fig. 1、Alg. 2 | ✅ |
| 教师步长为学生一半：t′=t−h/2、s=t−h；中点重新评价教师 | PD Alg. 2 | ✅ |
| DDIM 更新与反解标签 `x̃₀=(x_s−(σ_s/σ_t)x_t)/(α_s−(σ_s/σ_t)α_t)` | PD Eq. (7)、App. G | ✅ |
| PD VP 约定 `α²+σ²=1`；cosine α=cos(πt/2)，σ=sin(πt/2) | PD §4 | ✅ |
| v=α ε−σ x₀；x̂₀=αx_t−σv̂、ε̂=σx_t+αv̂；接近纯噪声时避免除以 α | PD §4、App. D | ✅ |
| PD 的 VP v 与线性 Flow Matching 的 ε−x₀ 不是相同参数化 | PD App. D；[RF §2.1](https://arxiv.org/abs/2209.03003)；本页符号比较 | ⚠ 基于已验证公式的解释 |
| 低 SNR 用 truncated-SNR `max(SNR,1)` 或 SNR+1 权重，v-MSE 等价于后一数据空间权重 | PD §4 | ✅ |
| PD 从教师权重复制；数据加噪，离散学生网格含 α₁=0 的纯噪声端 | PD §3、Alg. 2 | ✅ |
| Guided Distillation 先让单网络吸收 conditional/unconditional CFG 组合与强度条件，再 progressive distill | [Guided Distillation §3.1–3.2](https://arxiv.org/abs/2210.03142) | ✅ |
| RF 原文噪声 X₀→数据 X₁；本页统一为数据 x₀、噪声 ε，反向时间 t=1→0 | RF §2.1；明确为时间 / 记号重写 | ⚠ 重写 |
| RF 条件直线路径速度回归，边缘最优速度是条件期望 | RF Eq. (1)–(2)、§2.2 | ✅ |
| 在理想假设下边缘保持、确定 ODE coupling、凸运输代价不增加 | RF Thm. 3.3 / 3.5；§2.2 | ✅ |
| Reflow 重用旧 ODE 初始噪声与端点，在新配对直线上学习；反复直化后可选端点蒸馏 | RF Alg. 1、§3.4 | ✅ |
| Reflow 非有限训练的全局最优运输保证；条件直线不是实际流已直 | RF §2.2、§3，结合学习 / 数值误差作有限训练解释 | ⚠ 推断 |
| 回归组件显示平方回归理论最优，而非拟合实际网络；ODE 端点为 48 步 Euler 近似 | `assets/js/widgets/fewstep2d.js`：`odeMap`、`draw` | ✅ 本仓库组件 |
| ODE 轨迹不交叉指同一时刻的唯一解，二维端点连线不能证明该性质 | RF §2.1 非交叉解释；组件连线只是 coupling 可视化 | ⚠ 数学解释 |
| InstaFlow：SD 初始流→Reflow 得 2-RF→固定噪声端单步 distill；后期 L2→LPIPS | [InstaFlow §3、Fig. 3、App. D](https://arxiv.org/abs/2309.06380) | ✅ |
| 未蒸馏 2-RF 单步仍不够好，流轮次不等于 NFE | InstaFlow Tab. 2；RF Alg. 1 | ✅ |
| 数据、状态、v 和反解目标同形状 `[B,C,H,W]`；latent→VAE decode | PD Alg. 2、InstaFlow §3；符号形状从接口推导 | ⚠ 形状推导 |
| 高分辨率端点回归仍可能模糊；确定 coupling 不等于有限学生能精确拟合 | Denoising Student §4.1；InstaFlow §3、App. D | ✅ / ⚠ 容量解释 |
| PD 初始教师 CIFAR-10 8192 步，较大数据集 1024 步 | PD §5.2 | ✅ |
| PD 每轮 50,000 更新；到 2 / 1 步时 100,000 更新 | PD §5.2 | ✅ |
| PD Tab. 2 无条件 CIFAR-10：Denoising Student `(1,9.36)`；DDIM `(20,6.84)`；PD `(1,9.12)`、`(2,4.51)`、`(4,3.00)`、`(8,2.57)`；元组为 NFE/FID | PD Tab. 2（v2） | ✅ |
| InstaFlow 完整 COCO 2017-5k：SD1.5 `(25,0.88,20.1,0.318)`；PD-SD `(1,0.09,37.2,0.275)`；2-RF `(1,0.09,47.0,0.271)`；InstaFlow-0.9B `(1,0.09,23.4,0.304)`；1.7B `(1,0.12,22.4,0.309)`；元组为步数/s/FID/CLIP | InstaFlow v2 Tab. 2(a)；A100 延迟、5,000 图协议由 caption 说明 | ✅ |
| PD-SD 是 InstaFlow 引用的 guided/progressive 基线，非本页 CIFAR-10 模型 | InstaFlow Tab. 2(a) 与参考文献；原论文的比较协议 | ✅ |
| InstaFlow 内部 FID 差异：摘要 23.3、§1/Tab. 2(a) 23.4；本页采用表值 | InstaFlow v2 摘要、§1、Tab. 2(a) | ✅ 已注明内部不一致 |
| COCO 2014-30k 下 InstaFlow-0.9B FID 13.10，不能与 COCO 2017-5k 混用 | InstaFlow Tab. 2(b)；30,000 图协议由 caption 说明 | ✅ |
| InstaFlow-0.9B 完整训练 199.2 A100 GPU days，包含数据生产、Reflow 与蒸馏 | InstaFlow App. D | ✅ |
| PD 原论文与后续 CM 重做的基线数值不同，页面分开记录 | PD Tab. 2；[CM §6.2、Tab. 1](https://arxiv.org/abs/2303.01469) | ✅ |
| 视频轨迹回归可作 CausVid 初始化；双向教师未来噪声依赖令因果学生条件不完整 | 本 track `09-causvid.html`、`14-causal-forcing.html`；本页仅承上启下链接 | ⚠ 引用专页 |
| 首版月份：Denoising Student 2021-01；PD 2022-02；RF 2022-09；Guided Distillation 2022-10；InstaFlow 2023-09 | 对应 arXiv abstract submission history 与下载 PDF 首页 | ✅ 元数据 |

主结果采用 PD v2 与 InstaFlow v2。RF、Denoising Student 使用现有首版正文。未读取 PD 官方实现细节来补填未公开超参；伪代码直接对齐论文算法与公式。

## 03 — Consistency Models、LCM 与 LCM-LoRA (`03-consistency-models.html`) — 2303.01469 / 2310.14189 / 2406.14548 / 2310.04378 / 2311.05556

| Claim | Source | Status |
|---|---|---|
| CM 把同一 PF ODE 轨迹的状态映射到共同低噪声终点；最高噪声端可一次前向生成 | [CM §3、Fig. 2](https://arxiv.org/abs/2303.01469) | ✅ |
| 原 CM `x_t=x₀+tε`，噪声尺度 t/σ；T=80、截止 0.002 | CM §2；本页把原文截止 ε 重记 σ_min | ✅ / ⚠ 记号重写 |
| 恒等边界、`f=c_skip x+c_out F`，截止时 c_skip=1、c_out=0 | CM Eq. (5)、§3 | ✅ |
| 恒等边界排除全局常数解；不是有限训练稳定性的充分保证 | CM §4 的边界作用；有限训练限制为本页推断 | ✅ / ⚠ 推断 |
| CD 局部 ODE 邻居、真实数据加噪、冻结 score 教师与 EMA target 是不同对象 | CM §4、Eq. (6)–(8)、Alg. 2 | ✅ |
| CT 两端共享同一数据与同一高斯噪声，不需要 score 教师；这不是精确 ODE 轨迹对 | CM §5、Alg. 3、Thm. 2 | ✅ |
| 原始 CD/CT 的目标参数更新 `θ⁻←µθ⁻+(1−µ)θ`，目标停梯度 | CM Eq. (8)、Alg. 2–3 | ✅ |
| Euler CD 邻居 `x̂_l=x_h+(σ_l−σ_h)(−σ_h s_real(x_h,σ_h))` | CM §4、Eq. (6)，VE / EDM 时间重写 | ✅ |
| 多步 CM 是预测终点、以 `sqrt(τ²−σ_min²)` 重新加噪、再预测；推理尺度通过质量搜索 | CM Alg. 1、§3 Sampling | ✅ |
| iCT 移除损失目标的 EMA，即 `θ⁻=sg(θ)`；保留最终采样参数 EMA 是另一个问题 | [iCT §3.2](https://arxiv.org/abs/2310.14189)；实验评估 EMA 与目标网络区分 | ✅ |
| iCT Pseudo-Huber、lognormal 噪声、阶段加密网格 | iCT §3、Tab. 1 | ✅ |
| ECT 从扩散预训练开始，由大间隔去噪逐渐缩短间隔到一致性目标，无需在线 CD score 教师 | [ECT §3.2–3.3](https://arxiv.org/abs/2406.14548) | ✅ |
| ECT 单张 A100 一小时 consistency tuning 得 CIFAR-10 两步 FID 2.73；不含先前预训练 | ECT 摘要、§4.1；budget 范围由 pretraining+tuning 设计明确 | ✅ |
| LCM 冻结 VAE latent、教师 ε/v 参数化与权重初始化、c_skip/c_out 一致性包装 | [LCM §4.1、Eq. (9)、App. D](https://arxiv.org/abs/2310.04378) | ✅ |
| LCM guidance 条件化；论文 `(1+ω)cond−ω uncond` 与统一 `uncond+w(cond−uncond)` 满足 w=1+ω | LCM Eq. (12)–(17)；本页代数换算 | ✅ / ⚠ 换算 |
| LCM 训练教师仍双分支，推理学生一次前向已吸收 guidance | LCM §4.2、§5.1 | ✅ |
| LCM skipping-step 主实验 k=20 扩大训练跨度；不是 20 步推理 | LCM §4.3、§5.1 | ✅ |
| LCM local update Ψ 是位移增量；guided solver 组合为数值近似，不是任意 nonlinear 完整 ODE 解精确可线性组合 | LCM Eq. (11)、Eq. (15)–(18) | ✅ / ⚠ 近似边界解释 |
| LCM-LoRA `W₀+BA`：冻结 W₀、学习 A/B；低秩增量应用于兼容定制模型 / 风格 LoRA | [LCM-LoRA §3.1–3.2、Eq. (1)](https://arxiv.org/abs/2311.05556) | ✅ |
| LCM-LoRA training-free 是定制部署不再训练，模块本身仍做 LCD | LCM-LoRA §1、§3 | ✅ |
| LCM-LoRA 展示模型在固定 ω=7.5 下蒸馏，四步采样；不能默认拥有原 LCM 的可调 guidance 输入 | LCM-LoRA Fig. 2 caption；接口区别为本页明确限制 | ✅ / ⚠ 限制性推断 |
| 图像与 latent 同形状终点预测、条件嵌入、LoRA W₀[d,k]/B[d,r]/A[r,k] | CM Eq. (5)、LCM §4.1–4.2、LCM-LoRA §3.1；符号形状由公式推导 | ⚠ 形状推导 |
| LCM 基座：512 的 SD-V2.1-Base ε-prediction；768 的 SD-V2.1 v-prediction | LCM §5.1 | ✅ |
| LCM 主训练：100K 更新、batch 72/16、lr 8e-6、µ=0.999943、DDIM、k=20、ω=[2,14] | LCM §5.1；batch 顺序为 512/768 | ✅ |
| LCM 统一 w=1+ω 后为 [3,15]，是换算，不是新增配置 | LCM Eq. (12) + §5.1 | ⚠ 代数换算 |
| 具体官方 SD WDS 脚本默认 w_min=5.0、w_max=15.0、ema_decay=0.95，与原论文主实验不同 | [LCM_Training_Script/consistency_distillation/train_lcm_distill_sd_wds.py](https://github.com/luosiallen/latent-consistency-model/blob/main/LCM_Training_Script/consistency_distillation/train_lcm_distill_sd_wds.py)，`parse_args`；2026-10-13 核对 | ✅ 代码快照 |
| 同脚本 argparse 称采用 Imagen 系数、比论文加一，但实际 `pred_x0` 与 `pred_noise` 写 `cond+w*(cond−uncond)`，仍为论文式；不可只依帮助换算 | 同脚本 `parse_args`、训练 20.4.11；下载快照 `early-research/lcm_train.py` | ✅ 已注明帮助 / 实现内部不一致 |
| CM Tab. 1 无条件 CIFAR-10：PD `(1,8.34)`、`(2,5.58)`；CD `(1,3.55)`、`(2,2.93)`；CT `(1,8.70)`、`(2,5.83)`；元组为 NFE/FID | CM v2 Tab. 1；§6.2 确认 PD/CD 同 EDM 教师 | ✅ |
| iCT CIFAR-10 单步/两步 FID 2.51/2.24；ImageNet 64² 为 3.25/2.77 | iCT 摘要；不是原 CM 相同配置的单因素消融 | ✅ |
| LCM LAION-Aesthetics-6+ 512²：ω=8；30K 图、10K prompt、每 prompt 3 图；CLIP ViT-g/14 | LCM §5.1、Tab. 1 caption | ✅ |
| LCM Guided-Distill 基线是相同资源下复现，作者承认更大训练预算可改善，不是该基线原文最优 | LCM §5.1、App. G | ✅ |
| 同协议四步：DDIM FID/CLIP 22.38/25.89；DPM++ 18.43/26.64；Guided-Distill 15.12/27.25；LCM 11.10/28.69 | LCM Tab. 1 | ✅ |
| 同协议 LCM 一步 FID 35.36、两步 13.31 | LCM Tab. 1 | ✅ |
| LCM 数值不是 COCO；CLIP 缩放不能与 InstaFlow 小数列直接比较；LCM-LoRA 不补造未报告统一 FID | LCM §5.1；[InstaFlow Tab. 2](https://arxiv.org/abs/2309.06380)；LCM-LoRA 的报告范围 | ✅ / ⚠ 比较口径限制 |
| 未来 sCM/rCM/视频一致性为本线下游入口 | 本 track `08-scm.html`、`13-rcm.html`、`07-video-consistency.html`；本页仅概念预告，无新数值 | ⚠ 引用专页 |
| 首版月份：CM 2023-03；LCM 2023-10；iCT 2023-10；LCM-LoRA 2023-11；ECT 2024-06 | 对应 arXiv abstract submission history 与 PDF 首页 | ✅ 元数据 |

采用 CM v2、LCM v1、iCT v1、ECT v2、LCM-LoRA v1。代码核对仅限上述官方 SD WDS 文件，未声称所有官方训练 / 推理实现都采用相同默认值。未新增真实硬件测试或补造 LCM-LoRA 指标。

## 04 — ADD / LADD (`04-adversarial-distillation.html`) — 2311.17042, 2403.12015, 2402.13929, 2311.09257

| Claim | Source | Status |
|---|---|---|
| Adversarial Diffusion Distillation；作者：Axel Sauer, Dominik Lorenz, Andreas Blattmann, Robin Rombach；首版 2023-11 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2311.17042) | ✅ |
| Fast High-Resolution Image Synthesis with Latent Adversarial Diffusion Distillation；作者：Axel Sauer, Frederic Boesel, Tim Dockhorn, Andreas Blattmann, Patrick Esser, Robin Rombach；首版 2024-03 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2403.12015) | ✅ |
| SDXL-Lightning: Progressive Adversarial Diffusion Distillation；作者：Shanchuan Lin, Anran Wang, Xiao Yang；首版 2024-02 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2402.13929) | ✅ |
| UFOGen: You Forward Once Large Scale Text-to-Image Generation via Diffusion GANs；作者：Yanwu Xu, Yang Zhao, Zhisheng Xiao, Tingbo Hou；首版 2023-11 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2311.09257) | ✅ |
| registry modality：图像 · SD1.5 / SDXL / SD3 | ADD §4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
| registry signal：ADD：真实数据对抗 + 教师分数蒸馏；LADD / Lightning：潜空间对抗 | ADD Eq. 1–4、App. A；LADD §2.1、§3 | ✅ |
| registry teacher：ADD：教师 + 冻结 DINOv2 + 判别头 + 真图；LADD：教师合成参考与冻结教师特征 | ADD §3–4、Tab. 1 | ✅ |
| registry steps：ADD / LADD 1–4；Lightning 1 / 2 / 4 / 8（独立检查点） | ADD §4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
| registry headline：ADD-M：1 步 COCO2017 FID5k 19.7、CLIP 0.326 | ADD Tab. 2、Fig. 5–7；Lightning Tab. 2；LADD §5.1 | ✅ |
| registry cost：ADD 需像素解码；DINOv2 判别分辨率 518²；Lightning 逐段训练 | ADD §4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
| 主论文 venue：ECCV 2024 | [ECVA ECCV 2024](https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/11557_ECCV_2024_paper.php) | ✅ |
|  /  DINOv1 ViT-S  /  21.5  /  0.312 | ADD Tab. 1a / 1b | ✅ |
|  /  DINOv2 ViT-S（默认）  /  20.6  /  0.319 | ADD Tab. 1a / 1b | ✅ |
|  /  DINOv2 ViT-L  /  24.0  /  0.302 | ADD Tab. 1a / 1b | ✅ |
|  /  CLIP ViT-L  /  23.3  /  0.308 | ADD Tab. 1a / 1b | ✅ |
|  /  判别器无条件 / 仅文本 / 仅图像  /  21.2 / 21.2 / 21.1  /  0.302 / 0.307 / 0.316 | ADD Tab. 1a / 1b | ✅ |
|  /  Ladv + 指数加权 c(t) = αt  /  20.6  /  0.319  /  高噪声贡献小，多样性最好 | ADD Tab. 1d | ✅ |
|  /  Ladv + SDS 加权  /  22.3  /  0.325  /  质量与文本对齐更好 | ADD Tab. 1d | ✅ |
|  /  Ladv + NFSD 加权（最终模型）  /  21.8  /  0.327  /  同上 | ADD Tab. 1d | ✅ |
|  /  学生输入  /  加噪真实图像 xs，s ∈ 4 个学生时间步；评测 512²  /  加噪的教师合成潜变量，t ∈ {1, 0.75, 0.5, 0.25}  /  真实数据加噪 xt；1024² 图像 ↔ 128² 潜空间 | Lightning §2.2 | ✅ |
|  /  判别器输入  /  解码后的像素 → DINOv2 ViT-S（分辨率上限 518²）  /  再加噪潜变量 → 教师 MMDiT 各块 token  /  潜变量 xt−ns（及 xt）→ UNet 编码器 + mid block | ADD §3–4；LADD §3、§5；Lightning §3（计算次数为推算） | ✅ |
|  /  每次迭代的大网络前向  /  学生 1 + 教师 1（单步教师）+ VAE 解码 + φ 对真 / 假各 1  /  学生 1 + 教师对真 / 假特征各 1，无解码  /  教师 n 步（得到 xt−ns）+ 学生 1 + 判别器对真 / 假各 1 | ADD §3–4；LADD §3、§5；Lightning §3（计算次数为推算） | ✅ |
|  /  推理 NFE  /  1–4，无 CFG（SDXL 教师 50 步）  /  1–4，无 CFG（SD3 教师 50 步）  /  1 / 2 / 4 / 8，各自一个检查点，无 CFG | ADD §3–4；LADD §3、§5；Lightning §3（计算次数为推算） | ✅ |
|  /  ADD 损失权重  /  λ = 2.5；R1 γ = 10⁻⁵（作用在判别头输入上）  /  ADD §4 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  ADD 学生时间步  /  N = 4，τn = 1000，零终端 SNR  /  ADD §3.1 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  ADD 判别器  /  DINOv2 ViT-S 特征 + 多层轻量头；ctext：CLIP-ViT-g-14；cimg：DINOv2 ViT-L CLS  /  ADD §3.2、§4 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  ADD 模型与消融设置  /  ADD-M 860M（SD2.1 / SD1.5）、ADD-XL 3.1B（SDXL）；消融 4000 次迭代、batch 128  /  ADD §4、Tab. 1 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  LADD 噪声分布  /  判别器 t̂ ~ logit-normal(m = 1, s = 1)；学生 t ∈ {1, 0.75, 0.5, 0.25}，高分辨率先用 p = [0, 0, 0.5, 0.5] 预热，500 次迭代后改为 [0.7, 0.1, 0.1, 0.1]  /  LADD §4.1、§5 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  LADD 规模  /  消融：学生 / 教师 / 数据生成器均为 depth-24 MMDiT（2B），10k 次迭代；最终 SD3 8B；DPO-LoRA rank 256、3k 次迭代  /  LADD §4、§4.5 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  Lightning 训练  /  64 × A100-80G，batch 512；MSE 段 lr 1e-5（Adam 0.9 / 0.999）；对抗段 lr 1e-6（LoRA）/ 5e-7（全量），Adam β₁ = 0、β₂ = 0.99，无 weight decay；LoRA rank 64  /  Lightning §3.6 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  Lightning 判别器噪声  /  t ∈ {10, 250, 500, 750}，权重 1:1:1:1 → 稳定后 5:1:1:1  /  Lightning §3.7.2 | ADD §3–4；LADD §4–5；Lightning §3.6–3.7 | ✅ |
|  /  DPM Solver  /  25 / 8  /  0.88 / 0.34  /  20.1 / 31.7  /  0.318 / 0.320 | ADD Tab. 2 | ✅ |
|  /  Progressive Distillation  /  1 / 2 / 4  /  0.09 / 0.13 / 0.21  /  37.2 / 26.0 / 26.4  /  0.275 / 0.297 / 0.300 | ADD Tab. 2 | ✅ |
|  /  CFG-Aware Distillation  /  8  /  0.34  /  24.2  /  0.300 | ADD Tab. 2 | ✅ |
|  /  InstaFlow-0.9B / 1.7B  /  1  /  0.09 / 0.12  /  23.4 / 22.4  /  0.304 / 0.309 | ADD Tab. 2 | ✅ |
|  /  UFOGen  /  1  /  0.09  /  22.5  /  0.311 | ADD Tab. 2 | ✅ |
|  /  ADD-M  /  1  /  0.09  /  19.7  /  0.326 | ADD Tab. 2 | ✅ |
|  /  SDXL（教师，CFG）  /  32  /  18.49  /  35.89  /  26.48 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
|  /  LCM  /  1 / 4  /  80.01 / 21.85  /  158.90 / 42.53  /  23.65 / 26.09 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
|  /  LCM-LoRA  /  4  /  21.50  /  40.38  /  26.18 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
|  /  SDXL-Turbo（ADD-XL，512² 放大后裁块）  /  1 / 4  /  23.71 / 22.58  /  43.69 / 42.65  /  26.36 / 26.18 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
|  /  SDXL-Lightning（全量）  /  1 / 2 / 4 / 8  /  22.61 / 23.11 / 22.30 / 21.43  /  41.53 / 35.12 / 33.52 / 33.55  /  26.02 / 25.98 / 26.07 / 25.86 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
|  /  SDXL-Lightning（LoRA）  /  2 / 4 / 8  /  23.39 / 23.01 / 22.30  /  40.54 / 34.10 / 33.92  /  26.18 / 26.04 / 25.77 | SDXL-Lightning Tab. 2、§4.3 | ✅ |
| 到 2023 年下半年，把扩散模型压到少步主要靠两类方法：沿 ODE 轨迹逐段回归（Progressive Distillation / Rectified Flow）和一致性约束（Consistency Models / LCM）。 | ADD §2；Lightning §3.1 | ✅ |
| 它们在 4–8 步还行，再往下就明显发糊、出伪影 。 | ADD §2；Lightning §3.1 | ✅ |
| ADD 的学生不是只从纯噪声出发：训练时从数据集取真实图像 x₀，按学生自己的噪声表加噪到 xs = αsx₀ + σsε，s 从 N = 4 个固定时间步 {τ₁…τ₄} 中均匀抽取，其中 τ₄ = 1000。 | ADD §3–4；LADD §3 | ✅ |
| 因为推理从纯噪声开始，训练时强制零终端 SNR（t = 1000 时输入就是纯噪声）。 | ADD §3–4；LADD §3 | ✅ |
| s < 1000 时输入里还带着 x₀ 的信息，这也是判别器可以加图像条件的原因。 | ADD §3–4；LADD §3 | ✅ |
| 与教师同架构（ADD-M 860M、ADD-XL 3.1B），用预训练扩散模型的权重初始化，输出去噪后的样本 x̂θ(xs, s)。 | ADD §3–4；LADD §3 | ✅ |
| 保留扩散框架意味着推理可以 1 步，也可以“去噪—再加噪”迭代 2–4 步继续细化，这是纯 GAN 做不到的。 | ADD §3–4；LADD §3 | ✅ |
| 沿用 StyleGAN-T 的 projected-GAN 设计：判别器的主干是一个冻结的预训练 ViT，消融里 DINOv2 ViT-S 最好（FID 20.6，CLIP 0.319），更大的 ViT-L 反而更差（24.0 / 0.302）。 | ADD §3–4；LADD §3 | ✅ |
| 在 φ 的若干层特征 φk 上各接一个轻量可训练头，用 projection 方式加条件：文本条件 ctext 来自 CLIP-ViT-g-14 文本编码器，图像条件 cimg 是 x₀ 经 DINOv2 ViT-L 的 CLS 向量。 | ADD §3–4；LADD §3 | ✅ |
| R1 梯度惩罚不对像素算，而是对每个判别头的输入算，强度 γ = 10⁻⁵； | ADD §3–4；LADD §3 | ✅ |
| 作者发现分辨率超过 128² 时 R1 特别有用。 | ADD §3–4；LADD §3 | ✅ |
| 总损失 L = Ladv + 2.5·Ldistill； | ADD §3–4；LADD §3 | ✅ |
| 真实图像加噪到 4 个学生时间步之一。 | ADD §3–4；LADD §3 | ✅ |
| 与 Ladv 以 λ = 2.5 相加。 | ADD §3–4；LADD §3 | ✅ |
| ADD 的消融里最醒目的一行：同样 4000 次迭代、batch 128，学生随机初始化时 FID 293.6、CLIP 0.065，等于完全崩溃； | ADD Tab. 1c；ADD §3、§4.1 | ✅ |
| 用预训练扩散权重初始化则是 20.6 / 0.319 。 | ADD Tab. 1c；ADD §3、§4.1 | ✅ |
| 另外，学生的输入 xs 在 s < 1000 时本身含有真实图像信息，任务更接近“一步去噪”而不是“从零画图”，这进一步降低了难度。 | LADD §1 | ✅ |
| 但它也带来三个限制，后来被 LADD 逐一点名：DINOv2 把判别器训练分辨率限制在 518 × 518； | LADD §1；Lightning §2.4、SDXL-Turbo 模型卡 | ✅ |
| 潜扩散模型必须先解码到 RGB 才能判别，使 512² 以上的训练非常吃显存 。 | LADD §1；Lightning §2.4、SDXL-Turbo 模型卡 | ✅ |
| SDXL-Turbo（即 ADD-XL）的模型卡推荐 512² 输出，Lightning 认为像素空间判别器很可能就是它停在 512 的原因 。 | LADD §1；Lightning §2.4、SDXL-Turbo 模型卡 | ✅ |
| $$\nabla_\theta \mathcal L_\text{distill}\;\propto\;\mathbb E_{t,\epsilon'}\Big[w(t)\big(\hat\epsilon_\phi(\hat x_{\theta,t},t)-\epsilon'\big)\tfrac{\partial \hat x_\theta}{\partial\theta}\Big]$$ | ADD Tab. 1d、App. A；VSD §3.3；Diff-Instruct §3.3.1 | ✅ |
| ADD 的消融正是这样：只用 Ldistill 时 FID 315.6、CLIP 0.076； | VSD §3.3、Diff-Instruct §3.3.1；ADD Tab. 1d | ✅ |
| 只用 Ladv 时 20.8 / 0.315； | VSD §3.3、Diff-Instruct §3.3.1；ADD Tab. 1d | ✅ |
| 两者合用 20.6 / 0.319 。 | VSD §3.3、Diff-Instruct §3.3.1；ADD Tab. 1d | ✅ |
| 用合成数据替代真实数据：一步生成时 CFG 只会过饱和，而真实数据的图文对齐度参差（COCO 图像平均 CLIP 0.29，SD3 生成图约 0.35）。 | LADD §3、§4.2、Fig. 5 | ✅ |
| 这样“学生—教师—判别器”三者都在同一个潜空间里，最终把 SD3（8B）蒸馏成 4 步、无 CFG 的 SD3-Turbo； | LADD §5.1、Fig. 10；LADD §4.4、Fig. 7 | ✅ |
| 用户研究中 4 步的图像质量与 50 步教师相当，文本对齐略低 。 | LADD §5.1、Fig. 10；LADD §4.4、Fig. 7 | ✅ |
| $$D\big(x_t,\;x_{t-ns},\;t,\;t-ns,\;c\big)=\sigma\Big(\text{head}\big[d(x_{t-ns},t-ns,c)\,;\,d(x_t,t,c)\big]\Big),\qquad \mathcal L_G=-\log D(x_t,\hat x_{t-ns},\dots)$$ | SDXL-Lightning §3.2–3.7 | ✅ |
| 流程：先用 MSE 从 128 步直接蒸到 32 步（只在这一段用 CFG 6），再对抗地 32 → 8 → 4 → 2 → 1，每段重新初始化判别器 。 | Lightning §3.6 | ✅ |
| 一步模型的稳定技巧：学生在 {250, 500, 750, 1000} 多个时间步上训练； | Lightning §3.7 | ✅ |
| 判别器输入先加噪到 {10, 250, 500, 750}（先 1:1:1:1，稳定后 5:1:1:1），否则以 t = 0 输入时 UNet 编码器只看高频，评判不了结构； | Lightning §3.7 | ✅ |
| 代价是每个步数一个独立检查点（1 步没有 LoRA 版本），以及逐段蒸馏的工程量 。 | Lightning §6；DMD2 附录 F.1 | ✅ |
| 作者把 SIDDM 的重建项改为直接在 x₀ 上重建，使一步采样可行，并用 SD 1.5 同时初始化生成器和判别器，两者都在潜空间工作 。 | UFOGen §4、附录 A.3；UFOGen Tab. 3；ADD Tab. 2 | ✅ |
| COCO-30k 零样本 FID 12.78、0.09 s ； | UFOGen §4、附录 A.3；UFOGen Tab. 3；ADD Tab. 2 | ✅ |
| 在 ADD 的同协议对比里是 FID5k 22.5 / CLIP 0.311，被 ADD-M 超过 。 | UFOGen §4、附录 A.3；UFOGen Tab. 3；ADD Tab. 2 | ✅ |
| ADD 的时间记号沿用离散 DDPM：xs = αsx₀ + σsε，s 取 {τ₁…τ₄}，τ₄ = 1000 时为纯噪声。 | ADD Eq. 1–4 | ✅ |
| $$\mathcal L(\theta)=\mathcal L^{G}_\text{adv}\big(\hat x_\theta(x_s,s),\psi\big)+\lambda\,\mathcal L_\text{distill}\big(\hat x_\theta(x_s,s),\phi\big),\qquad \lambda=2.5$$ $$\mathcal L^{G}_\text{adv}=-\,\mathbb E_{s,\epsilon,x_0}\Big[\sum_k D_{\psi,k}\big(\varphi_k(\hat x_\theta)\big)\Big]$$ $$\mathcal L^{D}_\text{adv}=\mathbb E_{x_0}\Big[\sum_k\max\big(0,1-D_{\psi,k}(\varphi_k(x_0))\big)+\gamma R_1\Big]+\mathbb E_{\hat x_\theta}\Big[\sum_k\max\big(0,1+D_{\psi,k}(\varphi_k(\hat x_\theta))\big)\Big]$$ $$\mathcal L_\text{distill}=\mathbb E_{t,\epsilon'}\Big[c(t)\,\big\lVert\hat x_\theta-\hat x_\phi\big(\mathrm{sg}(\hat x_{\theta,t});t\big)\big\rVert_2^2\Big],\quad \hat x_{\theta,t}=\alpha_t\hat x_\theta+\sigma_t\epsilon'$$ | ADD Eq. 1–4、App. A；LADD §2.1、§3 | ✅ |
| 两张表的协议不同（512² FID5k vs 1024² 的 10K 提示，CLIP 量纲也不同），不能跨表比较。 | Lightning §4.3 | ✅ |
| “局部块 FID”是在 299 像素中心裁块上算的，用来衡量高分辨率细节 。 | Lightning §4.3 | ✅ |
| ADD-XL 的主要结论来自用户研究：1 步 ADD-XL 胜过 4 步 LCM-XL； | ADD §4.2、Fig. 5–7 | ✅ |
| 4 步 ADD-XL 在图像质量与文本对齐两项人评中胜过 50 步 SDXL-Base 教师 。 | ADD §4.2、Fig. 5–7 | ✅ |
| LADD：SD3-Turbo 4 步在图像质量上与 50 步 SD3 持平，文本对齐略低，仍胜过 Midjourney v6 等基线（用户研究）。 | LADD §5.1 | ✅ |
| “从教师初始化 + 对真实数据的对抗损失”让大规模 1–4 步生成第一次可用，且不再需要 CFG； | ADD §3、§4.3；DMD2 §4；APT 摘要 | ✅ |
| 通往视频：Lightning 的第一作者随后提出 Seaweed-APT（对抗后训练）：在扩散预训练之后直接对真实视频做对抗训练，一次前向生成 2 秒、1280×720、24fps 的视频 。 | APT 摘要 | ✅ |
| 从教师初始化后，生成器一开始就在数据流形附近，判别器只需纠正局部模糊，博弈稳定得多——ADD 的消融里随机初始化直接崩溃（FID 293.6），预训练初始化为 20.6。 | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| 只用蒸馏项会崩溃（FID 315.6），因为它等价于 SDS，是缺少熵项的寻模梯度； | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| 只用对抗项 FID 尚可（20.8）但文本对齐更差（CLIP 0.315 vs 0.319）。 | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| 保留扩散框架的附带好处：可以 1 步，也可以 2–4 步迭代细化； | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| ADD 用冻结的 DINOv2 ViT-S 特征加可训练轻量头：视觉先验强、容易平衡，但只认像素，潜扩散模型必须解码，分辨率被限制在 518²，也无法区分全局与局部反馈。 | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| Lightning 的一步模型还要把判别器输入加噪到 {10, 250, 500, 750}：UNet 编码器在 t = 0 只关注高频，评判不了结构。 | ADD §3–4、Tab. 1；LADD §3；Lightning §3.2–3.7 | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | 首版日期与作者取 ADD arXiv 摘要；ECCV 2024 已由 ECVA 核实。LADD 为 SIGGRAPH Asia 2024。数值按各自论文协议，ADD 的 FID5k 不与 Lightning 的 FID10k 横比。训练代码未运行；ADD 官方链接主要提供推理。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 05 — DMD (`05-dmd.html`) — 2311.18828

主要核对版本：DMD arXiv v4（正文、App. B/D/H/I）；相关方法核对 VSD v2 §3.2、Diff-Instruct v2 §3、SiD §4。网页缓存 dmd-paper.html / .txt 留在本 hand-off 目录。以下“推算”不代表独立复现实验。

| Claim | Source | Status |
|---|---|---|
| DMD 首版 2023-11，CVPR 2024；作者和 MIT / Adobe 机构 | [arXiv 摘要与历史](https://arxiv.org/abs/2311.18828)、[官方项目](https://tianweiy.github.io/dmd/) | ✅ |
| 学生沿用基础去噪器架构、从教师权重初始化，固定末端条件；推理 1 NFE | DMD §3.1；Tab. 1 / 3 | ✅ |
| 正向加噪 \(x_t=\alpha_t\hat x_0+\sigma_t\epsilon\)，real / fake 的 score 用去噪均值换算 | DMD Eq. 3–5 | ✅ |
| reverse-KL 参数梯度为 \(w_t\alpha_t(s_\text{fake}-s_\text{real})\partial G/\partial\theta\)；下降方向相反 | DMD Eq. 2、Eq. 7；App. F | ✅ |
| \(w_t=(\sigma_t^2/\alpha_t)CHW/\|\mu_\text{real}-\hat x_0\|_1\)，逐样本跨通道空间归一化 | DMD Eq. 8 | ✅ |
| 默认 DM 时刻 \(\mathcal U(0.02T,0.98T)\)，T=1000；这是日程索引不是 σ 区间 | DMD §3.1–§3.2；App. B.1–B.2 | ✅ |
| Alg. 2 实现为 \((\mu_\text{fake}-\mu_\text{real})/\text{mean}\lvert\hat x_0-\mu_\text{real}\rvert\)，用 0.5 MSE + stopgrad 目标注入 | DMD App. B Alg. 2（原注释主动指出与正文权重有差异） | ✅ |
| 直接代入 Eq. 4–8 会剩余一个 α_t；EDM α=1 时与 Alg. 2 一致 | 上述方程代数代入，页面明确标为推算；不是声称两个 VP 配方完全相同 | ⚠ 推算 |
| 作者后续官方 DMD2 延续无额外 α 的梯度，使用 nan_to_num | [main/sd_guidance.py](https://github.com/tianweiy/DMD2/blob/8d8fa55633d47cfb81bbc7a892e7248f9518763f/main/sd_guidance.py)：compute_distribution_matching_loss | ✅ 官方后续实现，非第一版独立仓库 |
| fake 网络从教师初始化，以 detach 学生样本做去噪，不使用教师回归终点 | DMD Eq. 6、Alg. 1 / 3 | ✅ |
| fake 去噪权重沿用基础模型：EDM SNR+1/0.5²，SD 数据预测用 SNR，对应 ε-MSE | DMD Alg. 3；App. H | ✅ |
| CFG 只进入 real score 与离线教师配对，fake 不加 CFG；学生固定 guidance | DMD §3.4 | ✅ |
| 标准 λ_reg=0.25；ImageNet 配对 LPIPS 与 DM 两条流；LAION 合并回归生成样本进 DM | DMD §3.3、Alg. 1、App. B.2–B.3 | ✅ |
| ImageNet EDM σ_min=0.002、σ_max=80；1000 bins | DMD App. B.2 | ✅ |
| ImageNet 25,000 对、256 步 Heun（S_churn=0） | DMD §3.3、App. B.2 | ✅ |
| ImageNet lr 2e-6、batch 336、350,000 迭代、λ_reg=0.25 | DMD App. B.2 | ✅ |
| SD v1.5 低 guidance：w=3、500,000 对、50 步 PNDM、lr 1e-5、20,000 迭代 | DMD §4.3、App. B.3；正文写 PNDM，附录 PNMS 应是名称笔误 | ✅ |
| 低 guidance 学生训练约 36 小时、72 A100 | DMD §4.3 | ✅ |
| 高 guidance：w=8、最终 12,000,000 配对、50 步 PNDM；后期 Max DM step=500 | DMD App. B.4、Tab. 5 | ✅ |
| SDXL 配对成本估算每对约 5 秒，12M 提示词约 700 A100-days，超过 DMD2 训练成本 4 倍 | **DMD2** §3；作者对升级 SDXL 的估算，页面明确不写成 DMD 实测 | ✅ 作者估算 |
| 张量 [B,C,H,W] 与 per-sample scale [B,1,1,1] | DMD Eq. 3–6、Eq. 8、Alg. 2；同形张量由公式 / dim=[1,2,3] 推读 | ⚠ 形状推读 |
| ImageNet Tab. 1：CM 1 / 6.20，Diff-Instruct 1 / 5.57，DMD 1 / 2.62，teacher EDM 512 / 2.32（前向次数 / FID） | DMD Tab. 1 | ✅ |
| ImageNet 消融：无 DM 9.21、无回归 5.61、完整 2.62 FID | DMD Tab. 2 | ✅ |
| zero-shot COCO2014 使用 30,000 验证提示词；表中延迟 batch=1 | DMD App. D；Tab. 3 / 4 caption | ✅ |
| COCO Tab. 3：InstaFlow 一步 FID13.10 / 0.09s；DMD w3 一步 11.49 / 0.09s；SDv1.5 w3 50步 8.78 / 2.59s | DMD Tab. 3；App. C.3（teacher 50步） | ✅ |
| COCO 高 guidance Tab. 4：DMD w8 一步 FID14.93 / 0.09s；teacher w8 50步 13.45 / 2.59s | DMD Tab. 4；App. C.3 | ✅ |
| FP16 20 FPS 与表中 0.09s 延迟分别阅读 | DMD 摘要、§4.3、Tab. 3；没有将两者强行互换 | ✅ 作者报告；计时硬件 ❓ |
| VSD 的渲染分布 / real score 差、在线 LoRA、粒子优化 | [VSD](https://arxiv.org/abs/2305.16213) v2 §3.2、Eq. 7–9 | ✅ |
| Diff-Instruct 用 Integral KL 更新任意可微生成器，在线估计生成分布 score | [Diff-Instruct](https://arxiv.org/abs/2305.18455) v2 §3.1–§3.2、Thm. 3.3、Eq. 3.2 | ✅ |
| SiD fake 分布上的 score 差平方是 Fisher 型目标，使用 score identities，区别于 DMD 梯度 | [SiD](https://arxiv.org/abs/2404.04057) §4.1–§4.2、Eq. 8–10 | ✅ |
| VSD / Diff-Instruct 首版 2023-05；SiD 首版 2024-04（milestones） | 各 arXiv abs 的 Submission history | ✅ |
| 2-D widget：8 Gaussian，exact real posterior / particle-cloud fake posterior，flow 时间 [0.02,0.98]，normalizer 下限 1e-3 | 本站 assets/js/widgets/fewstep2d.js：K、post、fakeDenoise、update；这是教学实现 | ✅ 本地代码，非论文实验 |
| DMD2 的 fake 跟踪诊断与 TTUR；后续 CausVid / Self Forcing 的视频问题 | DMD2 §4.2；本站已完成 09 / 12 页，尤其 Self Forcing #from-image | ✅ 原论文 + 本站交叉引用 |

未核实：DMD 独立官方训练仓库、完整速度计时硬件。页面以 DMD 自身 Alg. 2 / 3 为实现依据，官方 DMD2 只用于核对后续沿用的形式。不将第三方 OpenDMD 标为作者官方代码。

## 06 — DMD2 (`06-dmd2.html`) — 2405.14867

核对版本：arXiv v2 正文与 App. A/B/C/F/G；官方 DMD2 main 分支，下载时 tree SHA 8d8fa55633d47cfb81bbc7a892e7248f9518763f。缓存 dmd2-paper.html / .txt 与选定官方代码均在 hand-off 目录。表号按实际 caption，正文交叉引用有数处错号。

| Claim | Source | Status |
|---|---|---|
| 首版 2024-05，NeurIPS 2024；作者 / MIT 与 Adobe | [arXiv](https://arxiv.org/abs/2405.14867)、[官方仓库](https://github.com/tianweiy/DMD2) | ✅ |
| 去除主训练 regression；不稳定的 fake-score 跟踪诊断、亮度振荡 | DMD2 §4.1–§4.2、App. C | ✅ |
| TTUR 在 ImageNet / SDXL 为每学生更新 5 次 fake 更新 | DMD2 §4.2、§4.6、App. F.2 / F.4 | ✅ |
| SD v1.5 为每学生更新 10 次 fake 更新，real guidance=1.75 | DMD2 App. F.3 | ✅ |
| fake UNet middle-block bottleneck 上接判别头，更新头与共享 encoder | DMD2 §4.3、App. F.1；[main/sd_guidance.py](https://github.com/tianweiy/DMD2/blob/8d8fa55633d47cfb81bbc7a892e7248f9518763f/main/sd_guidance.py)：cls_pred_branch、compute_cls_logits | ✅ |
| GAN 使用真实图像，不要求逐噪声教师配对，可补充教师之外监督 | DMD2 §4.3 | ✅ |
| 分开写 logistic non-saturating GAN：D=softplus(-real)+softplus(fake)，G=softplus(-fake) | 同上代码 compute_generator_clean_cls_loss / compute_guidance_clean_cls_loss | ✅ |
| Eq. 4 把 generator 非饱和项与 real 项合写，不能按一个共享 min/max 直接实现 | DMD2 Eq. 4 对照上述官方代码；页面 callout | ✅ 可核对的记法差异 |
| DMD proxy=(fake_mu-real_mu)/mean abs(xhat-real_mu)，0.5 MSE stopgrad，nan_to_num | 官方 main/sd_guidance.py：compute_distribution_matching_loss | ✅ |
| fake SD denoising 用 ε-prediction MSE，完整基础日程；fake CFG=1 | 官方 compute_loss_fake、predict_noise | ✅ |
| DMD 梯度不穿过 score 网络；GAN 梯度必须保留输入 Jacobian | 官方 compute_distribution_matching_loss 的 no_grad、compute_generator_clean_cls_loss 无 no_grad | ✅ |
| 少步交替干净预测与 forward re-noising；固定四步日程 999/749/499/249，基础长度1000 | DMD2 §4.4 | ✅ |
| backward simulation 从学生自生成前缀构造当前训练状态；不是真图正向加噪或教师 ODE | DMD2 §4.5、Fig. 4 | ✅ |
| 前缀 @torch.no_grad、随机阶段跨 GPU 广播、当前步重新加噪、首个时刻强制纯噪声 | [main/sd_unified_model.py](https://github.com/tianweiy/DMD2/blob/8d8fa55633d47cfb81bbc7a892e7248f9518763f/main/sd_unified_model.py)：sample_backward、prepare_denoising_data | ✅ |
| 只在随机当前步保留梯度，不是整条采样链的全梯度 | 上述官方代码；main/train_sd.py train_one_step | ✅ |
| 单步 SDXL 特例：conditioning timestep399，10k 教师配对回归预热；四步 / 其他基座不需要 | DMD2 App. F.4 | ✅ |
| SDXL 1024² 图像 / 128² latent / 4通道；图像3通道 | DMD2 Fig.1；[四步脚本](https://github.com/tianweiy/DMD2/blob/8d8fa55633d47cfb81bbc7a892e7248f9518763f/experiments/sdxl/sdxl_cond999_8node_lr5e-7_denoising4step_diffusion1000_gan5e-3_guidance8_noinit_noode_backsim_scratch.sh) resolution / latent_resolution；main/train_sd.py noise shape | ✅ 官方配置；通道形状推读 |
| SDXL classifier 瓶颈1280×32×32，最终逐样本标量 [B,1] | main/sd_guidance.py 的 SDXL cls_pred_branch 与 compute_cls_logits；尺寸注释 | ✅ |
| ImageNet 标准：lr2e-6、batch280、200k迭代、7 A100约2天、GAN3e-3 | DMD2 App. F.2 | ✅ |
| ImageNet 延长：无GAN400k，FID选checkpoint，加GAN3e-3、lr5e-7、再150k，约5天 | DMD2 App. F.2 | ✅ |
| SD v1.5：40k+5k 两阶段，约26h；real guidance1.75 | DMD2 App. F.3 | ✅ |
| SDXL：lr5e-7、batch128、64 A100；四步20k / 一步25k迭代、约60h、real guidance8 | DMD2 App. F.4 | ✅ |
| SDXL 官方脚本 λ_G=5e-3、λ_D=1e-2，diffusion_gan_max_timestep1000；GAN t索引0..999 | 官方四步脚本 + compute_cls_logits 的 randint 上界排除 | ✅ |
| 3M LAION提示词、500k真实图像；GAN图像具体来自LAION-Aesthetic5.5+过滤集 | DMD2 §5.2、App. F.3–F.4 | ✅ |
| ImageNet 50k 生成图、EDM FID；DMD2标准1.51 / 延长1.28（1 NFE）；DMD2.62；teacher ODE2.32 / SDE1.36（511 NFE） | DMD2 Tab.1、App.G | ✅ |
| ImageNet消融：DMD2.62，去回归3.48，加TTUR2.61，加GAN1.51 | DMD2 Tab.3（按caption，正文误指Tab.4） | ✅ |
| SDv1.5 COCO-30k：30k生成输出缩到256²，与40,504真图 clean-FID | DMD2 App.G | ✅ |
| COCO30k：DMD11.49 / DMD2 8.35，两者0.09s；SDv1.5 ODE50step cfg3：8.59/2.59s；SDE200step cfg2：7.21/10.25s | DMD2 Tab.5 | ✅ |
| 原DMD教师8.78与DMD2重评8.59不同，不拼接表格 | DMD Tab.3 vs DMD2 Tab.5 | ✅ |
| SDXL COCO-10k：1024²输出缩到512²，对应10k真实图；299²中心patch；OpenCLIP-G | DMD2 §5、App.G | ✅ |
| SDXL四步：LCM FID22.16 / patch33.92 / CLIP0.317；Lightning24.46 /24.56 /0.323 | DMD2 Tab.2 | ✅ |
| SDXL DMD2一步19.01 /26.98 /0.336；四步19.32 /20.86 /0.332 | DMD2 Tab.2 | ✅ |
| SDXL teacher cfg6：100前向、19.36 /21.38 /0.332 | DMD2 Tab.2 | ✅ |
| SDXL去backsim patch24.21（完整20.86）；去GAN27.66 | DMD2 Tab.4 | ✅ |
| GAN-only低FID不代表条件质量佳；去DM=FID13.77/CLIP0.307、视觉质量较差 | DMD2 Tab.4、Fig.7 | ✅ |
| 多样性相对教师略降，guidance固定，SDXL高质量仍用四步 | DMD2 §6、App.B | ✅ |
| Imagine Flash自身backward trajectory；首版2024-05 | [Imagine Flash](https://arxiv.org/abs/2405.05224) 摘要与history；DMD2 §4.5 | ✅ 原文摘要 |
| SiD Fisher型分布蒸馏、首版2024-04 | [SiD](https://arxiv.org/abs/2404.04057) §4.1与history | ✅ |
| CausVid选择性继承DMD2；Self Forcing把自身状态训练推广到视频历史与KV | 本站09-causvid与12-self-forcing（已按要求阅读）；Self Forcing §3.2–§3.3 | ✅ 原论文引文与本站官方代码核对 |

注意：本次没有运行模型训练，结果均是作者报告。官方代码使用的 --use_fp16 名称在 SDGuidance 中实际选择 bfloat16 autocast，页面没有额外声称它全程严格 FP16。SDXL 长脚本文件名在页内简写，完整名称与固定 SHA 链接见本表。

## 07 — 视频一致性蒸馏 (`07-video-consistency.html`) — 2312.09109, 2402.00769, 2405.18750, 2410.05677

| Claim | Source | Status |
|---|---|---|
| VideoLCM: Video Latent Consistency Model；作者：Xiang Wang, Shiwei Zhang, Han Zhang, Yu Liu, Yingya Zhang, Changxin Gao, Nong Sang；首版 2023-12 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2312.09109) | ✅ |
| AnimateLCM: Computation-Efficient Personalized Style Video Generation without Personalized Video Data；作者：Fu-Yun Wang, Zhaoyang Huang, Weikang Bian, Xiaoyu Shi, Keqiang Sun, Guanglu Song, Yu Liu, Hongsheng Li；首版 2024-02 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2402.00769) | ✅ |
| T2V-Turbo: Breaking the Quality Bottleneck of Video Consistency Model with Mixed Reward Feedback；作者：Jiachen Li, Weixi Feng, Tsu-Jui Fu, Xinyi Wang, Sugato Basu, Wenhu Chen, William Yang Wang；首版 2024-05 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2405.18750) | ✅ |
| T2V-Turbo-v2: Enhancing Video Generation Model Post-Training through Data, Reward, and Conditional Guidance Design；作者：Jiachen Li, Qian Long, Jian Zheng, Xiaofeng Gao, Robinson Piramuthu, Wenhu Chen, William Yang Wang；首版 2024-10 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2410.05677) | ✅ |
| registry modality：视频 · TF-T2V / SD1.5+AnimateDiff / VideoCrafter2 | VideoLCM §4.1；AnimateLCM v1 §5.4；Turbo §4、App. A；v2 §4 | ✅ |
| registry signal：潜空间一致性；可加图文 / 视频文奖励 | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| registry teacher：冻结视频教师 + 目标网络 + 视频数据；Turbo 另需冻结奖励模型 | VideoLCM §3–4；AnimateLCM v1 §4–5；Turbo §3–4；v2 §3–4 | ✅ |
| registry steps：VideoLCM 4–6；AnimateLCM 2–4；Turbo 4–8；v2 16 | VideoLCM §4.1；AnimateLCM v1 §5.4；Turbo §4、App. A；v2 §4 | ✅ |
| registry headline：Turbo VC2：4 步 VBench 81.01；v2：16 步 Total 83.52 | Turbo Tab. 1–2；v2 Tab. 1/5；AnimateLCM v1 Tab. 1 | ✅ |
| registry cost：一步仍模糊；视频解码和奖励占显存；基座为短视频 U-Net | VideoLCM §4.1；AnimateLCM v1 §5.4；Turbo §4、App. A；v2 §4 | ✅ |
| 主论文 venue：技术报告（2023） | [VideoLCM arXiv 技术报告](https://arxiv.org/abs/2312.09109) | ✅ |
| VideoLCM 代码与模型于 2024-04 发布 | [官方 VGen README.MD News](https://github.com/ali-vilab/VGen/blob/main/README.MD) | ✅ |
|  /  VideoLCM（2023-12）  /  TF-T2V 发布的预训练视频扩散模型  /  LCM 原样搬到视频，固定 CFG \(w=9\)  /  4–6 步 | VideoLCM §3.2 | ✅ |
|  /  AnimateLCM（2024-02）  /  SD1.5 + AnimateDiff 运动模块  /  图像 / 运动先验解耦蒸馏；无教师适配插件  /  2–4 步 | AnimateLCM §5.2 | ✅ |
|  /  T2V-Turbo（2024-05）  /  VideoCrafter2、ModelScopeT2V  /  一致性蒸馏 + 图文 / 视频文奖励梯度  /  4–8 步 | T2V-Turbo §4 | ✅ |
|  /  T2V-Turbo-v2（2024-10）  /  VideoCrafter2  /  数据配比、多奖励、运动引导蒸进学生  /  16 步（4 / 8 步也给出） | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  VideoLCM 输入  /  [B, 3, 16, 256, 448] → 潜变量 [B, 4, 16, 32, 56]  /  16 帧、中心裁 448×256；潜变量形状为推算 | VideoLCM §4.1 | ⚠ |
|  /  AnimateLCM 评测  /  16 帧 512×512 → [B, 4, 16, 64, 64]  /  UCF-101 评测设置；潜变量为推算 | AnimateLCM §5.1 | ⚠ |
|  /  T2V-Turbo（VC2）  /  16 帧 320×512，fps 条件 16 → [1, 4, 16, 40, 64]  /  每卡 batch 1 | T2V-Turbo 附录 A | ✅ |
|  /  T2V-Turbo（MS）  /  16 帧 256×256，8 fps → [1, 4, 16, 32, 32]  /  | T2V-Turbo 附录 A | ✅ |
|  /  奖励分支  /  𝒟(ẑ0)：[1, 3, 16, H, W]；Rimg 取 M = 6 帧  /  v2 取 M = 2，CD batch 3、奖励 batch 1 | T2V-Turbo-v2 §4 | ✅ |
|  /  每个训练步的网络前向  /  学生 1（有梯度）+ 教师 2（条件 / 无条件）+ 目标网络 1  /  由 Algorithm 1 推算；v2 去掉 EMA 后目标仍需一次学生前向（stop-grad） | VideoLCM §4.1、Tab. 1；AnimateLCM v1 §5.1；Turbo App. A；v2 §4、App. C.1（潜变量为推算） | ⚠ |
|  /  推理 NFE  /  教师 50 步 DDIM（含 CFG ≈ 100 次前向） → 学生 4 次  /  CFG 计两次为推算 | VideoLCM §4.1、Tab. 1；AnimateLCM v1 §5.1；Turbo App. A；v2 §4、App. C.1（潜变量为推算） | ⚠ |
|  /  VideoLCM 实测时延（A100，一次 8 段）  /  16×256×256：60 s → 10 s；16×448×256：104 s → 16 s  /  含文本编码与 VAE 解码 | VideoLCM Tab. 1 | ✅ |
|  /  T2V-Turbo-v2 实测时延（BF16）  /  4 步约 1 s；8 步约 1.5 s；16 步约 3 s  /  GPU 型号未说明 | T2V-Turbo-v2 附录 C.1 | ✅ |
|  /  教师  /  TF-T2V 预训练模型  /  SD1.5 + AnimateDiff  /  VideoCrafter2 / ModelScopeT2V  /  VideoCrafter2 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  训练参数  /  全网络  /  空间 LoRA → 时间层  /  LoRA（训完合并）  /  全参数 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  数据  /  WebVid-10M + LAION-5B + 约 1M 内部视频  /  图像阶段：过滤的高质量图文；视频阶段：WebVid-2M  /  WebVid-10M  /  VidGen-1M + WebVid-10M 各半 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  引导尺度 w  /  固定 9.0  /  CFG 增强求解器（数值未给）  /  [5, 15]  /  [5, 15]；运动引导 λ = 500、τ = 0.5 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  求解器 / 网格  /  DDIM  /  DDIM，1000 步中取 50 个  /  DDIM，k = 20  /  DDIM，k = 5 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  损失  /  Huber  /  Huber × λn  /  CD − 1·Jimg − 2·Jvid（VC2）；2 / 3（MS）  /  CD − J；βimg = 0.2（HPSv2.1、CLIP 各一份）、βv = 0.5 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  学习率 / EMA  /  1e-5 / 0.95  /  未给出  /  1e-5 / μ（未给数值）  /  1e-5 / 去掉目标网络 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  算力  /  4×A100，约 4k 次迭代  /  消融：8×A800 上图像 4 h + 视频 4 h  /  8×A100（附录：6–8），10K 步，每卡 1 段  /  8×A100，8K 步 | VideoLCM §3.2、§4.1；AnimateLCM v1 §4–5；Turbo §4、App. A；v2 §4 | ✅ |
|  /  ModelScopeT2V（教师）  /  榜单设置  /  75.75  /  78.05  /  66.54 | T2V-Turbo Tab. 1 | ✅ |
|  /  VCM (MS)  /  4  /  75.84  /  78.80  /  63.98 | T2V-Turbo Tab. 1 | ✅ |
|  /  T2V-Turbo (MS)  /  4  /  80.62  /  82.15  /  74.47 | T2V-Turbo Tab. 1 | ✅ |
|  /  VideoCrafter2（教师）  /  榜单设置  /  80.44  /  82.20  /  73.42 | T2V-Turbo Tab. 1 | ✅ |
|  /  VCM (VC2)  /  4  /  73.97  /  78.54  /  55.66 | T2V-Turbo Tab. 1 | ✅ |
|  /  T2V-Turbo (VC2)  /  4  /  81.01  /  82.57  /  74.76 | T2V-Turbo Tab. 1 | ✅ |
|  /  Gen-2  /  —  /  80.58  /  82.47  /  73.03 | T2V-Turbo Tab. 1 | ✅ |
|  /  Pika  /  —  /  80.40  /  82.68  /  71.26 | T2V-Turbo Tab. 1 | ✅ |
|  /  T2V-Turbo (VC2)  /  4 / 16  /  81.01 / 80.51  /  82.57 / 82.27  /  74.76 / 73.43 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  Gen-3（榜单）  /  —  /  82.32  /  84.11  /  75.17 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  Kling（榜单）  /  —  /  81.85  /  83.39  /  75.68 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  T2V-Turbo-v2，无运动引导  /  16  /  82.93  /  84.08  /  78.33 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  T2V-Turbo-v2，有运动引导  /  16  /  83.52  /  85.13  /  77.12 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  同上  /  4 / 8  /  82.34 / 83.05  /  83.93 / 84.74  /  — | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
|  /  DDIM（教师，CFG 7.5）  /  4940.83  /  3218.74  /  1944.82  /  1209.88 | AnimateLCM v1 Tab. 1、§5.1 | ✅ |
|  /  DPM++（教师，CFG 7.5）  /  2731.37  /  2093.47  /  1043.82  /  932.43 | AnimateLCM v1 Tab. 1、§5.1 | ✅ |
|  /  AnimateLCM（无 CFG）  /  1256.50  /  1081.26  /  925.71  /  910.34 | AnimateLCM v1 Tab. 1、§5.1 | ✅ |
| 2023 年的开源文生视频模型（ModelScopeT2V、VideoCrafter、基于 SD1.5 的 AnimateDiff）基本都是“图像 U-Net + 时间层”，采样仍沿用约 50 步 DDIM 。 | VideoLCM §1；VideoLCM Tab. 1 | ✅ |
| 视频一次前向要处理 16 帧潜变量，再叠加 CFG 的条件 / 无条件两次前向，生成一段几秒的视频要几十秒到几分钟：VideoLCM 在 A100 上测得 8 段 16×448×256 的视频，50 步 DDIM 需 104 s 。 | VideoLCM §1；VideoLCM Tab. 1 | ✅ |
| 与此同时，图像侧的 LCM 已经证明：在潜空间里对“CFG 增强的 PF-ODE”做一致性蒸馏，4 步就能出可用的图。 | VideoLCM §1；VideoLCM Tab. 1 | ✅ |
| 本页覆盖把这套配方搬到视频上的第一波工作（2023-12 至 2024-10）。 | VideoLCM §1、Tab. 1；LCM §3 | ✅ |
| 它们都是 SD 系 VP 扩散：\(x_t=\alpha_t x_0+\sigma_t\epsilon\)，教师预测噪声 \(\epsilon\)，时间是 1000 步离散网格上取出的子序列 \(t_1\lt\dots\lt t_N\)； | VideoLCM §1、Tab. 1；LCM §3 | ✅ |
| 引导尺度 w 有两种处理：VideoLCM 固定 w = 9.0，避免为 w 加嵌入模块而改动网络结构； | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| T2V-Turbo / -v2 沿用 LCM 的做法，每步随机取 w ∈ [5, 15] 并把 w 作为学生的输入 fθ(z, w, c, t)。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| 一段 16 帧视频经冻结的 VAE 逐帧编码成潜变量，再随机取网格下标 n、按前向过程加噪到 tn+k。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| VideoLCM 用 WebVid-10M + LAION-5B 图像 + 约 1M 内部视频，裁 448×256； | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| T2V-Turbo 用 WebVid-10M（与两位教师的训练数据相同）。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| 跨 k 步（T2V-Turbo 取 k = 20，v2 取 k = 5； | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| AnimateLCM 从 1000 步里均匀取 50 个时间点）是 LCM 的“跳步”技巧：网格越粗训练越快，但偏差越大。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| VideoLCM 的 EMA 率为 0.95。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| 把它解码成像素视频 x̂0，随机取 M 帧（T2V-Turbo M = 6，v2 M = 2）喂给图文奖励模型 HPSv2.1，整段喂给视频文模型（VideoCrafter2 教师配 InternVid2 S2，ModelScope 教师配 ViCLIP）。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| 推理时从纯噪声出发，fθ 一步给出 x̂0，再按前向过程加噪到下一个更小的时间点、再跑一次 fθ，如此 4 次即 4 NFE。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ✅ |
| “教师 50 步 + CFG ≈ 100 NFE”按每步两次前向推算。 | VideoLCM §3；AnimateLCM v1 §4；T2V-Turbo §3、App. B | ⚠ |
| 时间结构在极少步时最先崩：VideoLCM 观察到 1 步时不仅模糊，物体的时间结构也保不住，4–6 步才接近 50 步 DDIM ； | VideoLCM §4.3 | ✅ |
| 只有带深度等结构条件的组合生成能降到 1–2 步。 | VideoLCM §4.3 | ✅ |
| 显存：每个样本 16 帧，奖励反馈要把 16 帧解码回像素再过奖励模型； | T2V-Turbo 附录 A；T2V-Turbo §1 | ✅ |
| VideoLCM 是一份技术报告：教师取 TF-T2V 发布的预训练视频扩散模型（文生视频与 VideoComposer 式组合生成两类），学生与教师同结构、由教师初始化，DDIM 作求解器，固定 w = 9.0 以保持与教师完全相同的网络结构——LCM 原本把 w 编码后注入网络，那需要新增模块 。 | VideoLCM §3.2；VideoLCM §4.1；VideoLCM §4.3；VideoLCM §4.5 | ✅ |
| 训练规模很小：4 张 A100（1 张喂图像、3 张喂视频）、约 4k 次迭代、学习率 1e-5、EMA 0.95、16 帧 448×256 。 | VideoLCM §3.2；VideoLCM §4.1；VideoLCM §4.3；VideoLCM §4.5 | ✅ |
| 它的价值在于给出了基线：文生视频 4–6 步、深度引导等组合任务 2–4 步（有时 1 步）可用 。 | VideoLCM §3.2；VideoLCM §4.1；VideoLCM §4.3；VideoLCM §4.5 | ✅ |
| 作者自己列出的局限也正是后续工作的切入点：强依赖教师、在域外数据上蒸馏效果差、4–6 步仍不是实时 。 | VideoLCM §3.2；VideoLCM §4.1；VideoLCM §4.3；VideoLCM §4.5 | ✅ |
| AnimateLCM 基于 SD1.5，教师是 SD1.5 + 开源 AnimateDiff 运动模块 。 | AnimateLCM §5.1 | ✅ |
| 换风格：由于空间权重就是 SD1.5，可以直接换成社区的个性化 SD1.5 模型。 | AnimateLCM Tab. 1 | ✅ |
| 换成 Realistic Vision V5.0 后，UCF-101 零样本 FVD 在 1 步从 1256.50 降到 1071.50 （4、8 步反而变差，作者归因于个性化模型与 UCF-101 的域差）。 | AnimateLCM Tab. 1 | ✅ |
| 两类奖励分工不同：图文奖励（HPSv2.1）只看单帧的美学与图文对齐，对随机抽的 M 帧求和； | T2V-Turbo §3；T2V-Turbo §3.1–3.2；T2V-Turbo Tab. 2 | ✅ |
| 消融显示单用 Rimg 已带来大部分收益（VC2：Total 73.97 → 80.42），再加 Rvid 主要提升语义分（71.70 → 74.76） 。 | T2V-Turbo §3；T2V-Turbo §3.1–3.2；T2V-Turbo Tab. 2 | ✅ |
| T2V-Turbo-v2（ICLR 2025）在三个方向上扩展：① 数据：高质量、长字幕的 VidGen-1M 与 WebVid-10M 各半； | T2V-Turbo-v2 §4.2；T2V-Turbo-v2 §3.2；T2V-Turbo-v2 §3.1 | ✅ |
| CD 损失用全部数据，奖励只在短字幕的 WebVid 上算，因为奖励模型的文本上下文只有 77（HPSv2.1 / CLIP）或 40（InternV2）个 token ； | T2V-Turbo-v2 §4.2；T2V-Turbo-v2 §3.2；T2V-Turbo-v2 §3.1 | ✅ |
| ② 奖励：HPSv2.1 + CLIPScore + InternV2 的组合，并指出“哪个奖励最有用”依赖于数据集； | T2V-Turbo-v2 §4.2；T2V-Turbo-v2 §3.2；T2V-Turbo-v2 §3.1 | ✅ |
| $$\hat z^{\Psi,w}_{t_n}=z_{t_{n+k}}+(1+w)\,\Psi(z_{t_{n+k}},t_{n+k},t_n,c)-w\,\Psi(z_{t_{n+k}},t_{n+k},t_n,\varnothing)$$ | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| $$\mathcal L_\text{CD}=\mathbb E_{z,c,w,n}\Big[\lambda_n\, d\big(f_\theta(z_{t_{n+k}},w,c,t_{n+k}),\ f_{\theta^-}(\hat z^{\Psi,w}_{t_n},w,c,t_n)\big)\Big],\qquad d(x,y)=\sqrt{\lVert x-y\rVert_2^2+c^2}-c$$ | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| $$\mathcal L=\mathcal L_\text{CD}-\beta_\text{img}\,\mathbb E\sum_{m=1}^{M}R_\text{img}(\hat x_0^m,c)-\beta_\text{vid}\,\mathbb E\,R_\text{vid}(\hat x_0,c),\qquad \hat x_0=\mathcal D\big(f_\theta(z_{t_{n+k}},w,c,t_{n+k})\big)$$ | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| 教师一步再加运动能量的梯度，\(\hat z^{\Psi,w,\lambda}_{t_n}=\hat z^{\Psi,w}_{t_n}+\lambda\nabla_{z}\mathcal G^m(z_{t_{n+k}},z^\text{ref}_{t_{n+k}},t_{n+k})\)，其中 \(\mathcal G^m\) 比较生成与参考视频的时间注意力图（只保留每行最大值处），只在前 \(\tau=50\%\) 的步上施加 。 | T2V-Turbo-v2 Eq. 6–9、§4 | ✅ |
| T2V-Turbo 正文 §4 写“8 张 A100”，附录 A 写“6–8 张 A100”； | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| 均为每卡 batch 1、10K 步。 | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| T2V-Turbo-v2 摘要与引言称 VBench “Total Score 85.13”，但 Tab. 1 与附录 Tab. 5 中带运动引导的 16 步模型 Total 为 83.52、Quality 为 85.13。 | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| 本页按表格取 Total 83.52。 | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| AnimateLCM 的 arXiv v3 是 SIGGRAPH Asia 2024 Technical Communications 的短版，标题也改了； | VideoLCM §3；AnimateLCM v1 Eq. 7–12；Turbo Eq. 5–10；v2 Eq. 6–9 | ✅ |
| VBench（16 个维度，每个提示生成 5 段）。 | Turbo Tab. 1–2；v2 Tab. 1/5；AnimateLCM v1 Tab. 1 | ✅ |
| 人评（EvalCrafter 700 个提示）：T2V-Turbo 的 4 步结果在三个问题上都更受偏好于教师的 50 步 DDIM，即采样步数减少约 12.5 倍（50/4，推算； | T2V-Turbo Tab. 1；T2V-Turbo §4.2、Fig. 3 | ⚠ |
| 注意 VCM (VC2) 的语义分 55.66 远低于教师的 73.42：纯一致性蒸馏在文本对齐上掉得最厉害，这正是奖励反馈主要补回的部分。 | Turbo Tab. 1–2；v2 Tab. 1/5；AnimateLCM v1 Tab. 1 | ✅ |
| T2V-Turbo 的 16 步反而比 4 步差，v2 随步数单调变好。 | T2V-Turbo-v2 Tab. 1、Tab. 5 | ✅ |
| 数字来自 （每类 24 段 16 帧 512×512）。 | AnimateLCM Tab. 1 | ✅ |
| 把现成的 U-Net 文生视频模型在几个 GPU 日内压到 4–8 步，LoRA 形式可插拔； | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| T2V-Turbo 用一步生成上的奖励梯度打破“学生 ≤ 教师”，4 步在 VBench 上超过 50 步教师。 | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| 1 步仍模糊：确定性回归在 1 步的上限很低。 | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| Seaweed-APT 的视频基线里，一致性蒸馏 1 步 VBench 只有 67.05，它只把一致性蒸馏当初始化，再做对抗后训练（APT）； | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| 基座停留在 16 帧、最高 512×512 的 U-Net； | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| 同期另一条路是分布匹配：CausVid 用 DMD 把双向视频模型蒸成 4 步因果生成器，后续 Self Forcing 解决自回归的暴露偏差； | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| “图像管画面、视频管运动”的思路被 Motion Consistency Model（MCM，2024-06）推进为单阶段：视频一致性蒸馏只作用于运动表征，另用图像判别器把帧画质拉向高质量图像。 | APT Tab. 7；MCM arXiv:2406.06890 摘要 | ✅ |
| 副产品：空间层仍是 SD1.5，可直接换成个性化风格模型； | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 1 步 FVD 由 1256.50 降到 1071.50。 | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 数字（VC2，4 步）：VCM 73.97 → +Rvid 77.57 → +Rimg 80.42 → 两者 81.01； | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 语义分 55.66 → 74.76。 | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 仍有代价：16 帧解码带梯度很占显存，T2V-Turbo 每卡 batch 只能放 1 段； | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 奖励模型的文本上下文（77 / 40 token）限制了它在长字幕数据上的效果。 | AnimateLCM v1 §4.2、Fig. 5；Turbo §3、Tab. 2；v2 §4.2 | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | 节点日期与作者以最早 VideoLCM 为准，headline 同时覆盖后续 Turbo。AnimateLCM 细节与表格用 v1，v3 改题名并收录 SIGGRAPH Asia 2024 Technical Communications；Turbo 为 NeurIPS 2024，v2 为 ICLR 2025。v2 摘要把 Quality 85.13 称为 Total；本页按表格 Total 83.52。c-t2v-turbo 同时覆盖 v2。潜变量形状为标明的推算，50/4 只是步数比。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 08 — sCM (`08-scm.html`) — 2410.11081

核对版本：arXiv v2（2025-03），正文 §2–§5、Alg.1、App.B/C/D/E/F/G；缓存 scm-paper.html / .txt 在 hand-off 目录。没有核实独立公开的官方 sCM 训练仓库；实现描述来自论文算法，而非运行复现。

| Claim | Source | Status |
|---|---|---|
| 首版2024-10，作者Cheng Lu / Yang Song，OpenAI，ICLR2025 | [arXiv](https://arxiv.org/abs/2410.11081)、[官方研究介绍](https://openai.com/index/simplifying-stabilizing-and-scaling-continuous-time-consistency-models/) | ✅ |
| 离散CM有限间隔目标、相邻状态求解误差；连续目标的梯度以 \(f_\theta^\top df_{\theta^-}/dt\) 表示 | sCM §2.2、Eq.1–2 | ✅ |
| θ−=stopgrad(θ)，不是EMA训练目标 | sCM §2.2、Eq.1–2；Alg.1 | ✅ |
| 全导数包含状态Jacobian方向与时间偏导 | sCM Eq.2、Eq.6 | ✅ |
| TrigFlow噪声z=σ_d ε，t∈[0,π/2]；x_t=cos(t)x0+sin(t)z；样本速度cos(t)z−sin(t)x0 | sCM §3、Eq.3–4 | ✅ |
| fθ=cos(t)x_t−σ_d sin(t)Fθ，自动满足f(x,0)=x；F diffusion训练拟合速度 | sCM Eq.4–5 | ✅ |
| EDM坐标σ_EDM=σ_d tan(t)；TrigFlow统一预条件与flow matching / stochastic interpolation | sCM App.B.1–B.2 | ✅ |
| identity c_noise=t；EDM log时间变换经sin(t)后导数随1/cos(t)发散 | sCM §4.1、Eq.7 | ✅ |
| positional embedding约等于Fourier scale0.02；高频导致时间导数大且振荡 | sCM §4.1、Fig.4 | ✅ |
| adaptive double normalization：norm(x)×pnorm(scale)+pnorm(bias) | sCM §4.1 | ✅ |
| tangent normalization c=0.1，或逐元素clip[-1,1]，均有改善 | sCM §4.2、Fig.5(a) | ✅ |
| warmup前10k迭代线性启用第二切向量项；H=10000 | sCM §4.2、App.G.2、Alg.1 | ✅ |
| Alg.1先构造g_raw=cos(t)df/dt（含warmup），后归一化g_raw | sCM Alg.1对照Eq.6、Eq.8 | ✅ |
| 自适应logweight与−wφ正则；MSE按单样本维数D归一化；先验权重1/(σ_d tan t) | sCM §4.2、Eq.8、App.D | ✅ |
| sCT方向来自数据噪声导数，sCD来自冻结教师PF-ODE | sCM §2.2、Alg.1 | ✅ |
| proposal用τ~Normal，t=arctan(expτ/σ_d)；Eq.8后文字与Alg.1不一致 | sCM Eq.8后文字、Alg.1；页面选可执行Alg.1 | ✅ 原文可直接对照 |
| 缩放JVP：输入(y=x_t/σ_d,t)，方向(ab v,ab σ_d)的输出为σ_d ab dF/dt；§5.1左端漏尺度 | sCM §5.1、Eq.6、Alg.1；链式法则核算 | ⚠ 推算，并在页面callout注明 |
| JVP重排把cos sin提前乘入输入切向量，减少中间层FP16溢出 | sCM §5.1 | ✅ |
| FlashAttention当时接口缺JVP；论文提出块式同时计算注意力与JVP，不存完整矩阵 | sCM §5.1、App.F | ✅ |
| 矩阵形式 dY=dP V+P dV，dP=P*(dA−rowsum(P*dA)) | sCM App.F的逐行推导，页面矩阵化整理 | ⚠ 代数整理 |
| CIFAR32² / ImageNet64²像素域、3通道形状；目标与状态同形 | sCM Tab.1、App.G.1、Eq.5 | ⚠ 数据 / 映射形状推读 |
| ImageNet512用SD VAE latent，σ_d=0.5；通道统计重缩放不同于原EDM2 | sCM App.G.1 | ✅ |
| 两步采样2 NFE；sCD训练单迭代约为教师训练2倍计算 | sCM §5.2 | ✅ 作者报告 |
| 离散网格N>1024后质量下降；连续版在所比较N上更好 | sCM Fig.5(c)、App.E.2 | ✅ 特定消融 |
| 两步中间t=1.1；t_max=arctan(80/σ_d) | sCM §5.2、App.G.2 | ✅ |
| CIFAR一致性训练：RAdam lr1e-4，P_mean−1.0/P_std1.4；sCT dropout0.20、sCD无dropout | sCM App.G.2 | ✅ |
| ImageNet一致性学习率为教师×0.01，FP16 + FlashAttention JVP | sCM App.G.2 | ✅ |
| ImageNet512 sCD guidance均匀抽[1,2]，guidance作为学生输入；sCT未测试CFG | sCM §5.2、App.G.2 | ✅ |
| 报告实验sCT与sCD都从教师扩散EMA参数初始化 | sCM App.G.2（明确always initialize） | ✅；避免将sCT结果写成从零训练 |
| CIFAR无条件：iCT-deep一步2.51/两步2.24；sCT2.85/2.06；sCD3.66/2.52 | sCM Tab.1 | ✅ |
| ImageNet64类条件：iCT-deep3.25/2.77；sCT2.04/1.48；sCD2.44/1.66 | sCM Tab.1 | ✅ |
| ImageNet512原EDM2-XXL1.5B、63×2NFE、FID1.81；本文改造teacher1.73 | sCM Tab.2、App.G.1 | ✅ |
| ImageNet512 sCD-XXL1.5B，一步2.28/两步1.88；sCT-XXL两步3.76 | sCM Tab.2 | ✅ |
| teacher ×2来自CFG，sCD不需额外无条件查询 | sCM §5.2、Tab.2 | ✅ |
| 摘要2.06/1.48/1.88由sCT/sCT/sCD分别产生 | sCM摘要对照Tab.1–2 | ✅ |
| “10%以内”不严格覆盖1.48对1.33，相对差约11.3% | sCM §5.2；(1.48/1.33−1)×100=11.278…，页面明确推算 | ⚠ 推算 + 原文概括差异 |
| CIFAR正文对照2.01为原EDM；改造teacher App.G.1是2.15 | sCM Tab.1、§5.2、App.G.1 | ✅ |
| 高分辨率sCD缩放可预测、sCT方差更高且latent质量落后 | sCM Fig.6、Tab.2、附录sCT局限讨论 | ✅ |
| Fig.7同EDM2-M / ImageNet512比较VSD、两步sCD及组合；VSD precision升/recall降，guidance大时mode collapse | sCM §5.2、Fig.7、App.C、Tab.7 | ✅ 该配置，非所有DMD2 |
| VSD对照不是完整DMD2的TTUR+真实GAN配方，且采样步数有区别 | sCM §5.2 / App.C对照DMD2 §4；页面明确限定结论 | ⚠ 方法范围判断 |
| rCM结合连续一致性与score长跨度正则，扩到图像/视频 | [rCM arXiv abs](https://arxiv.org/abs/2510.08431) 摘要；本站13页 | ✅ 原文摘要与本站交叉引用 |
| iCT首版2023-10；EDM2首版2023-12；ECT首版2024-06（milestones） | [iCT](https://arxiv.org/abs/2310.14189)、[EDM2](https://arxiv.org/abs/2312.02696)、[ECT](https://arxiv.org/abs/2406.14548) Submission history | ✅ |

未核实：独立官方 sCM 训练仓库。原始 CM / ECT / EDM2 的官方仓库只以各自名称列为参考，没有冒充 sCM 实现。本次没有训练或独立评测。

## 09 — CausVid (`09-causvid.html`) — 2412.07772

| Claim | Source | Status |
|---|---|---|
| From Slow Bidirectional to Fast Autoregressive Video Diffusion Models；作者：Tianwei Yin, Qiang Zhang, Richard Zhang, William T. Freeman, Fredo Durand, Eli Shechtman, Xun Huang；首版 2024-12 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2412.07772) | ✅ |
| registry modality：视频 · 内部 CogVideoX 式 DiT；公开 Wan2.1-1.3B | CausVid §5；官方 configs | ✅ |
| registry signal：ODE 初始化 + 双向教师 / fake score 的 DMD | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| registry teacher：冻结双向教师 + 可训练 fake score + 视频数据 | CausVid §4–6、Tab. 1–4；官方推理代码 | ✅ |
| registry steps：论文 4 步 / chunk；公开配置有 3 / 4 步 | CausVid §5；官方 configs | ✅ |
| registry headline：内部模型：640×352，单 H100 9.4 FPS，首帧 1.3 s | CausVid Tab. 1–7；Self Forcing Tab. 1 | ✅ |
| registry cost：64 H100 约 2 天；历史来自带噪真值，仍有暴露偏差 | CausVid §5；官方 configs | ✅ |
| 主论文 venue：CVPR 2025 | [CausVid 官方项目页](https://causvid.github.io/) | ✅ |
|  /  多步双向模型  /  —  /  —  /  100  /  94.6  /  62.7  /  29.6 | CausVid Tab. 4 | ✅ |
|  /  多步因果模型  /  —  /  —  /  100  /  92.4  /  60.1  /  28.5 | CausVid Tab. 4 | ✅ |
|  /  4 步因果学生  /  ✗  /  双向  /  4  /  93.4  /  60.6  /  29.4 | CausVid Tab. 4 | ✅ |
|  /  4 步因果学生（只做 ODE 回归）  /  ✓  /  无  /  4  /  92.9  /  48.1  /  25.3 | CausVid Tab. 4 | ✅ |
|  /  4 步因果学生  /  ✓  /  因果  /  4  /  91.9  /  61.7  /  28.2 | CausVid Tab. 4 | ✅ |
|  /  CausVid  /  ✓  /  双向  /  4  /  94.7  /  64.4  /  30.1 | CausVid Tab. 4 | ✅ |
|  /  学生与教师同架构，学生直接从教师权重开始做 DMD  /  学生要换成块因果掩码，架构不再一致；直接 DMD 不稳定  /  加回一个只做初始化的 ODE 回归阶段（1000 条轨迹、3000 步） | DMD2 §4.5；CausVid §4–5；官方 configs/wan_causal_dmd.yaml | ✅ |
|  /  生成器输入只有噪声图像 xₜ  /  当前 chunk 还要以“历史 chunk”为条件，历史从哪来？  /  用真实视频、逐 chunk 独立加噪作为历史（Diffusion Forcing 式），整段一次前向；没有启用 backward simulation（代码 backward_simulation: false） | DMD2 §4.5；CausVid §4–5；官方 configs/wan_causal_dmd.yaml | ✅ |
|  /  教师与学生对同一个输入打分  /  因果教师弱且自带误差累积  /  保持教师与 fake score 双向，在整段学生视频上做分布匹配（非对称） | DMD2 §4.5；CausVid §4–5；官方 configs/wan_causal_dmd.yaml | ✅ |
|  /  一张图一次出完  /  流式需要按块出图，块大小受 VAE 约束  /  chunk = VAE 的一个 latent 块（论文 5 帧，Wan 版 3 帧）；推理用 KV cache | DMD2 §4.5；CausVid §4–5；官方 configs/wan_causal_dmd.yaml | ✅ |
|  /  视频 latent  /  [B, 21, 16, 60, 104]  /  代码 image_or_video_shape；21 个 latent 帧、16 通道 | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ✅ |
|  /  每个 latent 帧的 token  /  1560  /  代码 frame_seq_length（= 30 × 52，2×2 patch，推算） | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ⚠ |
|  /  一个 chunk  /  3 帧 × 1560 = 4680 token  /  num_frame_per_block: 3，共 7 个 chunk | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ✅ |
|  /  自注意力 KV cache（每层）  /  K、V 各 [B, 32760, 12, 128]  /  32760 = 21 × 1560；30 层 | 代码 causal_inference.py | ✅ |
|  /  KV cache 总量（bf16，B = 1）  /  ≈ 6.0 GB  /  30 × 2 × 32760 × 12 × 128 × 2 B（推算） | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ⚠ |
|  /  交叉注意力缓存（每层）  /  [B, 512, 12, 128]  /  文本 token 只算一次 | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ✅ |
|  /  每个 chunk 的推理前向  /  3 次去噪 + 1 次写缓存  /  Wan 配置是 3 步；论文版 4 步 + 1 次 | 官方 configs/wan_causal_dmd.yaml、causvid/models/wan/causal_inference.py（容量与 token 数为推算） | ✅ |
|  /  教师  /  内部双向 DiT（CogVideoX 式），10 秒、352×640、12 FPS；50 步  /  论文 §5、摘要 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  VAE / chunk  /  3D VAE：16 个视频帧 → 5 个 latent 帧 = 1 个 chunk  /  论文 §5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  学生时间表  /  4 步：999, 748, 502, 247  /  论文 §5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  ODE 初始化  /  1000 条轨迹；3000 步；AdamW，lr 5e-6  /  论文 §4.3、§5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  DMD 阶段  /  6000 步；AdamW，lr 2e-6；TTUR 5；CFG 3.5  /  论文 §5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  算力  /  64 张 H100，总计约 2 天  /  论文 §5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  数据  /  约 40 万条内部单镜头视频（DMD 阶段的输入）  /  论文 §5 | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  Wan 版（开源）  /  batch 1/卡；DMD lr 2e-6；ODE batch 2；chunk 3 帧  /  官方代码 configs | CausVid §4.3、§5；官方 configs/wan_causal_dmd.yaml、wan_causal_ode.yaml | ✅ |
|  /  CogVideoX-5B  /  208.6  /  0.6 | CausVid Tab. 3 | ✅ |
|  /  Pyramid Flow  /  6.7  /  2.5 | CausVid Tab. 3 | ✅ |
|  /  双向教师  /  219.2  /  0.6 | CausVid Tab. 3 | ✅ |
|  /  CausVid  /  1.3  /  9.4 | CausVid Tab. 3 | ✅ |
|  /  CogVideoX-5B（6 s）  /  89.9  /  59.8  /  29.1 | CausVid Tab. 1、§5 | ✅ |
|  /  OpenSORA（8 s）  /  88.4  /  52.0  /  28.4 | CausVid Tab. 1、§5 | ✅ |
|  /  Pyramid Flow（10 s）  /  89.6  /  55.9  /  27.1 | CausVid Tab. 1、§5 | ✅ |
|  /  MovieGen（10 s）  /  91.5  /  61.1  /  28.8 | CausVid Tab. 1、§5 | ✅ |
|  /  CausVid（10 s）  /  94.7  /  64.4  /  30.1 | CausVid Tab. 1、§5 | ✅ |
| 2024 年的主流视频扩散模型（CogVideoX、MovieGen 等）都是双向 DiT：一段视频的所有帧在每一步去噪时互相可见，所以必须把整段视频的全部去噪步跑完，第一帧才能拿出来。 | 论文 Tab. 3 | ✅ |
| 论文测得自家 10 秒双向教师生成一段 120 帧视频要 219.2 s。 | 论文 Tab. 3 | ✅ |
| 论文在同一架构上的对照：100 次前向的多步模型里，双向版 Temporal / Frame / Text 为 94.6 / 62.7 / 29.6，因果版只有 92.4 / 60.1 / 28.5。 | 论文 Tab. 4 | ✅ |
| DMD 阶段学生的输入不是纯噪声，而是真实视频的 latent：切成 chunk，每个 chunk 从 4 步时间表里独立抽一个噪声水平再加噪（沿用 Diffusion Forcing 的“每块独立噪声”）。 | CausVid Fig. 6、§4–5；官方 causvid/dmd.py | ✅ |
| 它是 4 步生成器：时间表 999 / 748 / 502 / 247。 | 论文 §5 | ✅ |
| 训练时整段视频一次前向（FlexAttention 实现块因果掩码），推理时逐 chunk 走 4 步并读 KV cache。 | 论文 §5 | ✅ |
| 选 chunk 而不是逐帧，是因为 3D VAE 本来就要凑满一个 latent chunk（论文设定 5 个 latent 帧 ≈ 16 个视频帧）才能解码出像素，逐帧因果并不会更早出图。 | 论文 Eq. 5 | ✅ |
| 冻结的 50 步双向模型，带 CFG（论文 3.5）。 | 论文 Tab. 4 | ✅ |
| 论文对照显示，换成因果教师（同样 ODE 初始化）结果从 94.7 / 64.4 / 30.1 降到 91.9 / 61.7 / 28.2。 | 论文 Tab. 4 | ✅ |
| 官方代码在 x₀ 参数化下实现：grad = (pred_fake − pred_real) / mean / x̂₀ − pred_real / ，再写成 0.5·mse(x̂₀, (x̂₀ − grad).detach())。 | 论文 Eq. 4 | ✅ |
| 论文用 1000 条轨迹、3000 步、AdamW lr 5e-6。 | 论文 Eq. 6；论文 §4.3、§5 | ✅ |
| 在学生样本上做去噪训练，频率是学生的 5 倍。 | CausVid Fig. 6、§4–5；官方 causvid/dmd.py | ✅ |
| 论文设定一个 chunk = 5 个 latent 帧（16 个视频帧）； | 论文 §5；官方代码 configs/wan_causal_dmd.yaml num_frame_per_block: 3 | ✅ |
| 官方开源的 Wan2.1 版本用 3 个 latent 帧一块。 | 论文 §5；官方代码 configs/wan_causal_dmd.yaml num_frame_per_block: 3 | ✅ |
| 值得注意的是最后一行：4 步的因果学生在三项上都略高于 100 次前向的多步双向模型——分布匹配不是“复制教师”，学生可以得到比教师更高的特定指标。 | 论文 Tab. 4、§6 | ✅ |
| 上表第 3、4 行给出两个方向的消融：去掉 ODE 初始化，Frame 从 64.4 掉到 60.6； | CausVid §4.3、Tab. 4；Causal Forcing §3.2–3.3 | ✅ |
| 只做 ODE 回归、不做 DMD，Frame 只有 48.1——回归出来的学生很糊。 | CausVid §4.3、Tab. 4；Causal Forcing §3.2–3.3 | ✅ |
| 推理时每个 chunk 从纯噪声出发走 4 步（每步预测 x̂₀ 再加噪到下一个时刻），去噪完成后再以 t = 0 把干净的 chunk 前向一次，把它的 K/V 写入缓存，后续 chunk 只读缓存。 | 论文 Alg. 2、§4.4 | ✅ |
| 论文报告单张 H100 上 10 秒视频首帧延迟 1.3 s、吞吐 9.4 FPS（含文本编码、扩散与 VAE 解码）。 | 论文 Tab. 3；论文 §6 | ✅ |
| 论文也指出瓶颈在 VAE：必须攒满 5 个 latent 帧才能出第一批像素，逐帧 VAE 可以再降延迟。 | 论文 Tab. 3；论文 §6 | ✅ |
| CausVid 只在 10 秒片段上训练。 | 论文 §5.1；官方代码 minimal_inference/longvideo_autoregressive_inference.py；论文 Tab. 2；论文 Fig. 9；论文 §6 | ✅ |
| 更长的视频用滑动窗口：上一个 10 秒段的最后几帧作为下一段的上下文。 | 论文 §5.1；官方代码 minimal_inference/longvideo_autoregressive_inference.py；论文 Tab. 2；论文 Fig. 9；论文 §6 | ✅ |
| 论文在约 30 秒的对比中取得 94.9 / 63.4 / 28.9（Temporal / Frame / Text），高于 StreamingT2V、FIFO-Diffusion 等，并展示了 14 分钟的样例（有轻微过曝）。 | 论文 §5.1；官方代码 minimal_inference/longvideo_autoregressive_inference.py；论文 Tab. 2；论文 Fig. 9；论文 §6 | ✅ |
| CausVid 继承了 DMD 损失、TTUR、4 步固定时间表与 CFG 教师； | CausVid §4–6、Tab. 1–4；官方推理代码 | ✅ |
| 论文的教师是内部模型，没有给出参数量与 latent 尺寸，所以下表按官方开源的 Wan2.1-T2V-1.3B 版本追踪（81 帧、480×832）。 | 官方代码 configs/wan_causal_dmd.yaml | ✅ |
| 时间约定：Wan 版是流匹配 \(x_t=(1-t)x_0+t\epsilon\)，t ∈ [0, 1] 以 1000 为刻度并做 shift = 8 的时间扭曲； | 官方代码 configs/wan_causal_dmd.yaml | ✅ |
| 论文版使用 0–999 的离散时间步。 | 官方代码 configs/wan_causal_dmd.yaml | ✅ |
| $$\mathcal L_\text{ODE}(\theta)=\mathbb E_{x,\{t^i\}}\Big\lVert G_\theta\big(\{x^i_{t^i}\}_{i=1}^{N},\{t^i\}\big)-\{x^i_0\}_{i=1}^{N}\Big\rVert^2$$ | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| $$\nabla_\theta\mathcal L_\text{DMD}\approx-\mathbb E_{t,\epsilon}\Big[\big(s_\text{real}(\hat x_t,t)-s_\text{fake}(\hat x_t,t)\big)\,\frac{\partial \hat x_0}{\partial\theta}\Big],$$ | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| $$\mathcal L_\text{fake}(\psi)=\mathbb E_{t,\epsilon}\big\lVert \hat\mu_\psi(\hat x_t,t)-\mathrm{sg}(\hat x_0)\big\rVert^2\quad\text{（x₀ 参数化的普通去噪；Wan 版代码用等价的流匹配损失）}$$ | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| 步数：论文 4 步 [999, 748, 502, 247]； | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| wan_causal_dmd.yaml 为 3 步 [1000, 757, 522]，另有 wan_causal_dmd_warp_4step_cfg2.yaml（4 步 [1000, 750, 500, 250]、CFG 2.0）。 | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| ODE 初始化：论文 1000 条轨迹、lr 5e-6； | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| README 生成 1.5K 条，wan_causal_ode.yaml 的 lr 为 2e-6。 | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| CFG：代码写作 cond + 3.5·(cond − uncond)，按常见写法 uncond + w·(cond − uncond) 相当于 w = 4.5（推算）； | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ⚠ |
| 论文只写“CFG 3.5”。 | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| 代码对 DMD 与 fake score 的 t 做了 shift 并截到 [0.02, 0.98]·1000，论文未提。 | CausVid Eq. 4–6；官方 configs、causvid/dmd.py | ✅ |
| VBench-Long（946 条 prompt）：总分 84.27、质量 85.65、语义 78.75； | 论文附录 Tab. 7 | ✅ |
| 同表 Gen-3 82.32、Vchitect 82.24、CogVideoX1.5-5B 82.17、Kling 81.85。 | 论文附录 Tab. 7 | ✅ |
| 图生视频 92.0 / 65.0 / 28.9（CogVideoX-5B 87.0 / 64.9 / 28.9）； | 论文 Tab. 6；论文 Tab. 5 | ✅ |
| 视频到视频 93.2 / 61.7 / 27.7（StreamV2V 92.5 / 59.3 / 26.9）——因果结构让 I2V / V2V 只是“把条件帧预填进 KV cache”。 | 论文 Tab. 6；论文 Tab. 5 | ✅ |
| 不同协议注意：Self Forcing 用官方 Wan 版 CausVid 在 832×480 上测得 17.0 FPS、0.69 s、VBench 总分 81.20，与本表的内部模型数字不可直接比较。 | Self Forcing Tab. 1 | ✅ |
| 4 步 / chunk + KV cache 的流式推理，首帧延迟进入秒级； | CausVid §6；Self Forcing §1；Causal Forcing §3 | ✅ |
| 因果教师本身比双向教师弱（同架构多步对照 92.4 / 60.1 / 28.5 vs 94.6 / 62.7 / 29.6），而且自带误差累积，蒸馏会把这两点一并传给学生； | CausVid §4.2–4.3、Tab. 4；Causal Forcing Prop. 3.3 | ✅ |
| 实测换成因果教师后学生从 94.7 / 64.4 / 30.1 降到 91.9 / 61.7 / 28.2。 | CausVid §4.2–4.3、Tab. 4；Causal Forcing Prop. 3.3 | ✅ |
| 于是先用 1000 条教师 ODE 轨迹做 3000 步回归，把学生拉到“能生成可辨认视频”的起点，再交给 DMD。 | CausVid §4.2–4.3、Tab. 4；Causal Forcing Prop. 3.3 | ✅ |
| 去掉它，Frame 质量从 64.4 降到 60.6； | CausVid §4.2–4.3、Tab. 4；Causal Forcing Prop. 3.3 | ✅ |
| 只用它（不做 DMD），Frame 只有 48.1——单纯回归在 4 步下会给出模糊的均值式结果。 | CausVid §4.2–4.3、Tab. 4；Causal Forcing Prop. 3.3 | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | 论文内部模型的数值不与公开 Wan 配置混用。代码核实 master：wan_causal_dmd.yaml、dmd.py、causal_inference.py、longvideo_autoregressive_inference.py。代码 CFG cond+s(cond−uncond) 与常见 w 约定差 1。KV 字节数与 token 数是标明的计算值。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 10 — Seaweed-APT / APT2 (`10-apt.html`) — 2501.08316, 2506.09350

| Claim | Source | Status |
|---|---|---|
| Diffusion Adversarial Post-Training for One-Step Video Generation；作者：Shanchuan Lin, Xin Xia, Yuxi Ren, Ceyuan Yang, Xuefeng Xiao, Lu Jiang；首版 2025-01 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2501.08316) | ✅ |
| Autoregressive Adversarial Post-Training for Real-Time Interactive Video Generation；作者：Shanchuan Lin, Ceyuan Yang, Hao He, Jianwen Jiang, Yuxi Ren, Xin Xia, Yang Zhao, Xuefeng Xiao, Lu Jiang；首版 2025-06 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2506.09350) | ✅ |
| registry modality：视频 · Seaweed 8B MMDiT | APT §3.5、App. D–F；APT2 App. A–B | ✅ |
| registry signal：真实视频对抗；APT2 为相对配对 GAN + 近似 R1 / R2 | APT Eq. 1–10；APT2 App. B | ✅ |
| registry teacher：一致性初始化 + 真实视频 + 全参数扩散判别器；最终无在线教师 | APT §3–5、App. E/F；APT2 §2–4 | ✅ |
| registry steps：APT 1（可零样本 2）；APT2 每潜帧 1 NFE | APT §3.5、App. D–F；APT2 App. A–B | ✅ |
| registry headline：APT：1 步 VBench 82.00；APT2：736×416，单 H100 24.8 FPS / 0.16 s | APT Tab. 1/4/7；APT2 Tab. 1–5 | ✅ |
| registry cost：APT 视频阶段 1024 H100、batch 2048；结构与文本对齐退化 | APT §3.5、App. D–F；APT2 App. A–B | ✅ |
| 主论文 venue：ICML 2025（APT）；NeurIPS 2025（APT2） | [APT ICML 2025 proceedings](https://proceedings.mlr.press/v267/lin25m.html)；[APT2 NeurIPS 2025 paper](https://papers.nips.cc/paper_files/paper/2025/file/3a9468a918fc65dc9ce7b7bd99f4f0ef-Paper-Conference.pdf) | ✅ |
| APT 与 APT2 是否使用完全相同的 VAE、由此得到 APT 具体 latent 尺寸 | APT §2–3 仅给抽象形状；APT2 §3 给出 4× 时间 / 8× 空间压缩；本页形状为假设后的推算 | ❓ |
|  /  训练信号  /  真实视频 vs 生成视频的判别器  /  教师分数 − 假分数（需要 fake score 网络）  /  自回归展开后在整段视频上做分布匹配 | APT §3；APT2 §2–3、Tab. 4；CausVid §5；Self Forcing §4、Tab. 1（各自协议） | ✅ |
|  /  是否需要真实视频  /  需要（替代教师）  /  用约 40 万段内部视频；先用教师生成的 1000 对 ODE 解做回归初始化  /  DMD / SiD 版本不需要视频数据；GAN 版本用 14B 模型生成的 7 万段视频 | CausVid §4.3、§5；Self Forcing §4 | ✅ |
|  /  步数 / 粒度  /  1 步；APT2 每潜帧 1 NFE  /  4 步，每块 16 帧  /  4 步；按块（3 个潜帧）或按帧 | APT2 §1 相关工作；Self Forcing §4 | ✅ |
|  /  速度（单 H100）  /  APT2：736×416，24.8 fps，延迟 0.16 s  /  640×352，9.4 fps，延迟 1.30 s（APT2 转引）  /  832×480，按块 17.0 fps；按帧延迟 0.45 s | APT2 Tab. 4；APT2 Tab. 4；Self Forcing §4、Tab. 1 | ✅ |
|  /  主要代价  /  结构与文本对齐下降；需 8B 判别器与大 batch  /  监督分布来自教师；长视频误差累积  /  仍需多步；监督分布来自教师（DMD 版本） | APT §3；APT2 §2–3、Tab. 4；CausVid §5；Self Forcing §4、Tab. 1（各自协议） | ✅ |
|  /  APT 输出视频  /  49 帧 × 1280×720，24 fps，2 s  /  | APT §2 | ✅ |
|  /  APT 潜变量（推算）  /  13 × 90 × 160 × c′  /  1 + 48/4 = 13 个潜帧；720/8 = 90、1280/8 = 160 | APT §2、Tab. 8；APT2 §3、App. C/F（标注的形状与预算为推算） | ⚠ |
|  /  每个训练步的网络前向（推算）  /  G 1 次；D 4 次（真、假、扰动真；生成器步再 1 次）  /  按 Eq. 10 与交替更新推算；真样本的 D(x) 可在 GAN 项与 R1 项间复用 | APT §2、Tab. 8；APT2 §3、App. C/F（标注的形状与预算为推算） | ⚠ |
|  /  采样 NFE  /  APT 1（可零样本 2）；扩散基线 25 步 + CFG = 50  /  | APT Fig. 4 | ✅ |
|  /  APT 单 H100 推理  /  文本编码 0.28 s + DiT 2.65 s + VAE 3.10 s = 6.03 s  /  | APT Tab. 8 | ✅ |
|  /  APT 8×H100 推理  /  0.28 + 0.50 + 1.19 = 1.97 s（短于 2 s 视频 → 实时）  /  VAE 只做 4 卡并行 | APT Tab. 8 | ✅ |
|  /  APT2 每个自回归步  /  1 个潜帧 = 4 个视频帧；24 fps 下每步预算 4/24 ≈ 0.167 s（推算）  /  实测延迟 0.16 s、24.8 fps（736×416，1×H100） | APT2 §3、Tab. 4 | ⚠ |
|  /  APT2 潜帧网格（推算）  /  736×416 → 52 × 92；1280×720 → 90 × 160  /  按空间 8 倍压缩 | APT §2、Tab. 8；APT2 §3、App. C/F（标注的形状与预算为推算） | ⚠ |
|  /  APT2 注意力窗口  /  N = 30 潜帧（5 s）；1280×720 时 N = 15  /  | APT2 §3、附录 F | ✅ |
|  /  APT2 一分钟视频  /  1440 帧 ≈ 360 个潜帧（推算）  /  1440 帧 = 60 s | APT2 摘要 | ⚠ |
|  /  APT2 轻量 VAE 解码器  /  每级残差块 3 → 2，通道 [128, 256, 512, 512] → [64, 128, 256, 512]  /  约 3 倍加速 | APT2 附录 C | ✅ |
|  /  生成器初始化  /  一致性蒸馏 Ĝ  /  图像阶段 EMA 检查点  /  一致性蒸馏（32 步、s = 24、无 CFG、无 EMA 目标、5k 步） | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  判别器初始化  /  原始扩散权重  /  重新从扩散权重初始化  /  扩散适配后的权重 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  数据  /  1024px 图像  /  1280×720、24 fps、截 2 s  /  736×416 为主（加入 1280×720），5–10 s；扩展到最长 55 s | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  batch  /  9062  /  2048（梯度累积）  /  256；长视频扩展阶段 64 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  学习率  /  5e-6（G、D 相同）  /  3e-6  /  3e-6；扩展阶段 1e-5 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  更新次数  /  350（EMA 质量峰值）  /  300  /  500（不扩展）+ 500（扩展 1 次）+ 扩展 5 次阶段 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  判别器时间步  /  shift s = 1  /  shift s = 12  /  U(0, 1)，不 shift | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  正则  /  近似 R1：λ = 100，σ = 0.01  /  近似 R1：λ = 100，σ = 0.1  /  近似 R1 + R2：λ = 1000，σ = 0.1 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  损失  /  非饱和 GAN  /  非饱和 GAN  /  相对配对损失（R3GAN） | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  优化器  /  RMSProp α = 0.9；无 weight decay、无梯度裁剪；BF16；EMA 0.995（图像阶段）  /  RMSProp α = 0.9（前两阶段 AdamW lr 1e-5、wd 0.01） | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  算力  /  128–256 张 H100  /  1024 张 H100  /  全流程 256 张 H100，约 7 天 | APT §3.2–3.5、App. D–F；APT2 App. A–B | ✅ |
|  /  扩散（自家 8B）  /  25  /  82.15  /  84.36  /  73.31 | APT Tab. 7 | ✅ |
|  /  一致性蒸馏  /  4 / 2 / 1  /  77.97 / 74.20 / 67.05  /  81.93 / 78.83 / 73.78  /  62.10 / 55.69 / 40.15 | APT Tab. 7 | ✅ |
|  /  APT  /  2  /  81.85  /  84.39  /  71.70 | APT Tab. 7 | ✅ |
|  /  APT  /  1  /  82.00  /  84.21  /  73.15 | APT Tab. 7 | ✅ |
|  /  视频 APT 2 步  /  +32.3%  /  −31.3%  /  −9.4% | APT Tab. 1、Tab. 4 | ✅ |
|  /  视频 APT 1 步  /  +10.4%  /  −38.5%  /  −8.3% | APT Tab. 1、Tab. 4 | ✅ |
|  /  图像 APT 1 步  /  +37.2%  /  −13.1%  /  −8.1% | APT Tab. 1、Tab. 4 | ✅ |
|  /  图像 SDXL-DMD2 1 步（对 SDXL）  /  −9.3%  /  −16.8%  /  −4.6% | APT Tab. 1、Tab. 4 | ✅ |
|  /  图像 SDXL-Lightning 1 步（对 SDXL）  /  −7.7%  /  −15.1%  /  −17.4% | APT Tab. 1、Tab. 4 | ✅ |
|  /  图像 FLUX-Schnell 1 步（对 FLUX）  /  −36.6%  /  −24.4%  /  −2.8% | APT Tab. 1、Tab. 4 | ✅ |
|  /  Wan 2.1  /  120  /  87.95  /  66.58  /  39.11 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  自家扩散  /  120  /  90.40  /  66.08  /  52.52 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  APT2（AAPT）  /  120  /  89.51  /  66.58  /  42.44 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  SkyReel-V2  /  1440  /  82.19  /  53.67  /  47.15 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  MAGI-1  /  1440  /  80.79  /  60.01  /  25.45 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  自家扩散（续写）  /  1440  /  86.65  /  60.49  /  66.26 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  APT2（AAPT）  /  1440  /  89.79  /  62.16  /  76.50 | APT2 Tab. 1、App. F（各基线默认分辨率） | ✅ |
|  /  CausVid  /  5B  /  1  /  640×352  /  4  /  1.30 s  /  9.4 | APT2 Tab. 4 | ✅ |
|  /  APT2  /  8B  /  1  /  736×416  /  1  /  0.16 s  /  24.8 | APT2 Tab. 4 | ✅ |
|  /  MAGI-1  /  24B  /  8  /  736×416  /  8  /  7.00 s  /  3.43 | APT2 Tab. 4 | ✅ |
|  /  SkyReel-V2  /  14B  /  8  /  960×544  /  60  /  4.50 s  /  0.89 | APT2 Tab. 4 | ✅ |
|  /  APT2  /  8B  /  8  /  1280×720  /  1  /  0.17 s  /  24.2 | APT2 Tab. 4 | ✅ |
| 2024 年底，视频蒸馏的状态是：公开工作只在 AnimateDiff、ModelScope 这类小模型上做到 512×512、16 帧； | APT §1 | ✅ |
| 同期的 CausVid 把大模型蒸到 640×352、12 fps，仍要 4 步； | APT §1 | ✅ |
| 而原始扩散模型在 H100 上生成几秒 1280×720、24 fps 的视频要几分钟 。 | APT §1 | ✅ |
| 确定性蒸馏（一致性蒸馏、渐进蒸馏、rectified flow）用回归损失，一步结果很模糊：APT 自己的一致性蒸馏基线，1 步视频 VBench 总分只有 67.05，远低于扩散的 82.15 。 | APT Tab. 7；APT §2；APT §4.1、§5.3 | ✅ |
| 所以先用一致性蒸馏（MSE，固定 CFG 7.5 与负提示）得到一步模型 Ĝ：它在最终时间步 T 预测速度 v̂，样本为 z − v̂。 | APT §3.2；APT §3.3 | ✅ |
| 训完的模型零样本 2 步能补更多细节，更多步反而出伪影 。 | APT §3.5 | ✅ |
| 先在 1024px 图像上训（350 次生成器更新后取 EMA），再以图像 EMA 检查点为起点训 1280×720、24 fps、2 秒视频（300 次更新）。 | APT §3.5 | ✅ |
| 与生成器同为 36 层、8B 的 MMDiT，全部参数参与训练（冻结主干会出伪影，降低主干学习率则收敛慢 ）。 | APT 附录 F | ✅ |
| t 先均匀采样再做 shift(t, s) = st / (1 + (s − 1)t)，视频取 s = 12（s 由潜变量尺寸决定，s 越大越偏向高噪声端）。 | APT 附录 F | ✅ |
| 在第 16、26、36 层后各插一个只含交叉注意力的块：一个可学习的 query token 去注意全部视觉 token，输出 1 个 token； | APT §5.2、Fig. 6–7 | ✅ |
| 优化器为 RMSProp（α = 0.9，相当于 β1 = 0、β2 = 0.9 的 Adam），无 weight decay、无梯度裁剪，BF16 。 | APT §3.5 | ✅ |
| 生成器 + 判别器约 16B； | APT §3–5、App. E/F；APT2 §2–4 | ✅ |
| 视频阶段 1024 张 H100、batch 2048。 | APT §3–5、App. E/F；APT2 §2–4 | ✅ |
| ① 结构退化更重：图像一步结构偏好是 −13.1%，视频一步是 −38.5%，作者归因于视频还要正确地表达运动 ； | APT Tab. 1、Tab. 4、§4.2；APT 附录 E；APT §6；APT §5.5、附录 J | ✅ |
| ② 小 batch 模式坍塌：视频 batch 256 时跨提示、跨种子都坍到同一种输出，1024 才不坍，最终用 2048 ； | APT Tab. 1、Tab. 4、§4.2；APT 附录 E；APT §6；APT §5.5、附录 J | ✅ |
| ③ 时长：受算力限制只训到 2 秒（49 帧） ； | APT Tab. 1、Tab. 4、§4.2；APT 附录 E；APT §6；APT §5.5、附录 J | ✅ |
| APT 的人评正好印证了“越过教师”这一点：一步图像在视觉保真度上比自家 25 步扩散高 37.2%，是所有一步方法里唯一为正的 ； | APT §2；APT Tab. 1；APT §5.3、附录 H | ✅ |
| 一致性蒸馏：照搬 APT 做初始化，但去掉 CFG（在自回归设置下会出伪影）、不用 EMA 目标，32 个时间点、shift s = 24，5k 步。 | APT2 §2.1–2.3、App. B/C/D/F | ✅ |
| 长视频训练：数据集里单镜头平均只有约 8 秒，长镜头很少 。 | APT2 §2.2；APT2 Tab. 5、Fig. 3 | ✅ |
| APT2 让生成器连续生成长视频，切成 10 秒的段（重叠 1 秒）分别交给判别器，判别器的“真”样本仍是数据集里的短视频； | APT2 §2.2；APT2 Tab. 5、Fig. 3 | ✅ |
| 只训 10 秒的模型在 1 分钟生成时质量明显下降 。 | APT2 §2.2；APT2 Tab. 5、Fig. 3 | ✅ |
| 比一步扩散强迫更省：扩散强迫（diffusion forcing）在使用 KV cache 时每步要计算两帧，回收输入的做法每步只算一帧，作者称效率约为同等一步扩散强迫模型的 2 倍 。 | APT2 §1、Fig. 2 | ✅ |
| APT2 写明其 VAE 时间 4 倍、空间 8 倍压缩，首帧单独编码。 | APT Tab. 8；APT2 §3、App. C/F | ✅ |
| $$G_\theta(z,c)=z-\hat G(z,c,T),\qquad D_\psi(x,c)=\mathbb E_{t\sim\mathrm{shift}(\mathcal U(0,T),s)}\big[\hat D_\psi(x,t,c)\big],\qquad \mathrm{shift}(t,s)=\frac{st}{1+(s-1)t}$$ | APT Eq. 1–10；APT2 App. B | ✅ |
| $$\mathcal L_D=\mathbb E_{x,c}\big[\mathrm{softplus}(-D_\psi(x,c))\big]+\mathbb E_{z,c}\big[\mathrm{softplus}(D_\psi(G_\theta(z,c),c))\big]+\lambda\,\mathbb E_{x,c}\big\lVert D_\psi(x,c)-D_\psi(\mathcal N(x,\sigma^2 I),c)\big\rVert_2^2$$ | APT Eq. 1–10；APT2 App. B | ✅ |
| $$\mathcal L_G=\mathbb E_{z,c}\big[\mathrm{softplus}(-D_\psi(G_\theta(z,c),c))\big]$$ | APT Eq. 1–10；APT2 App. B | ✅ |
| 因此 \(\lambda=100,\ \sigma=0.1\) 大致等价于权重为 \(\lambda\sigma^2=1\) 的 R1，图像阶段 \(\sigma=0.01\) 时约为 0.01（推算）。 | APT Eq. 1–10；APT2 App. B | ⚠ |
| $$\mathcal L_D=\mathbb E\,\mathrm{softplus}\big(D(\hat x)-D(x_0)\big)+\lambda\big(\lVert D(x_0)-D(x_0+\sigma\epsilon)\rVert^2+\lVert D(\hat x)-D(\hat x+\sigma\epsilon)\rVert^2\big),\qquad \mathcal L_G=\mathbb E\,\mathrm{softplus}\big(D(x_0)-D(\hat x)\big)$$ | APT Eq. 1–10；APT2 App. B | ✅ |
| 其中 \(\lambda=1000,\ \sigma=0.1\)； | APT2 附录 B | ✅ |
| APT 的符号约定：Eq. 1–2 定义 \(f_D=g_G=\log\sigma\)、\(f_G=\log(1-\sigma)\)，正文又说判别器“最大化 \(-\mathcal L_D\)”、生成器“最小化 \(\mathcal L_G\)”，字面上方向与标准非饱和 GAN 相反，而 Eq. 10 又以 \(+\lambda\) 把 R1 项加到 \(\mathcal L_D\) 上。 | APT Eq. 1–10；APT2 App. B | ✅ |
| APT 的推理速度：§1 说“单张 H100 两秒内生成 2 秒视频潜变量”，附录 Tab. 8 的单卡 DiT 时间是 2.65 s、全流程 6.03 s； | APT Eq. 1–10；APT2 App. B | ✅ |
| “实时”指 8×H100 全流程 1.97 s。 | APT Eq. 1–10；APT2 App. B | ✅ |
| APT2 的扰动符号：附录 B 的 Eq. 2–3 用 \(\sigma\) 表示扰动强度，正文却写“where ε = 0.1”，而 ε 同时是生成器的噪声输入； | APT Eq. 1–10；APT2 App. B | ✅ |
| 本页按 \(\sigma=0.1\) 理解。 | APT Eq. 1–10；APT2 App. B | ✅ |
| CausVid 的分辨率：APT2 相关工作一节写 640×320，引言与 Tab. 4 写 640×352。 | APT2 §2.2、Tab. 5、App. B | ✅ |
| 另一个口径差异是长视频训练：正文与 Tab. 5 使用“60 s”，附录 B 的具体扩展课程最终是 55 s（10 + 5×(10−1)）； | APT2 §2.2、Tab. 5、App. B | ✅ |
| 本页超参取附录的 55 s，结果保留 Tab. 5 的 60 s 标签 。 | APT2 §2.2、Tab. 5、App. B | ✅ |
| EMA 模型的质量在约 350 次更新时达到峰值，继续训练结构变差 。 | APT §3.2–3.5、附录 D–F；APT2 附录 A–B；APT 附录 D、F | ✅ |
| 视频，VBench（每个提示 5 段，946 个提示）。 | APT Tab. 1/4/7；APT2 Tab. 1–5 | ✅ |
| 扩散基线为 25 步 + CFG（50 NFE）。 | APT Tab. 1/4/7；APT2 Tab. 1–5 | ✅ |
| 作者认为自动指标不如人评可靠（例如 FID 把 FLUX 一步排在 FLUX 25 步之前），主结论以人评为准 。 | APT Tab. 7；APT 附录 A | ✅ |
| 每个一步方法都对照它自己的 25 步基座，所以列间可比的是“相对退化”，不是绝对质量。 | APT Tab. 1、Tab. 4；APT Tab. 2 | ✅ |
| 736×416； | APT2 Tab. 1、App. F | ✅ |
| 本方法分辨率为 736×416，各基线采用各自默认分辨率； | APT2 Tab. 1、App. F | ✅ |
| CausVid 只报告了 12 fps、120 帧的 Temporal 92.00 / Frame 65.00，APT2 指出 12 fps 训练天然抬高动态度，不宜直接比较。 | APT2 Tab. 1；APT2 Tab. 5；APT2 Tab. 2–3 | ✅ |
| 训练时长消融：1 分钟生成的 Temporal / Frame 在只训 10 s 时为 85.86 / 57.92，训到 60 s 时为 89.79 / 62.16 。 | APT2 Tab. 1；APT2 Tab. 5；APT2 Tab. 2–3 | ✅ |
| 交互任务上，姿态驱动的 AKD 2.740（OmniHuman-1 为 2.136），相机控制的 FVD 61.33（CameraCtrl2 为 73.11） 。 | APT2 Tab. 1；APT2 Tab. 5；APT2 Tab. 2–3 | ✅ |
| “扩散预训练 → 一致性蒸馏初始化 → 对真实数据的对抗后训练”可以在 8B 规模稳定运行，第一次一步生成 1280×720、24 fps 视频； | APT §5.4、App. I；APT2 §4；arXiv 首版记录 | ✅ |
| 同期的分布匹配路线：CausVid（DMD，4 步因果）与 Self Forcing（训练时自回归展开，DMD / SiD / GAN 均可）——后者与 APT2 的学生强制是同一思路，前后相隔两天发布； | APT §5.4、App. I；APT2 §4；arXiv 首版记录 | ✅ |
| λ = 100、σ = 0.1 相当于 R1 权重约 1（推算）。 | APT §3–5、Tab. 1/4/7；APT2 §2.2、App. B/D | ⚠ |
| 视频 batch 至少 1024（256 时模式坍塌）； | APT §3–5、Tab. 1/4/7；APT2 §2.2、App. B/D | ✅ |
| EMA 0.995 并在质量峰值处早停。 | APT §3–5、Tab. 1/4/7；APT2 §2.2、App. B/D | ✅ |
| 得：质量不再以教师为上限，也不继承 CFG 的过曝与过饱和——APT 一步图像的视觉保真度比自家 25 步扩散高 37.2%，一步视频 VBench 82.00 与 50 NFE 的扩散 82.15 持平； | CausVid §5；Self Forcing §4 | ✅ |
| 失：没有 CFG 的“增强对齐”，文本对齐与结构完整性下降（视频一步结构 −38.5%）； | CausVid §5；Self Forcing §4 | ✅ |
| 需要真实数据和一个与生成器同规模的判别器，以及上千张 H100 的大 batch。 | CausVid §5；Self Forcing §4 | ✅ |
| CausVid 的原论文训练仍使用约 40 万段内部视频。 | CausVid §5；Self Forcing §4 | ✅ |
| APT2 生成 60 s、按 10 s 段判别（重叠 1 s），“真”的一侧仍是短片段； | APT §3–5、Tab. 1/4/7；APT2 §2.2、App. B/D | ✅ |
| 只训 10 s 的模型做 1 分钟生成时 Temporal / Frame 为 85.86 / 57.92，训到 60 s 为 89.79 / 62.16。 | APT §3–5、Tab. 1/4/7；APT2 §2.2、App. B/D | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | APT 论文声称单卡两秒内生成 latent，但 Tab. 8 单卡 DiT 为 2.65 s、全流程 6.03 s；实时全流程为 8 H100 / 1.97 s。APT2 主文与 Tab. 5 的 60 s 标签，与附录 B 最终训练 55 s 的课程并存。APT2 各基线采用各自默认分辨率。APT2 与 Self Forcing 为同期路线，未建议二者之间画继承箭头。APT 隐变量尺寸假设相同 VAE 的推算未确认。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 11 — MeanFlow（`11-meanflow.html`）— 2505.13447；2410.12557；2506.14603；2512.02012

本页原始 MeanFlow 使用 [2505.13447v1 全文](https://arxiv.org/html/2505.13447v1)，作者为 Geng / Deng / Bai / Kolter / He；后续 iMF 只作短说明与 url milestone，不合并结果。官方代码检查到的提交为 `d70cb55d298ee03c53bf6da67bec281082e4e2d9`；未运行模型复现。

| Claim | Source | Status |
|---|---|---|
| 首次版本月份：MeanFlow 2025-05；Shortcut 2024-10；AYF 2025-06；iMF 2025-12 | 各论文 arXiv abstract 的 submission history：2505.13447、2410.12557、2506.14603、2512.02012 | ✅ |
| MeanFlow v1 作者与机构：Geng、Deng、Bai、Kolter、He；CMU / MIT | MeanFlow v1 首页 / arXiv abstract | ✅ |
| t=0 数据、t=1 噪声，z_t=(1−t)x_0+tε，条件瞬时速度 ε−x_0，边缘速度为条件期望 | MeanFlow §3、Eq. 1–2 | ✅ |
| 直线条件插值不保证边缘 ODE 轨迹直；大步切线会有误差 | MeanFlow §3、Fig. 2 | ✅ |
| 平均速度是沿边缘 ODE 的积分除以 t−r；u→v；区间位移具有积分可加性 | MeanFlow Eq. 3–4、§4.1 | ✅ |
| MeanFlow 恒等式 u=v−(t−r)du/dt；r 固定，JVP 切向量 (v,0,1) | MeanFlow Eq. 5–8 | ✅ |
| 条件速度替代边缘速度构造目标，target stop-gradient 避免二阶参数反传 | MeanFlow Eq. 9–11、Alg. 1、App. B.4 | ✅ |
| r=t 恢复 Flow Matching；不使用扩散教师、EMA 教师、离线 ODE 对或离散时间课程 | MeanFlow §4.1、§5、Alg. 1 | ✅ |
| 网络可编码 (t,t−r)，JVP 必须对包装后的 (z,r,t) 函数计算 | MeanFlow §4.3；[meanflow.py](https://github.com/Gsunshine/meanflow/blob/d70cb55d298ee03c53bf6da67bec281082e4e2d9/meanflow.py) forward | ✅ |
| 基础 CFG：ṽ=w(ε−x_0)+(1−w)u_θ(z,t,t,null)，用于目标首项与切向量 | MeanFlow Eq. 13–19；代码 guidance_fn、forward | ✅ |
| 类别丢弃样本用无 guidance 条件速度；附录 κ 混合条件对角线，w′=w/(1−κ) | MeanFlow App. B.1、Eq. 20–21；代码 cond_drop、guidance_fn | ✅ |
| 推理 z_r=z_t−(t−r)u_θ；一步 x̂=ε−u_θ(ε,0,1,c)，不再做在线 CFG 双调用 | MeanFlow Eq. 12、§4.2、Alg. 2 | ✅ |
| 实际标签含当前网络导数；iMF 改为瞬时速度回归与显式 guidance 条件 | MeanFlow Eq. 11；[iMF](https://arxiv.org/html/2512.02012) 摘要、§1、Fig. 1 | ✅ |
| Shortcut 原文时间方向与本页相反；步长条件，两个半步自举一整步 | [Shortcut](https://arxiv.org/html/2410.12557) §2–3、Eq. 3–4、§3.1 | ✅ |
| 本页 Shortcut 用 t−d、z′=z−dS 的公式是时间反向重记法 | Shortcut Eq. 3–4 的符号转换，正文明确说明 | ⚠ 符号转换 |
| Shortcut 合并损失第二次调用写 t，Eq. 4 / §3.1 要用 t+d；本页按 Eq. 4 | Shortcut §3 合并损失式、Eq. 4、§3.1 | ✅ 内部差异已注 |
| AYF arXiv 2506.14603；作者 Sabour / Fidler / Kreis；NeurIPS 2025 | [arXiv abstract](https://arxiv.org/abs/2506.14603)；[官方项目页](https://research.nvidia.com/labs/toronto-ai/AlignYourFlow/) | ✅ |
| AYF 学任意终点流映射；Eulerian / Lagrangian 目标；预训练教师、autoguidance、可选短期对抗微调 | AYF §3–4、App. D.5、F | ✅ |
| CM 是固定 r=0 的流映射，跨区间 flow maps 一般化它；不能推出任意有限容量映射都更好 | MeanFlow Relation to Prior Work；AYF Fig. 2、§3；rCM App. F.1 | ✅ / ⚠ 边界说明 |
| ImageNet 256×256；FID-50K；预训练 VAE latent 32×32×4 | MeanFlow §5、App. A | ✅ |
| 代码 time 广播 [B,1,1,1]，入网络 reshape [B]；u / du 同输入形状 | meanflow.py sample_tr、u_fn、forward；Alg. 1 | ✅ |
| XL/2 patch token 256、hidden 1152（[B,256,1152]） | latent 32×32 与 Tab. 4 patch 2×2、hidden dim 1152 | ⚠ 推算 |
| JVP B/4 JAX v4-8 TPU：FM 0.045 s/iter，MF 0.052，作者报 16% 增量 | MeanFlow App. B.4 | ✅ 局部测量 |
| 自适应误差平方和，weight=(e+δ)^−p，默认 p=1，文中示例 δ=1e-3 | MeanFlow §4.3、Eq. 22、Tab. 4；代码 forward（sum over pixels） | ✅ |
| XL/2 676M、28 层、hidden 1152、16 heads；240 epochs、batch 256、EMA 0.9999 | MeanFlow Tab. 2、Tab. 4 XL/2 列 | ✅ |
| Adam lr 1e-4，β=(0.9,0.95)、weight decay 0；logit-normal(−0.4,1.0)、r≠t 25% | MeanFlow Tab. 4 | ✅ |
| XL/2 w′=2.5、w=0.2、κ=1−w/w′、引导范围 [0,0.75] | MeanFlow Tab. 4、Eq. 21 | ✅ |
| B/4 论文消融 80 epochs；公开 run_b4.yml 240 epochs；README checkpoint FID 11.4 | MeanFlow Tab. 1、Tab. 4；[公开配置](https://github.com/Gsunshine/meanflow/blob/d70cb55d298ee03c53bf6da67bec281082e4e2d9/configs/run_b4.yml)；README | ✅ 协议差异已注 |
| Tab. 2：iCT-XL/2 675M / 1 NFE / 34.24；Shortcut 675M / 1 / 10.60 | MeanFlow Tab. 2（作者汇总基线） | ✅ |
| Tab. 2：MF-B/2 131M / 1 NFE / 6.17；MF-XL/2 676M / 1 / 3.43 | MeanFlow Tab. 2 | ✅ |
| Tab. 2：iMM 675M / 1×2 NFE / 7.77；MF-XL/2 676M / 2 / 2.93；MF-XL/2+ 676M / 2 / 2.20 | MeanFlow Tab. 2；XL/2+ 更长训练见 Tab. 4 | ✅ |
| DiT-XL/2 675M / 250×2 NFE / 2.27 | MeanFlow Tab. 2（作者汇总基线） | ✅ |
| B/4 无 CFG：r≠t=0% FID 328.91；25% FID 61.06；错误切向 (v,0,0) FID 268.06 | MeanFlow Tab. 1(a–b) | ✅ |
| SiT FID 正文 §5.2=2.15、Tab. 2=2.06；M/2 参数 Tab. 2=308M、Tab. 4=497.8M | MeanFlow v1 对应段落 / 表格；本页未用其作主比较 | ✅ 内部差异已注 |
| Causal-rCM 将 sCM / MeanFlow 用于因果教师蒸馏，开发 custom-mask FA2 JVP | [Causal-rCM](https://arxiv.org/html/2606.25473) §3.1.2、§3.2、App. B | ✅ |

开放项：未运行训练与采样；未核实原始论文两处表格不一致的作者勘误。正文所有基准结果均为作者报告，JVP wall-clock 限于论文测试环境。

## 12 — Self Forcing (`12-self-forcing.html`) — 2506.08009, 2509.22622, 2509.25161, 2510.02283

| Claim | Source | Status |
|---|---|---|
| Self Forcing: Bridging the Train-Test Gap in Autoregressive Video Diffusion；作者：Xun Huang, Zhengqi Li, Guande He, Mingyuan Zhou, Eli Shechtman；首版 2025-06 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2506.08009) | ✅ |
| LongLive: Real-time Interactive Long Video Generation；作者：Shuai Yang, Wei Huang, Ruihang Chu, Yicheng Xiao, Yuyang Zhao, Xianbang Wang, Muyang Li, Enze Xie, Yingcong Chen, Yao Lu, Song Han, Yukang Chen；首版 2025-09 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2509.22622) | ✅ |
| Rolling Forcing: Autoregressive Long Video Diffusion in Real Time；作者：Kunhao Liu, Wenbo Hu, Jiale Xu, Ying Shan, Shijian Lu；首版 2025-09 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2509.25161) | ✅ |
| Self-Forcing++: Towards Minute-Scale High-Quality Video Generation；作者：Justin Cui, Jie Wu, Ming Li, Tao Yang, Xiaojie Li, Rui Wang, Andrew Bai, Yuanhao Ban, Cho-Jui Hsieh；首版 2025-10 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2510.02283) | ✅ |
| registry modality：视频 · Wan2.1-T2V-1.3B | Self Forcing §4、App. A、Tab. 3 | ✅ |
| registry signal：自生成整段视频的 DMD / SiD / GAN | Self Forcing §3.3、App. A | ✅ |
| registry teacher：DMD：14B 冻结教师 + 1.3B critic + prompts；不需视频数据 | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| registry steps：4 步 / 3-latent-frame chunk，或逐 latent 帧 | Self Forcing §4、App. A、Tab. 3 | ✅ |
| registry headline：832×480：VBench 84.31，单 H100 17.0 FPS / 首帧 0.69 s | Self Forcing Tab. 1、Fig. 4；官方 README | ✅ |
| registry cost：DMD 64 H100 约 1.5 h；KV 梯度截断限制跨块优化，长程仍退化 | Self Forcing §4、App. A、Tab. 3 | ✅ |
| 主论文 venue：NeurIPS 2025（Spotlight） | [官方 Self-Forcing README](https://github.com/guandeh17/Self-Forcing) | ✅ |
|  /  Teacher Forcing  /  干净的真实帧  /  模型自己生成的帧  /  否 | Self Forcing §1、Fig. 1 | ✅ |
|  /  Diffusion Forcing（CausVid 属此类）  /  独立加噪的真实帧  /  否 | Self Forcing §1、Fig. 1 | ✅ |
|  /  Self Forcing  /  模型自己生成的帧（带 KV cache）  /  是 | Self Forcing §1、Fig. 1 | ✅ |
|  /  DMD（默认）  /  反向 KL，score 差作梯度  /  real score（14B）+ critic，只要 prompt  /  84.31  /  84.26 | Self Forcing Tab. 2、App. A、Tab. 3 | ✅ |
|  /  SiD  /  Fisher 散度（实际用 α = 1）  /  real score（1.3B）+ critic，只要 prompt  /  84.07  /  83.54 | Self Forcing Tab. 2、App. A、Tab. 3 | ✅ |
|  /  GAN  /  JS 散度近似（相对论损失 + 近似 R1/R2）  /  判别器 + 7 万条 14B 生成的视频  /  83.88  /  83.27 | Self Forcing Tab. 2、App. A、Tab. 3 | ✅ |
|  /  LongLive（NVIDIA 等，2025-09）  /  帧级自回归，以 Self Forcing 流程初始化；streaming long tuning：每次迭代沿用已存的 KV cache 把上一段续写，只对新生成的一段做 DMD（教师仍为 14B）——“训练长、测试长”；短窗口注意力 + frame sink（保留首个 chunk 的 KV）；切换 prompt 时 KV-recache  /  单张 H100 20.7 FPS，最长 240 s，微调约 32 GPU·天；短视频 VBench 总分 84.87（Self Forcing 84.31） | LongLive 摘要、Tab. 1 | ✅ |
|  /  Rolling Forcing（NTU、腾讯 ARC，2025-09）  /  滚动窗口联合去噪：窗口内各 chunk 处在递增的噪声水平、每步整体前移，放松相邻帧的严格因果；attention sink 保留开头 3 帧的 KV 作全局锚点；训练在扩展窗口上做 DMD，并与 Self Forcing 目标交替  /  30 秒视频 ΔDrift（质量漂移）0.01，Self Forcing 1.66；15.79 FPS / 0.76 s | Rolling Forcing Tab. 1 | ✅ |
|  /  Self-Forcing++（UCLA、字节 Seed 等，2025-10）  /  学生用滚动 KV cache 生成远超 5 秒的视频，从中均匀截取窗口、用 backward noise initialization 重新加噪，再用 5 秒的双向教师对窗口做 DMD；可选 GRPO 后训练；推理代码与 Self Forcing 相同  /  标准长视频实验为 100 秒（5 秒基座的约 20 倍）；扩大训练计算后达到 4 分 15 秒（位置编码跨度的 99.9%，约 50 倍） | Self-Forcing++ §1、摘要、项目页 | ✅ |
|  /  训练视频 latent  /  [B, 21, 16, 60, 104]  /  81 帧 · 832×480；B = 1/卡，64 卡总 batch 64 | Self Forcing §4、App. A；官方 pipeline/self_forcing_training.py（计数为推算） | ✅ |
|  /  chunk-wise 块  /  3 帧 × 1560 token = 4680  /  7 个块；frame-wise 为 21 个 1560-token 块 | Self Forcing §4、App. A；官方 pipeline/self_forcing_training.py（计数为推算） | ✅ |
|  /  训练 KV cache（每层）  /  K、V 各 [B, 32760, 12, 128]  /  21 × 1560；30 层 | 代码 self_forcing_training.py | ✅ |
|  /  一次展开的前向次数  /  每块 s 次去噪 + 1 次写缓存  /  s ∈ {1,…,4}；只有每块 1 次前向留梯度 | Self Forcing §4、App. A；官方 pipeline/self_forcing_training.py（计数为推算） | ✅ |
|  /  推理 NFE（chunk-wise，5 秒）  /  7 × (4 + 1) = 35 次块前向  /  4 步去噪 + 1 次写缓存（推算） | Self Forcing §4、App. A；官方 pipeline/self_forcing_training.py（计数为推算） | ⚠ |
|  /  滚动推理每步代价  /  O(TL)  /  T 去噪步数，L 窗口长度 | 论文 §3.4 | ✅ |
|  /  基座 / 学生  /  Wan2.1-T2V-1.3B；5 秒、16 FPS、832×480  /  论文 §4 | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  初始化  /  按 CausVid 流程：在 16k 条基座 ODE 轨迹上做因果回归  /  论文 §4 | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  步数  /  4 步 [1000, 750, 500, 250]，shift 5  /  论文附录 A | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  DMD  /  real score Wan2.1-T2V-14B（CFG 3.0）；critic 从 1.3B 初始化  /  附录 Tab. 3 | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  优化  /  batch 64；生成器 lr 2e-6、critic lr 4e-7；AdamW β₁ = 0、β₂ = 0.999、wd 0.01；EMA 0.99  /  附录 Tab. 3 | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  更新比  /  critic 5 : 生成器 1  /  官方代码 dfake_gen_update_ratio | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  算力  /  DMD 约 1.5 h / 64 H100；SiD、GAN 约 2–3 h  /  论文 §4、附录 A | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  GAN 版  /  batch 768；7 万条 14B 生成视频  /  附录 A、Tab. 3 | Self Forcing §4、App. A、Tab. 3；官方 configs/self_forcing_dmd.yaml | ✅ |
|  /  Wan2.1（双向，多步）  /  1.3B  /  832×480  /  0.78  /  103  /  84.26  /  85.30  /  80.09 | Self Forcing Tab. 1 | ✅ |
|  /  SkyReels-V2  /  1.3B  /  960×540  /  0.49  /  112  /  82.67  /  84.70  /  74.53 | Self Forcing Tab. 1 | ✅ |
|  /  MAGI-1  /  4.5B  /  832×480  /  0.19  /  282  /  79.18  /  82.04  /  67.74 | Self Forcing Tab. 1 | ✅ |
|  /  LTX-Video  /  1.9B  /  768×512  /  8.98  /  13.5  /  80.00  /  82.30  /  70.79 | Self Forcing Tab. 1 | ✅ |
|  /  CausVid（官方 Wan 版）  /  1.3B  /  832×480  /  17.0  /  0.69  /  81.20  /  84.05  /  69.80 | Self Forcing Tab. 1 | ✅ |
|  /  Self Forcing（chunk-wise）  /  1.3B  /  832×480  /  17.0  /  0.69  /  84.31  /  85.07  /  81.28 | Self Forcing Tab. 1 | ✅ |
|  /  NOVA  /  0.6B  /  768×480  /  0.88  /  4.1  /  80.12  /  80.39  /  79.05 | Self Forcing Tab. 1 | ✅ |
|  /  Pyramid Flow  /  2B  /  640×384  /  6.7  /  2.5  /  81.72  /  84.74  /  69.62 | Self Forcing Tab. 1 | ✅ |
|  /  Self Forcing（frame-wise）  /  1.3B  /  832×480  /  8.9  /  0.45  /  84.26  /  85.25  /  80.30 | Self Forcing Tab. 1 | ✅ |
| 自回归视频扩散模型在推理时，第 i 个 chunk 以自己刚生成的前 i−1 个 chunk 为条件。 | 论文 §1、Fig. 1；论文 §4 | ✅ |
| 训练不需要真实视频：DMD / SiD 版本是 data-free 的，只需要文本 prompt（约 25 万条，来自 VidProM 的 VidProS 子集，经 Qwen2.5-7B-Instruct 扩写）。 | 论文 §3.3、附录 A；论文 §4 | ✅ |
| chunk-wise 版本每个 chunk 3 个 latent 帧，frame-wise 版本每块 1 帧。 | 论文 §3.3、附录 A；论文 §4 | ✅ |
| 每个 chunk 从噪声出发，按 4 步时间表 [1000, 750, 500, 250]（再经 shift = 5 扭曲）去噪：预测 x̂₀、再加噪到下一个时刻。 | 论文附录 A | ✅ |
| s 随机保证 4 个时间步的去噪都被训练到（与推理用到的每一步一一对应）； | 论文 §3.2、Alg. 1 | ✅ |
| 7 个 chunk 拼成 21 个 latent 帧（81 帧、832×480，Wan2.1 的 5 秒）。 | Self Forcing §3、Alg. 1、App. A/B；官方 pipeline/self_forcing_training.py | ✅ |
| DMD 版本用 Wan2.1-T2V-14B 作 real score（CFG 3.0），而不是 1.3B 基座 。 | 论文附录 Tab. 3；官方代码 real_name: Wan2.1-T2V-14B | ✅ |
| 从 1.3B 基座初始化，在学生样本上做去噪训练； | 论文附录 Tab. 3；官方代码 dfake_gen_update_ratio: 5 | ✅ |
| 对 7 个 chunk 重复 ①–④。 | Self Forcing §3、Alg. 1、App. A/B；官方 pipeline/self_forcing_training.py | ✅ |
| 14B 教师与 fake score 评估同一段自生成视频。 | Self Forcing §3、Alg. 1、App. A/B；官方 pipeline/self_forcing_training.py | ✅ |
| 滚动 KV cache 生成超过 5 秒的视频。 | Self Forcing §3、Alg. 1、App. A/B；官方 pipeline/self_forcing_training.py | ✅ |
| 同样用 DMD 蒸馏成 4 步，chunk-wise 下 TF + DMD 82.32、DF + DMD 82.76、SF + DMD 84.31； | 论文 Tab. 2 | ✅ |
| frame-wise 下差距更大：78.12 / 80.56 / 84.26。 | 论文 Tab. 2 | ✅ |
| frame-wise 每步只生成 1 个 latent 帧、自回归次数是 chunk-wise 的 3 倍，误差累积的机会更多，因此“训练时是否见过自己的历史”影响更大。 | 论文 Tab. 2 | ✅ |
| 有意思的是，多步（50×2）的 TF / DF 模型本身在 chunk-wise 下分别是 83.58 / 82.95——4 步的 SF 学生超过了它们。 | 论文 Tab. 2 | ✅ |
| DMD 版本在 64 张 H100 上约 1.5 小时收敛（README：600 次迭代，64 张 H100 不到 2 小时）。 | 论文 §3.2、Fig. 6；论文 §4；官方 README | ✅ |
| 只在一个随机的 s：s 每次迭代均匀采样，使学生在 4 个时间步上都得到训练，也让“第 s 步的输入”恰好来自学生自己前面几步的输出——这就是 DMD2 的 backward simulation； | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| 三者合起来，一次迭代的反传开销约等于“7 个 chunk 各做一次单步前向”的计算图（推算）。 | 论文 §5 | ⚠ |
| 附录 Tab. 3 中 DMD 的 real score 是 Wan2.1-T2V-14B，SiD 是 Wan2.1-T2V-1.3B——DMD 与 SiD 的对比同时换了教师规模，不是纯粹的损失对比。 | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| 论文的 4 步时间表写作均匀的 [1000, 750, 500, 250]，官方默认配置的 same_step_across_blocks: true 让各块共用退出步； | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| 代码用 warp_denoising_step: true 按 shift = 5 映射到调度器的实际时刻，即 t ≈ 1, 0.9375, 0.833, 0.625（推算； | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ⚠ |
| 训练只见过 5 秒（21 个 latent 帧）。 | 论文 §3.4、附录 B；论文 §4；论文 §5 | ✅ |
| 10 秒视频上，每次平移都重算 KV 只有 4.6 FPS，滚动缓存 + 该技巧为 16.1 FPS。 | 论文 §3.4、附录 B；论文 §4；论文 §5 | ✅ |
| 7 个 chunk × 4 步无法全程反传 → 随机退出步 + 只留一步梯度 + KV 截断； | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| 没有变的是“非对称”：评委仍是双向教师（这里升级为 14B）。 | Self Forcing §3–5、Tab. 2；LongLive / Rolling Forcing / Self-Forcing++ 原文 | ✅ |
| Self Forcing 训练 5 秒、靠滚动缓存外推，几十秒后仍会漂移。 | Self Forcing §3.4；CausVid §5.1；LongLive Tab. 1；Rolling Forcing Tab. 1；Self-Forcing++ §1（按段落所述工作） | ✅ |
| 2025 年秋有三篇工作直接以它为起点，分别从“训练时见更长的自生成视频”“注意力结构”“去噪调度”三个方向补长视频： | Self Forcing §3.4；CausVid §5.1；LongLive Tab. 1；Rolling Forcing Tab. 1；Self-Forcing++ §1（按段落所述工作） | ✅ |
| 基座 Wan2.1-T2V-1.3B，流匹配约定 \(x_t=(1-t)x_0+t\epsilon\)，t ∈ [0, 1] 以 1000 为刻度，shift = 5 。 | 论文附录 A；官方代码 configs/self_forcing_dmd.yaml | ✅ |
| $$\mathcal L_\text{SF}(\theta)=\mathbb E_{t}\;D\big(p_{\theta,t}(x^{1:N})\,\big\ / \,p_{\text{data},t}(x^{1:N})\big),\qquad p_{\theta}(x^{1:N})=\prod_{i=1}^{N}p_\theta\big(x^{i}\mid \hat x^{\lt i}\big)$$ | Self Forcing §3.3、App. A | ✅ |
| $$\nabla_\theta\mathcal L_\text{DMD}\approx-\mathbb E_{t,\epsilon}\Big[\big(s_\text{real}(\hat x^{1:N}_t,t)-s_\text{fake}(\hat x^{1:N}_t,t)\big)\,\frac{\partial \hat x^{1:N}}{\partial\theta}\Big],$$ | Self Forcing §3.3、App. A | ✅ |
| 与 CausVid 速度完全相同（同一推理路径），差别全在训练：VBench 总分 81.20 → 84.31，语义分 69.80 → 81.28。 | Self Forcing Tab. 1、Fig. 4；官方 README | ✅ |
| chunk-wise 首帧延迟比 Wan2.1 / SkyReels-V2 低约 150 倍； | 论文 §4 | ✅ |
| frame-wise 首帧更快（0.45 s）但吞吐减半。 | 论文 §4 | ✅ |
| 用户研究中 Self Forcing 胜过所有基线，包括 Wan2.1 基座。 | 论文 Fig. 4 | ✅ |
| 官方 README 称可在单张 RTX 4090 上实时流式生成。 | 论文 Fig. 4 | ✅ |
| 远超 5 秒仍漂移 → 3.7 的 LongLive、Rolling Forcing、Self-Forcing++； | Self Forcing §5；Causal Forcing §3 | ✅ |
| 数据：4 步 DMD 下 chunk-wise TF / DF / SF 为 82.32 / 82.76 / 84.31； | Self Forcing §3–5、Tab. 2、Alg. 1 | ✅ |
| frame-wise 为 78.12 / 80.56 / 84.26——自回归次数越多（frame-wise），差距越大。 | Self Forcing §3–5、Tab. 2、Alg. 1 | ✅ |
| 实测每次迭代耗时与 TF / DF 相当，DMD 版约 1.5 小时（64 张 H100）收敛。 | Self Forcing §3–5、Tab. 2、Alg. 1 | ✅ |
| 牺牲①：每次迭代只训练一个时间步（靠随机 s 在期望上覆盖全部 4 步）。 | Self Forcing §3–5、Tab. 2、Alg. 1 | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | c-long 表格合并 LongLive、Rolling Forcing、Self-Forcing++，现有页没有三者各自的 h3；anchors 保留该合并锚点。DMD 与 SiD 使用不同教师规模，不是纯损失对照。代码默认各块共用退出步。Tab. 3 更新比行名方向易混，代码明确 critic 5 : G 1。Self-Forcing++ 的 100 s / 20× 和扩大训练的 255 s / 约 50× 分开写；其 HTML 不可用，已下载 PDF 并用 pdftotext 核对。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 13 — rCM（`13-rcm.html`）— 2510.08431；2512.16093；2606.25473

正文实验使用 [2510.08431v3](https://arxiv.org/html/2510.08431v3)（2026-05-06），节点月份仍取首版 2025-10。官方实现核查快照 `ed3cb14dd936f92cdc9f9381af7369991509b41f`，未运行模型训练或生成。

| Claim | Source | Status |
|---|---|---|
| 首版 rCM 2025-10；TurboDiffusion 2025-12；Causal-rCM 2026-06 | 各 arXiv abstract submission history：2510.08431、2512.16093、2606.25473 | ✅ |
| rCM 作者列表、Tsinghua / NVIDIA、ICLR 2026 | arXiv abstract、v3 首页、官方 README | ✅ |
| 文生图 Cosmos-Predict2 0.6B / 2B / 14B；视频 Wan2.1 T2V 1.3B / 14B；Cosmos TI2V 2B | rCM §5.1、Tab. 1–3 | ✅ |
| 纯 sCM 可运行后仍有小字、纹理、跨帧物体几何失真，扩模型不能自动修复 | rCM §3.3.1、Fig. 3 | ✅ 作者观察 |
| 误差随时间积累 / 大 t 自反馈主导；BF16 JVP 比输出误差更大 | rCM Eq. 5、§3.3.2、App. F.2、Fig. 12 | ✅ 作者分析与对照；不写成全部失真的唯一归因 |
| TrigFlow x_t=cos(t)x_0+sin(t)ε，t=0 数据、π/2 噪声；数据标准差吸收 | rCM §2.2 及脚注、Eq. 3 | ✅ |
| f_θ=cos(t)x_t−sin(t)F_θ，教师日程通过 SNR wrapper 转換，不需重训 | rCM §2.2、§3.1、Eq. 3 | ✅ |
| wrapper 用 FP64；视频 / 10B+ 使用全 JVP、时间嵌入 FP32，其余网络 BF16 | rCM §3.1、§4.2、App. F.2 | ✅ |
| FA2 JVP Triton 核支持 self- / cross-attention，同一流式循环输出 O 与 tangent | rCM §3.2、App. C.1、Alg. 2；[官方 kernel](https://github.com/NVlabs/rcm/blob/ed3cb14dd936f92cdc9f9381af7369991509b41f/rcm/utils/flash_attention_jvp_triton.py) | ✅ |
| JVP attention 链式法则：dS=dQKᵀ+QdKᵀ；dP=P⊙(dS−rowsum(P⊙dS))；dO=dPV+PdV | rCM App. C.1；正文省略普通 attention 缩放项并说明 | ✅ |
| 网络逐层显式传递 primal / tangent，FSDP 粒度匹配层边界 | rCM §3.2、App. C.2 | ✅ |
| Ulysses CP：[B,H,L/P,C] → [B,H/P,L,C]，QKV tangent 用相同 all-to-all | rCM §3.2 | ✅ |
| 原始 video latent 记法 [B,C,T,H,W]；score 预测同形；JVP 不物化 L×L 矩阵 | [t2v_model_distill_rcm.py](https://github.com/NVlabs/rcm/blob/ed3cb14dd936f92cdc9f9381af7369991509b41f/rcm/models/t2v_model_distill_rcm.py)；App. C.1 | ✅ |
| sCM θ⁻ 为 stop-gradient 当前参数，不是另一个 EMA 教师 | rCM §2.2、Eq. 4、Alg. 1 | ✅ |
| λ=0.01，LrCM=Lscm+λLdmd；不加 GAN 判别器；real / fake 分数差为长跳正则 | rCM §4.1、Eq. 6、§5.2 | ✅ |
| forward / reverse 是作者的目标类别解释，不把 sCM Eq. 4 等同精确 forward KL | rCM §1、§4、Fig. 4 | ✅ / ⚠ 解释边界 |
| 学生 / fake 从教师初始化，full-parameter tuning，教师 CFG 同时蒸馏 | rCM §5.1 | ✅ |
| rollout 去噪 / 重加噪交替；连续时间范围、单调随机步表；只反传最后去噪步 | rCM §4.1、Alg. 1 | ✅ |
| fake 在 detached 学生样本上用 TrigFlow FM，v=cos(t)ε−sin(t)x̂_0 | rCM §5.1、Alg. 1 | ✅ |
| Semi-continuous 时间差分 1e-4 在 2B 图像稳定，10B+ / 视频不够稳，改 FP32 时间嵌入与全 JVP | rCM §4.2 | ✅ |
| Eq. 4 归一化分母 ||g||²+0.1；代码 _student_scm_step 实际 ||g||+0.1，先转 double | rCM v3 Eq. 4；官方训练文件 line 611，快照 ed3cb14 | ✅ 差异已 callout |
| 论文实际训练使用哪种分母、是否排版错误 | 无作者说明已核实；正文明确标 unverified | ❓ |
| Wan 配置 loss_scale=100、loss_scale_dmd=1，相对比例 0.01 | [wan2pt1_t2v.py](https://github.com/NVlabs/rcm/blob/ed3cb14dd936f92cdc9f9381af7369991509b41f/rcm/configs/experiments/rcm/wan2pt1_t2v.py)；比例为推算 | ✅ / ⚠ 比例推算 |
| 代码 rollout 长度循环取模；论文 Alg. 1 为随机抽取 | 训练文件 _student_dmd_step；rCM Alg. 1 | ✅ 差异已 callout |
| 代码 DMD 分母 mean-abs clamp min 1e-5，伪代码保留；参数优化只经学生 | 训练文件 _student_dmd_step | ✅ |
| Wan 1.3B / 14B：batch 256 / 64；CP 1 / 10；学生 lr 2e-6 / 1e-6，fake lr 4e-7 / 1e-7 | rCM Tab. 4 | ✅ |
| Wan 学生更新频率 5 / 10；总迭代均 10k；CFG 5；max simulation 4；warmup 1000 / 200；EMA length 0.05 | rCM Tab. 4、Alg. 1；不误写成 5:1 fake:student | ✅ |
| AdamW β=(0,0.999)、weight decay 0.01，关闭 grad clipping | rCM App. D | ✅ |
| 推理 [atan(σmax),1.3,1.0,0.6]，少步取前 k 项；Wan metric σmax=1600，diversity 可视化 80 | rCM App. D、Tab. 4 | ✅ 评估 / 可视化协议区别 |
| Wan 视频 832×480×81；H100 batch 1 FPS 含扩散与 VAE；教师 50×2 NFE | rCM §5.1、Tab. 2 | ✅ |
| Wan1.3B 教师：FPS 0.72、Total 83.02、Quality 83.95、Semantic 79.26 | rCM Tab. 2 | ✅ |
| Wan1.3B DMD2 4 NFE：14.6 FPS、84.56 / 85.58 / 80.50 | rCM Tab. 2（作者同基座实现） | ✅ |
| Wan1.3B rCM 4 NFE：14.6 FPS、84.43 / 85.38 / 80.63 | rCM Tab. 2 | ✅ |
| Wan1.3B rCM 2 NFE：23.0 FPS、84.09 / 84.90 / 80.86 | rCM Tab. 2 | ✅ |
| Wan1.3B rCM 1 NFE：32.3 FPS、82.65 / 83.60 / 78.82 | rCM Tab. 2 | ✅ |
| Wan14B 教师：0.18 FPS、83.58 / 84.26 / 80.92 | rCM Tab. 2 | ✅ |
| Wan14B rCM 4 NFE：4.5 FPS、84.92 / 85.43 / 82.88 | rCM Tab. 2 | ✅ |
| Wan14B rCM 2 NFE：8.3 FPS、85.05 / 85.57 / 82.95 | rCM Tab. 2 | ✅ |
| Wan14B rCM 1 NFE：14.4 FPS、83.02 / 83.57 / 80.81 | rCM Tab. 2 | ✅ |
| Cosmos T2I 14B，1360×768：teacher 35×2 / GenEval .84；rCM 4 / .83、2 / .81、1 / .82 | rCM Tab. 1 | ✅ |
| Cosmos TI2V 2B，1280×704×93：teacher T2V83.03/I2V88.6/FPS.32；rCM 4 NFE 84.40/88.2/4.6 | rCM Tab. 3 | ✅ 不与 Wan 协议合并 |
| λ 消融 {1,.1,.01,.001}，batch64、10k iterations、5 seeds；大 λ 更高细节 / 更低样例差异 | rCM §5.2、Fig. 7 | ✅ 作者报告与样例 |
| 一步视频仍模糊，指标超过 teacher 不代表 diversity / physics 全面超过 | rCM §5.2、Fig. 6；作者明确 caveat | ✅ |
| TurboDiffusion 首版 2512.16093；rCM 步数蒸馏 + SLA 微调并行后合并更新，SageAttention2++ / SageSLA 与 W8A8 INT8，128×128 块 | [TurboDiffusion](https://arxiv.org/html/2512.16093) §1.1–1.3 | ✅ |
| Turbo 单 RTX5090、Wan1.3B 480P 184s→1.9s；速度配置3步、90% sparsity；建议4步 | TurboDiffusion §2.1、Fig. 1、Fig. 12 | ✅ 作者示例 / 配置 |
| Turbo 时延不含 text encoder / VAE；质量为视觉对照，不能当同协议 VBench | TurboDiffusion §2.2 | ✅ 计时边界 / ⚠ 证据边界 |
| Causal-rCM TF-CM offline 初始化 → SF-DMD on-policy，custom-mask FA2 JVP 支持 sCM / MeanFlow | [Causal-rCM](https://arxiv.org/html/2606.25473) §3.1–3.2、App. B、Tab. 5 | ✅ |
| TF-sCM 沿因果教师速度求导，干净历史切向为零；改 RF-native，TrigFlow wrapper 因归一化目标不同在因果设置表现较差 | Causal-rCM §3.1.2、Eq. 15–19、App. A | ✅ 作者对照与分析 |
| Causal-rCM frame-wise Wan1.3B：2-step Total84.63/NFE3；1-step Total84.63/NFE2；noisy-context2-step 83.11/NFE2 | Causal-rCM Tab. 4 | ✅ |
| clean context 需要额外 cache-update 前向；noisy context 复用末步 KV，少一次前向；首块始终4步 | Causal-rCM §3.1.3、§4.1 采样时间表 | ✅ 必要限定已注 |

开放项：论文与当前代码的归一化分母差异原因未核实；没有独立复现多样性或速度。主实验与后续 Turbo / Causal 的协议明确分开。建议基础谱系 `scm→rcm`、`dmd2→rcm`；若未来 Causal-rCM 独立成节点，再加 `meanflow`、`self-forcing`、`apt`、`causal-forcing`、`rcm` 的对应边。

## 14 — Causal Forcing (`14-causal-forcing.html`) — 2602.02214

核对全文：[arXiv v5 HTML](https://arxiv.org/html/2602.02214v5)，2026-06-01 修订。首次 arXiv：2026-02-02（[摘要页](https://arxiv.org/abs/2602.02214)）。公开代码来自 [thu-ml/Causal-Forcing](https://github.com/thu-ml/Causal-Forcing)，读取时 main tree SHA：`8202903297918bcd12810fc4230a4db7fe065e64`。

| Claim | Source | Status |
|---|---|---|
| 作者 Hongzhou Zhu、Min Zhao、Guande He、Hang Su、Chongxuan Li、Jun Zhu；Tsinghua / ShengShu / UT Austin / Renmin affiliations | 摘要页与全文作者区 | ✅ |
| 首次 arXiv 2026-02-02；ICML 2026 标注来自官方仓库 | arXiv 摘要 submission history；官方 README 标题 | ✅ |
| 采样步数缺口与双向→因果架构缺口不同；从已完成 DMD 的双向学生初始化后仍未补齐后者 | §3.1–3.2；Fig. 1–2 | ✅ |
| 双向 PF-ODE 完整状态确定终点，但投影到当前块后可能依赖其他块；因果学生无法看到未来 | Def. 3.1、Lemma 3.2、式 (4)–(7)、App. B.1 | ✅ |
| 论文 frame-level injectivity 的历史条件被省略；页面明确固定历史和文本后讨论函数是否良定义 | 式 (4) 后的历史省略说明；页面的可见输入 U 重述 | ⚠ 教学重述，未声称单帧跨历史也须有相同终点 |
| 平方回归最优解 E[Y\|U]；非零条件方差对应不可消除的平均误差 | Prop. 3.3、式 (5)/(7)、App. B.1 | ✅ |
| 最小平方误差 = E tr Cov(Y\|U) | 标准条件回归分解，由上条推导；正文标明“推导解释” | ⚠ 推导，不是论文实验数值 |
| TF 训练当前带噪块、干净历史；DF 带噪历史与干净前缀推理的条件分布差异 | §2.2、§3.3、Prop. 3.4、App. B.2 | ✅ |
| TF 的历史噪声对齐与真实历史/学生历史的暴露偏差是不同问题；论文结论有训练/采样前提 | §3.3、App. C.1；Self Forcing 页背景 | ✅ |
| 阶段 TF 的内部数据来自双向模型合成，并非声称全部真实拍摄 | §4.1、App. D training details | ✅ |
| 因果 ODE 固定数据干净前缀 h，当前块从高斯噪声采样；存储中间状态与教师终点 | §3.3 Stage 2、式 (8) | ✅ |
| 原历史和新 ODE 轨迹的对应关系须保留；ODE 学生从 AR 教师权重初始化 | App. D training details | ✅ |
| 多步 AR 初始化直接少步采样有块间突变；因果 ODE 后更稳定 | App. C.2、Fig. 7–8 | ✅ |
| 最后 DMD 沿用 Self Forcing 的自生成历史；主改进发生于初始化 | §3.3 Stage 3；官方 `pipeline/self_forcing_training.py` | ✅ |
| DMD 只匹配加噪分布，不要求逐样本 ODE 映射对齐，因此可保留双向 real score | §2.4、式 (2)、§3.3；官方 README FAQ | ✅ |
| 初始化教师为 TF AR 1.3B；最终 real score 为 Wan2.1-14B，fake score 为 Wan2.1-1.3B | §4.1、App. D | ✅ |
| 公开 DMD 默认 CFG=3、critic:generator=5:1、critic lr=4e-7 | `configs/causal_forcing_dmd_chunkwise.yaml` | ✅ |
| 自回归 causal CD 使用同一干净历史、AR 教师相邻 ODE 步、EMA 学生目标 | §3.4、式 (9) | ✅ |
| 原论文将“causal CD 替换 ODE 初始化后接 DMD”留作后续方向 | §3.4 最后一段 | ✅ |
| 流匹配 x_t=(1−t)x_0+tε，v=ε−x_0，t 从 1 到 0 | §2.1、式 (1) | ✅ |
| 基座 Wan2.1-T2V-1.3B；输出 81 帧、832×480 | §4.1 | ✅ |
| latent `[B,21,16,60,104]`；每 chunk 3 latent 帧 | `configs/causal_forcing_dmd_chunkwise.yaml` 的 `image_or_video_shape` / `num_frame_per_block`；§4.1 | ✅ |
| 当前块 `[B,3,16,60,104]`；整片 7 块 | 上条按 21÷3 计算；正文标记推算 | ⚠ 推算 |
| 4 步时间表 1,0.9375,0.8333,0.625；代码 [1000,750,500,250]、shift=5 | App. D；`configs/causal_forcing_dmd_chunkwise.yaml` | ✅ |
| NFE 只数每 chunk 去噪求值，历史 KV 写入仍有额外计算 | App. D 4-step inference；`pipeline/self_forcing_training.py` 的干净历史前向 | ✅ |
| DMD 更新方向为 real/fake score 差；fake score 用停止梯度学生样本训练 | 式 (2)、§3.3；官方 `model/dmd.py` | ✅ |
| D_bi 约 3K 样本、D_causal 3K 轨迹；TF 2K 更新 + causal ODE 1K 更新 | §4.1、App. D | ✅ |
| DMD 阶段在 VidProM 提示词训练 750 步至收敛 | §4.1 | ✅ |
| 论文 Adam batch=64、lr=2e-6、β1=0、β2=0.999 | App. D | ✅ |
| 公开 TF 与 DMD 配置 `total_batch_size=8`，DMD critic lr=4e-7；与论文默认描述不同 | `configs/ar_diffusion_tf_chunkwise.yaml`、`configs/causal_forcing_dmd_chunkwise.yaml` 对照 App. D | ✅ 差异已在 callout 标注 |
| causal CD 扩展：48 个离散时刻、UniPC、EMA 0.99、3K 训练步、4 步推理 | App. D extended causal CD | ✅ |
| 初始化对照更新数均为 3K；论文“相同训练预算”不能自动等于完整 pipeline GPU-hours | §4.2、App. D ablation details；页面成本解释 | ⚠ 限定解释 |
| 完整原论文管线 GPU-hours | 全文未给统一完整管线成本 | ❓ 页面标为未报告 |
| Tab. 1 Wan2.1-1.3B：Total/Quality/Semantic 83.37/84.30/79.65，Dynamic/Vision/Instruction 61/5.275/42 | Tab. 1 | ✅ |
| Tab. 1 CausVid：81.33/83.98/70.72，62/5.741/12 | Tab. 1 | ✅ |
| Tab. 1 Self Forcing：83.74/84.48/80.77，57/5.820/48 | Tab. 1 | ✅ |
| Tab. 1 Causal Forcing：84.04/84.59/81.84，68/6.326/56 | Tab. 1 | ✅ |
| 主表相对 SF 提升 Dynamic 19.3%、VisionReward 8.7%、Instruction 16.7% | Abstract、§4.2、Tab. 1 | ✅ 相对提升，非百分点 |
| 三种少步因果模型 H100 单卡 17.0 FPS、首帧 0.69 s；Wan 0.78 FPS / 103 s | Tab. 1；App. D performance comparison details | ✅ 基线效率沿用 SF 论文 |
| Dynamic/Vision/Instruction 用自选 100 条复杂动作 prompt，数值乘以 100；Total 内 Dynamic 仍用标准 VBench prompts | §4.1、App. D evaluation details | ✅ |
| Tab. 2 TF/DF AR 教师消融均训练 3K 步 | App. D ablation details | ✅ |
| Tab. 2 DF：Total81.76、Dynamic60、Vision1.583、Instruction30；TF：82.12/50/3.343/32 | Tab. 2 | ✅ |
| TF VisionReward +111.2%，DF 更高动态来自崩坏；不能称 TF 每项都更高 | §4.2、Tab. 2、Fig. 4 | ✅ 修正文中泛化措辞 |
| Tab. 1 SF83.74 与 Tab. 2 SF ODE+DMD82.00 不同，不能合并；论文未完整列出全部差异 | Tab. 1–2、§4.2、App. D | ✅ 差异；解释边界已标注 |
| asymmetric CD 在 §3.4 说双向教师，App. D 说两个 CD 都由 TF AR 教师蒸馏 | §3.4 vs App. D ablation details | ✅ 论文内部文字矛盾 |
| 后续仅指针：Causal Forcing++，first arXiv 2026-05-14 | [2605.15141 摘要页](https://arxiv.org/abs/2605.15141) | ✅ |
| 后续仅指针：Causal-rCM，first arXiv 2026-06-24，rCM 页负责展开 | [2606.25473 摘要页](https://arxiv.org/abs/2606.25473) | ✅ |
| 相关时间线：Causality in Video Diffusers is Separable from Denoising，first arXiv 2026-02-10 | [2602.10095 摘要页](https://arxiv.org/abs/2602.10095) | ✅ 只登记存在、标题和首版月份 |

建议入边：`causvid → causal-forcing`（修复双向轨迹初始化）、`self-forcing → causal-forcing`（因果教师初始化）、`progressive-distillation → causal-forcing`（图像→视频：检查因果回归可学习性）；可选 `consistency-models → causal-forcing`（causal CD 扩展）。详见 14-registry.json。

未创建共享 SOURCES.md，遵守文件分工；页面 footer 暂不链接尚不存在的共享文件。没有启动浏览器，SVG 坐标按文本审查；lead 负责最终渲染复核。

## 15 — Drifting Models (`15-drifting.html`) — 2602.04770, 2607.15065

| Claim | Source | Status |
|---|---|---|
| Generative Modeling via Drifting；作者：Mingyang Deng, He Li, Tianhong Li, Yilun Du, Kaiming He；首版 2026-02 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2602.04770) | ✅ |
| DriftWorld: Fast World Modeling through Drifting；作者：Susie Lu, Haonan Chen, Weirui Ye, Yilun Du；首版 2026-07 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2607.15065) | ✅ |
| registry modality：图像 · DiT，SD-VAE 潜空间 / 像素空间；另含 DriftWorld | Drifting Tab. 8；官方 README | ✅ |
| registry signal：冻结表征里的吸引 − 排斥场，stop-gradient 回归 | Drifting Eq. 6、11–14、18–26；Prop. 3.1；官方 README | ✅ |
| registry teacher：真实样本队列 + 冻结 SSL 编码器；无预训练扩散教师 / 判别器 | Drifting §3–5、App. A–C；DriftWorld §III–IV | ✅ |
| registry steps：1 NFE | Drifting Tab. 8；官方 README | ✅ |
| registry headline：ImageNet-256 FID-50K：潜空间 L/2 1.54，像素 L/16 1.61 | Drifting Tab. 4–6、Tab. 10；RDM Tab. 1 | ✅ |
| registry cost：从零训练与编码器训练；全局生成批量 8192，核比较按类别分组 | Drifting Tab. 8；官方 README | ✅ |
| 主论文 venue：NeurIPS 2026（Oral，作者项目页标注） | [作者 Drifting 项目页](https://lambertae.github.io/projects/drifting/)（Oral 依据作者标注） | ⚠ |
| 原始 Drifting 拉普拉斯核是否具有与高斯核完全相同的平滑分布分数差恒等式 | Drifting Eq. 12；Turan 等 arXiv:2603.09936 §4 的精确恒等式限定为高斯核 | ❓ |
|  /  \(V^+-V^-\)（默认）  /  8.46  /  p = q 时精确抵消 | Drifting Tab. 1 | ✅ |
|  /  \(1.5V^+-V^-\) / \(V^+-1.5V^-\)  /  41.05 / 46.28  /  平衡点不再是数据分布 | Drifting Tab. 1 | ✅ |
|  /  \(2V^+-V^-\) / \(V^+-2V^-\)  /  86.16 / 112.84  /  偏离越大越差 | Drifting Tab. 1 | ✅ |
|  /  只有吸引 \(V^+\)  /  177.14  /  没有排斥，样本挤向核加权均值 | Drifting Tab. 1 | ✅ |
|  /  Lift（state / visual）  /  0.98 / 1.00  /  1.00 / 1.00 | Drifting Tab. 7、§5.3 | ✅ |
|  /  Can（state / visual）  /  0.96 / 0.97  /  0.98 / 0.99 | Drifting Tab. 7、§5.3 | ✅ |
|  /  ToolHang（state / visual）  /  0.30 / 0.73  /  0.38 / 0.67 | Drifting Tab. 7、§5.3 | ✅ |
|  /  PushT（state / visual）  /  0.91 / 0.84  /  0.86 / 0.86 | Drifting Tab. 7、§5.3 | ✅ |
|  /  BlockPush（phase 1 / 2）  /  0.36 / 0.11  /  0.56 / 0.16 | Drifting Tab. 7、§5.3 | ✅ |
|  /  Kitchen（phase 3 / 4）  /  1.00 / 0.99  /  0.99 / 0.96 | Drifting Tab. 7、§5.3 | ✅ |
|  /  类别 × 每类生成数  /  Nc × Nneg = 128 × 64 = 8192  /  有效批量 B；每个类别独立计算漂移 | Tab. 8、§4 | ✅ |
|  /  噪声 ε  /  [8192, 32, 32, 4] + 32 个风格下标 ∈ [0, 64)  /  与 SD-VAE 潜变量同形 | §4、§A.2 | ✅ |
|  /  生成器 token  /  16 + 256 个，宽 1024，24 层  /  patch 2：32×32 → 16×16 | §A.2、Tab. 8 | ✅ |
|  /  生成样本 x  /  [8192, 32, 32, 4]  /  像素版为 [·, 256, 256, 3]，DiT/16 同样 256 个 token | Drifting Tab. 8、App. A.2–A.6（核矩阵形状为推算） | ✅ |
|  /  编码器特征图  /  32²×C, 16²×2C, 8²×4C, 4²×8C，C = 640  /  每 2 个残差块取一次 | §A.3、§A.5 | ✅ |
|  /  每个特征向量的核矩阵（每类）  /  [64, 64 + 64 + 32]  /  行：生成样本；列：负（含自身，对角屏蔽）+ 正 + 无条件 由 Tab. 8 的 Nneg、Npos、Nunc 推算 | Drifting Tab. 8、App. A.2–A.6（核矩阵形状为推算） | ⚠ |
|  /  漂移 Vj  /  [64, Cj]  /  3 个温度各算一次，归一化后相加 | Drifting Tab. 8、App. A.2–A.6（核矩阵形状为推算） | ✅ |
|  /  推理  /  1 NFE  /  无 φ、无队列；像素 L/16 约 87 GFLOPs | §5.2 | ✅ |
|  /  生成器  /  DiT-B/2（133M）、L/2（463M）；像素 B/16（134M）、L/16（464M）；16 个上下文 token，32 个风格 token  /  论文 Tab. 5、6、8 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  批量（最终）  /  Nc = 128，Nneg = 64，Npos = 128（B/2）/ 64（L/2），Nunc = 32，有效批 8192  /  论文 Tab. 8 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  消融默认  /  B/2，100 epoch（30k 步），Nc = Npos = Nneg = 64，有效批 4096  /  论文 Tab. 8 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  优化器  /  AdamW（β = 0.9, 0.95），lr 4e-4（B/2、L/2、L/16）/ 2e-4（消融、B/16），warmup 10k（消融 5k），梯度裁剪 2.0；潜空间 200k 步 = 1280 epoch，像素 100k 步 = 640 epoch；EMA 在 {0.999, 0.9995, 0.9998, 0.9999} 中取  /  论文 Tab. 8；官方 configs/gen/*.yaml 一致 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  温度  /  τ ∈ {0.02, 0.05, 0.2}，每个温度一项，全部相加，不随配置调整  /  论文 Tab. 8、§A.6 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  特征编码器  /  latent-MAE ResNet，宽 640，[3, 4, 6, 3] 块，掩码率 50%，预训练 1280 epoch + 3k 步分类微调；MAE 训练 lr 4e-3、批 8192  /  论文 Tab. 8、§A.3 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  CFG  /  训练 α ∈ [1, 4]；推理在 [1.0, 3.5] 内搜索  /  论文 Tab. 8 | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  算力  /  消融 64 张 TPU v6e，最终模型 128 张 TPU v6e  /  官方仓库 README | Drifting Tab. 5–6、Tab. 8、App. A；官方 README | ✅ |
|  /  SiT-XL/2 + REPA  /  SD-VAE  /  675M+49M  /  250×2  /  1.42  /  305.7 | Drifting Tab. 5–6 | ✅ |
|  /  RAE + DiTDH-XL/2  /  RAE  /  839M+415M  /  50×2  /  1.13  /  262.6 | Drifting Tab. 5–6 | ✅ |
|  /  iCT-XL/2  /  SD-VAE  /  675M+49M  /  1  /  34.24  /  – | Drifting Tab. 5–6 | ✅ |
|  /  Shortcut-XL/2  /  SD-VAE  /  675M+49M  /  1  /  10.60  /  – | Drifting Tab. 5–6 | ✅ |
|  /  MeanFlow-XL/2  /  SD-VAE  /  676M+49M  /  1  /  3.43  /  – | Drifting Tab. 5–6 | ✅ |
|  /  iMeanFlow-XL/2  /  SD-VAE  /  610M+49M  /  1  /  1.72  /  282.0 | Drifting Tab. 5–6 | ✅ |
|  /  Drifting B/2  /  SD-VAE  /  133M+49M  /  1  /  1.75  /  263.2 | Drifting Tab. 5–6 | ✅ |
|  /  Drifting L/2  /  SD-VAE  /  463M+49M  /  1  /  1.54  /  258.9 | Drifting Tab. 5–6 | ✅ |
|  /  PixelDiT/16  /  像素  /  797M  /  200×2  /  1.61  /  292.7 | Drifting Tab. 5–6 | ✅ |
|  /  StyleGAN-XL  /  像素  /  166M  /  1  /  2.30  /  265.1 | Drifting Tab. 5–6 | ✅ |
|  /  EPG-L/16  /  像素  /  540M  /  1  /  8.82  /  – | Drifting Tab. 5–6 | ✅ |
|  /  Drifting L/16  /  像素  /  464M  /  1  /  1.61  /  307.5 | Drifting Tab. 5–6 | ✅ |
| 噪声由两部分组成：32×32×4 的高斯噪声，以及 32 个“风格 token”——每个是从 64 个可学习嵌入的码本里均匀抽的随机下标，求和后加到条件向量上。 | 论文 §A.2 | ✅ |
| 去掉风格嵌入，消融 FID 8.46 → 8.86 。 | 论文 §A.2 | ✅ |
| 条件是类别 c 和 CFG 强度 α（训练时随机采样，见 3.4）。 | 论文 §A.2 | ✅ |
| DiT 式 Transformer，patch 2（潜空间）或 16（像素空间），都得到 16×16 = 256 个 token； | 论文 §A.2、Tab. 8、Tab. 5 | ✅ |
| 采用 SwiGLU、RoPE、RMSNorm、QK-Norm，条件经 adaLN 并额外拼 16 个上下文 token。 | 论文 §A.2、Tab. 8、Tab. 5 | ✅ |
| B/2：宽 768、12 层，133M； | 论文 §A.2、Tab. 8、Tab. 5 | ✅ |
| L/2：宽 1024、24 层，463M 。 | 论文 §A.2、Tab. 8、Tab. 5 | ✅ |
| 默认编码器是作者自训的 ResNet 式 MAE（直接在 SD-VAE 潜空间上做掩码重建，再做 3k 步分类微调），输出 32²、16²、8²、4² 四个尺度的特征图； | 论文 §5.2 | ✅ |
| 实现上不用专门的数据加载器，而是像 MoCo 一样维护样本队列：每类一个长 128 的队列、无条件全局队列长 1000，每步推入 64 个新样本 。 | 论文 §A.7、§A.8 | ✅ |
| 温度 τ ∈ {0.02, 0.05, 0.2} 各算一次、各自归一化后相加。 | Drifting Alg. 1–2、App. A；官方 drift_loss.py | ✅ |
| 像素空间 L/16 生成一张图约 87 GFLOPs，StyleGAN-XL 为 1574 GFLOPs 。 | 论文 §5.2 | ✅ |
| 每个类别采 Nneg = 64 份噪声，并采一个 CFG 强度 α。 | Drifting Alg. 1–2、App. A；官方 drift_loss.py | ✅ |
| 若 \(V_{p,q}=-V_{q,p}\)，则 \(q=p\Rightarrow V=-V\Rightarrow V=0\)（论文 Prop. 3.1）。 | Drifting §3.2–3.3、Tab. 1/2/11 | ✅ |
| 作者用 mean-shift 构造满足它的场：\(V^+_p\) 是以核为权重的“正样本均值减 x”，\(V^-_q\) 是“负样本均值减 x”，两者相减后 x 被消掉，得到只含 \(y^+-y^-\) 的形式（式 11），交换 p、q 恰好变号。 | Drifting §3.2–3.3、Tab. 1/2/11 | ✅ |
| 反对称不是装饰：故意打破它，ImageNet 消融（B/2，100 epoch）立刻崩溃 —— | 论文 Tab. 1 | ✅ |
| 固定总批量 B = 4096，把每类正样本从 1 加到 64，FID 20.43 → 8.46； | 论文 Tab. 2；论文 Tab. 11、§B.2 | ✅ |
| 把负样本从 8 加到 64（类别数相应减少），11.82 → 8.46 。 | 论文 Tab. 2；论文 Tab. 11、§B.2 | ✅ |
| 核归一化方面，对 x、y 两轴都做 softmax 8.46，只对 y 做 8.92，完全不归一化 10.54——三者都满足平衡条件，所以都不崩 。 | 论文 Tab. 2；论文 Tab. 11、§B.2 | ✅ |
| 把损失写到特征 \(\varphi_j\) 上（式 13–14），正负样本也取特征。 | 论文 §3.4 | ✅ |
| ResNet 每 2 个残差块取一次特征图，对每张图取 (a) 每个位置的向量、(b) 全局均值和标准差、(c) 2×2 块均值 / 标准差、(d) 4×4 块均值 / 标准差，每个向量单独算一个漂移损失。 | 论文 §A.5 | ✅ |
| (a,b) 9.58 → (a–c) 9.10 → (a–d) 8.46 。 | 论文 §A.5 | ✅ |
| 单独用 τ = 0.02 / 0.05 / 0.2 分别为 10.62 / 8.67 / 8.96，三者相加 8.46，且之后不再调 。 | 论文 §A.6 | ✅ |
| 公开的 SimCLR / MoCo-v2（ResNet-50，需先过 VAE 解码到像素）分别 11.05 / 8.41； | 论文 Tab. 3；论文 Tab. 9 | ✅ |
| 潜空间 MAE 宽 256 为 8.46，加宽到 640 并训 1280 epoch 为 4.28，再做分类微调 3.36 。 | 论文 Tab. 3；论文 Tab. 9 | ✅ |
| 像素空间更依赖编码器：同一 MAE 下像素版 32.11（潜空间 8.46），加入 ConvNeXt-V2 后 3.70 。 | 论文 Tab. 3；论文 Tab. 9 | ✅ |
| L/2 的最佳 FID 出现在 α = 1.0（扩散里相当于“不用 CFG”），B/2 在 α = 1.1 。 | 论文 §3.5；论文 §A.7、Tab. 8；官方 configs 一致；论文 §B.3 | ✅ |
| 把 Diffusion Policy 里 100 步的扩散生成器换成一步 Drifting 生成器，其余协议不变； | 论文 §5.3；论文 Tab. 7 | ✅ |
| 成功率（最后 10 个 checkpoint 平均）大多持平或更好，个别任务略降 ： | 论文 §5.3；论文 Tab. 7 | ✅ |
| DriftWorld（Lu, Chen, Ye, Du）把 Drifting 用于动作条件的视频世界模型：给定当前帧、3 帧历史和 T 个动作，一次前向生成 T 帧未来； | DriftWorld §II、§IV-A | ✅ |
| 与 MSE 不同，每个样本的更新依赖其他 N − 1 个生成样本，这一机制区别于独立 MSE 回归； | DriftWorld 式 (2)、§III-C、§IV-E | ✅ |
| RT-1 上 FVD 191.05 → 62.84（α = 2.5）——这是 CFG 式负样本思想的直接迁移。 | DriftWorld §III-D、Tab. V | ✅ |
| 真实场景在 SD3 VAE 潜空间生成，漂移损失在 DINOv3 的逐帧 16×16 patch 特征上计算； | DriftWorld §III-D、Tab. V | ✅ |
| Bridge-V2 单步预测：不用特征 FID 34.24 / FVD 168.34，DINOv3 0.62 / 6.20。 | DriftWorld §III-D、Tab. V | ✅ |
| 速度是主要卖点：Bridge-V2 每帧 0.0242 s，IRASim 1.1031 s； | DriftWorld Tab. IV；DriftWorld Tab. III、§IV-D | ✅ |
| FID / FVD 4.86 / 46.05 对 10.46 / 91.55； | DriftWorld Tab. IV；DriftWorld Tab. III、§IV-D | ✅ |
| 但 RT-1 上 FID 8.99 不如 IRASim 的 4.60（FVD 62.84 对 93.02 更好）。 | DriftWorld Tab. IV；DriftWorld Tab. III、§IV-D | ✅ |
| 用它给 Push-T 策略的 50 个候选动作打分（GPC-RANK），IoU 0.635 → 0.772； | DriftWorld Tab. IV；DriftWorld Tab. III、§IV-D | ✅ |
| 作为离线评估器，与真实成功率的 Pearson 相关 0.9755 / 0.9958 / 0.9618（Push-T / Lift / Can）。 | DriftWorld Tab. IV；DriftWorld Tab. III、§IV-D | ✅ |
| $$x_{i+1}=x_i+V_{p,q_i}(x_i),\qquad \mathcal L=\mathbb E_{\epsilon}\Big\lVert G_\theta(\epsilon)-\mathrm{sg}\big(G_\theta(\epsilon)+V_{p,q_\theta}(G_\theta(\epsilon))\big)\Big\rVert^2$$ | Drifting Eq. 6、11–14、18–26；Prop. 3.1；官方 README | ✅ |
| $$V_{p,q}(x)=V^+_p(x)-V^-_q(x)=\frac{1}{Z_pZ_q}\,\mathbb E_{p,q}\big[k(x,y^+)\,k(x,y^-)\,(y^+-y^-)\big],\qquad k(x,y)=\exp\!\Big(-\tfrac{1}{\tau}\lVert x-y\rVert\Big)$$ | Drifting Eq. 6、11–14、18–26；Prop. 3.1；官方 README | ✅ |
| $$\mathcal L_\text{feat}=\sum_j\mathbb E\Big\lVert\tilde\varphi_j(x)-\mathrm{sg}\big(\tilde\varphi_j(x)+\tilde V_j\big)\Big\rVert^2,\qquad \tilde V_j=\sum_{\tau\in\{0.02,0.05,0.2\}}\frac{V_{j,\tau}}{\lambda_{j,\tau}}$$ | Drifting Eq. 6、11–14、18–26；Prop. 3.1；官方 README | ✅ |
| ImageNet 256×256，FID-50K，所有生成器都从零训练（无蒸馏）： | 论文 Tab. 5、Tab. 6 | ✅ |
| 从消融到最终（潜空间）：3.36（B/2，100 epoch）→ 2.51（320 epoch）→ 1.75（1280 epoch + 调参）→ 1.54（L/2）； | 论文 Tab. 4、Tab. 10 | ✅ |
| 像素：3.70 → 2.19 → 1.76（640 epoch）→ 1.61（L/16）。 | 论文 Tab. 4、Tab. 10 | ✅ |
| B/2（133M）已与此前 XL 级一步模型相当； | 论文 Fig. 11 说明 | ✅ |
| 与 iMF 在相同 IS 下对比（CFG 1.5）为 FID 3.01 / IS 354.4，iMF 可视化设置为 3.92 / 348.2 。 | 论文 Fig. 11 说明 | ✅ |
| RDM 用 14 个编码器的 SWr14 重新测量时，Drifting-L 在 Inception 上与真实数据持平（比值 0.97），但在 DINOv3 上比值高达 18.2，总分 5.93，是该表所列生成器中最差的（iMF-XL 5.02，SiT-XL/2 4.27）。 | RDM Tab. 1 | ✅ |
| 一步生成要么蒸馏教师（DMD、一致性蒸馏），要么从零训练时近似 ODE 轨迹（iCT、Shortcut、MeanFlow：最好 1.72）。 | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| MMD / 矩匹配生成网络（2015）被认为太弱。 | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| 用反对称核场在训练时演化分布，不要 ODE、不要对抗，一步 1.54 / 1.61。 | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| 已核实的后续工作（无单独页面）：Generative Drifting is Secretly Score Matching（2026-03，高斯核下漂移 = 平滑分布的分数差）； | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| Sinkhorn-Drifting（2026-03，与 Sinkhorn 散度梯度流的联系）； | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| Drift-AR（2026-03，把熵当作反对称漂移场初始状态的方差，让 AR-扩散混合模型的视觉解码一步完成，报告 3.8–5.5× 加速）； | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| DriftXpress（2026-05）； | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| Drift Flow Matching（2026-05）。 | Drifting §C.1–C.2；各后续 arXiv 摘要 | ✅ |
| 消融：\(1.5V^+-V^-\) 时 FID 8.46 → 41.05，只留吸引项 177.14——没有生成样本之间的排斥，样本只会挤向核加权的数据均值。 | Drifting §3.2–3.4、§5.2–5.3、Tab. 1/3；DriftWorld Tab. V | ✅ |
| 核方法完全依赖“近”的度量是否有语义：在高维潜变量 / 像素空间，L2 距离让核几乎处处平坦、漂移信号消失，所以 ImageNet 必须在 SSL 特征里算（编码器越好 FID 越低：11.05 → 3.36）； | Drifting §3.2–3.4、§5.2–5.3、Tab. 1/3；DriftWorld Tab. V | ✅ |
| DriftWorld 在视频上沿用这一点：真实场景用 DINOv3 特征，FID 34.24 → 0.62。 | Drifting §3.2–3.4、§5.2–5.3、Tab. 1/3；DriftWorld Tab. V | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | 反对称是充分条件，零场逆命题没有原论文一般保证；平衡性质指总体场，有限批仍有噪声。像素版使用 pixel-MAE + ConvNeXt-V2。Tab. 8 的残差块类型与 App. A.3 / Tab. 3 不一致，原页保留。官方 README FID 复测与论文有小差异。高斯核分数差理论已查原文，但原模型拉普拉斯核是否有同样精确恒等式仍标未核实。DriftWorld 多模态现象是实验支持，不是单正样本目标的一般保证。未画 MeanFlow→Drifting 的方法继承箭头；二者主要是替代范式。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 16 — RDM / iRDM (`16-rdm.html`) — 2607.02375

| Claim | Source | Status |
|---|---|---|
| Representation Distribution Matching for One-Step Visual Generation；作者：Lan Feng, Wuyang Li, Eloi Zablocki, Matthieu Cord, Alexandre Alahi；首版 2026-07 | [arXiv 摘要 / submission history](https://arxiv.org/abs/2607.02375) | ✅ |
| registry modality：图像 · pMF-H FD-SIM / FLUX.2 [klein] 4B | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
| registry signal：冻结表征的 MMD；多编码器比例式拉格朗日加权 | RDM Eq. 2–5、§3.3；官方 pid_lagrangian.py、trainer.py、joint_feature.py | ✅ |
| registry teacher：冻结编码器 + 离线参考集；不需在线教师 / critic | RDM §3–4、Tab. 1–4、App. C/E；官方训练实现 | ✅ |
| registry steps：1（FLUX 起点为 4 步） | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
| registry headline：ImageNet SWr14 1.30；FLUX 一步 GenEval 0.826 / PickScore 22.76 | RDM Tab. 1–2、App. E.2、Tab. 8 | ✅ |
| registry cost：ImageNet batch 5120；文生图 batch 10240、约 90 H200 GPU·h | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
| 主论文 venue：arXiv 预印本（2026） | [arXiv 预印本](https://arxiv.org/abs/2607.02375) | ✅ |
|  /  mmdx（精确排斥 + Nyström 吸引）  /  1.420  /  4.495 | RDM Tab. 4、§4.4 | ✅ |
|  /  mmd_rff（冻结 RFF 均值）  /  1.466  /  4.839 | RDM Tab. 4、§4.4 | ✅ |
|  /  mmd_exact（逐批精确交叉项）  /  1.492  /  5.438 | RDM Tab. 4、§4.4 | ✅ |
|  /  fd（Fréchet）  /  1.547  /  5.798 | RDM Tab. 4、§4.4 | ✅ |
|  /  sw（Sliced-Wasserstein，128 投影）  /  1.583  /  6.413 | RDM Tab. 4、§4.4 | ✅ |
|  /  drifting（官方力场的移植，批 8192，约 60 步）  /  1.746  /  8.258 | RDM Tab. 4、§4.4 | ✅ |
|  /  未训练  /  –  /  1.927  /  2.085 | RDM App. C、Tab. 6 | ✅ |
|  /  512  /  5.1e-7  /  2.067  /  2.521 | RDM App. C、Tab. 6 | ✅ |
|  /  1280  /  8.0e-7  /  1.429  /  2.061 | RDM App. C、Tab. 6 | ✅ |
|  /  2560  /  1.1e-6  /  1.363  /  2.053 | RDM App. C、Tab. 6 | ✅ |
|  /  5120  /  1.6e-6  /  1.253  /  2.006 | RDM App. C、Tab. 6 | ✅ |
|  /  10240  /  2.3e-6  /  1.285  /  2.027 | RDM App. C、Tab. 6 | ✅ |
|  /  生成批（ImageNet）  /  N = 5120 张 256×256 像素图  /  pMF-H 为像素空间一步模型；1 NFE | §4.1 | ✅ |
|  /  每个编码器的嵌入  /  [5120, D]，D = 1024–2048  /  例：Inception 2048、DINOv3-L 1024、AIMv2-H 1536、DreamSim 1792 | Tab. 5 | ✅ |
|  /  排斥核矩阵  /  [5120, 5120] × 10 个编码器  /  精确计算 | RDM §3.1、§4.1–4.2、App. B/E/F | ✅ |
|  /  Nyström 映射 ψ  /  [5120, 4096] → 与冻结的 μ̄ ∈ ℝ4096 内积  /  \(K_{mm}^{-1/2}\) 离线算好 | §3.1 | ✅ |
|  /  参考数据  /  n = 1.28M 张，只在离线阶段编码一次  /  每步不再接触真实数据 | RDM §3.1、§4.1–4.2、App. B/E/F | ✅ |
|  /  文生图  /  N = 10240 张 512×512；联合特征 D + 1152；m = 8192  /  参考约 30 万对教师生成 | §4.2、App. E、App. F | ✅ |
|  /  评估  /  每组 16384 张，M = 1024 个投影，14 个编码器  /  | §4.1 | ✅ |
|  /  起点  /  pMF-H FD-SIM（已发布）  /  FLUX.2 [klein] 4B，4 步检查点 | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  步数 / 学习率  /  4000 步，1.6e-6  /  180 步，2.83e-6 | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  生成批量 N  /  5120  /  10240 | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  编码器  /  10 个训练 + 4 个留出  /  同左，图像特征 ⊕ SigLIP2 文本特征 | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  参考  /  1.28M 训练图，4096 landmark  /  约 30 万教师生成，8192 landmark，带宽 0.25×中位数 | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  加权  /  门控比例式拉格朗日，预算 Σ = 10，地板来自验证集  /  同左 | RDM §4.1–4.2、App. B/E.1；官方 README | ⚠ |
|  /  算力  /  8 卡（README 示例）  /  约 90 H200 GPU·h | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
|  /  Drifting-L⋆（1 步）  /  0.97  /  3.20  /  6.12  /  18.2  /  7.89  /  5.93  /  4.91 | RDM Tab. 1 | ✅ |
|  /  iMF-XL（1 步）  /  0.96  /  2.96  /  5.07  /  15.2  /  7.26  /  5.02  /  4.08 | RDM Tab. 1 | ✅ |
|  /  SiT-XL/2  /  1.29  /  2.68  /  4.53  /  9.94  /  6.36  /  4.27  /  3.63 | RDM Tab. 1 | ✅ |
|  /  pMF-H base（1 步）  /  1.25  /  3.15  /  3.91  /  6.62  /  6.69  /  4.09  /  3.63 | RDM Tab. 1 | ✅ |
|  /  RAE-XL⋆  /  0.75  /  2.11  /  2.38  /  2.76  /  4.51  /  2.43  /  2.18 | RDM Tab. 1 | ✅ |
|  /  REPA-E SiT-XL/1⋆  /  0.75  /  1.86  /  2.79  /  3.30  /  3.89  /  2.40  /  2.14 | RDM Tab. 1 | ✅ |
|  /  pMF-H FD-SIM⋆（1 步，iRDM 起点）  /  0.67  /  0.60  /  1.81  /  2.33  /  4.76  /  2.05  /  1.98 | RDM Tab. 1 | ✅ |
|  /  iRDM⋆（1 步）  /  1.27  /  0.83  /  1.35  /  1.11  /  1.22  /  1.30  /  1.54 | RDM Tab. 1 | ✅ |
|  /  FLUX.2 [klein]（4 步）  /  0.994  /  0.904  /  0.791  /  0.880  /  0.575  /  0.623  /  0.794  /  22.58 | RDM Tab. 2 | ✅ |
|  /  未训练（1 步）  /  0.894  /  0.323  /  0.603  /  0.673  /  0.225  /  0.128  /  0.474  /  19.95 | RDM Tab. 2 | ✅ |
|  /  DMD2（1 步，作者复现）  /  0.997  /  0.894  /  0.806  /  0.864  /  0.603  /  0.660  /  0.804  /  22.36 | RDM Tab. 2 | ✅ |
|  /  iRDM 边缘版（1 步）  /  0.991  /  0.899  /  0.763  /  0.910  /  0.638  /  0.608  /  0.801  /  22.70 | RDM Tab. 2 | ✅ |
|  /  iRDM 联合版（1 步）  /  0.994  /  0.924  /  0.756  /  0.923  /  0.650  /  0.708  /  0.826  /  22.76 | RDM Tab. 2 | ✅ |
| 2026 上半年出现了一批不需要在线教师的一步生成器：Drifting 用核化的吸引 / 排斥场在冻结特征里推动样本； | FD-loss 摘要 | ✅ |
| Representation Fréchet Loss（FD-loss）直接把特征空间的 Fréchet 距离当损失，在 Inception 特征下把一步生成器推到 FID 0.72 。 | FD-loss 摘要 | ✅ |
| $$\mathcal L(\theta)=\mathcal D\big(\varphi_\#p_\theta,\ \varphi_\#p_\text{data}\big)$$ | RDM §1、Tab. 1–2；FD-loss 摘要 | ✅ |
| iRDM 是后训练配方：ImageNet 上从已发布的 pMF-H FD-SIM（像素 MeanFlow，再经 SigLIP+Inception+MAE 的 FD-loss 后训练）出发训 4000 步； | 论文 §4.1、§4.2 | ✅ |
| 文生图上从 4 步 FLUX.2 [klein]（4B）出发，直接用 1 步采样训 180 步 。 | 论文 §4.1、§4.2 | ✅ |
| 初始的 1 步 FLUX 很差（GenEval 0.474）。 | 论文 §4.1、§4.2 | ✅ |
| 训练用 10 个冻结骨干，覆盖监督分类、自监督蒸馏与掩码重建、语言监督、多模态自回归、人类相似度微调等范式——让它们“以不同方式失效”。 | 论文 App. B、Tab. 5 | ✅ |
| 每个编码器取单个池化嵌入（cls / avg / attention pool），维度 1024–2048，不做特征归一化 。 | 论文 App. B、Tab. 5 | ✅ |
| 另有 4 个编码器只用于评估。 | 论文 App. B、Tab. 5 | ✅ |
| 每个编码器：对 128 万张训练图像的特征做 k-means 取 m = 4096 个 landmark，算 \(K_{mm}^{-1/2}\)，再对全部数据平均得到 \(\bar\mu_\varphi\)； | 论文 §3.1、App. E.1 | ✅ |
| 文生图的参考是约 30 万条教师离线生成的图文对，用 8192 个 landmark 。 | 论文 §3.1、App. E.1 | ✅ |
| 其余在固定预算 Σ = 10 内按 softmax 分配，离真实越远的权重越大； | 论文 §3.3、§4.1 | ✅ |
| 对 14 个编码器各算 Sliced-Wasserstein 比值再平均，真实验证集按构造得 1； | 论文式 (5)、§4.1、App. B | ✅ |
| 每组 16384 个样本、1024 个投影 。 | 论文式 (5)、§4.1、App. B | ✅ |
| 10 个冻结编码器（文生图另加文本编码）。 | RDM Fig. 2、§3–4、App. B/E；官方训练实现 | ✅ |
| 用不共享训练机制的 SWr14 与 PickScore 检查。 | RDM Fig. 2、§3–4、App. B/E；官方训练实现 | ✅ |
| Drifting 自己的最终生成批量为 8192，不能解读为它只能用很小的总训练批量 。 | 论文 §3 开头；Drifting Tab. 8；RDM §3 | ✅ |
| 64 维环境空间里埋一条双圈螺旋，同一 MLP 生成器在匹配预算下换目标、扫批量 B ∈ {8, 32, 128}：Fréchet 与批量无关、始终描不出曲线； | 论文 Fig. 3 | ✅ |
| Drifting（参考库 128，尽力调参）在大批量坍缩； | 论文 Fig. 3 | ✅ |
| 同一 pMF-H 起点、只对 DINOv2 cls 一个编码器微调 100 步、只换距离，用两个“中立”距离打分（越低越接近真实，基线 1.927 / 10.393）： | 论文 Tab. 4、§4.4 | ✅ |
| 作者在匹配墙钟时间（约 6000 s）下扫 N，学习率按 \(\sqrt N\) 缩放，单编码器 DINOv2 Nyström-MMD ： | 论文 §3.2、Fig. 4、App. C Tab. 6 | ✅ |
| N = 512 步数最多，却退化到比起点还差：梯度被噪声主导。 | RDM §3.2、Fig. 4、App. C、Tab. 6；ViRDM §3.4.1 | ✅ |
| 最优区很宽，在 2048 以上，比常用批量大一个数量级； | RDM §3.2、Fig. 4、App. C、Tab. 6；ViRDM §3.4.1 | ✅ |
| ImageNet 取 5120，FLUX 取 10240。 | RDM §3.2、Fig. 4、App. C、Tab. 6；ViRDM §3.4.1 | ✅ |
| 去掉文本拼接的边缘版 GenEval 0.801，联合版 0.826，差距集中在需要图文对齐的类别：双物体 0.899 → 0.924、属性绑定 0.608 → 0.708 。 | 论文 §3.2、ViRDM 式 (2) 的转述；论文 Tab. 2 | ✅ |
| 文生图的“参考分布”是怎么来的值得细看 ：感知块——COCO train2014 的 82,783 条标注，每条让 4 步教师生成 24 张、按 PickScore 留前 3，共 248,349 对； | 论文 App. E.1 | ✅ |
| 组合块——GenEval 的 553 条提示词各采 150 个种子（不足 100 张正确的再补），只保留 GenEval 检测器判定完全正确的，每条至多 100 张，共 53,800 张，覆盖 551 条提示词。 | 论文 App. E.1 | ✅ |
| 教师逐种子的正确率从单物体 98% 降到属性绑定 40%、位置 33%，所以这个过滤恰好重塑了一步模型后来超过教师的那些类别。 | 论文 App. E.1 | ✅ |
| 起点 SWdino = 1.81，只匹配它（N = 5120，1000 步）后降到 1.01，几乎就是真实验证集的 1.00——按 DINOv2 的标准，生成器已经和真实数据一样真实； | 论文 §3.3、Fig. 5 | ✅ |
| 约束优化版本在 100 步对照中：总分 1.88 对均匀加权 1.90，最差编码器（PE-Core）3.49 对 4.06（起点 2.09 / 4.83）。 | 论文 §3.3；论文 Tab. 3 | ✅ |
| FID 只用 Inception 一个空间，而这个空间可以被直接优化：FD-loss 在 Inception 特征下把一步模型推到 FID 0.72； | FD-loss 摘要；RDM Tab. 1 | ✅ |
| 它的 FD-SIM 版本（用 SigLIP + Inception + MAE 训练）在 SW 比值上 Inception 0.67、MAE 0.60，都低于真实数据的 1，而 PE-Core 仍是 4.76 。 | FD-loss 摘要；RDM Tab. 1 | ✅ |
| 反过来，FID 很好的模型在别的空间可能很差：Drifting-L（FID 1.54）的 Inception 比值 0.97，DINOv3 比值却是 18.2 。 | RDM Tab. 1 | ✅ |
| MMD 形式的多编码器分数（MMDr14）也会被同族训练损失推到地板以下（FD-SIM 的 Inception 0.22），所以主指标改用不共享估计器的 SW，并留出 4 个编码器 。 | 论文 App. D | ✅ |
| 为了不只靠自造的指标，作者用从未优化过的 PickScore 交叉检验：iRDM 对其起点 FD-SIM 在 71.2% 的配对样本上胜出（20.61 → 20.96，配对 z = 30.5），对 RAE-XL、REPA-E SiT-XL 为 75.7%、73.2%，对留出的真实照片也有 63.6% 。 | 论文 §4.1、Fig. 6 | ✅ |
| 代价也不同：同一个 FLUX.2 [klein] 4 步教师，作者复现的 DMD2 一步学生在约 10 H200 GPU·h 达到 GenEval 0.804 / PickScore 22.36； | 论文 Tab. 2、§4.2、App. E.2 | ✅ |
| iRDM 用约 90 H200 GPU·h 达到 0.826 / 22.76 （参考集生成的教师采样开销论文未计入； | 论文 Tab. 2、§4.2、App. E.2 | ✅ |
| 仅感知块就需要约 199 万次教师生成，由 82,783 × 24 推算）。 | 论文 Tab. 2、§4.2、App. E.2 | ⚠ |
| 固定核给出了 2015 年的 GMMN / MMD 生成网络，对抗学核给出 MMD-GAN，还有 Sliced-Wasserstein 生成器； | 论文 §2 | ✅ |
| $$\hat{\mathcal L}_\varphi=\underbrace{\frac{1}{N^2}\sum_{i,j}k(g_i,g_j)}_{\text{排斥，精确}}\;-\;\underbrace{\frac{2}{N}\sum_i\psi(g_i)^\top\bar\mu_\varphi}_{\text{吸引，Nyström}},\qquad \psi(x)=K_{mm}^{-1/2}\big(k(x,\ell_1),\dots,k(x,\ell_m)\big)^\top,\quad \bar\mu_\varphi=\frac1n\sum_{t=1}^{n}\psi(r_t)$$ | RDM Eq. 2–5、§3.3；官方 pid_lagrangian.py、trainer.py、joint_feature.py | ✅ |
| $$\mathcal L(\theta)=\sum_{\varphi}\lambda_\varphi\,\hat{\mathcal L}_\varphi,\qquad e_\varphi=s_\varphi-b_\varphi,\qquad \lambda_\varphi=\begin{cases}0,&e_\varphi\le0\\ \Sigma\cdot\mathrm{softmax}_\varphi\!\big(e_\varphi/(T\bar e)\big),&e_\varphi>0\end{cases}$$ | RDM Eq. 2–5、§3.3；官方 pid_lagrangian.py、trainer.py、joint_feature.py | ✅ |
| $$\text{条件任务：}\ \Phi(x,c)=\varphi(x)\oplus\tau(c),\qquad \mathrm{SW}_{r^{k}}=\frac1k\sum_{e=1}^{k}\frac{\mathrm{SW}(\varphi_{e\#}p_\theta,\ \varphi_{e\#}p_\text{train})}{\mathrm{SW}(\varphi_{e\#}p_\text{val},\ \varphi_{e\#}p_\text{train})}$$ | RDM Eq. 2–5、§3.3；官方 pid_lagrangian.py、trainer.py、joint_feature.py | ✅ |
| \(s_\varphi\) 是当前生成批的训练用 Nyström-MMD 分数（官方控制器做 EMA / 裁剪），\(b_\varphi\) 是同一度量的真实参考地板，Σ = 10 为固定预算 。 | 论文式 (2)–(5)、§3.3、§4.1；官方 rdm/train/pid_lagrangian.py | ✅ |
| 出处：论文 §4.1、§4.2、App. B、App. E.1； | RDM §4.1–4.2、App. B/E.1；官方 README | ✅ |
| ImageNet 256，按编码器的 SW 比值（真实验证集 = 1，越低越好； | 论文 Tab. 1，节选 | ✅ |
| iRDM 在 14 个编码器中的 9 个和总分上最好； | 论文 Tab. 2 | ✅ |
| 留出的 4 个编码器上也从 1.98 降到 1.54。 | 论文 Tab. 2 | ✅ |
| PickScore 用 500 条 COCO 验证提示词）： | 论文 Tab. 2 | ✅ |
| 一步模型唯一落后教师的是计数（0.756 对 0.791）。 | 论文 App. E.2、Tab. 8 | ✅ |
| DMD2 基线：同一教师，批 128、512²、4 张 H200，生成器每 5 步更新一次、critic 每步更新，需要把均匀时间步按 klein 的 SNR 平移（μ ≈ 2.03）才不发散； | 论文 App. E.2、Tab. 8 | ✅ |
| 500 步时最好，此后回落 。 | 论文 App. E.2、Tab. 8 | ✅ |
| 可把 Inception FID 刷到 0.72。 | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| MMD + Nyström 冻结参考 + 新鲜大批量 + 联合图文 + 多编码器约束加权，ImageNet SWr14 1.30，FLUX 4 → 1 步。 | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| 离真实（1.0）仍有距离； | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| 大批量使后训练比 DMD2 贵（90 对约 10 H200 GPU·h）。 | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| 同期相关（无单独页面）：Representation Fréchet Loss（2026-04，FD-loss，iRDM 的 ImageNet 起点即其 FD-SIM 模型）； | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| W-Flow（2026-05，Sinkhorn 散度的 Wasserstein 梯度流一步生成）； | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| Amortized Moment Matching（2026-07）与 AdvFD（2026-08）沿 Fréchet 一支继续改进。 | RDM §3–4、App. E.2；ViRDM §3；相关 arXiv 摘要 | ✅ |
| 两侧性质相反：数据分布固定不动，可以一次性用上全部 128 万张图，压成冻结的 Nyström 均值嵌入，每步零参考噪声、代价 O(N·m)； | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 所以批量 N 决定估计质量：N = 512 时即使步数最多也会退化到比起点还差，最优区在 2048 以上（取 5120），靠梯度缓存解决显存。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 视频上结论翻转：ViRDM 发现 8–64 个视频就够了（新鲜视频太贵，且问题形态不同）。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 单个编码器只看得见它关心的特征，只是一个伪度量：生成器可以把这个空间里的分布对齐，而在编码器看不见的方向上（如键盘布局这种细结构）保持错误——只匹配 DINOv2 能把它的距离从 1.81 压到 1.01（真实为 1.00），图像却仍明显是假的。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 训练端：用 10 个以不同方式失效的编码器，组合核才可能是特征核； | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 评估端：SWr14 用 14 个编码器（4 个从不参与训练）、用与 MMD 不共享估计器的 Sliced-Wasserstein，并以 PickScore 交叉验证。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| FID 恰好是“单编码器 + 可直接优化的特征分布距离”：FD-loss 能把它刷到 0.72，FD-SIM 在 Inception 和 MAE 上低于真实地板； | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 反过来 Drifting-L 的 FID 1.54、Inception 比值 0.97，在 DINOv3 上却是 18.2。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 约束 vs 均匀加权：总分 1.88 对 1.90，最差编码器 3.49 对 4.06——控制器主要改善最差项。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| MMD 形式的多编码器分数也能被同族损失压到地板以下（FD-SIM 的 Inception 0.22），所以主指标选 SW。 | RDM §3–4、Tab. 1/3/4、App. C/D；ViRDM §3.4.1 | ✅ |
| 原论文 vs 当前官方实现、协议限制与未核实项 | 论文 GenEval 提示词参与参考构造与训练条件池，DMD2 提示词协议不同；不宜当独立留出评测。PickScore 也用于参考筛选。官方控制器读取保留 k_rr 的在线 Nyström-MMD raw_scores，非 SW；默认 ki=kd=0，EMA / clip 后给违规者 softmax 分配预算，更新下一轮权重。代码额外 self_normalize，并按 β 缩放拼接文本，与论文省略的实现细节分开说明。多编码器核在原图空间的 characteristic 性质需要联合表征可辨识性，不能只由数量推出。所有代码仅静态核查，未训练复现。 | ⚠ |

核查方式：原论文 HTML（AnimateLCM 使用 v1；Self-Forcing++ 使用下载 PDF 的 pdftotext 文本）、arXiv 首版记录、引用的官方代码 / 项目页。未运行模型训练。
数值表为对应论文协议；标注“推算”的张量 / NFE / 容量 / 比值不作为论文测量数。

## 17 — ViRDM (`17-virdm.html`) — 2609.28923

核对全文：[arXiv v1 HTML](https://arxiv.org/html/2609.28923v1)，首次 arXiv：2026-09-24（[摘要页](https://arxiv.org/abs/2609.28923)）。标题页的 September 4th 与 arXiv submission date 不同，registry 用后者。公开代码：[neu-vi/ViRDM](https://github.com/neu-vi/ViRDM)，读取时 main tree SHA：`08f354560452ac17a68587010838195db09193bf`。所有主要结果均直接核对论文，项目页没有作为数字的唯一来源。

| Claim | Source | Status |
|---|---|---|
| 作者 Zichong Meng、Chongjian Ge、Chun-Hao P. Huang、Yang Zhou、Huaizu Jiang；Northeastern University / Adobe Research | arXiv 摘要页与全文作者区 | ✅ |
| first arXiv 2026-09-24 | arXiv 摘要 submission history | ✅ |
| Self Forcing / Causal Forcing 的典型 DMD 设置：1.3B 学生 + 冻结14B teacher + 在线1.3B critic | §1、Tab. 7；Causal Forcing App. D | ✅ |
| “generator-only”指更新对象；仍需冻结编码器、解码器、参考与因果适配起点 | §3.2、§3.4.2、§5 | ✅ |
| 三个迁移障碍：梯度路径显存、视频特有优化与初始化、表征对动态约束不足 | §1、§3 | ✅ |
| 图像 RDM → 视频：继承固定参考、联合特征 MMD，但不照搬图像超大生成群体和多编码器加权 | §3.1–3.5；16-rdm.html 作轨道前文链接 | ✅ |
| consistency-style 每次给 clean prediction；先前步骤无梯度、退出S输出参与监督 | §3.3.1、Fig. 2、Alg. 1 | ✅ |
| 每个分布式 microbatch 同步抽 S，同一视频所有 chunk 共用S；历史 KV no_grad | §3.3.1、Alg. 1 | ✅ |
| 初次无梯度前向缓存全部随机性；generator replay 恢复同一 trace | Alg. 1–2 | ✅ |
| frozen 不关闭 input gradient；生成器、decoder、encoder 反向图共驻导致 OOM | §3.3、Tab. 1 | ✅ |
| staged VJP 依次 materialize g_h、g_x、g_z，再回放生成器；不构造显式 Jacobian | 式 (4)–(5)、Alg. 2 | ✅ |
| VJP 仅重排同一截断图；随机退出/历史detach已改变相对完整展开的梯度路径 | §3.3.1–3.3.2、Alg. 1–2；页面的解释 | ⚠ 数学执行边界重述 |
| 完整 Wan VAE 即使分阶段仍 OOM；训练桥梁改 TAEW2.1 | §3.3.2、Tab. 1；论文参考 [6] 指向 madebyollin/taehv | ✅ |
| 默认 V-JEPA2.1 ViT-L/16 final LayerNorm tokens 全时空平均、1024维、不再normalize | §3.2 | ✅ |
| SigLIP2 ViT-SO400M-16-SigLIP2-256 text branch 1152维、L2normalize | §3.2 | ✅ |
| 联合特征2176维；β=σ_v/σ_t；高斯联合核为视觉/文本核乘积 | 式 (1)–(2)、§3.2 | ✅ |
| 固定参考6505视频—文本对，来自 Causal Forcing 训练数据；离线一次编码 | §3.2 | ✅ |
| 生成输出81帧、832×480、21 latent帧、每chunk3 latent帧 | §3.4、§4.1 | ✅ |
| latent代码布局 `[B,21,16,60,104]` | `model/virdm.py:rollout_from_noise` expected_tail；`trainer/virdm.py` noise allocation | ✅ |
| 整片7块，生成批内核矩阵64×64 | 21÷3、B64，由 §4.1 与式 (3) 推算；页面明确推算 | ⚠ |
| 流时间 z_t=(1−t)z_0+tε，consistency-style再加噪 | §3.3.1、Fig. 2、`pipeline/virdm_training.py`；沿用Wan约定 | ✅ |
| 主设置4步，shift5，normalized times {1,0.9375,0.8333,0.625} | §4.1 | ✅ |
| 默认20 generator updates，8×A100，B64、perGPU microbatch1、gradient accumulation8 | §4.1、Tab. 2；默认配置 | ✅ |
| AdamW lr2e-6、β=(0.9,0.95)、weight decay0 | §3.4、§4.1 | ✅ |
| B8已有效；B64质量—时间饱和；B1024 vs64 Total +0.16，单更新约96分钟 | §3.4.1、Tab. 2 | ✅ 尚未加动态正则的受控实验 |
| 相同20更新/B64下，BidNoInit Total65.80；TF83.21；causalCD82.99；causalODE83.41 | §3.4.2、Tab. 3 | ✅ |
| prior few-step specialization非必要；因果兼容必要，causalODE是默认起点 | §3.4.2、Tab. 3、Fig. 3、§4.1 | ✅ 默认是ODE初始化检查点，不是完整CF最终DMD模型 |
| 在时间冻结诊断中，DINOv2于25%至100%动态基本不变，V-JEPA非线性响应；sqrt(MMD)仍有平台 | §3.5.1、Tab. 5 | ✅ |
| 动态项是冻结RAFT光流、单侧hinge；不足才推动，训练限定，不增加部署网络 | §3.5.2、式 (6)–(7)、§4.1 | ✅ |
| λ_dyn默认5e-4 | Tab. 6、Tab. 9 | ✅ |
| 论文式(3)完整MMD，参考—参考项是生成器参数常数 | 式 (3)、§3.1 | ✅ |
| 公开代码4096个Nyström landmark近似吸引、精确生成批内项与固定参考常数 | `virdm_integration/reference.py:mmd_nystrom_with_terms`；`config_virdm_bs64_1x8.yaml` | ✅ 正文公式未给出实现近似，callout说明 |
| 公开代码损失自归一化 raw/(abs(raw.detach())+1e-7) | `virdm_integration/reference.py:self_normalize_virdm_loss`；`trainer/virdm.py` 调用 | ✅ 梯度尺度细节，正文未说明 |
| 光流每帧对取top5%幅度均值；s为第10大帧对得分；阈值11.25 | `trainer/virdm.py:_dynamic_reg_top5_flow_mean / _dynamic_reg_s10_hinge_latent_gradients`；默认配置 | ✅ 代码细化正文概述 |
| 至少10帧对达到阈值，hinge才不活跃 | 上条顺序统计量按代码推导 | ⚠ 页面标明推导 |
| YAML dynamic=false；README明确nodynamic/dynamic variants，最终模型对应dynamic | `config_virdm_bs64_1x8.yaml`、README Supported recipes；Tab. 6 | ✅ |
| 峰值分析：完整/Wan/endtoend OOM，exit/Wan/endtoend OOM，exit/Wan/staged OOM，均8GPUs | Tab. 1，80GB A100 reserved memory定义 | ✅ |
| exit/lightweight/staged：1GPU68.5GB，8GPUs48.3GB | Tab. 1、§4.1 | ✅ |
| 单卡支持但单卡总墙钟时间没有给出 | §4.1、Tab. 1 | ✅ 不外推2h到单卡 |
| Tab. 7 DMD（Self Forcing）teacher14B/critic1.3B、120 generator updates、77.1GB/GPU、22h、176 GPU-hours | Tab. 7 | ✅ 同一8×A100后训练设置 |
| Tab. 7 ViRDM无teacher/critic、20 generator updates、48.3GB/GPU、2h、16 GPU-hours | Tab. 7、§4.1 | ✅ |
| 28.8GB/GPU节省；每更新约6分钟；时间比11× | §4.1；77.1−48.3与22÷2；页面标时间比为推算 | ✅/⚠ 11×是整段运行比，不是每更新比 |
| 资源比较排除共有初始化，仅最后分布匹配阶段；也未给端到端重新构建参考的统一成本 | Tab. 7 caption、§4.1 | ✅ 成本边界 |
| 主比较同Wan1.3B/832×480/4-step causal界面；官方VBench评估、同环境、SF extended prompts | §4.1–4.2、Tab. 8 | ✅ |
| Tab. 8 CausVid Total81.15/Quality83.99/Semantic69.79 | Tab. 8 | ✅ |
| Tab. 8 Self Forcing 84.20/84.90/81.39 | Tab. 8 | ✅ |
| Tab. 8 Causal Forcing 84.51/85.36/81.09 | Tab. 8 | ✅ 本论文统一重评，不能换成CF原论文84.04 |
| Tab. 8 ViRDM 84.87/85.82/81.09；Semantic与CF相同且低于SF | Tab. 8 | ✅ |
| 同主组单H100 17.0FPS、0.69s首帧；ViRDM同硬件测量，基线效率沿用原论文 | §4.1 Evaluation、Tab. 8 | ✅ |
| Tab. 6 DINOv2 no flow：Total82.70、Dynamic18.06、去动态Total87.04 | Tab. 6 | ✅ |
| Tab. 6 V-JEPA no flow：83.41、48.61、85.77 | Tab. 6 | ✅ |
| Tab. 6 V-JEPA+flow：84.87、72.02、85.79 | Tab. 6 | ✅ |
| 正则主要修复动态维度；去动态Total只85.77→85.79 | §3.5.2、Tab. 6 | ✅ 不当作外观质量全面增长 |
| 默认weight时4个未训练时间指标变化均≤0.18；weight1e-3时Total85.64但部分时间质量变差 | §4.3、Tab. 9 | ✅ |
| 人类动态偏好加正则模型85.6% | §4.3、Fig. 6(b) | ✅ |
| 因果低步数首块4步；后续2步Total84.42、后续1步84.27 | §4.4、Tab. 10 | ✅ FFE限定必需 |
| 双向1步Total83.12/Quality84.61/Semantic77.16 | §4.5、Tab. 11 | ✅ 探索设置 |
| 双向2步84.53/85.48/80.72 | Tab. 11 | ✅ |
| 双向4步84.56/85.84/79.43 | Tab. 11 | ✅ |
| 主要实验限Wan1.3B、81帧；更大/高分辨率/更长视频待验证；继承固定表征与参考偏置 | §5 limitations | ✅ |
| 相关时间线 One-Forcing：首次2026-05-22 | [2605.23458 摘要页](https://arxiv.org/abs/2605.23458) | ✅ 只作相关指针 |
| 相关时间线 Amortized Moment Matching：首次2026-07-29 | [2607.26860 摘要页](https://arxiv.org/abs/2607.26860) | ✅ 只作相关指针 |

建议入边：`rdm → virdm`（图像→视频：表征匹配搬到因果视频）、`self-forcing → virdm`（随机退出与自回归展开）、`causal-forcing → virdm`（保留初始化、换后训练）。详见 17-registry.json。

没有未核实的主结果数字。开放问题是代码与论文的实现颗粒度差异及未报告的端到端成本，已在正文限定。保留 `from-image`、`c-population`（已有16页交叉链接）、`c-initialization`、`c-dynamics`、`c-extensions`。共享 SOURCES.md 未改；lead 合并后可恢复 footer 的来源链接。未启动浏览器，SVG 按坐标审查，最终渲染交由 lead。

