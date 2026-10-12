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
