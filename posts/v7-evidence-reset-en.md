# MAT Nexus V7: an evidence reset before the expert-team test

V7 Preview is packaged, but this is not a victory announcement. It is a cleaner starting point for the next causal evaluation.

## What is verified today

- **52/52 focused release tests passed** for the Windows package, installer contract, profile handling, and Granite context guard.
- A previous public, self-contained safe-gate campaign remains reproducible: Granite moved from **3/18 to 18/18**, Gemma from **3/18 to 15/18**, and Llama from **1/6 to 6/6**. These small mechanically verifiable sets are useful evidence, not a universal benchmark claim.
- A historical controlled internal 800-question study measured Granite direct at **51/800 (6.375%)**, expert routing at **648/800 (81.0%)**, adaptive Nexus at **698/800 (87.25%)**, and the deterministic executor at **800/800 (100%)**. Because the corpus was template-controlled, these numbers do **not** establish general or official benchmark performance.

## What was rejected

The recent AgentDojo attempt is invalid as a paired comparison. Only **5/40** raw cases completed before a context overflow (**8,670 input tokens for an 8,192-token limit**); the Nexus arm never started. Therefore, it has **no accuracy score and no gain/loss conclusion**.

Rejecting a failed run is part of the product. A harness that cannot say “no result” is not trustworthy.

## The next decisive test

The next campaign will isolate the product's main hypothesis:

> **LLM alone vs the same LLM assisted by a sparse team of 3–6 qualified experts.**

It will use fresh sealed questions, identical model settings, paired scoring, per-domain results, abstention tracking, latency and token cost. Nexus orchestration will be evaluated separately afterward so that expert value is not confused with router value.

The official tau3 source is already pinned and audited: **278 core tasks, 0 consumed, and no test selection created yet**. No sealed answer will be used for tuning.

MAT Nexus V7 will earn its claim from those fresh paired results—not from a version number.

