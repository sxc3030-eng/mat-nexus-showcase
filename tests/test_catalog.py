import copy
import unittest

from tools.validate_catalog import load_catalog, validate


class CatalogTests(unittest.TestCase):
    def test_catalog_is_valid(self):
        self.assertEqual(validate(load_catalog()), [])

    def test_rejects_score_above_question_count(self):
        data = copy.deepcopy(load_catalog())
        data["primary_comparisons"][0]["nexus_correct"] = 999
        self.assertTrue(any("outside" in error for error in validate(data)))

    def test_excluded_campaign_cannot_be_primary(self):
        data = copy.deepcopy(load_catalog())
        data["excluded_campaigns"][0]["id"] = data["primary_comparisons"][0]["id"]
        self.assertIn("excluded campaign appears in primary comparisons", validate(data))


if __name__ == "__main__":
    unittest.main()
