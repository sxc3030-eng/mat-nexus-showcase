# Public disclosure boundary

This repository is a deliberately reduced portfolio surface. It is not a source
mirror of the MAT Nexus product repository.

## Allowed in this repository

- product positioning and architecture diagrams;
- public interface contracts without production endpoints;
- aggregate benchmark counts, scores, statistical labels, and SHA-256 proofs;
- generic examples that cannot reconstruct production experts;
- security and evaluation principles.

## Never publish here

- `.env` files, tokens, API keys, signing secrets, or user credentials;
- model weights, adapters, checkpoints, caches, or tokenizer assets;
- sealed questions, answers, oracle targets, model responses, or training data;
- employer/customer data or memory-database contents;
- absolute workstation paths, process dumps, or raw operational logs;
- production expert code, registry contents, qualification exams, or routing
  tables;
- proprietary service implementation and deployment configuration.

## Claim policy

Every numeric claim must identify its sample size and evaluation scope. A result
is published only when its checkpoint set reconstructs the final report and all
anti-reuse, non-training, non-mutation, and bypass-integrity controls pass.

No benchmark result in this repository should be interpreted as proof that MAT
Nexus improves every task or every language model.

No license is granted for the private MAT Nexus implementation by publication
of this portfolio repository.
