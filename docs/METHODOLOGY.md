# Evaluation methodology

## Paired experiment

For every model/question pair:

1. Generate the raw model response once.
2. Trial the verified expert fleet without exposing the target.
3. If an expert is verified, use its canonical answer and perform no additional
   model call.
4. If no expert is verified, reuse the current pair's raw response as the
   byte-identical bypass result.
5. Score raw and safe outputs with the same task scorer.

This produces four possible outcomes:

- **win**: raw wrong, safe correct;
- **loss**: raw correct, safe wrong;
- **tie-correct**;
- **tie-wrong**.

`GAIN` and `LOSS` require a two-sided exact paired test at alpha 0.05. Otherwise
the result is `INCONCLUSIVE`, regardless of the visible percentage difference.

## Freshness and leakage controls

- Models and questions are declared before the first generation.
- Question fingerprints are registered as consumed before inference.
- A consumed question cannot become a fresh benchmark again.
- Sealed targets are never present in model or expert prompts.
- Sealed tests cannot train, calibrate, or automatically promote a component.
- Checkpoints store hashes and scores, not raw questions, answers, or responses.

## Separate metrics

Correctness is reported separately from:

- strict output-envelope compliance;
- expert coverage and refusal rate;
- expert disagreement;
- generation-cap hits;
- latency and token use.

A formatting failure cannot turn a wrong answer into a correct one, and relaxed
answer extraction cannot erase the strict-format metric.
