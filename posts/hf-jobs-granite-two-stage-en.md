# LinkedIn post — Granite 3.3 2B, pilot to confirmation

A promising pilot is not proof. So I ran the larger paired test.

On 8 fresh official `lm-eval` questions, Granite 3.3 2B moved from **25% alone to 75% with a verified deterministic expert layer**: +50 percentage points, 4 paired wins and 0 losses. The signal was encouraging, but the sample was too small (`p = 0.125`).

The 100-question confirmation produced:

- **LLM alone: 22/100 (22%)**
- **LLM + verified expert layer: 51/100 (51%)**
- **Gain: +29 percentage points**
- **29 paired wins, 0 losses, 71 ties**
- **Exact McNemar p = 3.7 × 10⁻⁹**

The gain was concentrated where results could be checked mechanically: BBH multistep arithmetic went from 0% to 100%, and BBH date understanding from 0% to 16%. GSM8K and TriviaQA were unchanged.

The honest boundary matters: this confirms the value of the **verified deterministic expert layer on this selection**. It does not establish a separate Nexus orchestration gain, and MATmem was not exercised in this run.

Fresh questions. Target-blind execution. Official prompts, filters and scorers unchanged. No answer reuse. No automatic learning from the test set.

Evidence and hashes: https://github.com/sxc3030-eng/mat-nexus-showcase

Benchmark executed on Hugging Face Jobs. Report synthesized and visualized with GPT-5 Codex.

#LocalAI #LLM #AIEngineering #MachineLearning #HuggingFace #OpenSourceAI #Benchmarking
