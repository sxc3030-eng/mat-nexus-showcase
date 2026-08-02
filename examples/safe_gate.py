"""Dependency-free illustration of the MAT Nexus safe-gate contract.

This is intentionally not the production implementation and includes no real
expert, model, routing, memory, or service code.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Iterable


class ExpertRefusal(ValueError):
    """Normal signal: this expert cannot prove an answer."""


@dataclass(frozen=True)
class Proposal:
    expert_id: str
    answer: str
    proof: str


@dataclass(frozen=True)
class Decision:
    status: str
    answer: str | None
    source: str


Expert = Callable[[str], Proposal]
DirectModel = Callable[[str], str]


def answer_safely(question: str, experts: Iterable[Expert], direct_model: DirectModel) -> Decision:
    """Return a verified consensus, fail closed, or bypass unchanged."""

    proposals: list[Proposal] = []
    for expert in experts:
        try:
            proposal = expert(question)
        except ExpertRefusal:
            continue
        if not proposal.answer.strip() or not proposal.proof.strip():
            raise RuntimeError("invalid expert contract")
        proposals.append(proposal)

    if not proposals:
        # The direct call receives the original question with no Nexus scaffold.
        return Decision("complete", direct_model(question), "byte_identical_llm_bypass")

    answers = {proposal.answer.strip() for proposal in proposals}
    if len(answers) != 1:
        return Decision("refused_expert_disagreement", None, "fail_closed")

    return Decision("complete", next(iter(answers)), "verified_expert_consensus")
