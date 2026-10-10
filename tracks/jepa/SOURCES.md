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
