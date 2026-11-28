"""Câu trả lời 'không' ở nhóm audience_* không được loại món (đặt cạnh tests/test_api.py)."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
from preferences import Matrix  # noqa: E402
from scoring import build_profile, recommend  # noqa: E402

MATRIX = ROOT / "data/processed/resman_menu_feature_matrix_v7.csv"


class BuildProfileUnit(unittest.TestCase):
    def prefs(self, confirmed):
        return {"confirmed": confirmed, "inferred": {}}

    def test_audience_false_is_not_avoid(self):
        for attr in ("audience_possible_children", "audience_dieting", "audience_vegetarian"):
            want, avoid, _ = build_profile(self.prefs({attr: False}))
            self.assertEqual(avoid, set(), attr)
            self.assertEqual(want, {}, attr)

    def test_taste_false_is_still_avoid(self):
        _, avoid, _ = build_profile(self.prefs({"taste_spicy": False}))
        self.assertEqual(avoid, {"taste_spicy"})

    def test_audience_true_still_wanted(self):
        want, avoid, veg = build_profile(self.prefs({"audience_possible_children": True, "audience_vegetarian": True}))
        self.assertEqual(set(want), {"audience_possible_children", "audience_vegetarian"})
        self.assertTrue(veg)


class AudienceOnRealMatrix(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = Matrix(MATRIX)
        ids = {r["name"]: i for i, r in cls.m.rows.items()}
        cls.order = [{"menu_item_id": ids[n], "quantity": 1}
                     for n in ("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp")]

    def names(self, answers, k=20):
        r = recommend(self.m, self.order, {"answers": answers}, k)
        return [(x["name"], x["score"]) for x in r["recommendations"]]

    def test_no_children_same_result_as_no_answer(self):
        self.assertEqual(self.names({"audience_possible_children": False}), self.names({}))

    def test_no_dieting_same_result_as_no_answer(self):
        self.assertEqual(self.names({"audience_dieting": False}), self.names({}))

    def test_kid_friendly_dishes_still_recommended_when_no_children(self):
        top = [n for n, _ in self.names({"audience_possible_children": False})]
        self.assertIn("Tôm hùm hấp", top)

    def test_avoid_spicy_still_excludes_spicy_dishes(self):
        top = [n for n, _ in self.names({"taste_spicy": False}, k=200)]
        spicy = {r["name"] for r in self.m.rows.values() if r["taste_spicy"] == 1}
        self.assertFalse(set(top) & spicy)


if __name__ == "__main__":
    unittest.main()