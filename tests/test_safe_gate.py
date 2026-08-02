import unittest

from examples.safe_gate import Decision, ExpertRefusal, Proposal, answer_safely


class SafeGateTests(unittest.TestCase):
    def test_verified_consensus_is_authoritative(self) -> None:
        experts = [
            lambda _: Proposal("a", "42", "proof-a"),
            lambda _: Proposal("b", "42", "proof-b"),
        ]
        self.assertEqual(
            answer_safely("question", experts, lambda _: "wrong"),
            Decision("complete", "42", "verified_expert_consensus"),
        )

    def test_disagreement_fails_closed(self) -> None:
        experts = [
            lambda _: Proposal("a", "41", "proof-a"),
            lambda _: Proposal("b", "42", "proof-b"),
        ]
        self.assertEqual(
            answer_safely("question", experts, lambda _: "unused").status,
            "refused_expert_disagreement",
        )


    def test_all_refuse_uses_the_original_direct_call(self) -> None:
        received: list[str] = []

        def refuse(_: str) -> Proposal:
            raise ExpertRefusal

        def direct(question: str) -> str:
            received.append(question)
            return "direct"

        self.assertEqual(
            answer_safely("unchanged", [refuse], direct),
            Decision("complete", "direct", "byte_identical_llm_bypass"),
        )
        self.assertEqual(received, ["unchanged"])


if __name__ == "__main__":
    unittest.main()
