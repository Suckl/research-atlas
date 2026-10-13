# Sources — AI Infra track

Where the numbers and claims on this track's pages come from. "Paper" = the arXiv version listed in
`registry.js`; "Docs/Code" = official documentation or repository at the default branch (checked 2026-10-12).

Legend: ✅ verified against the source · ⚠ secondary source, vendor peak spec, or inferred · ❓ not verified

## 00 — Inference basics (`00-inference-basics.html`)

| Claim | Source | Status |
|---|---|---|
| H100 SXM 989 TFLOPS BF16 dense, 3.35 TB/s; ridge ≈ 295 FLOP/B | NVIDIA H100 datasheet (peak specs) | ⚠ vendor peak |
| A100 312 TFLOPS / 2.0 TB/s; MI300X 1307 TFLOPS / 5.3 TB/s; B200 ≈2.25 PFLOPS / 8 TB/s (widget presets) | vendor datasheets / Wikipedia | ⚠ vendor peak |
| OPT-13B KV = 800 KB/token = 2 × 5120 × 40 × 2 B | vLLM paper §2 | ✅ |
| Llama-3-70B / DeepSeek-V3 KV per token | computed from public configs (80 layers, 8 KV heads × 128; 61 layers × 576) | ⚠ derived |
| Continuous batching, prefill–decode interference | Orca (OSDI 2022); DistServe §2.3 | ✅ |

## 01 — FlashAttention (`01-flash-attention.html`) — 2205.14135 / 2307.08691 / 2407.08608

| Claim | Source | Status |
|---|---|---|
| Tiling + online softmax + recomputation; IO complexity Θ(N²d²/M); lower bound Ω(N²d²/M) for M ∈ [d, Nd] | FA1 §3, Thm 2–3 | ✅ |
| BERT-large +15% vs MLPerf 1.1; GPT-2 3×; LRA 2.4×; Path-X 61.4%, Path-256 63.1% | FA1 abstract | ✅ |
| FA2: fewer non-matmul FLOPs, sequence-length parallelism, warp partitioning; ~2× FA1; 50–73% of A100 peak; 225 TFLOPS/GPU, 72% MFU | FA2 abstract | ✅ |
| FA3: asynchrony (warp specialization + TMA), interleaved GEMM/softmax, FP8 block quantization + incoherent processing; 1.5–2× FA2; 740 TFLOPS (75%); FP8 ≈1.2 PFLOPS; 2.6× lower FP8 error; FA2 only 35% on H100 | FA3 abstract | ✅ |
| A100 non-matmul throughput 19.5 TFLOPS vs matmul 312 | FA2 §3.1 | ⚠ from memory of paper text |
| Block size B = ⌈M/4d⌉ | FA1 Algorithm 1 | ✅ |

## 02 — FlashInfer (`02-flashinfer.html`) — 2501.01005

| Claim | Source | Status |
|---|---|---|
| Block-sparse format unifies paged/radix/tree/mask KV; composable formats with different block sizes, no data movement | Paper §3.1.1–3.1.2 | ✅ |
| JIT template with QueryTransform/KeyTransform/ValueTransform/OutputTransform/LogitsTransform/LogitsMask; softmax can be omitted (FlashSigmoid) | §3.2.3 | ✅ |
| plan/run; plan on CPU not in CUDAGraph; fixed grid; deterministic (no atomics, Stream-K inspired) | §3.3.1, §3.4 | ✅ |
| ITL −29–69% vs SGLang Triton backend; long-context −28–30%, fused RoPE 1.6–3.7× bandwidth; parallel generation 13–17% (ITL −13.73%/−17.42%, TTFT −16.41%/−22.86% at n=4) | abstract, §4 | ✅ |
| Integrated in SGLang, vLLM, MLC-Engine | abstract, §3.4 | ✅ |
| Beats FlashAttention under uniform/skewed length distributions; FA decode tiles suboptimal; FA3 TMA fixed-stride → ~10% prefill gap for sparse gather | §4.2, App. B | ✅ |
| MLSys 2025 best paper | conference announcement | ⚠ |

## 03 — vLLM (`03-vllm.html`) — 2309.06180

| Claim | Source | Status |
|---|---|---|
| Existing systems use only 20.4–38.2% of KV memory for real tokens | Paper §2/§3 | ✅ |
| Default block size 16; ablation: ShareGPT 16–128 good, Alpaca 16/32 best; "16 is large enough … small enough" | §4.1, §7.2 | ✅ |
| 2–4× throughput vs FasterTransformer/Orca; up to 22× request rate vs FT (OPT-13B ShareGPT); 1.7–2.7× / 2.7–8× vs Orca Oracle/Max | abstract, §6 | ✅ |
| Block tables, reference counts, copy-on-write at block granularity; beam search memory −55% | §4.2–4.4 | ✅ |
| Preemption: swap vs recompute; recompute ≤ 20% of swap latency; comparable at block 16–64 | §4.5, §7.3 | ✅ |
| Fused kernels: reshape+block write, block read+attention, block copy | §5.1 | ✅ |
| `DEFAULT_BLOCK_SIZE = 16`, `enable_prefix_caching = True`, `gpu_memory_utilization = 0.92` | Code `vllm/config/cache.py` | ✅ |
| Backend-specific allowed block sizes (8/16/32…, larger for some backends); Mamba block multiple of 8 | vLLM source comments / docs | ⚠ |
| SGLang `--page-size` default 1; `--schedule-policy` options lpm/random/fcfs/dfs-weight/lof/priority/routing-key, default fcfs | SGLang server args docs | ✅ |
| Spec-decode KV rollback = truncate accepted length, overwrite slots | mechanism of paged KV; vLLM implementation (not quoted from docs) | ⚠ |

## 04 — SGLang (`04-sglang.html`) — 2312.07104

| Claim | Source | Status |
|---|---|---|
| RadixAttention: radix tree keyed by tokens, LRU leaf eviction, ref counts; cache-aware scheduling sorts by matched prefix; DFS order optimal (Thm 3.1); ≈96% of optimal hit rate | §3.1 | ✅ |
| Compressed FSM / jump-forward; JSON decoding ≈1.6×; 2.4× slower without FSM reuse | §3.2 | ✅ |
| API speculative execution: ~3× fewer input tokens on 3-field extraction | §3.3 | ✅ |
| Up to 6.4× throughput, 3.7× lower latency vs Guidance/vLLM/LMQL; hit rates 50–99%; Arena 52.4% / 74.1% | §5 | ✅ |
| Tree overhead < 0.3% (0.2 s / 74.3 s) | §5 | ✅ |
| Comparison used earlier vLLM; RadixAttention partially integrated into later vLLM | §5 note | ✅ |
| Frontend primitives gen/select/extend/fork/join/image/video | §2 | ✅ |
| "Zero-overhead scheduler" (CPU–GPU overlap) in later SGLang versions | SGLang release notes/blog | ⚠ |

## 05 — Speculative decoding (`05-speculative-decoding.html`) — 2211.17192 / 2302.01318

| Claim | Source | Status |
|---|---|---|
| Accept w.p. min(1, p/q); resample from norm(max(0, p−q)); always emit ≥1 token | Leviathan Alg. 1; Chen Alg. 2 (written as q/p with q = target) | ✅ |
| α = E[min(p,q)] = 1 − D_LK; E[tokens] = (1−α^(γ+1))/(1−α); speedup (1−α^(γ+1))/((1−α)(γc+1)); c < 0.05 | Leviathan §3.2–3.4 | ✅ |
| T5-XXL α table (0.75/0.80/0.82 translation temp 0; 0.62/0.68/0.71 temp 1; 0.65/0.73/0.74 and 0.53/0.55/0.56 summarization) | Leviathan Table 1 | ✅ |
| Speedups 3.4× (γ=7, temp 0), 2.6×, 3.1× (γ=5), 2.3×; batch 1, single TPU-v4 | Leviathan Table 2 / §4 | ✅ |
| "not helpful for configurations where additional computation resources are not available" | Leviathan §5 | ✅ |
| Chinchilla 70B + 4B draft, 16 TPU v4, K=4, batch 1; XSum 1.92× / 2.01×, HumanEval 2.46×; K=3 best on XSum nucleus | Chen Table 1, Fig. 1 | ✅ |
| Code hypothesis: common sub-sequences, shorter tokens | Chen §3.2 | ✅ |
| vLLM: "medium-to-low QPS, memory-bound workloads"; high-QPS gain "medium"; lossless up to numerics | vLLM speculative decoding docs | ✅ |
| DeepSeek-V3 MTP second-token acceptance 85–90% | DeepSeek-V3 report §5.4 | ⚠ from report text |

## 06 — PD disaggregation (`06-pd-disaggregation.html`) — 2401.09670 / 2311.18677 / 2407.00079

| Claim | Source | Status |
|---|---|---|
| Prefill compute-bound, decode bandwidth-bound; interference slows both; goodput definition; 90% attainment | DistServe §2–3 | ✅ |
| Intra-/inter-op parallelism choices per phase; placement Alg. 1/2 | DistServe §3–4 | ✅ |
| KV transfer: OPT-66B 512-token ≈1.13 GB; 10 req/s ≈ 90 Gbps; NVLink 600 GB/s, IB 800 Gbps; 25 Gbps testbed: <0.1% latency, 95% < 30 ms | DistServe §4.2, §6 | ✅ |
| vs vLLM 2.0–4.6× (chat), 4.3× (summarization), 12.6× tighter SLO; 7.4× vs DeepSpeed-MII | DistServe §6 | ✅ |
| "effectiveness … may be compromised" in throughput-optimized settings | DistServe §7 | ✅ |
| Splitwise: token phase memory-bound, power flat; prompt phase power-cap sensitive; H100 prompt / A100 token (Splitwise-HA); 1.4× at 20% lower cost or 2.35× same power/cost; HA 1.18× / 10% lower cost; layer-wise transfer <7%, ~5–8 ms non-overlapped; mixed pool JSQ | Splitwise §3–6 | ✅ |
| Mooncake: KVCache-centric, CPU DRAM/SSD pool, Messenger (GPUDirect RDMA), chunked pipeline prefill, early rejection; 525% / 75%; 800 Gbps; 512-token hash blocks; hit rate ≤55% | Mooncake §3–8 | ✅ |
| Heterogeneous (cross-vendor) challenges | inference from the above mechanisms + ROCm/NCCL facts | ⚠ reasoning |

## 07 — Megatron (`07-megatron.html`) — 1909.08053 / 2104.04473 / 2205.05198

| Claim | Source | Status |
|---|---|---|
| Column-then-row MLP split, head-wise attention split, f/g conjugate ops, 2 all-reduces fwd + 2 bwd | Megatron-LM §3; PTD-P §2.2 | ✅ |
| 8.3B on 512 GPUs: 15.1 PFLOPs, 76% scaling vs 39 TFLOPs (30% peak) | Megatron-LM abstract | ✅ |
| TP within node up to g; bubble (p−1)/m; interleaved (1/v)·(p−1)/m, v× communication; 1T on 3072 A100: 502 PFLOP/s, 52%; scatter/gather up to +11% | PTD-P abstract, §2–3 | ✅ |
| Sequence parallelism: all-reduce → reduce-scatter + all-gather; 5× activation memory; >90% less recompute; 530B on 2240 A100 MFU 54.2% vs 42.1% | 2205.05198 abstract | ✅ |
| Ring all-reduce traffic 2(N−1)/N·D | standard (Patarasuk & Yuan 2009) | ✅ |

## 08 — FP8 formats (`08-fp8-formats.html`) — 2209.05433

| Claim | Source | Status |
|---|---|---|
| E4M3: bias 7, max 448, min normal 2⁻⁶, min subnormal 2⁻⁹, no inf, NaN S.1111.111; E5M2: bias 15, max 57344, 2⁻¹⁴, 2⁻¹⁶, IEEE specials | Paper Table 1 | ✅ |
| Recommended E4M3 for weights/activations, E5M2 for gradients; per-tensor scaling; saturation on overflow | §4 | ✅ |
| GPT-3 175B ppl 6.65 (bf16) vs 6.68 (FP8) at 75% of training; PTQ numbers (8.51/10.29/8.41; 19.01/28.37/19.43; 90.87/89.65/90.94) | §5 | ✅ |
| H100 FP8 ≈1979 TFLOPS dense vs BF16 989 | NVIDIA datasheet | ⚠ vendor peak |

## 09 — DeepSeek-V3 (`09-deepseek-v3.html`) — 2412.19437

| Claim | Source | Status |
|---|---|---|
| 671B/37B; 61 layers (first 3 dense); hidden 7168; 256 routed + 1 shared experts, 8 active; expert dim 2048 | §2, §4.2 | ✅ |
| MLA d_c = 512, d_c' = 1536, RoPE dim 64 (576 cached per token per layer) | §2.1.1 | ✅ |
| 64-way EP over 8 nodes, 16-way PP (DualPipe), ZeRO-1 DP, no TP; node-limited routing M=4; IB 50 GB/s, NVLink 160 GB/s; 20 of 132 SMs for comms; dispatch FP8, combine BF16 | §3.2 | ✅ |
| FP8: E4M3 everywhere; 1×128 activation tiles, 128×128 weight blocks; ~14-bit tensor-core accumulation, ~2% error at K=4096; promote every N_C=128 to FP32; loss error <0.25%; BF16/FP32 for embedding, head, gating, norms, attention; FP32 master weights/grads, BF16 Adam moments; E5M6 for some inputs | §3.3 | ✅ |
| 2.788M H800 GPU hours (2.664M + 119K + 5K); 2048 H800 | §1, §3 | ✅ |
| Inference: prefill EP32 + DP, decode EP320 with redundant experts | §3.4 | ⚠ from report text |
| MTP acceptance 85–90% | §5.4 | ⚠ |

## 10 — RoPE (`10-rope.html`) — 2104.09864

| Claim | Source | Status |
|---|---|---|
| Rotation formulation, relative-position property, long-term decay, linear-attention compatibility | Paper §3.2–3.5 | ✅ |
| θ_i = base^(−2i/d), base 10000 | §3.3 | ✅ |
| NoPE findings | Kazemnejad et al. 2023 | ⚠ summary |
| YaRN / NTK / PI descriptions | respective papers | ⚠ summary |
| Qwen3-Next partial rotary 0.25 | Qwen3-Next config (HF) | ❓ not verified in this pass (marked unverified on page) |
| DeepSeek-V4 RoPE on last 64 dims + output rotation by −i | V4 paper §2 | ✅ |

## 11 — Gated DeltaNet (`11-gated-deltanet.html`) — 2412.06464

| Claim | Source | Status |
|---|---|---|
| S_t = S_{t−1}(α_t(I − β_t k_t k_tᵀ)) + β_t v_t k_tᵀ; gating = adaptive memory management; delta rule = better memorization | Paper Eq. 10, §3, §5 | ✅ |
| Chunkwise WY/UT algorithm; "marginal overhead"; 2–3K tok/s slower than Mamba2 | §4 | ✅ |
| Wikitext 16.42 / 16.56 / 17.71; S-NIAH-1@8K 91.8 / 30.4 / 98.8; S-NIAH-2@8K 29.6 / 17.0 / 14.4 | Tables 3–4 | ✅ |
| Hybrids H1 (SWA) / H2 (+Mamba2) beat pure attention on retrieval | §5 | ✅ |
| No positional encoding mentioned for GDN layers | paper text (absence) | ✅ |
| Qwen3.5: 3:1 GDN : gated attention; conv kernel 4; linear K/V heads 16/32 × 128; hidden 4096, 32 layers (9B); head_dim 256 full-attn; 397B-A17B 512 experts, 60 layers, 262K | HF transformers `qwen3_5` docs (config defaults) | ✅ |
| Linear layers no RoPE; full-attention layers RoPE; conv replaces PE | HF docs + justinchuby analysis gist | ⚠ secondary for the "replaces" phrasing |
| A_log ∈ U[0,16], dt_bias = 1 | gist (claims HF defaults) | ⚠ |
| GLM-5: 744B-A40B, 80 layers, MLA + DSA; GLM-9B efficient-attention comparison (SWA −30 RULER@128K; GDN adds params; SimpleGDN best balance; ≤5.69 RULER / 7.33 RepoQA gap); DSA "lossless by construction", 1.5–2× | GLM-5 report §2.1 | ✅ |

## 12 — DeepSeek Sparse Attention (`12-deepseek-sparse-attention.html`) — 2512.02556 / 2502.11089 / 2606.19348

| Claim | Source | Status |
|---|---|---|
| Indexer I_{t,s} = Σ_j w_{t,j} ReLU(q_{t,j}·k_s); few heads; FP8; ReLU for throughput; input detached | V3.2 §2.1 | ✅ |
| top-k = 2048; built on MLA MQA mode (shared latent KV); O(L²) → O(Lk) | §2.1–2.2 | ✅ |
| Dense warm-up: lr 1e-3, 1000 steps × 16 × 128K ≈ 2.1B tokens; sparse: lr 7.3e-6, 15000 × 480 × 128K ≈ 943.7B | §2.2 | ✅ |
| No substantial degradation vs V3.1-Terminus; Arena Elo matched; AA-LCR +4 | §2.3 | ✅ |
| NSA: compression + selection + sliding window, hardware-aligned, natively trainable; 64k speedups | NSA abstract | ✅ (branch details from paper body, ⚠) |
| V4: CSA (compress m → DSA) + HCA (m′ ≫ m, dense), interleaved; indexer FP4; V4-Pro 1.6T/49B, V4-Flash 284B/13B; 1M context; 27%/10% and 10%/7% of V3.2 FLOPs/KV; ≈2% of BF16 GQA8 KV; mixed-precision storage; RoPE last 64 dims + −i output rotation | V4 paper §2, abstract | ✅ |
| 128-token sliding window; 9.62 GiB KV per 1M-token sequence | vLLM blog 2026-04 | ⚠ secondary |
| GLM-5 adopted DSA | GLM-5 report §2.1 | ✅ |

## 13 — Batch invariance (`13-batch-invariance.html`)

| Claim | Source | Status |
|---|---|---|
| "concurrency + floating point" incomplete; no atomic adds in forward; batch invariance is the cause; load varies batch size | Thinking Machines blog | ✅ |
| RMSNorm / matmul (no split-K, one config) / attention (fixed split-size KV, write KV before kernel) fixes; 26 s → 55 s → 42 s | blog | ✅ |
| Qwen3-235B temp 0: 80 unique → 1 of 1000 (divergence after 102 tokens) | blog | ✅ (102 from blog, ⚠) |
| RL: reward collapse without correction; off-policy term fixes; KL flat at 0 with bitwise-identical sampling | blog | ✅ |
| TIS: min(ρ, C) one-sided cap; VeRL/slime/OAT integration; NeurIPS 2025 paper | Yao et al. Notion post; NeurIPS listing | ✅ |
| MiniMax-M1 FP32 LM head | MiniMax-M1 report | ⚠ from memory |

## 14 — AMD (`14-amd-rocm.html`)

| Claim | Source | Status |
|---|---|---|
| MI300X: CDNA 3, 8 XCD, 304 CU, 192 GB HBM3, 5.3 TB/s, FP16 1307.4 TFLOPS, 750 W; MI325X 256 GB, 1000 W; MI355X CDNA 4, TSMC N3, 288 GB HBM3E, 8 TB/s, 1400 W | Wikipedia AMD Instinct; AMD product brief | ⚠ vendor peak |
| MI300X FP8 2615 TFLOPS dense | AMD spec page | ⚠ |
| MI355X FP8 ≈5.03 PFLOPS, BF16 ≈2.52 PFLOPS, FP4 ≈10 PFLOPS dense | SemiAnalysis spec table; AMD platform brochure (8-GPU totals /8) | ⚠ |
| H100 / B200 reference numbers | NVIDIA datasheets | ⚠ vendor peak |
| wavefront 64, LDS 64 KB (160 KB on MI355X), MFMA, FNUZ FP8 on MI300, OCP FP8 on MI355X | ROCm docs / CDNA whitepapers | ⚠ from memory of docs |
| vLLM / SGLang ROCm support | project docs | ✅ |

## 15 — Orca / Sarathi-Serve (`15-orca-sarathi.html`) — OSDI 2022 / 2403.02310

| Claim | Source | Status |
|---|---|---|
| Iteration-level scheduling, selective batching; GPT-3 175B: 36.9× throughput at same latency vs FasterTransformer | Orca OSDI 2022 abstract (USENIX page) | ✅ |
| Orca reserves KV for max output length; vLLM uses Orca variants as baselines | vLLM paper §6 | ✅ |
| Chunked prefill + stall-free batching; uniform batches reduce PP bubbles; Mistral-7B 2.6×, Yi-34B 3.7×, Falcon-180B 5.6× vs vLLM | Sarathi-Serve abstract | ✅ |
| Token budget trade-off (small = stable TBT, lower prefill efficiency, KV re-read) | Sarathi-Serve §3–4 (qualitative) | ⚠ paraphrased |
| Token budget 512 in pseudocode | illustrative only | ❓ not a paper value |

## 16 — ZeRO / FSDP (`16-zero-fsdp.html`) — 1910.02054 / 2304.11277

| Claim | Source | Status |
|---|---|---|
| 16Ψ bytes (2+2+12) with mixed-precision Adam; stage formulas; Ψ=7.5B, N_d=64 → 120 / 31.4 / 16.6 / 1.9 GB | ZeRO §3, §5, Fig. 1 | ✅ |
| Communication 2Ψ (DP, ZeRO-1/2) vs 3Ψ (ZeRO-3) | ZeRO §7 | ✅ |
| 100B+ on 400 GPUs, 15 PFLOPS, 8× size / 10× perf; 13B without model parallelism; Turing-NLG 17B | ZeRO abstract | ✅ |
| ZeRO-R (activation partitioning, constant buffers, defragmentation) | ZeRO §6 | ⚠ from memory of paper structure |
| FSDP: FlatParameter units, prefetch, rate limiter, HSDP; FSDP2 per-parameter DTensor | FSDP paper §3–4; PyTorch docs | ⚠ from memory |
| FSDP comparable to DDP, near-linear TFLOPS scaling | FSDP abstract | ✅ |
| DeepSpeed pipeline engine supports only ZeRO-1 | DeepSpeed docs | ⚠ not re-checked (marked unverified on page) |
| Venues SC 2020 / VLDB 2023 | proceedings | ⚠ from memory |

## 17 — EAGLE 1/2/3 (`17-eagle.html`) — 2401.15077 / 2406.16858 / 2503.01840

| Claim | Source | Status |
|---|---|---|
| Feature-level drafting, shifted token, reuse LM head; feature regression + token loss | EAGLE §3; EAGLE-3 §2 | ✅ |
| EAGLE-2 dynamic tree: confidence ≈ acceptance, expand + rerank | EAGLE-2 §3 | ✅ |
| EAGLE-3: drop feature loss, fuse low/mid/high (3k → k), training-time test; speedup scales with data | EAGLE-3 §3, Fig. 1 | ✅ |
| τ / speedup table (Vicuna 13B 6.65 / 5.58×; LLaMA-3.1-8B 6.13 / 4.40×; LLaMA-3.3-70B 5.63 / 4.11×; EAGLE-2 τ 4.83 / 4.05 / 3.67) | EAGLE-3 Tab. 1 | ✅ |
| Max 6.47× (HumanEval, τ 7.54); "about 1.4× over EAGLE-2" (abstract) vs "20–40%" (§4.1) | EAGLE-3 abstract, §4.1 | ✅ (discrepancy noted) |
| SGLang H100 batch 64: 1.38×; EAGLE 0.93× at batch 24 | EAGLE-3 Tab. 3 | ✅ |
| EAGLE 3.1 (May 2026, EAGLE + vLLM + TorchSpec); change list | vLLM blog (title); AMD ATOM docs | ⚠ secondary |
| SpecForge (SGLang team) | arXiv 2603.18567 | ✅ (title/authors) |
| Kimi K3 MTP → EAGLE-3-style draft fusing AttnRes blocks 1, 4, last | Kimi K3 §4.1.4 | ✅ |
| Venue ICML 2024 (EAGLE) | proceedings | ⚠ from memory |

## 18 — RL systems (`18-rl-systems.html`) — 2409.19256 / 2505.24298

| Claim | Source | Status |
|---|---|---|
| RLHF dataflow (generation / preparation / training); hybrid single- + multi-controller; @register protocols; ResourcePool; PPO ≈ 8 lines | HybridFlow §1–4 | ✅ |
| 3D-HybridEngine: N_a = p·t·d = p_g·t_g·d_g·d; zero redundancy; memory / comm table | HybridFlow §5, Tab. 2 | ✅ |
| Placement findings (colocate small, split 34B, standalone 13B at 128 GPUs) | HybridFlow §8.3 | ✅ |
| 1.53–20.57×; PPO avg 3.67 / 3.25 / 12.52×; transition −71.2% / −89.1%; 16 × 8 A100 | HybridFlow abstract, §8 | ✅ |
| AReaL architecture; η definition, η = 4 (code) / 8 (math); decoupled PPO | AReaL §4–5, §7.1 | ✅ |
| 2.77× (41.0 h → 14.8 h, 1.5B); 2.57× in intro; 512 H800 | AReaL abstract, Tab. 1, §7 | ✅ (discrepancy noted) |
| Kimi K3 million-token agentic RL, external KV pool | Kimi K3 §5.3 | ✅ |
| Venue EuroSys 2025 (HybridFlow) | proceedings | ⚠ from memory |

## 19 — FP4 training (`19-fp4-training.html`) — 2509.25149

| Claim | Source | Status |
|---|---|---|
| NVFP4: E2M1, block 16, E4M3 scale, FP32 tensor scale; MXFP4: block 32, E8M0, up to one binade waste | NVFP4 paper §2, App. B | ✅ |
| Recipe: <15% layers high precision (12B: first 2 + last 8 blocks ≈16%); RHT 16×16 on Wgrad only; 2D 16×16 weight scaling; SR on gradients only | §4.1–4.4, App. E | ✅ |
| 12B / 10T: loss <1% (≈1.5% after LR decay); MMLU-Pro 62.62 vs 62.58; MMLU 77.36 / 76.57; MBPP+ 59.11 / 55.91; switch at 8.2T → 0.5% | §3, Tab. 2, App. D | ✅ |
| MXFP4 2.5% vs NVFP4 1.5%; 1.36T tokens to match | §5 | ✅ |
| Throughput vs BF16: NVFP4 4× (GB200) / 6× (GB300); FP4 vs FP8 2× / 3× | Tab. 1, §2 | ✅ (different baselines noted) |
| Two-level scale formula s_g = amax/(6·448) | derived from format definition | ⚠ derived |
| gpt-oss: MoE weights MXFP4, 4.25 bits/param, 120b on one 80 GB GPU | gpt-oss model card §2.1 | ✅ |
| DeepSeek-V4: MXFP4 QAT on experts + indexer QK, dequant to FP8 (1×32 in 128×128); FP4×FP8 peak = FP8×FP8 today | V4 §5.2.1, §2 | ✅ |
| Kimi K3: MXFP4 experts + MXFP8 activations QAT through SFT and RL | K3 §4.1.4 | ✅ |

## 20 — Kimi Linear / KDA (`20-kimi-linear.html`) — 2510.26692 / 2607.24653

| Claim | Source | Status |
|---|---|---|
| KDA recurrence with Diag(α_t); vs GDN / GLA / Mamba2; Mamba2 fails synthetic tasks | Kimi Linear §2.2, §3, §5.1 | ✅ |
| Neural parameterization (ShortConv + Swish, L2Norm q/k, low-rank α, sigmoid β, head-wise RMSNorm + low-rank sigmoid gate); d_k = d_v = 128 | §4, Eq. 10 | ✅ |
| Constrained DPLR (a = βk, b = k⊙α, D = Diag(α)); 4 → 2 secondary-chunk matmuls; ≈2× vs DPLR up to 64K | §3.2, §6.2, Fig. 2 | ✅ |
| 3:1 ratio ablation (5.65 / 5.66 / 5.70 / 5.82 / 5.77); NoPE in MLA (MQA conversion, no RoPE retuning) | §4, Tab. 1 | ✅ |
| 48B-A3B, 8/256 experts incl. 1 shared; 1.4T comparison runs; 5.7T release; MuonClip, lr 1.1e-3, 32M batch | §5.4 | ✅ |
| TPOT 1.84 vs 11.48 ms at 1M; prefill 2.3× (512K) / 2.9× (1M); KV up to −75% | abstract, Fig. 1, §5.6 | ✅ |
| "75% = 3 of 4 layers have constant state" | derived | ⚠ derived |
| Benchmark table (MMLU-Pro 51.0 vs 47.2 …; EvalPlus/LiveBench worse) | Tab. 3–5 | ✅ |
| K3: 2.8T-A104B, 93 layers (69 KDA + 24 gated MLA, NoPE), 7168 hidden, g_min = −5; Block AttnRes 8 × 12; LatentMoE 896/16 + 2 shared, 3584 latent; per-head Muon; ≈2.5× scaling efficiency | K3 abstract, §2–3, Tab. 1 | ✅ |
| K3 infra: FlashKDA, KCP (fixed-size all-gather), MoonEP (S×K per rank), prefix cache 512-token hashes in 6144-token blocks, KDA snapshots at turn boundaries | K3 §5.1–5.4 | ✅ |

## 21 — KV cache tiering (`21-kv-cache-tiering.html`) — 2510.09665 / 2508.18572

| Claim | Source | Status |
|---|---|---|
| Stored KV ≫ GPU memory; >19% users reuse >1.5× | LMCache §2.2 | ✅ |
| 256-token chunks, multi-tier, layer-wise pipelining, zero-copy, connector hooks, control API | LMCache §5–7, Tab. 2–3 | ✅ |
| Up to 15× throughput; TTFT 1.9–8.1×; PD 1.53–1.84×; 400 vs 88 Gbps; crossover ≈256K at 32 Gbps | LMCache abstract, §8 | ✅ |
| vLLM page 20–63 KB | LMCache §5 | ✅ |
| Strata: 22% of PCIe 5.0 at page 32 / 8192 tokens; 1–2 MB for 75–80%; 74% prefill blocked (LooGLE, Qwen2.5-14B) | Strata §1, §3.1 | ✅ |
| GPU-assisted I/O (128 B granularity, layer-first GPU / page-first host, ≈50 GB/s, GH200 40 → 150 GB/s); delay hits; load/compute threshold 100; bubble filling | Strata §4 | ✅ |
| 5× vs vLLM+LMCache, 3.75× vs TRT-LLM (abstract: TTFT; §5.2.1: throughput at same TTFT) | Strata abstract, §5.2 | ✅ (metric discrepancy noted) |
| Typical coding prefix 400K, +4K per turn | Kimi K3 §5.4.3 | ✅ |
| DeepSeek-V4 on-disk KV; SWA ≈ 8× compressed; three SWA strategies | V4 §3.5 | ✅ |

## 22 — FlashAttention-4 (`22-flash-attention-4.html`) — 2603.05451

| Claim | Source | Status |
|---|---|---|
| H100 → B200: 4096 → 8192 FLOPs/clk/SM; SMEM 128 B/clk; MUFU 16/clk (B300: 32); TMEM 256 KB/SM | FA4 §2.2 | ✅ |
| Tile cycles (128): MMA 1024, SMEM 768, exp 1024 | FA4 Tab. 1 | ✅ |
| MMA/exp ratio = d/128 | derived from §2.2 numbers | ⚠ derived |
| Warpgroups: 2 softmax, 1 correction, 1 MMA+TMA; two Q tiles ping-pong; P via TMEM aliasing S | §3.1.2 | ✅ |
| Software exp2: Cody-Waite + polynomial; degree-3 ≤1 BF16 ulp on 99%; 8.77e-5 vs 1.41e-7; 10–25% emulated | §3.1.3, Tab. 2 | ✅ |
| Conditional rescaling τ = log2(256) = 8 | §3.1.4, Eq. 6 | ✅ |
| Backward: TMEM layout; 2-CTA M = 256; SMEM cycles 3328 → 2688; dQ atomics halved; deterministic ≈75% | §3.2, Tab. 3, §5.2 | ✅ |
| 1613 TFLOPS (71%); 1.1–1.3× cuDNN 9.13; 2.1–2.7× Triton | abstract, §5.1, Fig. 4 | ✅ |
| Compile 55 → 2.5 s, 45 → 1.4 s | Tab. 4 | ✅ |
| Appendix says B100 / March 2025 | App. A.1 | ✅ (inconsistency noted) |

## 23 — DeepSeek-V4 / mHC (`23-deepseek-v4.html`) — 2606.19348 / 2512.24880

| Claim | Source | Status |
|---|---|---|
| Config table (43/61 layers, 4096/7168, 256/384 experts, top-6, m = 4, k = 512/1024, m′ = 128, n_hc = 4, 20 Sinkhorn iters, MTP 1, SWA 128, indexer 64 heads × 128, 32T/33T tokens) | V4 §4.2.1–4.2.2 | ✅ |
| CSA / HCA mechanics; shared-KV MQA, grouped output, RMSNorm on Q/KV, partial RoPE 64, attention sinks | V4 §2.3 | ✅ |
| 27% / 10% FLOPs, 10% / 7% KV vs V3.2; ≈2% of BF16 GQA8 | V4 abstract | ✅ |
| Muon (momentum 0.95, wd 0.1, RMS 0.18; NS coefficients); AdamW for embedding / head / norms / mHC statics; no QK-Clip | V4 §2, §4.2.2 | ✅ |
| MegaMoE 1.50–1.73× / 1.96×; 6.1 TFLOP/s per GB/s; TileLang host codegen <1 µs; deterministic kernels; Muon ZeRO knapsack <10% padding | V4 §3 | ✅ |
| SwiGLU clamp [−10, 10], gate cap 10 | V4 §4.2.3 | ✅ |
| Benchmarks (base and post-trained tables) | V4 Tab. 1, 6–7 | ✅ |
| mHC: HC instability (≈3000 gain, loss surge ≈12k steps at 27B); Birkhoff polytope; σ / 2σ maps; fusion (3n+1)C → (n+1)C; recompute √(nL/(n+2)); 6.7% overhead; 27B table; max gain ≈1.6 | mHC §3–5, Tab. 4 | ✅ |
| arXiv id 2606.19348 with submission date 2026-04-26 | arXiv API metadata | ✅ |
| Hyper-Connections ICLR 2025 | proceedings | ⚠ from memory |

## Timeline-only entries (track index)

External milestones (no own page) link to arXiv abstracts whose titles and dates were checked against the arXiv API
on 2026-10-13: GPipe 1811.06965, MQA 1911.02150, GQA 2305.13245, DeepSpeed-Ulysses 2309.14509, Ring Attention
2310.01889, Mamba 2312.00752, Medusa 2401.10774, DeepSeek-V2 2405.04434, Muon is Scalable 2502.16982, Gated Attention
2505.06708, Kimi K2 2507.20534, gpt-oss 2508.10925, FP16 mismatch 2510.26788, Engram 2601.07372, GLM-5 2602.15763,
Attention Residuals 2603.15031, Mamba-3 2603.15569, SpecForge 2603.18567, Gated DeltaNet-2 2605.22791. Venue tags in
labels (NeurIPS 2025 for Gated Attention, FAST 2025 for Mooncake, OSDI for Orca / Sarathi / Strata) are ⚠ from memory
except Strata (USENIX OSDI 2026 page ✅).
