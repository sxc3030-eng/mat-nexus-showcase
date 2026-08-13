# Nexus MoE product roadmap

Nexus MoE is the planned downloadable product built on the MAT Nexus verified
expert architecture. The implementation remains proprietary; dates are not
promised until the relevant release gates pass.

## Downloadable Windows edition

The first public package is planned for Windows. It will combine conversation,
code, streaming output, local-model selection, conversation history and
explicit expert attribution. Model inference and private workspace content stay
on the user's computer by default.

Publication requires:

1. signed installer and update packages;
2. end-to-end reliability across supported local models;
3. independent expert-routing, refusal, security and regression benchmarks;
4. proprietary licence, privacy and support documents;
5. tested rollback and recovery on a clean Windows installation.

## Expert qualification

An expert file is not an active or certified expert. Candidates must produce a
bounded proof or explicit refusal, pass independent examinations and remain
disabled until a human-approved release gate. Nexus MoE never treats successful
training alone as certification.

## Mobile companion

A future Android/iOS companion may connect to the user's own Nexus MoE computer
through an authenticated encrypted channel. Large local models remain on the
computer. Pairing, device revocation and selective conversation sync are
required before remote access is offered.

## Optional advertising

Nexus MoE may include a collapsible travel-offers surface funded by an approved
affiliate relationship:

- advertisements are clearly labelled and optional;
- no prompt, response, source code, file, memory, model telemetry or expert
  choice is sent to the advertising provider;
- destination and date fields are transmitted only after deliberate user input;
- links open in the browser and never purchase or book automatically;
- advertising failures cannot block local AI features;
- only allow-listed HTTPS endpoints and signed offer manifests are accepted.

No Expedia Group affiliation or approval is claimed. Partner branding will be
shown only after formal acceptance under the applicable programme.

## Ownership

The production implementation, expert fleet, training data, model adapters,
installer and service remain proprietary. This repository contains only the
portfolio surface defined in `PUBLIC-BOUNDARY.md`.
