# Sources — Diffusion LLM track

Where the numbers and claims on this track's pages come from. "Paper" = the arXiv version listed in
`registry.js`; "Code" / "Weights" = official repositories and model cards (checked 2026-10-14). All metric
and speed values are as reported by the authors, with their measurement conditions; nothing was re-run.

Legend: ✅ verified against the source · ⚠ secondary source or inferred · ❓ not verified

## 01 — 扩散语言模型基础 (`01-foundations.html`) — 2107.03006, 2205.14217, 2310.16834, 2406.03736, 2406.07524, 2406.04329, 2409.02908, 2502.09992, 2505.22618, 2510.04767, 2502.09622, 2609.20539, 2608.00146

Read in full (arXiv HTML): D3PM, Diffusion-LM, SEDD v3, RADD v4, MDLM v2, MD4 v4, Zheng et al. 2409.02908 v6, LLaDA v3, Fast-dLLM v3, ParallelBench v2, Feng et al. 2502.09622 v2, 2609.20539 v2, DiffusionGemma v1, ReMDM v4, EB-Sampler v1, BD3-LM v3, Token Ordering v3, Plaid v1, CDCD v3, iLLaDA v1, Beyond-Masked v1. Abstract only: SSD-LM, LangFlow, ELF, Sigma, SMDM, How Efficient, Flexibility Trap, Generative Frontiers, 2609.33947, LLaDA 1.5, 2602.23225, A3, Fast-dLLM v2, SDAR, WeDLM, TiDAR, DFlash, LLaDA2.0, Eso-LM, DiffuLLaMA, Stable-DiffCoder, Nemotron-Labs-Diffusion, LLaDA-MoE, MMaDA, Dream. Code: Dream README (`alg` options).

| Claim | Source | Status |
|---|---|---|
| Low-concurrency AR decoding is memory-bound; speculative decoding ≈3–6 TPF at draft length 8 | DiffusionGemma §1 (cites Li et al. 2026) | ✅ |
| LLaDA "incompatible with KV caching" (uses MHA) | LLaDA §2.2 | ✅ |
| Notation conventions: MDLM α_t, SEDD/RADD σ̄(t) with mask prob 1−e^{−σ̄}, D3PM discrete t | MDLM §3.4; SEDD App. C.1; RADD §3.3; D3PM §3 | ✅ |
| D3PM transition families (uniform, absorbing [MASK], embedding NN) | D3PM §3.1, App. A.2 | ✅ |
| D3PM LM1B ppl @1000 steps: absorbing 76.9, uniform 137.9; AR Transformer 43.6 | D3PM Tab. 2 | ✅ |
| SEDD small WikiText103: absorb ≤40.62, uniform ≤49.60, GPT-2 41.60; 1BW 79.29 vs 101.37 | SEDD Tab. 1 | ✅ |
| DiffusionGemma uses multinomial (uniform) diffusion so tokens can be revised | DiffusionGemma §3.2 "Multinomial diffusion" | ✅ |
| DiffusionGemma renoises unaccepted positions uniformly (entropy-bounded, b = 0.1) | DiffusionGemma §3.3 | ✅ |
| Beyond-Masked: 1.7B uniform worse ppl but better GSM8K; ppl misleading across families | Beyond-Masked abstract | ⚠ abstract |
| Diffusion-LM E2E bound 2.28 vs AR 1.77; 200 steps still 7× slower than AR | Diffusion-LM §7 footnote, §6.1 | ✅ |
| Plaid 1B > GPT-2 124M likelihood | Plaid abstract | ⚠ abstract |
| LangFlow "first continuous DLM to rival discrete"; Sigma 3B/8B continuous dLM | LangFlow, Sigma abstracts | ⚠ abstract (author claims) |
| Ancestral step reveals with prob (t−s)/t | LLaDA App. A Eq. (10); MDLM §4.1 | ✅ |
| Output caching when no token changes (time-free network) | MDLM §4.1; RADD §3.2 | ✅ |
| First-hitting sampler, equivalent to original process, up to 20× faster | 2409.02908 §4.2, abstract | ✅ |
| Low-confidence remasking beats random (Tab. 9) | LLaDA §2.4, App. B.4 Tab. 9 | ✅ |
| Top-probability vs top-probability-margin ordering | Token Ordering §4.1 | ✅ |
| Dream `alg`: maskgit_plus / topk_margin / entropy | Dream README | ✅ (secondary: README) |
| Fast-dLLM threshold rule (≥τ else top-1), default τ = 0.9, block 32 | Fast-dLLM §3.3, §4.1 | ✅ |
| Fast-dLLM Theorem 1: (n+1)ε ≤ 1 ⇒ greedy parallel = joint argmax | Fast-dLLM §3.3 Theorem 1 | ✅ |
| EB-Sampler entropy-bounded unmasking, 2–3× on code/math | EB-Sampler abstract | ✅ (abstract) |
| ReMDM remasking enables inference-time scaling; masked tokens otherwise fixed | ReMDM abstract | ✅ (abstract) |
| SSD-LM semi-autoregressive block generation | SSD-LM abstract | ⚠ abstract |
| LLaDA Instruct semi-AR: GSM8K 77.5 (B=32), 78.6 (B=8) vs 69.4 pure diffusion; EOS padding cause | LLaDA §3.2 last para, App. B.4 Tab. 8 | ✅ |
| Base: block-diffusion-style sampling improves with block length | LLaDA App. B.4 (Tab. 7 text) | ✅ |
| Widget values: N=16 → 0%, N=8 → 16.98%, N=4 → 92.79%; τ=0.4 → 0% (E[NFE] 3.00), τ=0.35 → 16.98%, τ=0.3 → 68.99% | `assets/js/widgets/dllmdecode.js` `exact()`; cross-checked by 4000-run Monte Carlo | ✅ (toy, computed) |
| Two-token example P(invalid) = 1/2, total correlation ln 2 | arithmetic | ✅ (derived) |
| One-step KL lower bound = conditional total correlation (Huang et al. 2022); T-step bound monotone | ParallelBench §4 Theorem 1–2 | ✅ |
| ParallelBench "New City" example | ParallelBench §1 Fig. 1 | ✅ |
| Threshold strategies can't adapt parallelism to difficulty | ParallelBench abstract | ✅ |
| TER: constant steps; SER: steps ≥ linear in L (worst case) | 2502.09622 §4 Thm 4.2, 4.4 | ✅ |
| DTC-scaling for uniform/Gaussian; Θ̃(√d) vs Ω̃(d) separation for masked | 2609.20539 abstract, §1 | ✅ |
| DiffusionGemma ≈20 TPF, ≈1500 tok/s, single H100 FP8 batch 1 | DiffusionGemma abstract, Fig. 1 caption | ✅ |
| DiffusionGemma 256-token canvases, block-diagonal attention, encoder KV cache for context | DiffusionGemma §4 | ✅ |
| DiffusionGemma advantage scoped to low batch / single request | DiffusionGemma §6 opening | ✅ |
| DiffusionGemma <10% of AR training tokens | DiffusionGemma abstract | ✅ |
| Fast-dLLM v2 ≈1B tokens vs Dream 580B | Fast-dLLM v2 abstract | ✅ (abstract) |
| BD3-LM: block AR + intra-block diffusion, KV cache, variable length | BD3-LM abstract | ✅ |
| Nemotron-Labs-Diffusion joint AR–diffusion objective, tri-mode | Nemotron abstract | ✅ (abstract) |
| Infilling via arbitrary-position prompting; MAUVE table | SEDD §4.2, Tab. 5 | ✅ |
| Sudoku <7% → ≈90% with adaptive order | Token Ordering abstract | ✅ |
| Gradient-guided control in continuous space | Diffusion-LM §5.1 | ✅ |
| Masked ELBO = ∫ α'_t/(1−α_t) Σ log p dt; carry-over unmasking | MDLM §3.2.3, §3.4–3.5 Eq. (12)–(13) | ✅ |
| Same weighted-CE ELBO derived independently | MD4 §3 Eq. (4) | ✅ |
| LLaDA Eq. (3)–(4) objective and upper bound; BERT/MaskGIT lack 1/t | LLaDA §2.1 | ✅ |
| Time-free posterior p(x_0^i|x_t) = p_data(x_0^i|x_t^UM) | RADD §3.1 Thm 1; LLaDA App. A.1 Eq. (11) | ✅ |
| With/without time conditioning similar ppl | MDLM §5.1, Tab. 12 | ✅ |
| Lower-variance l-uniform likelihood estimator Eq. (6) | LLaDA §2.4 Eq. (6) | ✅ |
| VRPO: optimal MC budget + antithetic sampling | LLaDA 1.5 abstract | ✅ (abstract) |
| Diffusion ppl are upper bounds vs exact AR | SEDD Tab. 3 caption | ✅ |
| fp32 Gumbel truncation lowers effective temperature | 2409.02908 §5.2 | ✅ |
| SEDD-medium 4096 steps: gen ppl 81 / entropy 8.07 (fp64) vs 22 / 7.25 (fp32) | RADD App. J.4 Tab. 3–4 | ✅ |
| Gen ppl and entropy are two parts of a KL | Generative Frontiers abstract | ✅ (abstract) |
| Sharpened old MDLM at 16 steps beats its 1024-step gen ppl | 2609.33947 abstract | ✅ (abstract) |
| iLLaDA confidence-based multiple-choice scoring | iLLaDA abstract | ✅ |
| LLaDA no CFG in main tables for fair comparison | LLaDA §3, App. B.3 | ✅ |
| LLaDA 1.5×/1.8× throughput on GSM8K/Math vs LLaMA3 with KV cache; A100-80GB, bs 1, bf16, output 256 | LLaDA App. B.7 Fig. 5 | ✅ (text) |
| Fast-dLLM up to 27.6× end-to-end, A100, batch 1, 8-shot, gen 1024, vs vanilla LLaDA | Fast-dLLM abstract, Fig. 1(c) caption | ✅ |
| Fast-dLLM threshold vs TPF trade-off figure | Fast-dLLM Fig. 5 | ✅ |
| SEDD matches AR inference time at ~100 steps, 4–6× larger batch (unoptimized vs HF) | SEDD §6 | ✅ |
| AR throughput generally higher; cache/parallel gains shrink with batch | How Efficient abstract | ✅ (abstract) |
| Flexibility Trap: arbitrary order bypasses high-uncertainty tokens; JustGRPO | Flexibility Trap abstract | ✅ (abstract) |
| Fast DLMs converge to AR-like decoding; attributed to sequential data | 2602.23225 abstract | ✅ (abstract) |
| Shapes / cost per forward (|c|+L)^2 etc. | derived from computation graph | ⚠ inferred |

## 02 — SEDD 与 RADD (`02-sedd.html`) — 2310.16834, 2406.03736

Read: SEDD arXiv v3 (HTML, full incl. appendices); RADD arXiv v4 (HTML, full incl. App. B–J) plus v1/v2/v3 abstract pages; official code `louaaron/Score-Entropy-Discrete-Diffusion` (`model/transformer.py`, `noise_lib.py`, `graph_lib.py`, `losses.py`, README) and `ML-GSAI/RADD` README; LLaDA v3 §2.4 / App. A.1 for the link; Concrete Score Matching abs page (2211.00802).

| Claim | Source | Status |
|---|---|---|
| SEDD venue ICML 2024 Oral, Best Paper award | arXiv comments ("ICML 2024 Oral"); Stanford AI Lab news; icml.cc virtual oral page | ✅ (award via secondary sources) |
| RADD venue ICLR 2025 | iclr.cc poster page / proceedings (web search) | ✅ (secondary) |
| Mean prediction (D3PM) underperforms; CSM ℓ2 doesn't penalize ≤0 values | SEDD §2.2, Eq. (4) | ✅ |
| ℓ2 CSM ablation: 3–4× higher likelihood loss | SEDD App. D.1 | ✅ |
| Reverse rate Q̄_t(y,x) = p_t(y)/p_t(x) Q_t(x,y); column convention | SEDD §2.1 Eq. (1)–(3) | ✅ |
| Score entropy definition, K(a)=a(log a−1), Bregman of −log, consistency | SEDD Def. 3.1, Prop. 3.2 | ✅ |
| Gradient rescaled by 1/s (log-barrier) | SEDD §3.1 | ✅ |
| Denoising score entropy | SEDD Thm 3.4 Eq. (7) | ✅ |
| DWDSE + KL is NLL upper bound | SEDD Thm 3.6 Eq. (9)–(10) | ✅ |
| Only Hamming-1 ratios: network d×n | SEDD §3.3 Eq. (11)–(13) | ✅ |
| Dense Q for n = 50257 would need ≈20 GB | SEDD §3.3 | ✅ |
| Q^uniform / Q^absorb | SEDD Eq. (15)–(16) | ✅ |
| Geometric (1e−5 to 20) and log-linear schedules; log-linear helps absorb | SEDD §5.1, App. C.1 | ✅ |
| Log-linear formula: paper −log(1−(1−εt)) vs code −log1p(−(1−ε)t), ε=1e−3 | SEDD App. C.1; `noise_lib.py` `LogLinearNoise` | ✅ discrepancy |
| Scaling trick: paper "scaling by e^σ̄−1"; code subtracts log(expm1(σ̄)) and log(n), absorb only | SEDD App. C.2; `model/transformer.py` `scale_by_sigma` | ✅ discrepancy (direction unstated in paper) |
| Absorb loss only on MASK positions: pos − neg + const, times σ(t) | `graph_lib.py` `Absorbing.score_entropy`; `losses.py` | ✅ |
| adaLN-zero time net, hidden 128; network takes σ̄ not t; +5–10% params | SEDD §5.1, App. C.2 | ✅ |
| SEDD small/medium ≈90M/320M non-embedding vs GPT-2 86M/304M | SEDD App. C.2 | ✅ |
| Euler only changes one position; τ-leaping Eq. (17) | SEDD §4.1 | ✅ |
| Discrete Tweedie; Tweedie τ-leaping KL-optimal among τ-leaping | SEDD Thm 4.1–4.2 Eq. (18)–(19) | ✅ |
| Conditional ratios = unconditional ratios (Bayes); Alg. 3 | SEDD §4.2 Eq. (21)–(22) | ✅ |
| MAUVE: SEDD standard 0.957, infill 0.942, GPT-2 nucleus 0.955 / none 0.802; medium; 50→50 tokens; infill first/last 25 | SEDD Tab. 5, App. C.8 | ✅ |
| Seq length 1024, 32–2048 steps | SEDD §5.3.1 | ✅ |
| GPT-2 baselines recomputed without sliding window (higher than original) | SEDD §5.2.3 | ✅ |
| Zero-shot ppl table (GPT-2, D3PM, PLAID, SEDD uniform/absorb small & medium) | SEDD Tab. 1 | ✅ |
| SEDD-Unscale, RADD-DSE / λ-DCE / AO small; medium SEDD-Scale, RADD-DSE | RADD Tab. 1–2 | ✅ |
| text8 BPC: SEDD absorb ≤1.39, AR 1.23, D3PM absorb ≤1.45 | SEDD Tab. 2 | ✅ |
| 1BW: SEDD absorb ≤32.79 vs AR 31.98 | SEDD Tab. 3 | ✅ |
| Likelihood MC with 1000 timesteps | SEDD App. C.6 | ✅ |
| SEDD ≈ AR inference time at ~100 steps (unoptimized vs HF), 4–6× batch | SEDD §6 | ✅ |
| Training: batch 512, lr 3e−4, warmup 2000, EMA 0.9999, clip 1; 8×A100 80GB or 16×A100 40GB | SEDD App. C.3 | ✅ |
| SEDD 400K iterations | RADD Tab. 1 caption ("All SEDD and RADD models trained for 400k") | ✅ (via RADD) |
| Generative ppl "6–8× better than GPT-2" | SEDD abstract, Fig. 1 | ✅ (claim) |
| fp32 Gumbel truncation explains MDM gen-ppl superiority | 2409.02908 abstract, §5 | ✅ |
| RADD Theorem 1 (ratio = e^{−σ̄}/(1−e^{−σ̄}) × p_0(x̂|x^UM)) | RADD §3.1 Thm 1, App. B | ✅ |
| p_t(x_t) factorization derivation on page | own derivation, consistent with App. B | ⚠ derived |
| Scaling trick = this reparameterization | RADD §3.1 Eq. (3.2) | ✅ |
| RADD network: no TimeEmbedding/adaLN, softmax, no attention mask | RADD App. J.1 | ✅ |
| Caching & E-NFE(n) = n(1−(1−1/n)^l) | RADD §3.2 Eq. (3.4), App. D.5 | ✅ |
| E-NFE ≈ 906 for n=4096, l=1024 | computed from Eq. (3.4) | ⚠ computed |
| Dynamic batch size in caching | RADD App. J.4 | ✅ |
| Euler ≡ Tweedie τ-leaping under log-linear for RADD | RADD App. D.2–D.4 | ✅ |
| DSE ⇔ t-DCE ⇔ λ-DCE ⇔ AO (Thm 2) and equations | RADD §3.3 Eq. (2.15), (3.5)–(3.8) | ✅ |
| Four losses differ slightly (finite-data optima) | RADD §4.3 | ✅ |
| MDLM keeps adaLN with zero time input; RADD removes structure | RADD §5 "Concurrent works"; MDLM Tab. 12 | ✅ |
| Not applicable to multinomial diffusion | RADD §5 | ✅ |
| Limitation: fixed-length outputs, GPT-2 scale | RADD §6 | ✅ |
| AO sampling: forward 81.70 / backward 103.68 / random 83.10 gen ppl | RADD App. J.4 Tab. 6 | ✅ |
| RADD training: batch 512, lr 3e−4, warmup 2500, EMA 0.9999, wd 0.03, dropout 0.02, fp16; 400K ≈ 105B tokens; OWT ≈ 9B tokens | RADD App. J.2 | ✅ |
| fp64 Gumbel sampling for RADD/SEDD comparisons | RADD App. J.3 | ✅ |
| Timing table (256/1024/4096 steps; batch 16; fp64; single high-memory accelerator, unnamed) | RADD App. J.4 Tab. 3 | ✅ |
| fp32 SEDD-medium 4096 steps gen ppl 22 / entropy 7.25 | RADD App. J.4 Tab. 4 | ✅ |
| Batch-1 4096 steps 109.90 s vs 30.70 s (≈3.6×) | RADD App. J.4 Tab. 5; ratio computed | ✅ / ⚠ ratio computed |
| v1/v2 abstract "up to 3.5× faster"; v3/v4 abstract without number; v4 text "2.5–3×", 1024 steps ≈1.5× | RADD abs v1, v2, v3; v4 App. J.4 | ✅ |
| LLaDA uses time-free parameterization citing RADD; Eq. (6) "equivalent form [20]" | LLaDA App. A.1 Eq. (11); §2.4 Eq. (6) | ✅ |
| Weights: louaaron/sedd-small, sedd-medium; JingyangOu/radd-lambda-dce, radd-t-dce (162M) | SEDD README; RADD README | ✅ (secondary) |

## 03 — MDLM 与 MD4 (`03-mdlm.html`) — 2406.07524, 2406.04329

| Claim | Source | Status |
|---|---|---|
| arXiv v1：MD4 2024-06-06，MDLM 2024-06-11；均为 NeurIPS 2024 | arXiv abs 页 citation_date / comments | ✅ |
| 连续时间 NELBO = ∫ α′_t/(1−α_t)·Σ_masked log⟨x_θ, x⟩ dt；序列版为加权 MLM 损失 | MDLM Eq. 12–13；MD4 Eq. 4–5 | ✅ |
| 每步 KL = −(α_s−α_t)/(1−α_t)·1[x_t=M]·log p_θ(x_0\|x_t) | MD4 §3；MDLM Eq. 10 | ✅ |
| 有限 T 的 ELBO 被连续积分从下方界住，T→∞ 更紧 | MD4 App. D | ✅ |
| SUBS：[M] logit 置 −∞；已揭示位置照抄 | MDLM §3.2.3；官方 diffusion.py `_subs_parameterization` | ✅ |
| 消融（LM1B）：27.04 / 27.19（离散 T=1000）/ 28.56（去照抄）/ 28.51（再去零掩码，≡D3PM） | MDLM Tab. 8 | ✅ |
| 工程配方贡献最大 | MDLM §6（Comparison to D3PM） | ✅ |
| 调度不变性；OWT BPD 均 3.30，方差 1.81 / 3.30 / 3.30 / 7.57 | MDLM §3.4、App. E.1、Tab. 9 | ✅ |
| log-linear σ(t)=−log(1−t)（α_t=1−t）；代码 eps=1e-3 | MDLM App. E.1；官方 noise_schedule.py | ✅ |
| 低差异采样 t_i ~ U[(i−1)/N, i/N] | MDLM App. D.3；代码 antithetic_sampling | ✅ |
| 去掉 t 条件约 2× 推理加速；带 / 不带 t：23.21 / 23.05 | MDLM §3.2.2、Tab. 12 | ✅ |
| 官方 config 默认 time_conditioning: False、EMA 0.9999 | kuleshov-group/mdlm configs/config.yaml | ✅ |
| 代码损失 `-log_p * dsigma / expm1(sigma)` 在 log-linear 下化为 1/t | 官方 diffusion.py `_forward_pass_diffusion` + 推算 | ⚠ 推算 |
| 262B（按被遮 token）vs 524B（原始位置）指同一 1M 步 OWT 训练 | MDLM §5.1、App. D.2、Tab. 2–3、Fig. 3、Tab. 12 | ✅（不一致已标注） |
| 正文“距 AR 14% 以内”与 Tab. 1 比值 1.21 / 1.10 不符 | MDLM §5.1、Tab. 1、摘要 | ✅（推算比值） |
| DiT 12 层 / 768 / 12 头 / 时间嵌入 128；AdamW lr 3e-4、预热 2500、dropout 0.1、batch 512 | MDLM App. D.4 | ✅ |
| LM1B：AR 22.32 / 20.86；SEDD ≤32.79；MDLM ≤27.04 / ≤23.00；D3PM absorb ≤76.90；110M | MDLM Tab. 1 | ✅ |
| OWT：AR 17.54、SEDD ≤24.10、MDLM ≤23.21 | MDLM Tab. 2 | ✅ |
| 零样本 7 数据集（AR / SEDD / MDLM） | MDLM Tab. 3 | ✅ |
| GLUE：BERT 81.62 → +MDLM-FT 82.06 | MDLM Tab. 4 | ✅ |
| A5000、64 条：SEDD 85.3 / MDLM 70.3 / +缓存 40.1 分钟（T=5k）；155.2 / 127.9 / 60.4（T=10k） | MDLM Tab. 10 | ✅ |
| SAR 2048 token、3090：MDLM 27.18、89.3 s/条；SSD-LM 35.43、2473.9 s/条 | MDLM Tab. 5 | ✅ |
| 祖先采样揭示概率 (α_s−α_t)/(1−α_t)；时间无关时缓存，NFE ≤ L | MDLM §4.1；DFM App. B | ✅ |
| MD4 转移矩阵 Q_i=(1−β_i)I+β_i 1 e_m^⊤；SNR 形式不变性 | MD4 §2–3 | ✅ |
| score↔均值：s(m,t)_j = α_t/(1−α_t)·E[x_0\|x_t=m]_j；SEDD 不强制约束、训练不稳 | MD4 Prop. 1、§7.1 | ✅ |
| AO-ARM 关系：揭示时间同分布、顺序均匀随机 | MD4 §5 | ✅ |
| 余弦调度 / 网格使 ImageNet64 FID 70→17（T=256） | MD4 §4、Fig. 2 | ✅ |
| GenMD4：α_{t,i}=1−t^{w_i}，RLOO；OWT 21.80 vs 22.13；text8 1.34 vs 1.37；过拟合 | MD4 §6、Tab. 2、Tab. 5、§7.1 | ✅ |
| MD4 零样本 S（5 项）与 GPT-2 / SEDD 重训 | MD4 Tab. 1 | ✅ |
| MD4 OWT 验证：Gaussian 27.28、SEDD 24.10、MD4 22.13、GenMD4 21.80、M 16.64；text8 AR 1.23 | MD4 Tab. 5、Tab. 2 | ✅ |
| HellaSwag：AR-S 30% 于 50k 步，MD4-S 200k 步（4×） | MD4 §7.1、Fig. 5 | ✅ |
| MD4 超参：ε=1e-4 平移、lr 3e-4、wd 0.03、预热 2000 + 余弦、dropout 0.02（OWT）、EMA 0.9999、1000 步采样 | MD4 App. J | ✅ |
| MD4 OWT 训练步数未单列（“同 text8”） | MD4 App. J.2 | ⚠ |
| MD4 Tab. 5 与 MDLM Tab. 2 的 SEDD 同为 ≤24.10（划分不同） | 两篇表格 | ❓ 巧合或沿用未知 |
| LLaDA 式 (3) = 1/t 加权掩码交叉熵，引用 [18,19,20] = MD4 / MDLM / RADD | LLaDA §2.1、App. A.1、参考文献 | ✅ |
| MDLM OWT 权重 kuleshov-group/mdlm-owt | 官方 README | ✅ |

## 04 — 离散流匹配与 Edit Flows (`04-discrete-flow.html`) — 2407.15595, 2506.09018

| Claim | Source | Status |
|---|---|---|
| DFM arXiv v1 2024-07-22；Meta FAIR + Weizmann | arXiv abs；论文作者块 | ✅ |
| DFM NeurIPS 2024 Spotlight | survey（会议页） | ⚠ 未重核 |
| 时间方向：t=0 源、t=1 数据，κ_0=0、κ_1=1 | DFM §2.2–2.3；Edit Flows §2 | ✅ |
| 条件路径 Eq. 9（两项）与 Eq. 10（混入均匀噪声）；耦合 Eq. 4–5 | DFM §2.2–2.3 | ✅ |
| 前缀条件 N_0 ~ U(0,N)；App. B 措辞“U-coupling, see (5)”与 Eq. 5（C-coupling）矛盾 | DFM App. B | ✅（不一致已标注） |
| 速度 u = κ̇/(1−κ)·(p_{1\|t} − δ)，与连续 FM 同形 | DFM Eq. 24、Tab. 1 | ✅ |
| 边缘速度定理、离散连续性方程 | DFM Thm. 2.2、Eq. 16–20 | ✅ |
| corrector：ū = α û − β ǔ；α−β=1 / α=β 两种；i.i.d. 源时 ǔ 用源分布 | DFM Eq. 26–27、Thm. 2.4 | ✅ |
| 掩码源下去噪器与 t 无关；无 corrector 时 NFE ≤ N；采样时可换调度器 | DFM Prop. 3.1、App. B | ✅ |
| 安全步长 h_adaptive | DFM App. B Eq. 29–31 | ✅ |
| 训练损失 = 所有位置交叉熵（无时间权重）；极小点为后验 | DFM Eq. 28、Prop. 2.5 | ✅ |
| MDLM 指出 DFM 目标不是合法 ELBO | MDLM §6 | ✅ |
| MaskGIT 置信度排序在低 NFE 好、高 NFE 差；CIFAR-10 FID 3.63 @1024 NFE | DFM §3、§4.2、Fig. 3 | ✅ |
| 文本调度 κ_t=t²（三次族 a=0, b=2）；corrector α_t=1+α t^0.25(1−t)^0.25，α∈{10,15,20}；温度 τ(1−t)² | DFM App. D | ✅ |
| 150M DiT 12L/12H/768（GPT-2 tok，OWT）；1.7B DiT 48L/24H/1536（tiktoken）；RoPE θ=10000；Adam (0.9,0.999)；lr 3e-4、预热 2500、dropout 0.1 | DFM App. G.1 | ✅ |
| batch 4096 × 1.3M 与 512 × 400k（原文两处均写 big） | DFM App. G.1 | ✅（笔误已标注） |
| App. C 称 1.5B；App. D 写 κ_1=0 | DFM App. C、D | ✅（不一致已标注） |
| 1.7B 文本 / 代码模型的序列长度 | — | ❓ 论文未写明 |
| Tab. 2（150M，1024 NFE）：Data 7.0/7.7；AR 31.4/7.1；SEDD 27.2/7.6；Campbell 28.7/7.6；DFM(9) 22.5/7.2；DFM(10) 22.3/7.1（Llama-2 Gen PPL / 熵） | DFM Tab. 2 | ✅ |
| Tab. 5（fp64）：SEDD 56.1/8.1；Campbell 50.9/8.0；DFM(9) 50.1/8.0；DFM(10) 50.0/8.0 | DFM Tab. 5、App. G.1 | ✅ |
| 主表采样精度为非双精度 | DFM App. G.1 措辞 | ⚠ 推断 |
| Tab. 3（1.7B，512 NFE）：Llama-3 Gen PPL U 10.3、C 9.7、AR 22.3、Llama-3 8B 7.3；熵 6.7 vs AR 7.2 | DFM Tab. 3 | ✅ |
| 1.7B 条件生成的 corrector / 温度 / 精度设置 | DFM §4、App. D | ⚠ 未逐行注明 |
| Tab. 4 代码：DFM 6.7/6.7（HumanEval/MBPP P@1），oracle 11.6/13.1，AR 14.3/17.0 | DFM Tab. 4 | ✅ |
| A100 80GB、batch 1、HumanEval：256 NFE 19.97 s vs AR 50.94 s（约 2.5×），512 NFE 持平 | DFM App. F | ✅（AR 是否用 KV cache ❓） |
| flow_matching 库含离散实现（Flow Matching Guide and Code, 2412.06264） | 官方 README | ✅ |
| Edit Flows arXiv v1 2025-06-10；Meta FAIR；NeurIPS 2025（论文集标题不同） | arXiv abs；survey | ✅ / ⚠ 标题来自 survey |
| 编辑操作 ins/del/sub 定义与速率参数化 λ·Q | Edit Flows Eq. 10–16 | ✅ |
| 特例：只替换 = 逐 token 路径；只在最右插入 = AR | Edit Flows §3.1 Special cases | ✅ |
| Thm. 3.1（辅助过程边缘化 + Bregman 梯度不变） | Edit Flows Thm. 3.1 | ✅ |
| 对齐 z（ε 空位）、f_rm-blanks、Eq. 19–23 损失 | Edit Flows §3.2 | ✅ |
| 最差对齐训练仍偏好最少编辑（AAAA→AAAA 比 →BBBB 高 20×） | Edit Flows App. F | ✅ |
| 一阶近似同时编辑；Gillespie 不可行 | Edit Flows App. C | ✅ |
| 局部化路径：MBPP P@1 +48%（14.8 vs 10.0），相对 Mask DFM +138%（vs 6.2） | Edit Flows §3.3、Tab. 3 | ✅（自行核算） |
| 源：δ_∅；或 100 个经验分布 token（删 50、替 50） | Edit Flows §5 | ✅ |
| 280M / 1.3B Llama 结构（宽 1024/2048、12/16 层、16/32 头、8 KV 头）；词表 32k；最大长度 1024；κ_t=t³ | Edit Flows §5、Tab. 4 | ✅ |
| 500k 步、batch 4096、16×8 H100；AR / Mask DFM ≈2T token，Edit Flows ≈6T；AdamW (0.9,0.95)、lr 3e-4、预热 2000、余弦 | Edit Flows App. E、Tab. 4 | ✅ |
| 条件前缀比例 c³、10% 丢弃；条件嵌入 32/64 维 | Edit Flows App. E、Tab. 4 | ✅ |
| 采样超参：EF 10000/5000 步、CFG 0.5、温度 0.8、top-p 0.5；Mask DFM 1000 步、CFG 1.5、top-k 2；random search N=200 后换种子 | Edit Flows Tab. 5 | ✅ |
| Mask DFM 基线：代码 / 文本用交叉熵，填充到 1024 | Edit Flows App. E | ✅ |
| Tab. 1 MS-COCO CIDEr：AR 95.5、Mask DFM 95.6、EF 108.1、Localized 105.1 | Edit Flows Tab. 1 | ✅ |
| Tab. 2 文本：HellaSwag 49.5/38.3/49.0；ARC-E 71.0/55.4/63.1；WinoGrande 62.1/52.3/53.6；CFG 6 档取最好 | Edit Flows Tab. 2、Tab. 6 | ✅ |
| Tab. 3 代码（AR† / Mask DFM† / U+EF / EF / Localized） | Edit Flows Tab. 3 | ✅ |
| 文本基准用 ELBO 的噪声估计（局限） | Edit Flows §6 | ✅ |
| 官方代码 | GitHub 检索仅见第三方教学实现 | ❓ 未找到 |
| FlexMDM：v1 2025-08-31；插入 [M] + 去掩码；LLaDA-8B 16×H100 三天，GSM8K 58→67%、代码填空 52→65% | FlexMDM 摘要、§1；arXiv abs | ✅（作者自报） |
| FlexMDM ICLR 2026 | survey | ⚠ |
| DiffusionGemma 采用均匀源与 Gat et al. 离散 Euler 步 | DiffusionGemma 报告 §2.1、§2.1.2 | ✅ |

## 05 — Duo 与均匀态扩散 (`05-uniform.html`) — 2506.10892, 2602.15014

| Claim | Source | Status |
|---|---|---|
| Duo arXiv v1 2025-06-12；ICML 2025；Cornell Tech + EPFL（Chiu 署 Cohere） | arXiv abs；作者块 | ✅ |
| 均匀态前向 Cat(α_t x + (1−α_t)1/K)、反向后验 Eq. 4 | Duo Eq. 1–5 | ✅ |
| 高斯扩散定义在 K 维 one-hot 上（非词嵌入） | Duo §3.1、§6 | ✅ |
| argmax 推前边缘 = 均匀态，α_t = T(α̃_t)，Eq. 11 闭式；满足均匀态 ODE | Duo Eq. 10–13 | ✅ |
| Eq. 11 中 φ 写作 exp(−z²)/√(2π)（笔误） | Duo Eq. 11 | ✅（笔误已标注） |
| 边缘对偶但离散化轨迹非马尔可夫离散扩散 | Duo App. A.3 | ✅ |
| 离散似然 ≥ 高斯似然 | Duo Thm. 3.2 | ✅ |
| 未来工作：高斯侧引导、ε / v 参数化 | Duo §7.2（v3） | ✅ |
| K=30K 时 α̃∈[0.85,1] 近乎覆盖 α∈[0,1] | Duo §4.1.2、App. C.7 | ✅ |
| 课程损失 Eq. 21；仅 τ→0 且 [β,γ]=[0,1] 时为 NELBO；评测用真 NELBO | Duo §4.1.2、App. C.4 | ✅ |
| τ=1e-3 前 50 万步、[β,γ]=[0.03,0.15]（α_t∈[0.05,0.95]）；之后 τ=0；α̃_t=1−t | Duo §5、§5.1、App. C.7 | ✅ |
| 课程第二阶段 t 范围 | — | ❓ 未单列 |
| 预计算 10 万个 (α̃, T(α̃)) 对；8×H100、bf16；170M DiT | Duo §5 | ✅ |
| DiT 12 层 / 768 / 12 头 / 时间嵌入 128；AdamW lr 3e-4、预热 2500、dropout 0.1、batch 512、1M 步 | Duo App. C.5、§5 | ✅ |
| 软输入 = 嵌入矩阵的凸组合 | Duo App. C.2 | ✅ |
| 梯度方差（top-100）10k 步 0.30 vs 11.7 | Duo Tab. 4 | ✅ |
| 51 万步 PPL 35.2，UDLM 1M 步 36.7 → “至少 2×” | Duo §5.1 | ✅ |
| 消融：33.7 / 35.0（去课程）/ 36.7（再去 RB 损失 = UDLM） | Duo Tab. 3 | ✅ |
| Tab. 1：AR 22.3/22.8/17.5；MDLM 27.0/31.8/23.2；SEDD Unif 40.3/–/29.7；UDLM 31.3/36.7/27.4；Duo 29.9/33.7/25.2 | Duo Tab. 1 | ✅ |
| 摘要“距掩码 <2 PPL”只对 OWT 与打包 LM1B 成立（不打包差 2.9） | Duo Tab. 1 + 推算 | ✅（推算） |
| 零样本：3/7 优于 AR（Lambada、Pubmed、Arxiv）；1/7 优于 MDLM（PTB） | Duo Tab. 2 | ✅ |
| DDT：P_ODE 的 argmax 投影；DCD 损失 KL(学生, 教师)；教师为当前学生权重（非 EMA，消融更好） | Duo §4.2、Alg. 1、Eq. 23、Fig. 10 | ✅ |
| DCD：5 轮、M=10k、δ_0=1/512 每轮 ×2；GPT-2 Large Gen PPL；fp64 采样 | Duo §5.2 | ✅ |
| Tab. 7 少步数字（MDLM、SDTT、Duo、DCD 祖先 / Greedy-tail，1024/16/8 步） | Duo Tab. 7、Tab. 5 | ✅ |
| 16 步匹配 1024 步基线；Greedy-tail 8 步（熵略降） | Duo Fig. 4、§5.2 | ✅ |
| App. C.8 写在 LM1B 蒸馏 MDLM，§5.2 写 OWT | Duo App. C.8、§5.2 | ✅（不一致已标注） |
| 掩码模型缺乏“隐式”确定性映射，少步蒸馏退化 | Duo §1 | ✅ |
| Duo 第二章 Ψ-samplers：2602.21185，v1 2026-02-24；训练时间 −25%、显存 −33%；ICLR 2026 | arXiv abs；Beyond-Masked 参考文献；官方 README | ✅ |
| 隐变量 [B, L, K] 约 5.1e7 数 / 序列，fp32 约 206 MB | 推算（L=1024，K=50257） | ⚠ 推算 |
| Beyond-Masked v1 2026-02-16；作者 / 机构 | arXiv abs；作者块 | ✅ |
| Beyond-Masked ICML 2026 | 官方仓库 README | ⚠ 二手 |
| 设置：DiT、Llama-2 分词器（32,001）、L=2048、batch 256、SlimPajama、calflops、C ∈ {6e18,…,1e20} | Beyond-Masked §3 | ✅ |
| AR / MDLM 时间输入置零；均匀态需时间条件 | Beyond-Masked §2.2.2、§3 | ✅ |
| 计算倍数：MDLM(ELBO) ≈16×、低方差 ≈14×（≈12%）、Duo ≈23×、Eso-LM ≈32×；最优模型 ≈2× 小 | Beyond-Masked §3.2 | ✅ |
| 低方差损失：权重换成 −1，仅训练时 | Beyond-Masked Eq. 7–8 | ✅ |
| 困惑度跨族不可比的理由（不同界、推理特性） | Beyond-Masked §1、§5 | ✅ |
| 前沿：Gen PPL（Llama-2 7B、1000 条、fp64）与吞吐（单 H100 最大 2 的幂 batch）；目标 40–200；AR <200、Duo [200,400]∪[600,∞)、Eso-LM [400,600] | Beyond-Masked §3.3、Fig. 1 | ✅ |
| AR 前沿吞吐的 KV cache 实现 | — | ❓ 未写明 |
| 1.7B：2.1T token、Nemotron phase 1+2、64×H100、词表 128,000、1% 随机截断、lr 3e-4 → 4e-5（1.4T 后衰减）、batch 256 | Beyond-Masked §4 | ✅ |
| Tab. 1 零样本（ARC-e、BoolQ、PIQA、RACE 等） | Beyond-Masked Tab. 1 | ✅ |
| GSM8K：385K 增强集、5 epoch、上下文 256；全部逐 token 左到右；AR 62.9 / MDLM 58.8 / Eso 33.4 / Duo 65.8；吞吐 25.6 / 24.6 / 25.6 / 24.6（batch 1） | Beyond-Masked §4.2、Tab. 2 | ✅ |
| Tab. 3 网格：MDLM 最好 61.7（2e-5, 2e-6, 5ep），Duo 最好 66.0（2e-5, 5e-8） | Beyond-Masked Tab. 3 | ✅（与 Tab. 2 不一致已标注） |
| 扩展律 28 个模型配置（14M–1708M） | Beyond-Masked Tab. 4 | ✅ |
| 均匀态模型如何“逐 token 左到右”解码 | — | ❓ 未说明 |
| von Rütte et al. 2512.10858：均匀需更多参数、更少数据；10B / 1e22 FLOPs | arXiv 摘要 | ✅（摘要） |
| Sumi 2606.19005：7B 均匀态从零、1.5T token、常识类较弱 | arXiv 摘要 | ✅（摘要） |
| DiffusionGemma：均匀前向（§2.1.1）、画布从均匀随机 token 起、前序画布冻结、256-token 块（§3.1–3.2）、采样器引用 Duo 第二章（§3.3）、DFM Euler 步（§2.1.2） | DiffusionGemma 报告 | ✅ |
| SDTT（2410.21035）为 MDLM 蒸馏基线 | Duo §5.2；arXiv abs | ✅ |
| Duo 代码 / 权重、Beyond-Masked 代码 / 权重链接 | 官方 README、HF（HTTP 200） | ✅ |

## 06 — LLaDA、SMDM 与 iLLaDA (`06-llada.html`) — 2502.09992, 2410.18514, 2606.25331

Read: LLaDA arXiv v3 (HTML), SMDM v3 (HTML), iLLaDA v1 (HTML); official code `ML-GSAI/LLaDA` (`generate.py`, `get_log_likelihood.py`, `GUIDELINES.md`, README); 2610.17590 v1 for the 16× pointer.

| Claim | Source | Status |
|---|---|---|
| LLaDA 8B: 2.3T tokens, 0.13M H800 GPU hours, seq 4096, 1% random length U[1,4096] | LLaDA §2.2 | ✅ |
| Data mix ≈11% Chinese / 61% English / 28% code; SFT 4.5M pairs (1M human + 3.5M synthetic) | LLaDA App. B.1 | ✅ |
| WSD: 2000 iters to 4e-4; after 1.2T decay to 1e-4 for 0.8T; last 0.3T linear to 1e-5; AdamW wd 0.1; batch 1280, 4/GPU | LLaDA §2.2 | ✅ |
| SFT 3 epochs, lr 2.5e-5 (→2.5e-6 last 10%), batch 256 | LLaDA §2.3 | ✅ |
| Arch vs LLaMA3 8B: KV heads 32 vs 8, FFN 12,288 vs 14,336, vocab 126,464 vs 128,000, params 8.02B vs 8.03B, non-emb 6.98B | LLaDA Tab. 5 | ✅ |
| MHA because "incompatible with KV caching" | LLaDA §2.2 | ✅ |
| ~9.6e22 FLOPs via 6ND | computed from Tab. 5 + 2.3T | ⚠ inferred |
| Eq. 6 (l-uniform) needs 128 MC vs >1000 for Eq. 12; single-token tasks 1 MC | LLaDA App. A.2, B.6 | ✅ |
| Random vs low-confidence remasking (BBH 32.1→45.0, GSM8K 21.3→70.0, MATH 9.2→30.3, HE 11.6→32.9, MBPP 21.0→40.2) | LLaDA Tab. 9 | ✅ |
| Instruct semi-AR GSM8K 77.5 / MATH 42.2 (B=32), 78.6 (B=8); pure diffusion 69.4 / 31.9; AR sampling GSM8K 0 | LLaDA Tab. 8, Tab. 2, App. B.4 | ✅ |
| EOS confidence set to 0 for HE/MBPP/GSM8K/MATH/GPQA (Instruct) | LLaDA App. B.4, B.6 | ✅ |
| Base eval: gen length = steps = 1024; Instruct steps = answer length (3–512) | LLaDA App. B.6 | ✅ |
| Poem completion 496 pairs; GPT-4o 82.7/34.3, Qwen2.5-7B-Instruct 75.9/38.0, LLaDA 51.8/45.6 | LLaDA Tab. 4, §3.3 | ✅ |
| Base table (MMLU 65.9 vs 65.4 etc.) | LLaDA Tab. 1 | ✅ |
| iGSM 64/41/44 vs 38/35/34 (100 Qs each) | LLaDA Tab. 12, App. B.8 | ✅ |
| Throughput 1.5× / 1.8× vs LLaMA3 w/ KV cache on GSM8K / MATH; A100-80GB, batch 1, bf16, 256 tokens | LLaDA App. B.7 | ✅ (read from text; Fig. 5 not inspected) |
| Memory 17.53 vs 16.41 GB (1024/1024) | LLaDA Tab. 11 | ✅ |
| Alg. 5 internal inconsistency vs code (top-k transfer) | LLaDA App. A.3; `generate.py` | ✅ |
| Code: stratified l in MC likelihood; t ∈ [1e-3, 1); mask id 126336; Gumbel in float64 | official code | ✅ |
| SMDM: IsoFLOP 6e18–1e20, C=6ND, SlimPajama, Llama-2 tokenizer, ctx 2048 | SMDM §3 | ✅ |
| SMDM 16× compute; optimal size ≈ half of ARM; CDM 64× | SMDM §3, Fig. 2 | ✅ |
| SMDM pretraining: AdamW (0.9,0.95), wd 0.1, cosine 4e-4→4e-5, batch 256; 1.1B at 3.3e21 FLOPs | SMDM App. B.2 | ✅ |
| SMDM MT-Bench: MDM 1.40/1.56/1.60 at 64/128/256 NFE (204/396/780 s) vs ARM 1.57, 325.94 NFE, 555 s; A100-40GB | SMDM Tab. 4, §6 | ✅ |
| SMDM reverse curse DescriptionToName reverse 92 vs GPT-3 0 | SMDM Tab. 5 | ✅ |
| iLLaDA: 12T tokens, GQA 8 KV heads, tied emb, vocab 155,136, max len 8192, 7.62B total / 6.98B non-emb | iLLaDA §2.1, Tab. 1 | ✅ |
| iLLaDA 30% split, varlen packing; lr 2e-4 const → cosine to 5e-6 | iLLaDA §2.1 | ✅ |
| iLLaDA SFT whole-sequence masking, ~25B tokens × 12 epochs, lr 5e-6 | iLLaDA §2.2 | ✅ |
| iLLaDA variable-length block generation; block 32 (HE 512) | iLLaDA §2.3, App. A; `var_generate` | ✅ |
| Confidence scoring +1.3 / +0.6 / +2.3 (PIQA/ARC-C/HellaSwag) | iLLaDA Tab. 4 | ✅ |
| iLLaDA base/instruct tables; Instruct avg 67.1 vs Qwen2.5 77.1 | iLLaDA Tab. 2–3 | ✅ |
| iLLaDA's LLaDA column takes best-of semi-AR / pure diffusion per benchmark | cross-check iLLaDA Tab. 3 vs LLaDA Tab. 2/8 | ✅ (inference from numbers) |
| LLaDA MMLU-Redux 68.9 (as cited in iLLaDA) | not in LLaDA v3 | ❓ |
| iLLaDA sampling steps / TPF / compute | not reported | ❓ |
| 16× revisit: ELBO 17.8×, DUEL 12.8×, E2D2 7.8× (b=32), 4.6× (b=8), 3.0× (b=4) | 2610.17590 abstract, §4.1 | ✅ (new, unreplicated) |
| LLaDA venue NeurIPS 2025 Oral | registry / candidates | ⚠ |

## 07 — Dream 7B 与 DiffuLLaMA (`07-dream.html`) — 2508.15487, 2410.17891

Read: Dream arXiv v1 (HTML), Dream blog (hkunlp.github.io/blog/2025/dream/), `HKUNLP/Dream` README + `src/trainer/fsdp_sft_trainer.py` + `src/diffllm/gen_utils.py` + `sft_trainer.yaml` + `run_sft_tulu3.sh`, HF `Dream-org/Dream-v0-Instruct-7B/generation_utils.py`, `Dream-v0-Base-7B/config.json`; DiffuLLaMA arXiv (HTML), `HKUNLP/DiffuLLaMA` (`DiffuLLaMA-training/train.py`, `LLaMA-Factory/.../ddm/trainer.py`); DiffuCoder 2506.20639 (AR-ness section).

| Claim | Source | Status |
|---|---|---|
| Dream blog 2025-04-02, checkpoints 2025-04-05; arXiv v1 2025-08-21; report header "April 2, 2025" | Dream README News; blog; arXiv | ✅ |
| Dream init from Qwen2.5-7B; same config | Dream §4.3; config.json | ✅ |
| 580B tokens from Dolma v1.7, OpenCoder, DCLM-Baseline | Dream §4.3; blog | ✅ |
| Shift operation kept from DiffuLLaMA; code `cat([logits[:, :1], logits[:, :-1]])` | Dream §4.1; `generation_utils.py`; trainer | ✅ |
| CART Eq. 4–5; code W_nj = 0.5 p (1−p)^{|n−j|−1}, diag 0; weight = (1−m)W | Dream §4.2; `fsdp_sft_trainer.py` | ✅ |
| cart_p = 0.1 in YAML (function default 0.8); run_sft_tulu3.sh uses cart, lr 2e-6 | official config/scripts | ✅ |
| Pretraining CART p, lr, hardware, GPU hours | not disclosed | ❓ |
| CART weight ≤1 and no longer an ELBO | derived from Eq. 5 | ⚠ inferred |
| 1B study with LLaMA3.2-1B, 200B tokens; AR init lower loss; initial spike from causal→full | Dream §5.4, Fig. 4; blog | ✅ |
| LR too high washes away L2R knowledge | Dream §5.4; blog | ✅ |
| Dream 7B config: hidden 3584, 28 layers, 28 heads, 4 KV, FFN 18,944, vocab 152,064, mask id 151666, rope θ 1e6 | `config.json` | ✅ |
| Context length 2048 | Dream README | ✅ |
| Decoding algs origin / maskgit_plus / topk_margin / entropy; 'origin' may degrade | Dream README; generation_utils.py | ✅ |
| SFT 1.8M pairs (Tulu 3 + SmolLM2), 3 epochs | Dream §4.3, §5.3 | ✅ |
| Base table (Dream/LLaDA/Qwen2.5/LLaMA3), incl. Sudoku 81.0, Countdown 16.0 | Dream Tab. 1 | ✅ |
| Instruct numbers (MMLU 67.0, GSM8K 81.0, MATH 39.2, HE 55.5, MBPP 58.8, IFEval 62.5) | Dream Tab. 2 | ✅ |
| Countdown 5–20 steps faster and better than Qwen2.5 | Dream §5.5.2, Fig. 7 | ✅ (hardware not given) |
| "1/4 of LLaDA's data"; iLLaDA lists Dream as 18T + 0.6T | Dream §5.2; iLLaDA Tab. 2 | ✅ |
| DiffuLLaMA: attention-mask annealing, shift, time-embedding-free | DiffuLLaMA §3.3 | ✅ |
| DiffuGPT: FineWeb 30B unique, >100B effective; 8×A100-80G; lr 3e-4 cosine, 2K warmup, 10K anneal steps | DiffuLLaMA §4.1, App. B.1–B.2 | ✅ |
| DiffuLLaMA 7B: 65B tokens SlimPajama:Starcoder 7:3; no annealing (flash-attn 2); 16×4 GH200; batch 60/GPU, accum 4; constant lr 2e-5 | DiffuLLaMA §4.1, App. B.1–B.2 | ✅ |
| 65B vs 60B inconsistency | DiffuLLaMA §4.1 vs App. B | ✅ |
| [M] ids: 10541 (S), 50257 new (M), 811 (7B) | DiffuLLaMA App. B.2 | ✅ |
| Annealing code = causal ∪ Bernoulli(ρ), ρ = min(1,(step+1)/anneal_steps) | `ddm/trainer.py` | ✅ |
| Ablation GPT2-M GSM8K-sym: DD 49.7, no anneal 47.2, no shift 34.5; ELBO 0.015/0.019/0.028 | DiffuLLaMA Tab. 3, Tab. 5 | ✅ |
| Table 1 numbers (TriviaQA, Lambada, HellaSwag, GSM8K*, code infill) | DiffuLLaMA Tab. 1 | ✅ |
| MAWPS ZS 9.7 → FS 31.3 → SC 33.1 | DiffuLLaMA Tab. 2 | ✅ |
| Continual AR pretraining of GPT-2 gives no gain | DiffuLLaMA App. C.4, Tab. 9 | ✅ |
| Speed (batch 1, flash-attn 2): 1024 → 13.3 vs 17.5 s; 2048 → 23.5 vs 35.7 s; 512 → 12.5 vs 9.2 s | DiffuLLaMA Tab. 10 | ✅ |
| Whether LLaMA2 used KV cache in speed test | not stated | ❓ |
| MC scoring sensitivity T=32 vs 8 (HellaSwag 58.7 vs 47.1) | DiffuLLaMA Tab. 11 | ✅ |
| Adapted dLLMs show higher AR-ness than from-scratch (Dream vs LLaDA); temperature lowers AR-ness | DiffuCoder §4.2–4.3, Fig. 3, 5 | ✅ |
| FlashAttention-2 only natively supports causal/full masks (reason annealing was dropped) | general knowledge | ⚠ inferred |
| Dream's MC-likelihood sample count | not found | ❓ |

## 08 — 数据受限下的扩散与 AR (`08-data-constrained.html`) — 2507.15857, 2511.03276

Read: Prabhudesai et al. arXiv v7 (HTML); Ni et al. arXiv v1 (HTML) + official Notion blog (dumped via Notion page-chunk API, released 2025-08-09, with 08-11 / 08-26 updates); 2510.04071 abstract; 2610.17590 v1 (abstract, §2, §4).

| Claim | Source | Status |
|---|---|---|
| Title of 2511.03276 = "Diffusion Language Models are Super Data Learners"; v1 2025-11-05; "initial draft" footnote | arXiv abs + HTML | ✅ |
| Setup: C4, GPT-2 BPE, 2048; U ∈ {25,50,100}M; up to 800 epochs (80B); 7M–2.5B; 200 models | Data-Constrained §2.4, §3 | ✅ |
| Hyperparams: batch 256, AdamW (0.9,0.95), eps 1e-8, lr 2e-4→2e-5 cosine, 1% warmup, wd 0.1, clip 1.0; Megatron-DeepSpeed; RoPE/SwiGLU/RMSNorm/no bias | Data-Constrained App. 8–9 | ✅ |
| MDM objective with 1/r (v7) | Data-Constrained §2.2 | ✅ |
| 100M: diffusion best at 500 epochs, AR at 50; single-epoch 10.65 vs 7.07; best 3.55 vs 3.71 (67% vs 48%) | Data-Constrained §3.1, Fig. 2 caption | ✅ |
| R_D*: ≈500 vs ≈15 (intro), 512.85 vs 31.93 (§3.2), 493.89 vs 31.19 (Tab. 1b); R_N* 1265.65 vs 55.16; R² 0.9784 vs 0.7628 | Data-Constrained §1, §3.2, Tab. 1 | ✅ (inconsistency flagged) |
| Repeated ≈ fresh: AR ≈4 epochs, diffusion ≈100 epochs | Data-Constrained §3.2, Fig. 5 | ✅ |
| log10 U = 0.460 log10 C − 1.050; C_crit = 2.12×10^1.956 U^2.174 | Data-Constrained §3.3 | ✅ |
| C_crit ≈ 2.3e18 / 1.0e19 / 4.7e19 FLOPs at 25/50/100M | computed from the fit | ⚠ inferred |
| Unit inconsistency in critical-compute equation acknowledged (Biderman) | Data-Constrained §5 Acknowledgement | ✅ |
| AR perturbations (attention dropout 25/50/75%, token masking) do not help; 140M, 50 epochs | Data-Constrained §3.5, App. 7, Fig. 8 | ✅ |
| AR with N orderings (278M, 100 epochs); N=16 approaches diffusion | Data-Constrained §3.5, Fig. 7 | ✅ |
| Orderings = raster + Gaussian noise (std ∝ index) then argsort; first token fixed; evaluated L2R | Data-Constrained App. 12, Alg. 1–2 | ✅ |
| Why AR more compute-efficient (order specialization; denser supervision) | Data-Constrained App. 10 | ✅ |
| Downstream Tab. 2 (100M) and Tab. 3 (500M; 2.3B diffusion 130 epochs) | Data-Constrained Tab. 2–3, App. 7 | ✅ |
| NLL Tab. 4 (Best ARM 4.32e18 vs Best MDM 1.24e20 FLOPs; OSCAR 3.98/3.83 ...); ≈29× compute ratio | Data-Constrained Tab. 4; ratio computed | ✅ / ⚠ |
| Super Data setup: Megatron-LM, Nemotron-CC, batch 256, seq 2048, WSD peak 2e-4, 1000 warmup, 10% exp decay to 2e-5, GPT-2 tokenizer, RoPE, SwiGLU, RMSNorm, qk-norm, LLaDA objective | Super Data §3.1 | ✅ |
| 1B, 96B total tokens, unique 0.5B–96B; >3× data potential (0.5B DLM ≈ 1.5B AR) | Super Data §3.2 | ✅ |
| Quality later crossover; size 1B→8B earlier; smallest DLM beats all AR sizes; 8B1A MoE | Super Data §3.3–3.5 | ✅ |
| AR input masking / dropout 10–90% help but don't close gap | Super Data §3.6, Fig. 5–6 | ✅ |
| 1.7B coder: 10B (9B + 1B anneal) Python, ≈150 epochs, ≈1.5T tokens, seq 4096, batch 1024; MBPP vs HumanEval crossover timing | Super Data §4, Fig. 7, 13 | ✅ (no numeric table) |
| 480 epochs on 1B tokens: HellaSwag 56%, MMLU 33% vs AR 41%, 29%; DLM overfits up to 1000 epochs | Super Data §6, Fig. 10–11 | ✅ |
| Rising val loss ≠ worse downstream | Super Data §5, Fig. 8–9 | ✅ |
| >100× training FLOPs (preliminary); inference 16×–4700× for lengths 16–4096 | Super Data §7.1, Fig. 12 | ✅ |
| AR ≈2× supervision signals vs MDM (linear schedule); 2^L corruptions vs L prefixes | Super Data §7.2, §3.4 | ✅ |
| Blog critique (5 points) of Prabhudesai v2; v3 added time reweighting; updates 08-11, 08-26 (code released) | Super Data official blog §3 | ✅ (secondary source: blog) |
| 2510.04071: random input masking dominant; MLP dropout & weight decay similar gains | 2510.04071 abstract | ⚠ abstract only |
| 16× revisit: ELBO 17.8×, DUEL 12.8×, BD3LM b=32 9.6×, E2D2 7.8× / 4.6× / 3.0× (b=32/8/4); ~1700 models; WinoGrande/BoolQ/COPA excluded downstream | 2610.17590 abstract, §4.1, §4.4 | ✅ (new, unreplicated) |
| Super Data hardware / GPU hours; decoding steps for code benchmarks | not reported | ❓ |

## 09 — LLaDA-MoE, LLaDA2.0 与 LLaDA2.1 (`09-llada2.html`) — 2509.24389, 2512.15745, 2602.08676

Read: LLaDA-MoE arXiv HTML v1; LLaDA2.0 arXiv HTML v2 (2025-12-24); LLaDA2.1 arXiv HTML v3 (2026-02-13); HF model cards (LLaDA-MoE-7B-A1B-Base, LLaDA2.0-mini/flash, LLaDA2.1-mini/flash); LLaDA2.1-flash `config.json` and `modeling_llada2_moe.py` (generate()).

| Claim | Source | Status |
|---|---|---|
| LLaDA-MoE: ~20T tokens from scratch, 7B total / 1.4B active | LLaDA-MoE abstract, Tab. 2 | ✅ |
| LLaDA-MoE arch: 16 layers, hidden 2048, 16 heads, 64 experts / 8 active, expert dim 1024, RoPE base 50,000 | LLaDA-MoE Tab. 2 | ✅ |
| LLaDA-MoE pipeline 10T + 10T + 500B + 500B (RoPE 10k→50k, 4k→8k) + SFT | LLaDA-MoE §3.1, Fig. 3 | ✅ |
| Variable-length training in 1% of steps, ℓ ∈ [8, 4096]; SFT capped at 4k to avoid EOS over-generation | LLaDA-MoE §3.2 | ✅ |
| Aux loss weights 0.01 (LB) / 0.001 (z-loss) | LLaDA-MoE §3.2 Eq. (4) | ✅ |
| Eval: semi-AR, gen length 1024, block 64; MDM baselines cited from their papers | LLaDA-MoE §4 | ✅ |
| Instruct numbers (MMLU 67.18, GSM8K 82.41, MATH 58.68, HumanEval 61.59, MBPP 70.02, avg 53.12) and baselines | LLaDA-MoE Tab. 3 | ✅ |
| Base avg 46.94 vs Qwen2.5-3B Base 50.34 | LLaDA-MoE Tab. 1 | ✅ |
| Fig. 2 "top-2" vs Tab. 2 "8 activated"; 1B vs 1.4B; HF card context 4,096 vs paper 8k | LLaDA-MoE Fig. 2, Tab. 1–3; HF Base card | ✅ (inconsistency noted) |
| LLaDA2.0 bases Ling-mini-2.0 / Ling-flash-2.0; mini 16B, flash 100B MoE | LLaDA2.0 abstract, §4.1 | ✅ |
| Active params 1.4B (mini) / 6.1B (flash); 20 / 32 layers; context 32,768 | HF LLaDA2.0 model cards | ⚠ secondary (model card) |
| "≈20T tokens" CPT wording | HF LLaDA2.0 card (ambiguous); paper silent | ❓ |
| WSD block sizes 1→4→32→64→4096, stable at 4096, decay 4096→2048→…→32; divisibility requirement | LLaDA2.0 §4.1 | ✅ |
| Stable phase drops clean copy → cheaper attention | LLaDA2.0 §4.1 Phase-2 | ✅ (qualitative) |
| Document-level attention mask; beats random-length / CART in CPT | LLaDA2.0 §4.2 | ✅ (authors' claim) |
| Top-k checkpoint merge (WSM) | LLaDA2.0 §4.3 | ✅ |
| Gaussian noise on [M] embedding output early in training | LLaDA2.0 §7.1 | ✅ |
| Mask-ratio bandwidth [α_min, α_max] (values not given) | LLaDA2.0 §5.1 | ✅ |
| Complementary masking only in post-training (CPT helps only < 100B tokens) | LLaDA2.0 §5.1 footnote 1 | ✅ |
| CAP loss inspired by dParallel; λ not given | LLaDA2.0 §5.2 Eq. (6) | ✅ |
| DPO: 1.5M pairs, β = 0.1, single-MC ELBO, ref = post-SFT | LLaDA2.0 §5.3 Eq. (7)(8) | ✅ |
| Inference: threshold + low-confidence fallback | LLaDA2.0 §5.4 | ✅ |
| Eval setting: temperature 0, block 32, threshold 0.95; 47 benchmarks | LLaDA2.0 §6.1 | ✅ |
| flash results (avg 73.18, MMLU-Pro 73.36, GPQA 61.98, HumanEval 94.51, LCB 42.29, AIME 60.00, BFCL 75.43) and Qwen3 / Ling baselines | LLaDA2.0 Tab. 2 | ✅ |
| mini threshold/block analysis: 0.95 → 70.15 / 2.55 TPF; 0.85 → 67.90 / 3.31; B=16 → 70.26 / 2.44; B=64 worse | LLaDA2.0 §6.3 text | ✅ |
| RULER: flash > 93 for 4k–32k; mini 93.29 → 83.94; 64k via YaRN ×2 | LLaDA2.0 §6.3 | ✅ |
| cuDNN attention: > 1.3× end-to-end, > 90% attention memory saving (mini) | LLaDA2.0 §7.1 | ✅ (not shown on page) |
| TPS: flash-CAP 535, flash 383, AR 256 / 237, "up to 2.1×"; dInfer vs SGLang; 4 benchmarks; threshold 0.95 | LLaDA2.0 §7.3 | ✅ ; hardware/batch ❓ not stated |
| Eq.(1)(2) sign vs "−α′/(1−α) weight"; "Figure 5" vs Fig. 4; two-stage / three-stage wording | LLaDA2.0 Eq. (1)(2), §1, §3, §6.3 | ✅ (inconsistency noted) |
| LLaDA2.1 Γ / Δ sets, union update | LLaDA2.1 Eq. (1)–(3) | ✅ |
| Exposure-bias motivation (errors → conservative later steps) | LLaDA2.1 §2 | ✅ |
| M2T + T2T dual-stream CPT/SFT; MTF augmentation | LLaDA2.1 §3.1 | ✅ |
| EBPO clipped surrogate with block-level ELBO ratio, vectorized likelihood | LLaDA2.1 §3.2 Eq. (4)(5) | ✅ |
| Serving: custom SGLang, Alpha-MoE megakernel, per-block FP8, radix cache, batching, block-causal prefill | LLaDA2.1 §4.2 | ✅ |
| MBE | LLaDA2.1 §4.3, Tab. 4 | ✅ |
| S / Q thresholds 0.5 / 0.0 and 0.7 / 0.5; max_post_steps 16; output length 16384; block 32 | HF LLaDA2.1-flash card | ⚠ secondary (card only; paper silent) |
| Code: edits only non-mask, non-prompt positions; fallback min 1 token; signature default editing_threshold 0.9 vs docstring 0.5; HF generate() recomputes prefix each step | `modeling_llada2_moe.py` generate() | ✅ (code) |
| flash config: 32 layers, hidden 4096, 256 experts / 8 + 1 shared, 4 KV heads, head_dim 128, vocab 157,184, first_k_dense_replace 1 | LLaDA2.1-flash config.json | ✅ (code) |
| 2.1 flash/mini Score/TPF (avg 72.43/3.08, 72.34/5.93, 73.54/3.64; mini 63.39/2.60, 62.07/5.34, 63.90/3.12; HumanEval+, AIME, ZebraLogic, IFEval rows) | LLaDA2.1 Tab. 1–2 | ✅ |
| TPS w/o vs w/ FP8 (HumanEval+ 746.66 → 891.74, −3.04; BCB 691.14 → 801.48, +1.06; IFEval 219.37 → 248.25; mini 1496.67 → 1586.93; PrOntoQA 912.16) | LLaDA2.1 Tab. 3 | ✅ ; hardware/batch ❓ not stated |
| MBE flash avg 70.69/5.82 → 72.67/5.14; AIME 63.33 → 70.00 | LLaDA2.1 Tab. 4 | ✅ |
| S-mode stuttering in general chat; recommend Q mode | LLaDA2.1 §6 | ✅ |
| Re-evaluated 2.0 numbers differ (GPQA 62.31 vs 61.98; HumanEval+ 88.41 vs 87.80); Tab. 2 caption mislabel | LLaDA2.1 Tab. 1–2 vs LLaDA2.0 Tab. 2 | ✅ (inconsistency noted) |
| Third-party: LLaDA2.1 Flash S 375 TPS, 4.63 TPF on 8×B200 BF16 bs1 | DiffusionGemma Tab. 3 | ✅ |
| "3–6 TPF ⇒ 6–11 forwards per 32-token block" | page arithmetic | ⚠ inferred |

## 10 — 工业 dLLM：DiffusionGemma、Mercury 与 Seed Diffusion (`10-industrial.html`) — 2608.00146, 2506.17298, 2508.02193 (+ 2606.14620 abstract)

Read: DiffusionGemma arXiv HTML v1 (2026-07-31, incl. App. E); Mercury arXiv HTML v1; Seed Diffusion arXiv HTML v1; 2606.14620 abstract page only; Gemini Diffusion blog + deepmind.google model page (raw HTML); Inception "Introducing Mercury 2" blog (raw HTML).

| Claim | Source | Status |
|---|---|---|
| AR low-concurrency decoding is memory-bound; diffusion shifts toward compute-bound | DG §1, §6 | ✅ |
| Speculative decoding with draft 8 → 3–6 TPF | DG §1 (citing Li et al. 2026) | ⚠ secondary (DG quoting) |
| DG fine-tuned from Gemma 4 26B A4B post-trained weights; < 10% of AR training tokens | DG abstract, §1, §3 | ✅ |
| Params: total 25.2B, active 3.85B (3.8B in abstract), vision 550M, embedder 740M, self-cond 7.8M, 8/128 experts + 1 shared, vocab 262k | DG Tab. 1 | ✅ |
| Sampler hyperparams: canvas 256, N = 48, e_stop 0.005, b 0.1, temp 0.8 → 0.4; ~12 average steps | DG Tab. 2, §3.3 | ✅ |
| Uniform/multinomial forward kernel Eq. (1); "rather than masked diffusion"; SFT uniform noise tokens; Alg. 1 uniform init / re-noise | DG Eq. (1), §3.2, §4, Alg. 1 | ✅ |
| Third-party paper calls DG "masked discrete-diffusion", submitted 2026-06-12 | 2606.14620 abstract | ✅ (abstract only) |
| DG cites 2606.14620 in §3.2 interpretability remark | DG §3.2, refs | ✅ |
| Why 2606.14620 says "masked" (EB-sampler / accept-step) | page inference | ❓ unverified (marked) |
| Causal encoder + bidirectional decoder with shared weights; append KV per canvas; block-AR from unpublished June 2023 manuscript | DG §3, §3.1, Eq. (3)(4) | ✅ |
| Self-conditioning z = FFW(p̂₀E); 50% z / 50% zeros in downstream SFT | DG Eq. (5)(6), §8 | ✅ |
| Entropy-bounded acceptance, re-noise rest uniformly; EB-Sampler (Ben-Hamu et al.) | DG §3.3, Alg. 1 | ✅ |
| Adaptive stopping ~12 effective steps, ~4× latency reduction; code needs fewer steps | DG §3.3, Fig. 5 | ✅ |
| TPF / TPS / effective-steps definitions incl. K−1 | DG Eq. (7)–(10), (12) | ✅ |
| SFT: block-diagonal mask, t ~ U[0,1], CE over all canvas positions; thinking needs extended SFT | DG §4, Eq. (11), Fig. 6–7 | ✅ |
| SD·RL: online teacher, joint reward + distillation; implicit curriculum; +10 pts GPQA-D+LCB; TPF 5 → ~20; ~2× shorter outputs; < 5% forwards of Gemma 4 AR | DG §5, Fig. 8–9 | ✅ |
| SD·RL loss formula | — | ❓ not published |
| Retained AR mode, scores between TD and Gemma 4 | DG §3.5, Tab. 3 | ✅ |
| Per-step costs: 13.56 ms e2e / 12.63 ms GPU; 3.2× AR step; ~84 experts vs 8, MoE 4.3×; sampling 3.06 vs 0.56 ms; attention 4× (FA-4); 4096 in / 1024 out, H100 FP8 bs1 | DG §6, Fig. 11 | ✅ |
| 1456 TPS from 19.74 TPF; 7.1× over 204 TPS AR, 4.8× over 303 TPS MTP | DG §6 Eq. (12) | ✅ |
| AR overtakes around 32 concurrent requests; MTP draft length 4 in Fig. 12 | DG §6, Fig. 12, §10 | ✅ |
| Tab. 3 numbers (AIME 2026, GPQA-D, LCB-v6, HumanEval, TPS 1479/204/303/375/49/600, TPF 19.74/1.00/1.40/4.63/1.79, total tokens) and measurement conditions | DG Tab. 3 (column spans verified in HTML) | ✅ |
| IFEval no-think 732.1 TPS; GSM8K no-think 1966.4 TPS | DG Tab. 4 | ✅ |
| JSON extraction converges in 2–3 steps; answer-first example | DG §9.1, §9.3 | ✅ (qualitative) |
| Limitations: stuttering, closing thought tag, MMMU-Pro 54.3 vs 66.0 | DG §10 | ✅ |
| LoRA on all linear layers, 2× A100 80GB; Sudoku 0.00 → 84.40% | DG §8, Tab. 5 | ✅ (partly on page) |
| Mercury 2 OpenRouter estimates 489 / 600 / 547 TPS; AA median ~987 TPS; Inception ~1000 TPS | DG App. E | ✅ |
| Unsloth RTX 6000 up to 2,000 TPS | DG §1 | ⚠ third-party, not on page |
| Mercury: Transformer, "extend [28]" = SEDD, trillions of tokens, H100 cluster, context 32,768 / 128k | Mercury §2.1, refs | ✅ |
| Mercury serving: proprietary engine, dynamic batching, paging, custom kernels | Mercury §2.2 | ✅ |
| Mercury API endpoint tested Feb 2025 | Mercury §3 | ✅ |
| AA protocol: ~1,000 in / 1,000 out coding prompts proprietary to AA; median across providers | Mercury §3.2.1 | ✅ (throughput definition wording garbled in paper) |
| Mercury Tab. 1 numbers (Mini 88.0 / 77.1 / 17.0 / 42.0 / 1109; Small 90.0 / 76.6 / 25.0 / 45.5 / 737; baselines) | Mercury Tab. 1 | ✅ |
| FIM Small 93.1 / 76.5 (avg 84.8), Mini avg 82.2, Codestral 93.0 / 72.0 | Mercury Tab. 3 | ✅ |
| Copilot Arena Mini latency 0.25 s, Elo 993 (rank 2) vs text "25 ms" | Mercury Tab. 4, §3.2.2 | ✅ (inconsistency noted) |
| Seed: 2146 tok/s on H20 over eight open code benchmarks; dense Transformer; Seed-Coder data pipeline; size "-" | Seed abstract, Fig. 1, §3, Tab. 1 | ✅ ; batch ❓ not stated |
| Seed TSC: mask 80% / edit 20% steps; k_t = ⌊|x0| α_t⌋, α_t ∈ [0, 0.1]; no carry-over unmasking | Seed §3.1, Remark 3.1 | ✅ |
| Constrained-order trajectories selected by ELBO | Seed §3.2 Eq. (9) | ✅ |
| On-policy objective |τ| − V(τ[0]); Levenshtein surrogate | Seed §3.3 Eq. (10)(11) | ✅ |
| Block-level semi-AR with KV cache, no block-specific training, block size from Fig. 2(b) | Seed §3.4 | ✅ ; block value ❓ not given |
| Fig. 1 caveats (Mercury proprietary data/H100; Gemini mixed task/unknown hardware; format-constraining prompts) | Seed Fig. 1 caption | ✅ |
| Seed Tab. 1–3 numbers (Aider 44.4, CanItEdit 54.3, MBXP 72.6, NCB 42.2; Seed-Coder-8B 57.1 / 50.5 / 75.3 / 49.6; Qwen2.5-Coder-7B 57.9 / 49.5 / 72.9 / 35.4) | Seed Tab. 1–3 | ✅ |
| Seed typos (Eq. 6 conditioning, "Eq. 6" ref, "langevin") | Seed §3.1 | ✅ |
| Gemini Diffusion: 2025-05-20 blog; "Sampling speed excluding overhead 1479 tokens / sec", "Overhead 0.84 sec", "Average sampling speed across reported evals"; no architecture | blog.google; deepmind.google model page (raw HTML grep) | ⚠ vendor self-report |
| Mercury 2: "1,009 tokens/sec on NVIDIA Blackwell GPUs" | inceptionlabs.ai blog (raw HTML grep) | ⚠ vendor self-report; blog page shows "Published Oct 8, 2026" (republish?) |

## 11 — 块扩散：BD3-LM 与 Eso-LM (`11-block-diffusion.html`) — 2503.09573, 2506.01928

Read: BD3-LM arXiv HTML v3 (2025-05-17, incl. App. B–C); Eso-LM arXiv HTML v5 (2026-08-05, ICML 2026 camera ready, incl. App. C, E.10); official code `kuleshov-group/bd3lms` (`diffusion.py`, `noise_schedule.py`).

| Claim | Source | Status |
|---|---|---|
| Three limitations of discrete diffusion (fixed length, no KV cache, PPL gap) | BD3-LM §1 | ✅ |
| Block factorization Eq. (4)–(6); single network with block-causal mask; K/V signature Eq. (7) | BD3-LM §3.1 | ✅ |
| Paper notation L′ = block size, B = number of blocks | BD3-LM §3.1 | ✅ |
| Two passes per token; vectorized x_t ⊕ x; 20–25% faster than two passes | BD3-LM §3.2, §6.3 | ✅ |
| Attention masks M_BD / M_OBC / M_BC; FlexAttention ~5× over SDPA (A5000, L 1024, bs 16); ~15% end-to-end over FlashAttention | BD3-LM App. B.6–B.7 | ✅ |
| Alg. 1 training, Alg. 2 sampling with KV cache, arbitrary length | BD3-LM Alg. 1–2 | ✅ |
| NELBO tight at B = 1, looser as B grows (L_K ≤ L_{K+1}) | BD3-LM §4.1, App. B.5 | ✅ |
| B = 1: AR 22.88 vs ≤ 25.56; AR + random batch size 24.37; tuned (full-mask) schedule 22.88; variance 1.52 → 0.11 after 328M tokens; LM1B 16B tokens | BD3-LM Tab. 1, §4.2, Fig. 2 | ✅ (text says "two point" gap; table gives 2.68) |
| Clipped schedule U[β, ω]; grid search each validation epoch (~5K steps) minimizing Var NELBO | BD3-LM §5.2–5.3, §6 | ✅ |
| Tab. 2 / Tab. 8 schedule results (B = 4 clipped 29.21 vs linear 30.18; B = 16 U[0.3, 0.8] 31.12 vs 31.72) | BD3-LM Tab. 2, Tab. 8 | ✅ |
| LM1B / OWT PPLs (AR 22.83 / 17.54; SEDD ≤ 32.68 / ≤ 24.10; MDLM ≤ 31.78 / ≤ 22.98; BD3 B = 16, 8, 4) | BD3-LM Tab. 3–4 | ✅ |
| Gen PPL / NFE (AR 14.1 / 13.2; MDLM 46.8 / 41.3; SEDD 52.0; SSD-LM 37.2 @ 40K, 281.3 @ 1K; BD3 33.4 / 30.4 / 25.7 and 23.6 @ L = 2048) | BD3-LM Tab. 7 | ✅ |
| Lengths: OWT median 717; AR 4008; SEDD 1021 / max 1024; BD3 B = 16 median 798 / max 9982 | BD3-LM Tab. 6 | ✅ |
| Stopping: EOS or mean entropy of last 256 tokens < 4 | BD3-LM App. C.5 | ✅ |
| Architecture 12 layers / 768 / 12 heads, 110M, no timestep conditioning; batch 512, lr 3e-4, warmup 2.5K | BD3-LM App. C.2 | ✅ |
| 850K pretrain (B = L) + 150K finetune; LM1B 65B tokens / 73 epochs; OWT 524B / 60 epochs; LM1B wrapping, OWT no BOS/EOS | BD3-LM §6, App. C.1, C.3 | ✅ |
| Sampling: nucleus 0.9, T = 5K, first-hitting, 64-bit Gumbel; NFE ≤ L | BD3-LM App. C.5 | ✅ |
| Limitations: training < 2× diffusion; small blocks ~ AR constraints; task-specific block size | BD3-LM §7 | ✅ |
| Code: loss weight −1/mask-rate (log-linear), resampling blocks outside [β, ω], constant weight when β > 0.5 | bd3lms `diffusion.py` (_sample_t, _resample_q_xt, _forward_pass_diffusion), `noise_schedule.py` | ✅ (code) |
| Eso-LM hybrid process Eq. (6), bound Eq. (7), α_t = α0(1−t) | Eso-LM §3.1 | ✅ |
| Causal attention after shuffling clean-before-mask; KV caching with one-step lag; forward restricted to clean + current masks | Eso-LM §3.2, §4.1.1, §4.2, §6 | ✅ |
| κ = 0.5 batch split; α0 = 1 uses κ = 1 and constant −1 coefficient | Eso-LM §4.1, §5.1 | ✅ |
| Theorem 3.1 IW bound, K = 5000 (LM1B) / 1000 (OWT) | Eso-LM §3.3, §5.1 | ✅ |
| Single-pass NELBO variance: L_MDM SD 0.56 (10 MC) vs L_AO SD 0.03 (1 sample) | Eso-LM Tab. 2 | ✅ |
| Tab. 1 PPLs (AR+AdaLN 21.86 / 17.78; MDLM exact 26.82, NELBO 31.78 / 25.19; Eso α0 = 1, 0.25, 0.125 rows) | Eso-LM Tab. 1 | ✅ |
| BD3-LM OWT numbers inside Eso-LM retrained from scratch 250K steps (23.57 / 22.04 / 20.96) | Eso-LM Tab. 1 footnote r, App. C.3 | ✅ (protocol mismatch flagged) |
| Eso-LM (A) ablation matches MDLM PPL but no KV cache | Eso-LM §5.1 | ✅ |
| Latency Tab. 11 (A6000, bs 1, NFE = L): AR 13.3 / 54.0; MDLM 201.3 / 5438.3; BD3 B = 4 24.3 / 312.0; B = 16 21.3 / 268.1; Eso 14.6 / 82.1 | Eso-LM §5.3, Tab. 11, App. C.3 | ✅ |
| L = 10240: BD3 B = 4 Gen PPL 29.50 / 588.6 s vs Eso 23.40 / 116.4 s | Eso-LM Tab. 12 | ✅ |
| Training ~27 h (α0 = 1) / ~37 h (α0 < 1) OWT 250K on 8× H200 nodes; 1.37× slower than MDLM | Eso-LM App. C.3, §6 | ✅ |
| Speedup ratios 66×, 3.3–3.8×, AR 1.5× faster | page arithmetic from Tab. 11 | ⚠ inferred |
| Eso-LM scaled to 1.7B by Sahoo et al. (2026) | Eso-LM §5.1 | ⚠ secondary (not on page) |

## 12 — AR 转块扩散：SDAR、Fast-dLLM v2 与 WeDLM (`12-ar-to-block.html`) — 2510.06303, 2509.26328, 2512.22737

Read: SDAR arXiv HTML v3; Fast-dLLM v2 arXiv HTML v1; WeDLM arXiv HTML v1; official READMEs (JetAstra/SDAR, NVlabs/Fast-dLLM, Tencent/WeDLM).

| Claim | Source | Status |
|---|---|---|
| Block diffusion from scratch roughly doubles per-sample compute; MDLM less compute-efficient | SDAR §1, §4 | ✅ |
| Dream conversion used 580B tokens; DiffuLLaMA 65B | SDAR §5.1 (Highly Efficient Adaptation); Fast-dLLM v2 abstract | ✅ |
| SDAR 2B controlled study: same 1T corpus, ctx 4096, 100B anneal, 4B SFT; BD block 16, 16 static steps | SDAR §4.1 | ✅ |
| Tab. 1 numbers (AR 48.7/29.9/61.8/42.1/26.3; MDLM 47.0/12.6/57.9/21.3/26.3; SDAR 50.9/26.8/59.4/40.0/28.2; MDLM-BD 47.5/23.3/64.7/39.0/29.8) | SDAR Tab. 1 | ✅ |
| No logits shift, no attention-mask annealing; suggestion credited to LLaDA author | SDAR §3.1, Fig. 1, §9 | ✅ |
| Qwen3 1.7B/4B/8B/30B-A3B; CPT 50B (ctx 4096 packed) + SFT 4B; identical AR-Chat pipeline | SDAR §5.1.1 | ✅ |
| 20B/30B/40B adaptation budgets slightly worse, less room to scale block | SDAR §5.1.2 | ✅ |
| Static (⌈B/N⌉) and dynamic (≥ τ, at least one) low-confidence remasking | SDAR §3.2 | ✅ |
| Main table uses static decoding, block 4, 4 steps, greedy (⇒ TPF = 1) | SDAR §5.1.1 (TPF = 1 is derived) | ✅ / derived |
| Small models sensitive for B > 4; large models robust; TPF rises with B and model size; τ–TPF non-monotone | SDAR §5.2.2–5.2.3, Fig. 3–6 | ✅ |
| LMDeploy, 1×H200, Math-500, τ = 0.9, batch 4–512; peak TGS 6600/5510/4236/2520/1509 for B = 4/8/16/32/64 | SDAR §5.2.4, Fig. 7 | ✅ |
| TGS formulas with extra forward for KV (B+1, γ+1) | SDAR Eq. 9–15 | ✅ (notation changed) |
| Speedup ≈ B/(n̄+1) in memory-bound regime | derived from SDAR Eq. 9, 13 | ⚠ inferred |
| Effective training speed ≈ half of AR; FlexAttention; fused Triton loss | SDAR §10.1 | ✅ |
| Exact KV identical to AR, PagedAttention, block-aligned allocation | SDAR §10.2 | ✅ |
| SDAR-30B-A3B-Sci pipeline (1T sci AR CPT → 50B → 0.5B SFT); GPQA 66.7 vs 61.2, ChemBench 72.3 vs 60.5, LCB-v5 40.7 vs 51.5 (greedy) | SDAR §6.1, Tab. 4–5 | ✅ |
| Tab. 2 rows for 8B and 30B-A3B (MMLU, GSM8K, Math500, HumanEval, LCB-v6) | SDAR Tab. 2 | ✅ |
| Internal inconsistencies (Tab. 7 +5.9 vs Tab. 5 +5.5; Tab. 6 S row uses 66.7; 2B vs 1.7B; HumanEval 72.8 vs 72.0; Eq. 7 vs Eq. 5) | SDAR Tab. 2/3/5/6/7, §4.1, §5, Eq. 5/7 | ✅ (observed) |
| SDAR is the base of TraceRL/TraDo (SDAR-4B/8B-Chat, block 4) | TraceRL 2509.06949 §4, Tab. 1 | ✅ |
| LLaDA2.0 cites SDAR as AR-initialized block diffusion precedent | LLaDA2.0 2512.15745 related work | ✅ |
| Fast-dLLM v2: Qwen2.5-1.5B/7B-Instruct; LLaMA-Nemotron data; batch 256; lr 2e-5 / 1e-5; 6000 / 2500 steps; 64 A100; 8 h / 12 h; block 32, sub-block 8; threshold 1 in main table | Fast-dLLM v2 §4.1 | ✅ |
| "~1B tokens", "500× less than Dream" | Fast-dLLM v2 abstract | ⚠ author claim; seq len not given |
| Pad to multiple of block; complementary masks; token shift (i−1 predicts i); concat x_t and x_0 (2L) | Fast-dLLM v2 §3.2 | ✅ |
| Ablation 41.3 → 42.2 → 45.0 | Fast-dLLM v2 Tab. 2 | ✅ |
| Block-level cache + sub-block DualCache + confidence threshold | Fast-dLLM v2 §3.3 | ✅ |
| Sub-block table; mismatched block: GSM8K 62.0 vs 58.5 | Fast-dLLM v2 Tab. 3–4, §4.3 | ✅ |
| Sub-block cache: negligible at small batch, helps at batch 32, no accuracy effect | Fast-dLLM v2 §4.3, Fig. 6 | ✅ |
| Threshold 0.9: GSM8K 39.1 → 101.7 tok/s (2.6×) | Fast-dLLM v2 §4.2, Fig. 4 | ✅ (hardware not stated) |
| A100 up to 1.5×, H100 up to 1.8× at batch 64 vs Qwen2.5-7B-Instruct; Fig. 1: 2.54× | Fast-dLLM v2 §4.2, Fig. 1, Fig. 5 | ✅ (AR engine not stated) |
| Tab. 1 7B rows (Nemo-FT 52.4/57.1/84.1/72.0/69.5/59.6; Dream 57.9/68.3/81.0/39.2/62.5/57.6; v2 63.4/63.0/83.7/61.6/61.4/60.3) | Fast-dLLM v2 Tab. 1 | ✅ |
| Fast-dLLM v2 loss has no 1/t; preliminaries do | Fast-dLLM v2 §3.1–3.2 | ✅ |
| Fast-dLLM v2 accepted at ICLR 2026 | Official README | ⚠ secondary |
| WeDLM p_cache definition | WeDLM §3.1, Eq. 4 | ✅ |
| Two principles; directed factorization; "not equivalent" disclaimer | WeDLM §3.2 | ✅ |
| Topological reordering with logical position ids | WeDLM §4.1, Eq. 5–7 | ✅ |
| Dual-stream masking, block B = 32, attention pattern, memory stream dropped at inference | WeDLM §4.2, §6.1 | ✅ |
| CPT 100B; lr 3e-6 → 3e-7 cosine; MagiAttention; auxiliary AR loss | WeDLM §6.1 | ✅ |
| SFT 10B tokens (§1) vs 10K pairs (§6.1); avg 77.36 (§1) vs 77.53 (Tab. 2) | WeDLM §1, §6.1, Tab. 2 | ✅ (inconsistency) |
| Streaming parallel decoding (W, entropy + λd < τ, commit leftmost filled prefix, refill) | WeDLM §5.2, Alg. 1, Eq. 11 | ✅ |
| Streaming vs block 423 vs 221 tok/s at τ = 0.9 (1.9×) | WeDLM §6.4, Fig. 4c | ✅ |
| Quality tables: 1 token per step, W = 6, λ = 0.10, max 512, temp 0.1, each model on recommended engine | WeDLM §6.2 | ✅ |
| Tab. 2 instruct rows (Qwen3-8B, SDAR-8B, WeDLM-8B) | WeDLM Tab. 2 | ✅ |
| Pareto 272–445 tok/s; 92.3% @ 1.97× (τ = 0.2, λ = 0.01); >79% @ 3.2× (τ = 0.9) | WeDLM §6.4, Fig. 5a | ✅ |
| Block size 4/8/32 within 0.8 pts; bidirectional intra-block worse; 0.6B −3.9, 1.5B −0.6, 7B +3.6 | WeDLM §6.5, Fig. 5b–c | ✅ |
| Case study 1673.3 / 745.2 / 197.8 tok/s | WeDLM §6.6, App. A | ✅ |
| Speed experiments: no GPU / batch given in paper | WeDLM §6 (absence) | ✅ (absence checked by search) |
| README: 3–6× on math, up to 10× counting; H20 example 218 tokens 689.18 tok/s; engine built on nano-vllm | Tencent/WeDLM README | ⚠ secondary |
| WeDLM ICML 2026 (Oral) | survey (icml.cc) | ⚠ not re-checked |
| SDAR venue (Findings of ACL 2026?) | ACL Anthology author page, marked unverified | ❓ left blank |

## 13 — 扩散起草、AR 验证：TiDAR、Nemotron-Labs-Diffusion 与 DFlash (`13-hybrid.html`) — 2511.08923, 2607.05722, 2602.06036

Read: TiDAR arXiv HTML v1; Nemotron-Labs-Diffusion arXiv HTML v1; DFlash arXiv HTML v2 (camera-ready); z-lab/dflash README; mlsys.org virtual page for TiDAR.

| Claim | Source | Status |
|---|---|---|
| "Free token slots": Qwen3-32B, H100, batch 1, FlashAttention 2, latency flat until compute-bound | TiDAR §1, Fig. 1 | ✅ |
| Dream-7B GSM8K drops ~10% from 1 to 2 tokens/step (quoting APD) | TiDAR §2.1 | ✅ (secondary within paper) |
| Training: prefix causal + last block bidirectional; NTP on prefix; diffusion section all [M]; α balance, α = 1 default | TiDAR §3.1, §3.3, loss eq. | ✅ |
| Inference: verify last drafts (causal) + pre-draft for all acceptance outcomes in one forward; one-step diffusion drafting | TiDAR §1, §3.2 | ✅ |
| q_len = block_len·(1 + block_len); pre-built mask sliced for FlexAttention; exact KV, evict rejected | TiDAR §3.3 and footnote | ✅ |
| Figure's grid layout (group j sees prefix + d_1..d_j, intra-group bidirectional) | redrawn from TiDAR text (Fig. 2–3 are images) | ⚠ inferred from text + q_len |
| Verification = argmax of β·logits_ar + (1−β)·logits_diff vs draft; trust AR / trust diff | TiDAR §4.4.3 | ✅ |
| Speculative decoding guarantees identical output, TiDAR positioned differently | TiDAR §4.3 | ✅ |
| 1.5B: Qwen2.5-1.5B, 50B tokens, blocks 4/8/16; 8B: Qwen3-8B, 150B, block 16; 2M-token batch; lr 1e-5→3e-6; seq 4096; H100; BF16 | TiDAR §4.1 | ✅ |
| Tab. 2 numbers (Qwen2.5 1.5B, Block Diff 1.5B, TiDAR 1.5B 7.45; Qwen3 8B, Dream 7B, TiDAR 8B trust-diff 8.25) | TiDAR Tab. 2 | ✅ |
| 4.71× / 5.91× tokens/s; single H100, batch 1; native PyTorch; EAGLE-3 third-party Qwen3-8B Instruct weights | TiDAR §4.3, footnote, abstract | ✅ |
| Decoding strategy table (conf > 0.9: 2.63 / 51.40; L2R 53.37; TiDAR 8: 5.49 / 54.74; 16: 6.97 / 53.90; conf > 0.6: 3.81 / 37.60) | TiDAR Tab. 4 | ✅ |
| Full vs random masking 45.45 → 48.42 (4 drafts) | TiDAR Tab. 5 | ✅ |
| Limitations: batch 1 only, no custom kernel | TiDAR §5 | ✅ |
| TiDAR MLSys 2026 Oral | mlsys.org/virtual/2026/oral/3751 | ✅ (conference site) |
| Nemotron joint objective L_AR + α L_diff, α = 0.3; block diffusion 1/t NELBO | Nemotron §2.1, Eq. 1–3 | ✅ |
| Clean stream strictly causal (following SBD) | Nemotron §2.2 | ✅ |
| Ministral3 base; Stage 1 1T AR, Stage 2 300B joint; lr 1e-5→3e-6 WSD; batch 512; seq 4096; 256 H100; SFT 45B, seq 16k | Nemotron §5.1–5.2 | ✅ |
| Ablations: AR loss +7.48, two-stage +5.74, global loss avg +2.12, DP-rank masking +0.71; α peaks at 0.3 | Nemotron Tab. 1–2, §2.3–2.4 | ✅ |
| Trained sampler 4.8M params, 4-layer, d = 384; ~1.3× TPF or +10.6% acc | Nemotron §3.2, App. A, §6.1, Fig. 7 | ✅ |
| Linear SS: draft forward + AR verify forward, greedy match, 1..k+1 tokens | Nemotron §3.3 | ✅ |
| LoRA o_proj rank 128, α = 512, ~36M (0.4%); LK-hybrid + CE on accepted+1; τ = 3; K = 200; η = 0.5 | Nemotron §3.3, Eq. 6–9 | ✅ |
| LoRA TPF gains 14.4% / 32.5% / 27.6% (3B/8B/14B) | Nemotron §6.1 | ✅ |
| Quadratic SS follows TiDAR; AR-diffusion ensemble verifier | Nemotron §3.4, App. C, ref [20] | ✅ |
| SOL: 713 SPEED-Bench samples; 7.60 at B = 32; multilingual 11.26; roleplay 3.49; real TPF 6.02 vs 3.41 (76.5%) | Nemotron §4.2, Tab. 4, Fig. 6 | ✅ |
| Tab. 5 rows (Qwen3-8B 62.75; SDAR-8B 50.57 @ 1.75; AR 63.61; Diff 63.18 @ 2.57; Linear SS 62.81 @ 5.99; Quad SS 64.04 @ 6.38) | Nemotron Tab. 5 | ✅ |
| Tab. 5 SS "TPF" likely per draft-verify cycle | inferred from §4.2 vs Tab. 5 | ⚠ inferred |
| Deployment: SGLang, 4 SPEED-Bench categories, max 1024; GB200 3.3× (3.97×, 1015 tok/s); RTX Pro 6000 277/525 tok/s (3.46×/2.35×); DGX Spark 77.5/112.5; vs Eagle3 2.4×/2.3×/1.8× | Nemotron §6.5, Fig. 8 | ✅ |
| Acceptance length (draft 31): Native 5.46, LoRA 6.82, Eagle3 2.75, MTP 4.24; roleplay 5.54, multilingual 10.06 (LoRA) | Nemotron Tab. 10 | ✅ |
| Abstract "4× vs Qwen3-8B on GB200" vs §6.5 "3.3× over AR" | Nemotron abstract, §6.5 | ✅ (inconsistency) |
| Kernel mismatch explains small SS vs AR accuracy gap | Nemotron §6.1 | ✅ |
| DFlash latency model L = (T_draft + T_verify)/τ; AR drafting γ·t_step vs t_parallel; 5-layer 16 tokens faster than 1-layer EAGLE-3 8 tokens | DFlash §3.1–3.2, Eq. 1–3, Fig. 3 | ✅ |
| 5 target layers from 2nd to third-to-last; RMSNorm(W_c[...]); KV injection every layer; shared frozen embedding + LM head | DFlash §4.1, §5, App. A.3 | ✅ |
| Without target features: ~2–3× | DFlash §4.1, Tab. 10 | ✅ |
| ~800K samples, target-generated responses; 512 anchors/seq; inter-block invisible; w_k = exp(−(k−1)/γ), γ = 7 for block 16; 6 epochs; lr 6e-4 | DFlash §4.2, §5, App. A.1 | ✅ |
| 5 layers (8 for Qwen3-Coder), block 16 (10 for LLaMA-3.1); H200 default | DFlash §5 | ✅ |
| Tab. 1 Qwen3-8B averages (EAGLE-3 16: 1.76×/2.96, 1.68×/2.83; EAGLE-3 60: 2.02×/3.40, 1.88×/3.26; DFlash 4.86×/6.49, 4.03×/5.48) | DFlash Tab. 1 | ✅ |
| SGLang B200 FA4 Spec-v2: Qwen3-8B Math500 230→1175 (5.1×) at c = 1, 5694→16076 (2.8×) at c = 32; HumanEval 4.2×→2.4× | DFlash §5.3, Tab. 3 | ✅ |
| vLLM Qwen3.5-9B Math500 4.0× (c = 1) → 1.9× (c = 32) | DFlash App. A.4, Tab. 12 | ✅ |
| LLaMA-3.1-8B vs EAGLE-3 same data, SGLang Spec-v1: GSM8K 2.4× vs 1.6× (c = 1), 1.6× vs 1.0× (c = 32) | DFlash Tab. 5 | ✅ |
| Train b16 → infer b8 generalizes, not reverse | DFlash §5.5.4, Tab. 8 | ✅ |
| W_c ≈ 42 MB for Qwen3.5-35B-A3B (D = 2048) | DFlash App. A.3 | ✅ |
| TiDAR "not yet lossless" | DFlash §2.3 | ✅ |
| SGLang / vLLM integration available | DFlash §5.3, App. A.4; z-lab/dflash README | ✅ / ⚠ README |
| DFlash ICML 2026 | arXiv comments ("Accepted at ICML 2026. Camera-ready") | ✅ |
| Standard speculative acceptance min(1, p/q) gives target distribution | general (see ai-infra/05) | ✅ background |

## 14 — dLLM 的 KV cache 与并行解码：Fast-dLLM、dKV-Cache 与 D2F (`14-kv-cache.html`) — 2505.22618, 2505.15781, 2508.09192

Read: Fast-dLLM arXiv HTML v3; dKV-Cache arXiv HTML v1; D2F arXiv HTML v1; READMEs (NVlabs/Fast-dLLM, horseee/dKV-Cache, zhijie-group/Discrete-Diffusion-Forcing); NeurIPS / ICLR proceedings pages via search.

| Claim | Source | Status |
|---|---|---|
| Two reasons standard KV cache fails (timestep-variant K/V, non-sequential order) | dKV-Cache §3.2 | ✅ |
| O(L³) vs O(L²) | dKV-Cache §1 | ✅ |
| Open dLLMs slower than AR in practice; degrade with multi-token decoding | Fast-dLLM §1 | ✅ |
| Block-wise approximate cache: prompt KV reused within block, update all after block; fused with decoding step | Fast-dLLM §3.2 | ✅ |
| KV cosine similarity across adjacent steps near 1 (prompt and last block) | Fast-dLLM Fig. 3 | ✅ |
| DualCache caches suffix masked tokens | Fast-dLLM §3.2, Fig. 2b | ✅ |
| Prefix-only: forward on x[s:]; DualCache: x[s:e) | Fast-dLLM Alg. 1 line 7 | ✅ |
| Defaults: PrefixCache, block 32, τ = 0.9; τ explored 0.5–1.0; block 4–32 | Fast-dLLM §4.1 | ✅ |
| A100 80GB; Fig. 1 batch 1, no inference framework | Fast-dLLM §4.1, Fig. 1 caption | ✅ |
| Cache alone typically 2–3.6× | Fast-dLLM §4.2 | ✅ (HumanEval 1.3–1.6× from Tab. 1) |
| Tab. 1 LLaDA rows (GSM8K 256/512, MATH 256, HumanEval 512) | Fast-dLLM Tab. 1 | ✅ |
| 8-shot GSM8K gen 1024: 0.7 → 9.3 (13.3×) → 13.0 (18.6×) → 19.3 (27.6×); accuracies 77.3 / 78.0 / 75.7 / 76.0 | Fast-dLLM Tab. 5 | ✅ |
| LLaDA-V sensitive to block size; full-block + refresh; up to 9.9× | Fast-dLLM §4.2, Tab. 3 | ✅ |
| Curse of parallel decoding, poker-hands example | Fast-dLLM §2.2 | ✅ |
| Threshold rule; at least one token | Fast-dLLM §3.3 | ✅ |
| Theorem 1: (n+1)ε ≤ 1 ⇒ argmax equivalence; tight; TV < (3n−1)ε/2; KL bound | Fast-dLLM Thm. 1 | ✅ |
| τ = 0.9 ⇒ n ≤ 9 in worst case | derived from Thm. 1 | ⚠ derived |
| Remark: coherent joint assumption; worst-case bounds | Fast-dLLM App. A Remark 1 | ✅ |
| Factor rule (n+1)(1 − c^(n)) < f; 78.5 tok/s (11.7×) vs 54.4; 1.4–1.5× throughput, 1–3 pts lower | Fast-dLLM §3.3, App. C.2, Tab. 11 | ✅ |
| Threshold beats fixed top-k at same tokens/step | Fast-dLLM §4.3, Fig. 5 | ✅ |
| Batch 1–32 comparison vs LLaMA (PrefixCache only, prefill 256, gen 16–64); 211 vs 43 tok/s at batch 32 gen 16 | Fast-dLLM App. C.5, Fig. 9 | ✅ |
| Tab. 1 54.4 vs Tab. 12 54.1 tok/s | Fast-dLLM Tab. 1, Tab. 12 | ✅ (inconsistency) |
| Baseline LLaDA step count | not in main text | ❓ |
| Fast-dLLM ICLR 2026 | Official README | ⚠ secondary |
| Approximate cache "not equivalent" | Fast-dLLM v2 §1 | ✅ |
| K/V dynamics observations (LLaDA, L = T = 128, block 64) | dKV-Cache §3.2, Fig. 2 | ✅ |
| Delayed caching; one-step delay; refresh mechanism; Prefill; PD | dKV-Cache §3.3 | ✅ |
| Without one-step delay accuracy collapses at high cache ratio | dKV-Cache §4.3, Fig. 3 | ✅ |
| Greedy: current + previous decoded + window ≤ 6; O(L²); relies on predefined order | dKV-Cache §3.4, §4.2 | ✅ |
| concat_reorder, RoPE-compatible | dKV-Cache §3.3, App. A | ✅ |
| Speed on A6000 (LLaDA) and H20 (Dream) | dKV-Cache §4.1 Metric | ✅ |
| Tab. 1 LLaDA rows (GSM8K, HumanEval) and configs (GSM8K L=T=256 B=32; HumanEval L=T=512) | dKV-Cache Tab. 1, App. C Tab. 5 | ✅ |
| Tab. 2/3 Dream rows (GSM8K 8-shot, GPQA 5-shot Prefill 10.19×) | dKV-Cache Tab. 2–3 | ✅ |
| HumanEval 39.63 → 46.34; GSM8K 80.97 → 83.13 at L = 512 | dKV-Cache §4.3 | ✅ |
| Batch 1 can be slower than baseline (gather/scatter) | dKV-Cache App. D | ✅ |
| Main-table batch size | not stated | ❓ |
| dKV-Cache NeurIPS 2025 | proceedings.nips.cc listing | ✅ |
| D2F: monotone block noise, block-causal student, Eq. 2; DF analogy | D2F §4.1 | ✅ |
| Asymmetric distillation Eq. 3; student init from teacher, differs only in mask | D2F §4.2 | ✅ |
| Pipelined decoding with τ_add / τ_act / τ_conf, semi/full activation | D2F §4.3, Alg. 2 | ✅ |
| LoRA r = 32, α = 32, dropout 0.1 on q/k/v/o; seq 512; block 16; mask ratios 0.3–0.7; lr 1e-5; 12 h on 8 A100-PCIe-40GB; Bespoke-Stratos-17k Qwen2.5-7B responses ≤ 600 tokens | D2F §5.1 | ✅ |
| Defaults τ_conf 0.9, τ_add 0.1, τ_act 0.95; main-table per-task block 32–64, τ_add 0.1–0.9 | D2F §5.1, App. A.3 Tab. 8 | ✅ |
| Cache-only 2.4× vs Cache+Para 7.3× (GSM8K, LLaDA) | D2F App. A.1, Tab. 5 | ✅ |
| Data-control: Dream fine-tuned on same data no faster | D2F App. A.2, Tab. 6 | ✅ |
| Tab. 1 rows (LLaDA GSM8K, MBPP) and Tab. 2 (Dream GSM8K-CoT) | D2F Tab. 1–2 | ✅ |
| AR: D2F-Dream 119.9, LLaMA3-Instruct-8B 48.0, Qwen2.5-Base-7B 52.7 tok/s; max gen 512 | D2F §5.2, Fig. 1 | ✅ |
| AR engine / batch | not stated | ❓ |
| Speed tests on A100-PCIe-40GB | D2F README; §5.1 | ⚠ README + paper setup sentence |
| Different max lengths/blocks per method (GSM8K baseline 256/8 vs D2F 512/64) | D2F App. A.3 Tab. 8 | ✅ |
| D2F ICLR 2026 (ICLR listing adds Kai Yu) | proceedings.iclr.cc via search | ✅ (author list difference noted) |
| Widget dllm-decode, data-focus="threshold" | assets/js/widgets/dllmdecode.js header | ✅ |

## 15 — dParallel、d3LLM 与 CDLM：学会早定稿 (`15-learned-parallel.html`) — 2509.26488, 2601.07568, 2511.19269

Read: dParallel arXiv v1 (HTML, only version), d3LLM arXiv v3 (2026-08-06), CDLM arXiv v2 (2026-02-20); official repos czg1225/dParallel (`LLaDA/llada_train.py`, `LLaDA/configs/config_lora_llada.yaml`, `LLaDA/generate.py`), hao-ai-lab/d3LLM README, SqueezeAILab/CDLM README.

| Claim | Source | Status |
|---|---|---|
| Open dLLMs need ~token-length steps; confidence threshold averages 3–4 tokens/step on LLaDA GSM8K | dParallel §1, §5.2, Tab. 1 (256/72) | ✅ |
| Certainty correlates with accuracy; certainty converges left-to-right | dParallel §4.1, Fig. 2, Fig. 6 | ✅ |
| Teacher = original dLLM, semi-AR, length 256, block 32; filter wrong answers → ~92k samples (LLaDA) | dParallel §4.2, §5.1 | ✅ |
| Semi-AR forward masking (context / active q / future), q = 0.5 | dParallel Eq. 4, §5.1, Tab. 4 | ✅ |
| L_CFD = CE on active masked + β·entropy (T) on correct positions; β = 2, T = 0.5 | dParallel Eq. 5–8, §5.1, App. A | ✅ |
| Dream: semi-AR masking degenerated to AR behaviour → full random masking | dParallel §5.2 | ✅ |
| Ablation 53/73.5, 23/57.8, 44/73.3, 30/76.1 (GSM8K) | dParallel Tab. 3 | ✅ |
| Mask-ratio ablation 50% → 76.3; random 72.4; 100% 71.1 | dParallel Tab. 4 | ✅ |
| LLaDA Tab. 1 rows (steps / latency / acc) incl. Dual-Cache, threshold, consistency distillation | dParallel Tab. 1 | ✅ |
| Dream GSM8K 256/82.9 → 39/82.1 (6.9×); threshold 61/81.9 | dParallel Tab. 2 | ✅ |
| +16.5 points vs threshold at same 9.4× speedup | dParallel §5.2, Fig. 4 | ✅ |
| Latency hardware RTX 6000 Ada; batch size not stated | dParallel §5.1 | ✅ / ❓ batch |
| Hardware inconsistency (8×A5000 10 h vs 2×H100 23 GB); data (92k vs ~10k); length 256 vs 384 padding | dParallel §1, §5.1, App. A, App. D | ✅ (inconsistency) |
| LoRA r=32/α=32 (paper Tab. 5) vs r=128/α=128 (official config) | dParallel Tab. 5; `config_lora_llada.yaml` | ✅ (paper vs code) |
| Complementary mask in appendix and code | dParallel App. A; `llada_train.py` | ✅ |
| Entropy-threshold decoding in official generate | `LLaDA/generate.py` `get_transfer_index_entropy` | ✅ |
| ICLR 2026 | czg1225/dParallel README (Jan 26, 2026) | ⚠ secondary |
| d3LLM pseudo-trajectory: teacher 1 token/step, beyond EOS, order only; noisy construction formula | d3LLM §3.1, App. A.11 | ✅ |
| +18% TPF from pseudo-trajectory; curriculum t 0→0.8, k 16→32 | d3LLM §3.1, Tab. 5–7 | ✅ |
| Reuses dParallel loss (T 0.5; weight 2.0 LLaDA / 1.0 Dream), complementary mask, dParallel dataset (122k/65M, 92k/40M) | d3LLM App. A.11 | ✅ |
| Multi-block states (10% / 95%), KV delay + refresh, EOS early stop; +30% / +5% TPF | d3LLM §3.2 | ✅ |
| AUP definition, α = 3, y_min = y_1 − 5, W(y) | d3LLM §2 | ✅ |
| AUP robustness to W, α, Δy | d3LLM Tab. 8, Tab. 10–13 | ✅ |
| y_1 described differently (§2 vs App. A.6) | d3LLM §2, App. A.6 | ✅ (inconsistency) |
| "AUP ≈ 9 × y if accuracy flat" | derived from AUP formula | ⚠ inferred |
| Tab. 1 GSM8K-CoT LLaDA rows (TPF / acc / AUP); Tab. 3 H100 / A100 TPS; Qwen AUP 74.1 | d3LLM Tab. 1, Tab. 3, Tab. 10 | ✅ |
| HF Transformers backend, single GPU, batch 1 for main results | d3LLM §4.1, App. A.8 | ✅ |
| SGLang: Qwen 108.6 / d3LLM-LLaDA 545.3 TPS (H100, bs 1); B200 1241.0 vs 274.7; bs-4 rows vs bs-1 AR | d3LLM Tab. 15 | ✅ |
| Fast-dLLM-v2 AUP 156.0 (text) vs 176.1 (Tab. 2); LLaDA throughput table cited as "Tab. 4" | d3LLM §4.2, Tab. 2–4 | ✅ (inconsistency) |
| EAGLE-3 TPF 5.12 GSM8K; higher AUP on MATH / MBPP / HumanEval; FLOPs not constrained | d3LLM Tab. 14, App. A.7 | ✅ |
| Dream MATH 38.2 vs Fast-dLLM-v2 48.7 | d3LLM Tab. 2 | ✅ |
| ICML 2026 | arXiv comment; d3LLM README | ✅ |
| CDLM trajectory collection (B=32, L_g=256, N=L_g, temps {0, 0.5}), hidden-state buffer, ~30× smaller, 25–30 GiB / 15k | CDLM §4.1, Alg. 1, App. A.1 | ✅ |
| Three losses, U_y / S_y definitions, stop-gradient, weights (1, 0.5, 0.01 / 0.1) | CDLM §4.2, Eq. 4–7, App. A.2 | ✅ |
| DLM loss ground truth = Qwen2.5-7B responses | CDLM App. A.1, App. C | ✅ |
| Consistency-only collapses (6.9 / 0.0) | CDLM Tab. 3 | ✅ |
| Block-causal student, exact KV cache, τ = 0.9, EOS early stop, no inter-block parallelism | CDLM §4.3, §5.1 | ✅ |
| HumanEval-Instruct shorter outputs (96.9 vs ~200) | CDLM §5.2.1, Tab. 1 | ✅ |
| Arithmetic intensity 1.0 / 438.9 / 4.0 / 15.8 / 31.1; ridge 153 FLOP/B on A100 | CDLM §5.4, App. B.4 | ✅ |
| Tab. 1 / Tab. 2 rows (TPS, latency, steps, length, score); 4×A100 DP, batch 1 per GPU | CDLM Tab. 1–2, §5.1, App. A.3 | ✅ |
| AR comparison 1.2× / 1.1× / 1.3× / 4.2×; accuracies 78.8 vs 73.8 etc. | CDLM §5.2.3, Fig. 3 | ✅ |
| AR baseline inference engine | not stated in CDLM | ❓ |
| Training 4×A100, ~8 h Dream / ~16 h LLaDA; LoRA 32 / 64; lr; 16 epochs best 12 | CDLM §5.1, Tab. 5–6 | ✅ |
| MLSys 2026 | arXiv comment; proceedings header in HTML | ✅ |
| LLaDA vocabulary 126,464 (used for logits shape) | LLaDA 1.5 App. D.2 Tab. 3 | ✅ |
| dParallel "≈8.5 token/step" vs d3LLM's measured TPF 5.14 for dParallel-LLaDA | dParallel Tab. 1; d3LLM Tab. 1 | ✅ (protocol difference) |

## 16 — 任意顺序的利与弊：Token Ordering、ParallelBench 与 Flexibility Trap (`16-order-limits.html`) — 2502.06768, 2510.04767, 2601.15165

Read: Token Ordering arXiv v3 (2025-08-19), ParallelBench arXiv v2 (2026-06-23), Flexibility Trap arXiv v4 (2026-06-08; titles of v1/v3 checked on abs pages). Widget behaviour described from `assets/js/widgets/dllmdecode.js` header only.

| Claim | Source | Status |
|---|---|---|
| MDM loss = weighted sum over masks = average π-learner loss over uniform permutations; ≥ −log-likelihood bound | Token Ordering Prop. 2.1, §2.1, App. E | ✅ |
| Θ(L·2^L) vs L subproblems | Token Ordering §3.2 | ✅ |
| L&O distributions; hardness of sparse predicate (1RSB conjecture), sparse parity (SLPN), random slab | Token Ordering Def. 3.1, Prop. 3.3, App. B.1–B.2 | ✅ |
| π-learner scaling on SlimPajama, L = 2048, learnable pos-emb, L/10 and √L swaps; closer → nearer ARM | Token Ordering §3.2, Fig. 2, App. C.1 | ✅ |
| Error imbalance latent vs observation positions (L&O-NAE-SAT) | Token Ordering §3.3, Fig. 2 | ✅ |
| Top probability / top probability margin oracles | Token Ordering §4.1 | ✅ |
| Sudoku 6.88 / 18.51 / 89.49 vs ARM 9.73 / 87.18; Zebra 76.9 / 98.5 / 98.3 vs 80.31 / 91.17; hard Sudoku 3.62 / 9.44 / 49.88 vs 32.57 | Token Ordering Tab. 2, 3, 5 | ✅ |
| Puzzle models 6M / 19M (MDM), 42M (ARM), lr 1e-3, batch 128, 300 epochs, 50 steps, Gumbel 0.5 | Token Ordering App. D.2 | ✅ |
| LLaDA 8B Tab. 4 (HumanEval infill multi 16.5→25.4, split 14.2→22.3, Math 28.5→34.3, MMLU top-prob 36.5) | Token Ordering Tab. 4 | ✅ |
| LLaDA 8B base vs instruct | not stated | ❓ |
| Fig. 3 "170M MDM + LLaMA-7B" vs App. D.1.2 "1.1B MDM + LLama2-7B"; checkpoint source not named; π-learner code from SMDM | Token Ordering Fig. 3, App. C.1, C.2.2, D.1.2 | ✅ (inconsistency) / ❓ checkpoint |
| Ye et al. 100% Sudoku dataset easier (footnote) | Token Ordering §4.2 fn. 2 | ✅ |
| ICML 2025 Outstanding Paper | AIhub ICML 2025 award list (web search) | ⚠ secondary |
| Factorised parallel step P(S_k) = Π P(y_i) ; "New York / Mexico City" example | ParallelBench §3, Fig. 1 | ✅ |
| Theorem 1 KL ≥ Σ E[C(S_k | X, S_<k)]; Theorem 2 monotone; boundary cases | ParallelBench Thm. 1–2, Remarks 1–2 | ✅ |
| C for Copy / Replace Index = 0; Replace Random (n−1)[log n − log(n−1)] → 1.44; Shuffle n log n − log n! → ∞; L_{n/2} = log(n!!/(n−1)!!) | ParallelBench §4.1, Eq. 3–4 | ✅ |
| Top-k Shuffle accuracy n!/n^n, (n−1)!!/n!!; threshold Shuffle → 1, Replace Random 0 unless τ ≥ (n−1)/n | ParallelBench §4.2, Eq. 5, Tab. 1 | ✅ |
| Fine-tuned LLaDA 1.5: Replace Index recovers, Replace Random / Shuffle still degrade | ParallelBench §7, Fig. 8, App. E.2 | ✅ |
| 17 tasks / 3 categories; grammar score; Sudoku C = 0 vs Latin square C > 0 | ParallelBench §5, Tab. 2 | ✅ |
| Semi-AR block size: opposite effects on Text Writing vs Waiting Line | ParallelBench §6 | ✅ |
| Oracle per-sample threshold; CoT 8× tokens; ReMDM / RCR no improvement | ParallelBench §6–7, App. F.2, E.4 | ✅ |
| Tab. 7 (n = 15, 128 tokens, k = 2, no semi-AR) values for LLaDA 1.5, Dream, Mercury, Qwen2.5 7B, Llama 3.1 8B, Haiku 3.5 (column alignment checked in HTML) | ParallelBench App. H.1, Tab. 7 | ✅ |
| Unmasking rule used in Tab. 7 | not stated | ❓ |
| Mercury Shuffle drops sharply with n (Fig. 4) | ParallelBench §6, Fig. 4 | ⚠ figure only |
| Decoding settings: greedy (infilling temp 1.0), max tokens 32 / 64, τ ∈ {0.5,…,1.0} | ParallelBench §6, App. C | ✅ |
| ICLR 2026 | arXiv comment; README | ✅ |
| Pass@k setup: 256 tokens, 256 steps, block 32, temperature 0.6; LLaDA-Instruct, Dream-Instruct, LLaDA 1.5 | Flexibility Trap §3, Fig. 3 | ✅ |
| HumanEval Pass@1024: 21.3% AR-only vs 0.6% AO-only | Flexibility Trap §3.1, Fig. 4 | ✅ |
| Pass@k decreases monotonically with block size | Flexibility Trap §3.1, Fig. 5 | ✅ |
| Bypassed connectives; entropy degradation | Flexibility Trap §3.2, Fig. 6–7, App. C | ✅ |
| Pass@128 / Pass@1 table (confidence / random / AR) | Flexibility Trap App. D, Tab. 4 | ✅ |
| JustGRPO-Random 82.2% GSM8K | Flexibility Trap App. D, Tab. 5 | ✅ |
| π^AR definition, exact likelihood, standard GRPO | Flexibility Trap §4.2, Eq. 5–8 | ✅ |
| Flexibility tax: ambiguous token ratio, O(N!) trajectories, sampler–learner mismatch | Flexibility Trap §4.1 | ✅ |
| Training: LLaDA 8B Instruct full FT, lr 5e-6, batch 64, G 16, 125 steps, temp 1.0, KL 0, 16×H100 | Flexibility Trap App. A.2 table | ✅ |
| Rewards (math binary; code format 0 / 0.5 / 1 + pass rate) | Flexibility Trap App. A.3 | ✅ |
| Eval: low-confidence remasking, block 32, 1 token/step, temp 0, lengths 128/256/512 | Flexibility Trap §5 | ✅ |
| JustGRPO 89.1 / 45.1 / 49.4 / 52.4; d1 81.1 / 38.6; SPG 86.1 / 40.0; ESPO 82.3 / 39.0 / 42.1 / 44.6; LLaDOU 59.1 HE; LLaDA-1.5 51.9 HE @512 | Flexibility Trap system-level table (HTML "Table 1", text "Table 3") | ✅ |
| Unified-protocol reproduction d1* 83.8 / 39.2, ESPO* 84.7 / 40.3, SPG* 86.9 / 41.8 | Flexibility Trap reproduction table | ✅ |
| EB-sampler: MBPP gap +10.6 → +25.5 | Flexibility Trap §5.2, Fig. 8 | ✅ |
| Per-position forward cost; JustGRPO-Fast top-25% entropy positions; wall time vs ESPO | Flexibility Trap §5.3, Fig. 9 | ✅ |
| "~256 vs ~64 forwards for 256 tokens" | derived from §5.3 | ⚠ inferred |
| Title v1–v3 vs v4; ICML 2026 Oral | arXiv abs v1/v3/v4 metadata; icml.cc oral page (web search) | ✅ / ⚠ secondary (oral) |
| Pass@k as proxy for RL ceiling (Yue et al. 2025) | Flexibility Trap §2.3 | ✅ (assumption stated as such) |

## 17 — dLLM 的强化学习：d1、LLaDA 1.5 与 TraceRL (`17-rl.html`) — 2504.12216, 2505.19223, 2509.06949

Read: d1 arXiv v2 (2025-06-03) + official repo dllm-reasoning/d1 (`diffu-grpo/slurm_scripts/train.yaml`, `diffu-grpo/run.sh`, `diffu-grpo/diffu_grpo_trainer.py`); LLaDA 1.5 arXiv v2 (2025-10-12); TraceRL arXiv v1 (only version) + Gen-Verse/dLLM-RL README. Timeline pointers (wd1, SPG, ESPO) from arXiv abstracts only.

| Claim | Source | Status |
|---|---|---|
| Sequence likelihood sums over O(N!) trajectories; token ratio ill-defined; sampler–learner mismatch | Flexibility Trap §4.1 | ✅ |
| LLaDA MC likelihood uses 128 samples, too costly for online RL | d1 §3.1 | ✅ |
| ELBO ≤ log π; doubly MC estimator; variance Θ(1/n) | LLaDA 1.5 Eq. 4–6, Prop. 1 | ✅ |
| Mean-field sequence log-prob; one-step per-token estimate with prompt masking | d1 §3.1, Fig. 2 | ✅ |
| Unnormalised advantage r − mean (no std) | d1 §2.2, Eq. 2; official trainer | ✅ |
| μ up to 12 / 24 with random masking; fewer generations, wall-clock gain | d1 §3.2, §4.4, Fig. 5 | ✅ |
| p_mask 0.15; 0.1 / 0.3 stable, 0.5 / 0.7 unstable, 0.0 slightly worse | d1 App. D.1, Fig. 6 | ✅ |
| LoRA r 128 / α 64, 4-bit, Flash-Attn 2, lr 3e-6, 8×A100-80G; code tasks 4×A5000 | d1 App. D.1 | ✅ |
| Inference: N/2 steps, 2 tokens/step, block 32 | d1 App. D | ✅ |
| SFT on s1K (1000 traces), seq 4096, PAD loss, pad to max length | d1 §3.3, App. D.2 | ✅ |
| Official config: num_generations 6, num_iterations 12, beta 0.04, epsilon 0.5, diffusion_steps 128, block 32; sync_ref_model every 64 is set but has no effect with LoRA (reference = adapter disabled, i.e. the starting model) | `train.yaml`, `run.sh`, `diffu_grpo_trainer.py` | ✅ (paper vs code; corrected 2026-10-19) |
| k3 KL estimator exp(Δ) − Δ − 1 | `diffu_grpo_trainer.py` lines ~100–106 | ✅ |
| RL checkpoints: eval every 100 steps from step 600, report best | d1 §4.1 | ✅ |
| Tab. 1 values at 256 / 512 (GSM8K, MATH500, Countdown, Sudoku) | d1 Tab. 1 | ✅ |
| Coding: HumanEval 35.3 → 39.0, MBPP 41.2 → 45.5 (256) | d1 Tab. 3 | ✅ |
| No CoT length growth; rollout limited to 256 | d1 §4.3 | ✅ |
| NeurIPS 2025 | NeurIPS 2025 proceedings / virtual page (web search) | ⚠ secondary |
| DPO-E with four ELBOs; score estimator unbiased; log σ nonlinearity → bias | LLaDA 1.5 Eq. 7–8, §3.1 | ✅ |
| Theorem 1: bias ≤ √V, variance ≤ 4 E[V]; gradient analogue | LLaDA 1.5 Thm. 1, App. B.4 | ✅ |
| Budget / optimal allocation (n_t = n) / antithetic sampling; Prop. 1–2; variance decomposition Eq. 9 | LLaDA 1.5 §3.2, Prop. 1–2, Eq. 9 | ✅ |
| n = 8 default, ~8× compute, < 0.5% of pretraining; ~405 H100 GPU hours | LLaDA 1.5 §4, App. D.3 | ✅ |
| Extension to PPO / GRPO (discussed, no experiment) | LLaDA 1.5 §3.3 | ✅ |
| Ablation variances 2.2 / 44.0 / 1.0 / 7.3 / 4.7 / 2183.7 and GSM8K 82.8 / 80.1 / 83.3 / 81.4 / 82.3 / 82.0 | LLaDA 1.5 Tab. 2 (column order checked) | ✅ |
| 350K private preference pairs; topic mix; 1 epoch; batch 64; lr 5e-7; DPO β 0.2; 0.05 SFT loss; packing to 4096 | LLaDA 1.5 §4, App. D.1, D.3 | ✅ |
| Tab. 1 benchmark values (SFT / naive DPO / VRPO) | LLaDA 1.5 Tab. 1 | ✅ |
| Per-model per-task tuned answer / block length; EOS confidence zeroed (HumanEval 47.6 → 49.4); sampler ablation (low-confidence 49.4 vs 47.0) | LLaDA 1.5 App. D.4, Tab. 4, Tab. 6 | ✅ |
| Seed reruns GSM8K 82.9 ± 0.6, HumanEval 52.0 ± 0.7 | LLaDA 1.5 Tab. 5 | ✅ |
| ACL 2026 (2026.acl-long.524) | ACL Anthology (web search) | ⚠ secondary |
| Trace-SFT experiment: Dream 54.4 / 52.6 / 45.1; SDAR-4B 71.3 / 70.0 (equal forward compute) | TraceRL §3, Tab. 1 | ✅ |
| Objective with shrinkage s; sliced training for block attention | TraceRL §4.1, §4.3, Eq. 3 | ✅ |
| Diffusion value model: final-step reward, step-wise GAE, clipped value loss; less fluctuation | TraceRL §4.2, §5.7, Eq. 4, Fig. 6 | ✅ |
| Data MATH L3–5 8K; PrimeIntellect 6K; rollout 128 × 32 (block, τ 0.9) / 56 × 8 (full, static); lr 1e-6, ε 0.2, β 0.01; value lr 5e-6, γ = λ = 1 | TraceRL §5.1, App. B.5 | ✅ |
| KV cache: JetEngine (block) / improved Fast-dLLM (full) | TraceRL App. B.3 | ✅ |
| Tab. 2 values (MATH500, AIME2024, GSM8K, LCB-v2) | TraceRL Tab. 2 | ✅ |
| Acceleration 2.28 → 2.63 (+15.4%); block 4 → 8 (60.2 → 67.7 at block 8) | TraceRL §5.8–5.9, Tab. 3–4 | ✅ |
| Full-attention code RL 25.0% LCB-V2; avg length 380, s = 8 → ~47.5 forwards | TraceRL §5.6, App. B.5 | ✅ |
| Inconsistencies 85.8 vs 87.4; caption model name; 4.2 vs 4.4 | TraceRL §5.3–5.4, Tab. 2 | ✅ (inconsistency) |
| RL hardware | not stated (64×A100 only for trace-SFT experiment) | ❓ |
| ICLR 2026 | Gen-Verse/dLLM-RL README | ⚠ secondary |
| "32 forward sequences per VRPO pair" | derived (2 responses × n 8 × 2 models) | ⚠ inferred |
| wd1: ratio-free weighted likelihood, ICLR 2026 | wd1 abstract, arXiv comment | ✅ (abstract only) |
| SPG: upper + lower bound sandwich, ICLR 2026 | SPG abstract, arXiv comment | ✅ (abstract only) |
| ESPO: sequence-level ELBO, per-token normalised ratio, robust KL | ESPO abstract | ✅ (abstract only) |
| Q34 claim "negative correlation would increase variance" | derived from Eq. 9 | ⚠ inferred (stated as such on page) |

## 18 — 代码扩散模型（`18-code.html`）— 2506.20639, 2509.01142, 2601.15892

读取版本：DiffuCoder arXiv HTML v2；Dream-Coder arXiv HTML v1；Stable-DiffCoder arXiv HTML v1（v2 的 HTML 为 404）；Seed-Coder 2506.03524 HTML（仅用于对照）。官方代码：apple/ml-diffucoder（`src/open_r1/coupled_grpo.py`、`recipes/config_coupled_code.yaml`、README）、DreamLM/Dream-Coder（README、`base/README.md`、`base/eval_code_base.sh`、`instruct/code_eval/README.md`）、ByteDance-Seed/Stable-DiffCoder（README）。

| Claim | Source | Status |
|---|---|---|
| DiffuCoder 7B，130B 有效代码 token（Stage 1 65B + Stage 2 65B） | DiffuCoder 摘要、§3、§B.1 | ✅ |
| Stage 1 在 700B（§3）/ 720B（Tab. 4）时性能下降，在 65B 早停 | DiffuCoder §3、Tab. 4 | ✅（论文内部数字不一致） |
| Stage 1：10 节点 × 8 H100、10 万步约 40 小时、每 GPU batch 2、上下文 4096、lr 2e-5、warmup 2 万步、注意力掩码退火 1 万步 | DiffuCoder §B.1 | ✅ |
| 2×4096×80×10⁵ ≈ 65.5B 与 65B 吻合 | 本页推算 | ⚠ 推算 |
| Stage 1 数据：约 400B；代码 78% / 文本 20% / 数学 2% | DiffuCoder Tab. 3 | ✅ |
| 中期训练 16B × 4 epoch，lr 1e-5，8×8 A100，90 小时 | DiffuCoder §B.1 | ✅ |
| SFT 43.6 万条，5 epoch，固定 2048，lr 1e-5 | DiffuCoder §3、§B.1、Tab. 4 | ✅ |
| GRPO：21K 难题（通过率后 20%、方差前 40%），G=10，μ=2，β=0.01，ε=0.5，lr 1e-6，补全 256，步数 256，温度 1.2，t∈[0.2,0.8]，8×H100 约 40 小时 | DiffuCoder §B.1 | ✅ |
| 官方配置 generation_temperature 1.0，scale_rewards false，ref_model_sync_steps 64，奖励权重 2.0/0.5 | recipes/config_coupled_code.yaml | ✅（与正文温度不一致） |
| 每次更新 3 份输入（全掩码 + 互补对），logp = (lp0 + w·lp_part)/2，w = 1/t 或 1/(1−t)，同一掩码种子 | coupled_grpo.py `forward_process`、`selective_log_softmax`、`mask_seeds` | ✅ |
| 比相对 d1 多 2 次前向；端到端 GRPO 耗时为 AR 的 2 倍 | DiffuCoder §A.3、§C.4 | ✅ |
| 对偶变量方差下降 v_k²/(2N) | DiffuCoder §A.4 Eq. 20–28 | ✅ |
| AR 性定义（Local@k、Global@k）；默认温度 0.2 → 1.2 时 AR 性下降；代码的全局 AR 性低于数学；熵汇 L 形 | DiffuCoder §4.1–4.3、§A.2、Fig. 3–5 | ✅（只有图，没有数值） |
| AR 性玩具例子（1,2,5,3,4,6 → Global@1 = 5/6，Local@1 = 2/5） | 本页自构 | ⚠ 示例 |
| 温度通过两条路径改变顺序 | 本页推论 | ⚠ |
| 步数减半时 RL 后掉分更小；最优评测温度变为 0.3–0.4 | DiffuCoder §5、Fig. 1(c)、App. C.3 | ✅（图） |
| Tab. 1 全部数字（Qwen2.5-Coder、Dream、DiffuCoder 各行） | DiffuCoder Tab. 1 | ✅ |
| Tab. 2 消融数字（含 AR GRPO、LOO、全掩码、decoupled） | DiffuCoder Tab. 2 | ✅ |
| EvalPlus +4.4 = 67.9 − 63.55 | DiffuCoder 摘要、Tab. 1 | ✅ |
| Dream-Coder：Qwen2.5-Coder-7B 初始化、shift、CART、322B | Dream-Coder §2.2、§3 | ✅ |
| 数据配比 2:7:1 | Dream-Coder base/README.md | ✅（官方 README） |
| SFT 500 万条（Ling-Coder-SFT），随机截断，[PAD] 惩罚 | Dream-Coder §4.1 | ✅ |
| RL：17k 题，≥5 个单测，用 Qwen2.5-Coder-7B-Instruct 8 次采样筛难度，不加 KL/熵，clip-higher 0.2/0.28，互补掩码 + 样本替换，Fast-dLLM | Dream-Coder §4.2 | ✅ |
| 三种生成模式（定性）；Fig. 3(b)/(c) 引用错位 | Dream-Coder §5.4、Fig. 3 | ✅ |
| 评测脚本步数 = 长度，温度 0.1，BCB --split instruct | Dream-Coder instruct/code_eval/README.md | ✅ |
| Dream-Coder Tab. 4–5 数字 | Dream-Coder Tab. 4–5 | ✅ |
| Dream-Coder 表中 DiffuCoder 的 BCB 37.5/10.8 = DiffuCoder Tab. 2 的 BCB-I | 两表交叉核对 | ⚠ 推断（列口径） |
| Stable-DiffCoder 机构：HUST + ByteDance Seed | Stable-DiffCoder HTML v1 Contributions 节 | ✅ |
| 从 Seed-Coder 退火前检查点出发，CPT 1.3T（子采样），B=4，上下文 8192，不做 logit shift，打包样本互相可见，SFT 复用 Seed-Coder 数据并追加 1–4 个 eos | Stable-DiffCoder §1、§4.1 | ✅ |
| warmup：掩码率上限从 u_init（如 1e-3）线性升到 1，期间去掉 w(t)；掩码率 10% 时 w≈10 | Stable-DiffCoder §3.2 | ✅ |
| 块级截断：P[m=0] = 1/(B+1)，B=4 时为 1/5；截断到 ≥1/B；兜底强制掩 1 个 | Stable-DiffCoder §3.3 Eq. 11 | ✅ |
| 2.5B 课程排序 (1) > (2) > (3) | Stable-DiffCoder §3.1.2、Fig. 2 | ✅（只有图） |
| Seed-Coder：6T，1T + 4T 常规预训练，CPT 400B + 600B，上下文 8K→32K，8.2B Llama-3 结构 | Seed-Coder §2.3 | ✅ |
| Seed-Coder-Instruct：约 300 万条 SFT（3 epoch）+ 约 2 万对 DPO | Seed-Coder §3.1.4–3.1.5 | ✅ |
| Seed-Coder base 用普通 base 提示；Qwen2.5-Coder 用 chat 模板（72.0/67.1） | Seed-Coder §5.1.1、Tab. 1 | ✅ |
| Stable-DiffCoder base 用 EvalPlus chat 模板 | Stable-DiffCoder §4.3.1 | ✅ |
| Stable-DiffCoder 中的 Seed-Coder 数字与 Seed-Coder 报告逐项相同 | 两表逐项比对 | ✅ |
| Stable vs Seed-Coder 的全部对比数字（base Tab. 1–3，instruct Tab. 4–9） | Stable-DiffCoder Tab. 1–9 | ✅ |
| MBPP+ 67.7 < 69.0 与正文“全部胜出”矛盾；Tab. 4 标题错误 | Stable-DiffCoder §4.3.1、Tab. 1、Tab. 4 | ✅ |
| README 推理示例 steps 512 / gen 512 / block 4 / threshold None | Stable-DiffCoder README.md | ✅ |
| 评测解码设置；8192 序列内各块是否同时训练；generate 是否缓存 | — | ❓ 未核实 |
| DiffuCoder ICLR 2026 | iclr.cc/virtual/2026/poster/10011497 | ⚠ 会议网站（二手） |

## 19 — 多模态扩散语言模型（`19-multimodal.html`）— 2505.15809, 2505.16933, 2505.16839

读取版本：MMaDA arXiv HTML v2；LLaDA-V arXiv HTML v2；LaViDa arXiv HTML v4。官方代码：Gen-Verse/MMaDA（README、`configs/mmada_demo.yaml`）、ML-GSAI/LLaDA-V（README、`eval/scripts/evaluate.sh`、`train/generate_demo.py`）、jacklishufan/LaViDa（README、`llava/model/language_model/llava_llada.py`、`llada/modeling_llada.py`）。时间线条目只核对了 arXiv 摘要页。

| Claim | Source | Status |
|---|---|---|
| MMaDA 以 LLaDA-8B-Instruct 与 Show-o 的 MAGVIT-v2 初始化；f=16，码本 8192，512² → 1024 码 | MMaDA §2.1、§4.1 | ✅ |
| 联合词表 134,656 = 126,464 + 8192；w_clip_vit False | configs/mmada_demo.yaml | ✅ |
| 统一掩码 CE（Eq. 1）；Mixed-SFT（Eq. 2）；统一 CoT 格式；GPT-4.1 合成知识类 T2I CoT | MMaDA §2.1–2.2、§4.1 | ✅ |
| Stage 1 20 万 + 40 万步，Stage 2 5 万步，Stage 3 5 万步；64×A100-80GB；batch 1280；lr 5e-5 余弦 | MMaDA §4.1 | ✅ |
| 文本采样 1024 / 512 步 / 块 64 / 每步 2 个 token；不分块时回答短、EOS 多；图像 50 步、余弦调度、CFG 3.5 | MMaDA §3 | ✅ |
| CFG 时约 10 码 / 前向 | 本页推算 | ⚠ 推算 |
| UniGRPO：问题不掩，p~U[0,1]，只对被掩位置求平均，μ 次内循环等距铺开，T=1000；奖励 2.0 / 0.5 / 0.1×CLIP / 0.1×ImageReward | MMaDA §2.3、§5.2、Alg. 1、Eq. 3–5 | ✅ |
| §5.2 示例与 Alg. 1 公式不一致（325/550/775/1000） | MMaDA §5.2、Alg. 1 L14；本页计算 | ✅ |
| Tab. 2 / 3 / 4 / 5 / 6 中引用的数字 | MMaDA Tab. 2–6 | ✅ |
| 摘要“超过 Qwen2-7B”与 Tab. 4 矛盾；CLIP 32.46 vs 32.0；MMLU 66.9 vs 68.4；§5.3 步数；§3 “最低置信度”措辞 | MMaDA 摘要、§3、§5.3、Tab. 3–4、Tab. 6 | ✅（论文内部） |
| MMaDA-8B-Max（UniGRPO 后）未发布；UniGRPO 并入 dLLM-RL | MMaDA README | ✅ |
| CLIP / ImageReward 的提升归因于对齐的奖励 | MMaDA §4.3 | ✅ |
| MMaDA NeurIPS 2025 | arXiv comments | ✅ |
| LLaDA-V：SigLIP2-so400m-patch14-384，729 token / 图，两层 MLP，LLaDA-8B-Instruct | LLaDA-V §3.1、§4.1、§B.1 | ✅ |
| 三阶段数据与超参（55.8 万 / 1000 万 / 200 万 / 90 万 / 300 万；batch；lr；长度） | LLaDA-V Tab. 1、§3.3 | ✅ |
| LLaMA3-V 与 LLaDA-V 流水线相同，只换语言塔 | LLaDA-V §4.1、§4.3 | ✅ |
| 18 项中 11 项胜出；Tab. 2/3 中引用的数字 | LLaDA-V §1、Tab. 2–3 | ✅ |
| 100 万样本在 MMMU-Pro 上胜过 LLaMA3-V 的 900 万样本 | LLaDA-V §4.2 | ✅（正文；图） |
| no mask 与 dialogue causal 对比为 7/12 | LLaDA-V Tab. 4 | ✅ |
| 评测脚本 gen_length=2（12 项）、ChartQA 16/16、DocVQA 32/16、MathVista 96/48 | LLaDA-V eval/scripts/evaluate.sh | ✅ |
| Fast-dLLM 接入后 60 s → 6 s | LLaDA-V README | ⚠ 官方 README，硬件未注明 |
| LLaDA-V CVPR 2026 | cvpr.thecvf.com/virtual/2026/poster/39049 | ✅（会议网站） |
| LaViDa：768² → 4+1 视图，SigLIP-400M，5×27²=3645 → 2×2 池化为 980 | LaViDa §3.1 | ✅ |
| 互补掩码；ScienceQA 48.74 → 81.49；每 1000 步 8.2 → 8.9 小时（20 万子集） | LaViDa §3.2、Tab. 4(a) | ✅ |
| 前缀 DLM 只在推理时使用；FT 版本慢 ≥62%，精度相当 | LaViDa §3.3、App. B.4、Tab. 9–10 | ✅ |
| COCO：500 张，L=32，单卡 A5000；Tab. 3(a) 的 CIDEr 与延迟；3.9× | LaViDa §4.5、App. B.1、Tab. 3(a) | ✅ |
| 调度对比 Tab. 3(b)；α=1/3；每步至少揭开 1 个 | LaViDa §3.3、App. A.2、Tab. 3(b) | ✅ |
| 受约束写诗 100% vs 41/37%、45/16%（100 个样本） | LaViDa §4.4、Tab. 2(b) | ✅ |
| “约束满足由画布结构保证” | 本页推论 | ⚠ |
| Tab. 1 中引用的数字 | LaViDa Tab. 1 | ✅ |
| 上下文 4096 / 2048 迫使池化 | LaViDa App. D | ✅ |
| 摘要中的 +4.1 CIDEr / 1.92× 无法从 Tab. 3(a) 对上 | LaViDa 摘要 vs Tab. 3(a) | ✅（不一致） |
| batch 512 vs 128；lr 5e-3；24×24×5 笔误；时间下标 | LaViDa App. B.1、App. D、§3.3、App. A.2 | ✅（论文内部） |
| 官方代码：CE 不加权、p_mask 公式、至少掩 1 个、两份副本拼接 | LaViDa llava_llada.py、modeling_llada.py | ✅ |
| LaViDa NeurIPS 2025 Spotlight | LaViDa README | ✅ |
| AR 基线是否使用 KV cache 及推理引擎；Tab. 3(a) 的 batch 大小 | — | ❓ 未核实 |
| Dream-VL & VLA：LIBERO 97.2%（摘要），2025-12 | arXiv 2512.22615 摘要 | ✅（摘要） |
| Lumina-DiMOO：完全离散扩散统一模型，2025-10 | arXiv 2510.06308 摘要 | ✅（摘要） |
| MMaDA-Parallel（2025-11）、Lavida-O（2025-09） | arXiv 2511.09611、2509.19244 摘要 | ✅（摘要） |
