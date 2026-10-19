# Sources — JEPA track

Where every number and claim on this track's pages comes from. "Paper" = the arXiv HTML/PDF
version listed; "Code" = the official repository at the default branch (checked 2026-10).
When paper and code disagree, the page says so in a "论文 vs 官方代码" callout.

Legend: ✅ verified against the source · ⚠ secondary source or inferred · ❓ not verified

## 00 — Foundations (`00-foundations.html`)

| Claim | Source | Status |
|---|---|---|
| Three SSL families (JEA / generative / JEPA), energy-based view, H-JEPA | LeCun, *A Path Towards Autonomous Machine Intelligence*, 2022 (OpenReview) | ✅ (concept, no numbers) |
| Collapse remedies taxonomy | BYOL / SimSiam / VICReg / LeJEPA papers | ✅ |
| I-JEPA pixel vs representation 40.7 / 66.9; V-JEPA 68.6 / 73.7 | see rows under 01 and 02 | ✅ |

## 01 — I-JEPA (`01-i-jepa.html`) — arXiv:2301.08243, github.com/facebookresearch/ijepa

| Claim | Source | Status |
|---|---|---|
| M = 4 target blocks, scale (0.15, 0.2), aspect (0.75, 1.5); context scale (0.85, 1.0), aspect 1; overlap removed | Paper §3 | ✅ |
| Targets taken from target-encoder **output**, "crucial … high semantic level" | Paper §3 | ✅ |
| Predictor width 384; depth 12 for ViT-L/16, ViT-H/16, ViT-H/14 | Paper App. A | ✅ |
| Mask token = shared learnable vector + positional embedding; predictor applied M times | Paper §3 | ✅ |
| Loss = average L2 over target patches / blocks | Paper §3 (eq.) | ✅ |
| Code: `F.layer_norm` on targets, `F.smooth_l1_loss`, momentum scheduler | Code `src/train.py` | ✅ |
| EMA momentum 0.996 → 1.0 linear; AdamW; wd 0.04 → 0.4; batch 2048; 15-epoch warmup + cosine | Paper App. A | ✅ |
| No view augmentations | Paper §1 | ✅ |
| ViT-H/14 < 72 h on 16×A100 (< 1200 GPU·h); ~5× fewer iterations than MAE | Paper abstract / §5 | ✅ |
| IN-1K linear probe 79.3 (ViT-H/14), 81.1 (ViT-H/16@448); MAE 77.2; iBOT 81.0 | Paper Tab. 1 | ✅ |
| 1% IN-1K 73.3 / 77.3; MAE 71.5 | Paper Tab. 2 | ✅ |
| Clevr/Count 86.7, Clevr/Dist 72.4; MAE 90.5 / 72.4; iBOT 85.7 / 62.8 | Paper Tab. 4 | ✅ |
| Masking ablation 54.2 / 20.2 / 17.6 / 15.5 (ViT-B/16, 300 ep, 1% IN) | Paper Tab. 6 | ✅ |
| Pixel targets 40.7 vs representation targets 66.9 (ViT-L/16; 800 vs 500 ep) | Paper Tab. 7 | ✅ |
| Target-encoder used for evaluation, average-pooled | Paper App. A.1 | ✅ |
| ViT-H/14 ≈ 632M params, 32 layers, width 1280 | standard ViT-H config | ⚠ |
| K_ctx ≈ 100, K_pred ≈ 38–51 in shape table | derived from scale ranges × 256 | ⚠ |

## 02 — V-JEPA (`02-v-jepa.html`) — arXiv:2404.08471, github.com/facebookresearch/jepa

| Claim | Source | Status |
|---|---|---|
| 16 frames, temporal stride 4, 224² (384² for ViT-H/16₃₈₄); tubelet 2×16×16 → 8×14×14 = 1568 tokens | Paper §3 / App. B | ✅ |
| Short-range 8 blocks × 0.15; long-range 2 blocks × 0.70; aspect (0.75, 1.5); spans full time; ~90% masked; 2 masks per clip, y-encoder once | Paper §3.3 | ✅ |
| Predictor 12 blocks, width 384; heads match backbone; 3D sin-cos positional embeddings; no [CLS] | Paper §3 / App. B | ✅ |
| L1 loss ("more stable"); stop-gradient; no target normalisation (paper) | Paper §3 / §4.3 | ✅ |
| Code: `F.layer_norm` on targets; `mean(|z-h|**loss_exp)/loss_exp` | Code `app/vjepa/train.py` | ✅ |
| EMA 0.998 → 1.0; AdamW; batch 3072 (2400 for H/16₃₈₄); 90K iters, 12K warmup; lr 2e-4 → 6.25e-4 → 1e-6; wd 0.04 → 0.4; schedules for 112.5K; bf16, A100 80GB | Paper App. B | ✅ |
| VideoMix2M ≈ 2M videos (HowTo100M, K400/600/700, SSv2), eval overlap removed | Paper §3.1 | ✅ |
| Attentive probe structure | Paper §4 / App. D | ✅ |
| K400 81.9, SSv2 72.2, AVA 25.0, IN-1K 77.4, Places205 62.8, iNat21 72.6 (ViT-H/16₃₈₄) | Paper Tab. 6 | ✅ |
| IN-1K 77.9 in abstract | Paper abstract | ✅ |
| Pixels vs features: 68.6/66.0/73.3/85.4 vs 73.7/66.2/74.8/85.6 | Paper Tab. 1 | ✅ |
| Data ablation 70.9 / 71.0 / 71.1 / 71.5; ViT-H 72.0 → 72.8 | Paper Tab. 2 | ✅ |
| Pooling ablation K400 56.7 → 73.7, SSv2 50.1 → 66.2 | Paper Tab. 3 | ✅ |
| Masking ablation (random-tube 51.5/46.4/55.6 … multi-block 72.9/67.4/72.8) | Paper Tab. 4 | ✅ |
| ViT-L/16 ≈ 300M, ViT-H/16 ≈ 630M | Paper §3 | ✅ (~) |
| K_ctx ≈ 150 in shape table | 10% of 1568 | ⚠ |

## 03 — V-JEPA 2 (`03-v-jepa-2.html`) — arXiv:2506.09985, github.com/facebookresearch/vjepa2

| Claim | Source | Status |
|---|---|---|
| VideoMix22M composition (SSv2 168K/168h, Kinetics 733K/614h, HowTo100M 1.1M/134Kh, YT-Temporal-1B 19M/1.4–1.6Mh, ImageNet 1M) | Paper Tab. 1 / §2 | ✅ (YT1B hours inconsistent in paper) |
| ViT-L ~300M, ViT-H 600M, ViT-g ~1B (width 1408); tubelet 2×16×16; 3D-RoPE split into 3 segments | Paper §2 / App. | ✅ |
| Predictor ViT-S: 22M, width 384, depth 12, 12 heads | Paper Tab. 12 | ✅ |
| Mask spatial scale [0.15, 0.7], temporal [1,1], aspect [0.75,1.5]; EMA 0.99925 fixed | Paper App. (pretraining hyper-params) | ✅ |
| Scaling gains +1.0 (data), +1.5 (model; +1.7 in fig caption), +0.8 (iters), → 88.2 avg | Paper §2 / Fig. 2 | ✅ |
| Schedule 12K warmup + 228K constant + 12K cooldown = 252K; cooldown 64 frames × 384²; 8.4× GPU-time saving; ~60 GPU-years from scratch | Paper §2 | ✅ |
| SSv2 77.3, Diving-48 90.2, Jester 97.8, K400 87.3, COIN 91.1, IN 85.1; EK100 R@5 39.7 vs 27.6 | Paper Tab. (understanding / anticipation) | ✅ |
| Video QA: Llama 3.1 8B, LLaVA-style alignment; PerceptionTest 84.0, TempCompass 76.9, MVP 44.5, TemporalBench 36.7, TOMATO 40.3 | Paper §5 | ✅ |
| Droid < 62 h; 4 s clips @ 4 fps = 16 frames, 256²; 23k trajectories | Paper §3 | ✅ |
| Per-frame encoding → 16×16×1408 (256 tokens/frame); code duplicates each frame into a 2-frame tubelet | Paper §3; Code `app/vjepa_droid/train.py` | ✅ |
| State 7D (3 pos + 3 Euler + gripper); action = Δstate | Paper §3 | ✅ |
| AC predictor ~300M, 24 layers, 16 heads, width 1024, GELU; separate affine projections; (a_k, s_k, z_k) interleave; 3D-RoPE for patches, temporal RoPE for a/s; block-causal | Paper §3 | ✅ |
| L_tf (T=15), L_rollout (T=2), L = L_tf + L_rollout, L1 | Paper §3 (eqs.) | ✅ |
| Energy ‖P(â; s_k, z_k) − z_g‖₁; CEM 800 samples, 10 iters, horizon 1; L1-ball radius 0.075 (~13 cm); MPC; 16 s/action | Paper §3–4 | ✅ |
| Robot success rates (Octo vs V-JEPA 2-AC, 2 labs avg); Cosmos lab-2 numbers, 4 min/action | Paper §4 robot table | ✅ |
| Pick-and-place uses 2 sub-goal images + final goal | Paper §4 | ✅ |
| Limitations: camera sensitivity, long horizon, image goals only | Paper §6 | ✅ |
| 3D-RoPE "stabilises training for the largest models" | Paper §2 | ✅ |

## 04 — LeWorldModel (`04-le-world-model.html`) — arXiv:2603.19312, github.com/lucas-maes/le-wm, le-wm.github.io

| Claim | Source | Status |
|---|---|---|
| Encoder ViT-Tiny: patch 14, 12 layers, 3 heads, width 192, ~5M; input 224² | Paper §3 / App. D | ✅ |
| [CLS] + 1-layer MLP projector with BatchNorm; reason: final LayerNorm hinders SIGReg | Paper §3 | ✅ (code default `norm_fn=nn.LayerNorm`; config may override) |
| Predictor 6 layers, 16 heads, dropout 0.1, ~10M; AdaLN zero-init; causal; projector after predictor | Paper §3; Code `module.py` (`ConditionalBlock`, `adaLN_modulation`, zero init, `is_causal`) | ✅ (App. D calls it "ViT-S backbone") |
| History 3 (PushT, Cube), 1 (TwoRoom); frameskip 5; action block | Paper App. D | ✅ |
| Action encoder: Conv1d(k=1) + SiLU MLP | Code `module.py::Embedder` | ✅ |
| L_pred = ‖ẑ_{t+1} − z_{t+1}‖²; L = L_pred + λ·SIGReg; λ = 0.1; M = 1024; no stop-grad / EMA | Paper §3 (eqs.) | ✅ |
| Code: `pred_loss = (pred_emb - tgt_emb).pow(2).mean()`, `tgt_emb = emb[:, n_preds:]` not detached; `sigreg(emb.transpose(0,1))` | Code `train.py` | ✅ |
| SIGReg: Epps–Pulley, w(t)=exp(−t²/2λ²) in paper; code `knots=17`, `t∈[0,3]`, trapezoid, ×N | Paper §3; Code `module.py::SIGReg` | ✅ (paper says nodes in [0.2, 4]) |
| λ "only effective hyper-parameter", bisection O(log n) | Paper §3 | ✅ |
| PLDM has six loss weights (α, β, γ, ζ, ν, μ) | Paper App. C.2 | ✅ |
| Batch 128; 4-frame sub-trajectories; 10 epochs; ~15M params; single GPU, few hours | Paper abstract / App. D | ✅ (GPU model not stated) |
| Dataset sizes (TwoRoom 10K ep avg 92; PushT 20K expert avg 196; Cube 10K × 200; Reacher 10K × 200) | Paper App. D | ✅ |
| CEM 300 samples / 30 elites / var 1; 30 iters PushT, 10 otherwise; horizon 5 (= 25 env steps); cost ‖ẑ_H − z_g‖²; < 1 s | Paper §3.2 / App. D | ✅ (paper inconsistent on executing first K vs all actions) |
| PushT +18% success vs PLDM; beats DINO-WM on PushT/Reacher; DINO-WM better on Cube; weak on TwoRoom (low intrinsic dim) | Paper §4; project page | ✅ |
| Planning ≈ 1 s vs DINO-WM ≈ 47 s; up to 48×; ~200× fewer tokens | Project page / paper | ✅ |
| Probing table (linear & MLP, LeWM / PLDM / DINO-WM) | Paper probing table; project page | ✅ |
| Surprise: teleport significant (p < 0.01), colour change not | Paper §4 / App. F.3 | ✅ |
| DINO-WM encoder pretrained on ~124M images | Project page | ✅ |
| Follow-up on real outdoor robot data | arXiv:2607.16314 | ⚠ (title/abstract only) |

## LeJEPA (bridge node)

| Claim | Source | Status |
|---|---|---|
| Isotropic Gaussian minimises downstream risk; SIGReg; removes stop-grad / teacher-student / schedulers; single trade-off hyper-param; ~50 LoC; ViT-H/14 79% IN-1K linear | arXiv:2511.08544 abstract | ✅ |

## 05 — DINO-WM / PLDM (`05-dino-wm.html`) — 2411.04983 / 2502.14819

| Claim | Source | Status |
|---|---|---|
| Frozen DINOv2 patch features, 196 patches × 384; image 224 (§4.1, Tab. 12) vs 196 (App. A.9) | DINO-WM §3.1.1, App. A.9, Tab. 12 | ✅ (inconsistency noted); ViT-S/14 inferred ⚠ |
| Action MLP → 10-d, concatenated to every patch; frameskip 5 (1 for Rope/Granular); history H 3 / 1 | §3.1.2, Tab. 11–12 | ✅ |
| Predictor ViT depth 6, 16 heads, MLP 2048, ≈19M; frame-level causal mask; no mask → PushT 0.08 vs 0.92 | App. A.9, Tab. 6 | ✅ |
| Decoder separate; backprop decoder loss → 0.80 vs 0.92 | §3.1.3, Tab. 7 | ✅ |
| CEM 100 samples / 10 steps; MPC vs open-loop table | App. A.5, A.8 Tab. 10, Tab. 8 | ✅ |
| AdamW, lr 5e-5 / 5e-4 / 3e-4, 100 epochs, batch 32; dataset sizes | Tab. 11–12, App. A.1 | ✅ (Rope/Granular length 5 vs 20 inconsistent) |
| Main results (Tab. 1) and encoder comparison (Tab. 2); WallRandom 0.82 vs 0.76 | Tab. 1–3 | ✅ |
| Planning ≈47 s (DINO-WM) vs ≈1 s (LeWM) | LeWorldModel paper / project page | ✅ |
| DINOv2 pretraining data LVD-142M | DINOv2 paper | ✅ (LeWM project page says ~124M; not resolved) |
| PLDM loss: 5 terms (sim, var over time, cov, time-sim, IDM) with α, β, δ, ω | PLDM §3.3, App. D.1.1 | ✅ |
| PLDM ablation table (98.0/98.7; α=0 13.4/11.4; β=0 29.2/7.8; δ=0 71.0/95.6; ω=0 98.0/75.5) | PLDM App. D.1.2 | ✅ |
| PLDM MPPI + ensemble-variance penalty; only PLDM generalises to held-out layouts | PLDM §3.3, §4.8, Tab. 1 | ✅ |
| LeWM describes PLDM as 7 terms / 6 weights | LeWorldModel paper | ✅ (counting differs; noted on page) |

## 06 — LLM-JEPA (`06-llm-jepa.html`) — 2509.14252 / 2602.22617

| Claim | Source | Status |
|---|---|---|
| Loss (Eq. 2); Enc = last-layer last-token hidden state; Pred = same LLM + k [PRED]; cosine; block-causal packing | LLM-JEPA §3.1–3.2 | ✅ |
| "one extra forward" (§3.1) vs "two instead of three" (§3.2); cost 2 − α with loss dropout | §3, §5.2, §6 | ✅ (inconsistency noted) |
| λ × k grid; lr grid; best configs per model | §4.1, Tab. 12 | ✅ |
| NL-RX-SYNTH table; TURK / GSM8K / Spider; pretraining 54.38 → 60.59; Llama-3.1-8B 35.77 → 63.57 ± 16.81 | Tab. 2, 12, 13, 15 | ✅ |
| Least-squares Text→Code error 3953.11 / 3035.01 / 4.47 / 4.04 | Tab. 14 | ✅ |
| Ablations (MSE 70.64, prepend 68.07, Code→Text 65.70, InfoNCE 34.40, ℓ2 2.22); JEPA-only → empty output | Tab. 3, Tab. 10 | ✅ |
| STP loss 1 − cos(h_t − h_r, h_r − h_s), last layer, random s<r<t; λ optima 0.0025–0.04; negligible overhead; 1/16 data on NL-RX-SYNTH; regex diversity 88.5 / 29.9 / 68.9 | STP §3–4, Tab. 1–2, Fig. 1 | ✅ |

## 07 — VL-JEPA (`07-vl-jepa.html`) — 2512.10942

| Claim | Source | Status |
|---|---|---|
| Frozen V-JEPA 2 ViT-L (304M), 256²; predictor = last 8 layers of Llama-3.2-1B (490M), no causal mask, ≤512 query tokens, mean pool; Y-encoder EmbeddingGemma-300M lr ×0.05; 1536-d shared space | VL-JEPA §2, §3.1 | ✅ |
| Total 1.6B (components sum ≈1.1B) | abstract / §3 | ✅ (gap noted) |
| Bi-directional InfoNCE; ablation InfoNCE 23.3 / 30.3 vs L2 13.5 / 11.7; cosine better on VQA 46.6 vs 44.3 | §2, §4.8, Tab. 7c | ✅ |
| Two-stage training details (24k batch, 100k iters, 61.6% IN zero-shot; 8 → 32 frames; lr 5e-5; 24 × 8 H200 ≈ 4 weeks; SFT 83k steps, batch 3072, PLM mixture) | §3.2 | ✅ |
| Controlled comparison numbers (500K / 5M / 15M samples) | §4.5, Fig. 3 | ✅ |
| Selective decoding ≈0.35 Hz ≈ uniform 1 Hz; 2.85×; EgoExo4D 218 videos | §4.6, Fig. 4 | ✅ |
| Results: cls 52.5 vs PE-Core-G 44.7 / SigLIP2 39.8 / CLIP 30.7; retrieval 63.7 vs 58.1; VQA GQA 61.5 TallyQA 69.9 POPE 85.7 POPEv2 86.3; WorldPrediction-WM 63.9 / 65.7 | Tab. 1–3 | ✅ (retrieval baselines other than PE not re-checked ⚠) |
| Visual token count and 1024 → 2048 projection | derived from V-JEPA 2 config | ⚠ derived (marked on page) |

## 08 — V-JEPA 2.1 (`08-v-jepa-2-1.html`) — 2603.14482

| Claim | Source | Status |
|---|---|---|
| V-JEPA 2 dense weakness: ADE20K 22.2, NYU 0.682; register hypothesis | §2.2 | ✅ |
| Context loss; λ sweep; λ_i = λ/√d_min; warm-up epochs 50–100; 22.2 → 33.9 (Tab. 2: 33.8), NYU 0.473 | §2.3.1, Tab. 2 | ✅ (inconsistency noted) |
| Deep self-supervision: 3 intermediate + final, MLP fuse, 4-level predictions; SSv2 72.0, IN1K 80.8, ADE 38.6 | §2.3.2, Fig. 4 | ✅ |
| Multi-modal tokenizer 16×16×2 / 16×16 + modality token; ADE 40.8 → 41.4 | §2.3.4 | ✅ |
| VisionMix163M (LVD-142M, YT-1B 0.188 → 0.720, SSv2 0.056 → 0.170); 128 clips + 2304 images; 135k + 12k iters | §2.3.3, §2.3.5–6, Tab. 3, App. A | ✅ |
| ViT-g 1B / ViT-G 2B; distilled ViT-L / ViT-B (frozen teacher, last layer) | §2.3 | ✅ |
| Results: Ego4D 7.71; EPIC 40.8; grasp 60 → 70–80; TartanDrive 5.687; NYU 0.307 (DINOv3-7B 0.309); ADE 47.9 (DINOv3-7B 55.9; V-JEPA 2 24.4); SSv2 77.7 | abstract, Tab. 4–9 | ✅ (20 vs 10 point grasp discrepancy noted) |
| ViT-G width 1664 | RoboJEPA §2.1 | ✅ (cross-paper) |
| Loss formula layout (sum over levels, normalisation) | paraphrase of Eq. 2 + §2.3 | ⚠ |

## 09 — LeVJEPA (`09-levjepa.html`) — 2608.27395

| Claim | Source | Status |
|---|---|---|
| Single encoder + projector (d → 2048 → BN → GELU → 256); no predictor / EMA / stop-grad; Polyak eval copy 0.9999 every 32 steps | §3, App. B | ✅ |
| Views: 1 × 224² (3136 tokens) + V × 96² (576), V = 4 (10 FLOP-matched), 16 frames, τ = 1 | §3.2 | ✅ |
| ρ = 0.95 uniform drop; IN 33.9 → 50.7 (one passage says 47.6); tube 39.6; SSv2 caveat | §3.2, §4.1 | ✅ (inconsistency noted) |
| λ = 0.02 never tuned; 1024 directions; 17 knots on [0, 3]; one all-reduce | §3, App. A | ✅ |
| Block-causal 51.2 vs bidirectional 50.7 | §4.4, Tab. 2 | ✅ |
| 5.6–20.8× less compute; ViT-L +1.9; ViT-B 4.8 vs 36.4 ExaFLOPs | §5.1, Fig. 2 | ✅ |
| FLOP-matched ViT-B table; DINOv2 comparison (53.8 / 50.7; 16.9 / 30.4) | Tab. 3–4 | ✅ |
| Data K710 20% subset; large-scale ViT-L 100 epochs on K710 + SSv2 + Walking Tours + PE Video; batch 3072; 240 / 1085 epochs | §3.3, §5 | ✅ |
| Token counts after dropping (≈157 / ≈29) | derived | ⚠ derived |

## 10 — HWM / H-JEPA (`10-hierarchical-wm.html`) — 2604.03208 / 2610.06805

| Claim | Source | Status |
|---|---|---|
| HWM: shared latent space; bases (Franka V-JEPA2-AC ViT-g + ≈300M; Push-T DINOv2 ViT-S/14 25M / 75M; Maze PLDM conv) | HWM §2.2, App. A.2–A.4 | ✅ |
| Waypoint spacing (Franka 0.33–4 s, N = 3; Push-T 25–70 steps, N = 5; Maze stride 10, 6 waypoints) | App. A.2–A.4, D.1 | ✅ |
| Macro-action encoder (Transformer, 4-d; maze MLP 8-d); ablation 52 / 37 vs 95 / 83 | §3, §4.3, Tab. 5 | ✅ |
| Horizons table (Franka 2/2/1; Push-T 4–5/5/5; Maze 47/15/4); CEM (MPPI for maze) | Tab. 12, 14; App. B | ✅ |
| Results (Franka 0 → 70 / 60, drawer 30 → 70; Push-T 55/17 → 78/61; Maze 44 → 83); 3× (abstract) vs 4× (§3.3) | Tab. 1–3 | ✅ (inconsistency noted) |
| H-JEPA: per-level latent spaces; HWM baseline = identity encoders above level 1; level 1 = LeWM ViT-Tiny; MLP encoders; s = 2, w = 1 | H-JEPA §1, §2.1, §3, §4.1 | ✅ |
| Per-level SIGReg; IDM needed on DROID; gradient-descent planning; β subgoal weight | §2.1–2.2, §4.3, App. K | ✅ |
| AntMaze 18.0 / 39.3 / 73.3 / 63.3; cost-only 31.3 vs 23.3; Push-T 3-level 58% transitions; ≈2× HWM | Tab. 1, §4.1 | ✅ |
| V-JEPA 2-AC action dim 7; H-JEPA upper-level widths | inferred | ⚠ (marked on page) |

## 11 — RoboJEPA (`11-robojepa.html`) — 2610.10515

| Claim | Source | Status |
|---|---|---|
| Frozen V-JEPA 2.1-G (1664, patch 16); V-JEPA 2 does not scale predictably | §2.1, App. K | ✅ |
| Predictor 22M–8B; pre-norm, RMSNorm, GELU, QK-norm; 4-axis RoPE + view bias; time-causal + 8-step window | §2.1, App. A.1–A.3 | ✅ |
| 26 robot IDs, per-ID linear action encoders padded to 64; token layout per timestep | §2.1, App. B.7, Eq. 4 | ✅ |
| Data: 23 datasets, 12 platforms, 15,022 h video, 6,692 h with actions, 2.8713M episodes; per-dataset table | §2.2, Tab. 1 | ✅ |
| Loss ½ TF + ½ AR (L1); AdamW wd 0.1, clip 1.0, lr 5e-5; cooldowns K = 2 / K = 10 | §2.1–2.2, Eq. 5, §3.3 | ✅ |
| Second-order power law; fitted params; held-out errors (0.6e-3 / 1.4e-3 vs 2.0e-3 / 3.7e-3); compute 2e19–9.5e22 | §3.1, Tab. 2, §2.2 | ✅ |
| Emergence thresholds (1e20, 3e20, 1e21–1e22, ≈1e22) | §3.2–3.3 | ✅ |
| CEM receding horizon, single goal image, uniform proposals, rolling KV cache, seconds per plan (8B) | §2.2, §5 | ✅ |
| Real-robot table (π0-FAST, π0.5, RoboJEPA-4B / 8B) with caveat | Tab. 3 | ✅ |
| Token counts for 240×320 views | derived | ⚠ (marked on page) |

## Timeline-only entries (track index)

External milestones link to arXiv abstracts whose titles, authors and dates were checked against the arXiv API on
2026-10-13: MC-JEPA 2307.12698, JEPA-WMs 2512.24497, latent-action world models 2601.05230, Causal-JEPA 2602.11389
(ICML 2026 per arXiv comment), EB-JEPA 2602.03604, LeJEPA world-model theory 2605.26379, MJEPA 2606.25225,
AdaJEPA 2606.32026, LeWAM 2610.12818. Semantic Tube Prediction (2602.22617) is covered inside the LLM-JEPA page.
