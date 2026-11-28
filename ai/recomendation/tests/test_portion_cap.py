"""Giới hạn 4 phần cho mỗi món khi suy luận sở thích (đặt cạnh tests/test_api.py)."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
from preferences import MAX_PORTIONS_PER_DISH, Matrix, infer_preferences, normalize_session  # noqa: E402

MATRIX = ROOT / "data/processed/resman_menu_feature_matrix_v7.csv"


class PortionCap(unittest.TestCase):
    def test_constant_is_four(self):
        self.assertEqual(MAX_PORTIONS_PER_DISH, 4)

    def test_cap_applies_to_one_dish(self):
        self.assertEqual(normalize_session([{"menu_item_id": "A", "quantity": 10}])["A"], 4)

    def test_below_cap_unchanged(self):
        self.assertEqual(normalize_session([{"menu_item_id": "A", "quantity": 3}])["A"], 3)

    def test_cap_applies_after_summing_several_lines(self):
        s = [{"menu_item_id": "A", "quantity": 3}, {"menu_item_id": "A", "quantity": 3}]
        self.assertEqual(normalize_session(s)["A"], 4)

    def test_ten_portions_same_as_four_on_real_matrix(self):
        m = Matrix(MATRIX)
        ids = {r["name"]: i for i, r in m.rows.items()}
        beef, shrimp = ids["Bắp bò nướng ớt"], ids["Tôm hấp"]
        a = infer_preferences(m, [{"menu_item_id": beef, "quantity": 10}, {"menu_item_id": shrimp, "quantity": 1}])
        b = infer_preferences(m, [{"menu_item_id": beef, "quantity": 4}, {"menu_item_id": shrimp, "quantity": 1}])
        self.assertEqual({k: v["score"] for k, v in a["inferred"].items()},
                         {k: v["score"] for k, v in b["inferred"].items()})


if __name__ == "__main__":
    unittest.main()