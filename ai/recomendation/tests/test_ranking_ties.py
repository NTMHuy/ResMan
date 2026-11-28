"""Test phá hòa khi nhiều món cùng điểm (đặt cạnh tests/test_api.py)."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
from preferences import Matrix  # noqa: E402
from scoring import DEFAULT_K, rank, recommend  # noqa: E402

MATRIX = ROOT / "data/processed/resman_menu_feature_matrix_v7.csv"


def item(mid, score, matched, cat):
    return {"menu_item_id": mid, "score": score, "matched_count": matched, "category": cat}


class RankUnit(unittest.TestCase):
    def test_more_matched_labels_first_when_same_score(self):
        out = rank([item("A", 80, 2, "x"), item("B", 80, 3, "x")], set(), 2)
        self.assertEqual([o["menu_item_id"] for o in out], ["B", "A"])

    def test_unordered_category_first_then_interleave(self):
        scored = [item("M1", 100, 3, "Đã gọi"), item("M2", 100, 3, "Đã gọi"),
                  item("M3", 100, 3, "Mới 1"), item("M4", 100, 3, "Mới 1"), item("M5", 100, 3, "Mới 2")]
        out = [o["menu_item_id"] for o in rank(scored, {"Đã gọi"}, 5)]
        self.assertEqual(out, ["M3", "M5", "M4", "M1", "M2"])   # xen kẽ Mới 1 / Mới 2, nhóm đã gọi xuống cuối

    def test_diversity_never_beats_higher_score(self):
        scored = [item("HIGH", 90, 3, "Đã gọi"), item("LOW", 80, 3, "Mới")]
        out = rank(scored, {"Đã gọi"}, 2)
        self.assertEqual(out[0]["menu_item_id"], "HIGH")

    def test_deterministic(self):
        scored = [item(f"M{i}", 100, 3, "c") for i in range(6)]
        self.assertEqual(rank(scored, set(), 4), rank(list(reversed(scored)), set(), 4))


class RankOnRealMatrix(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = Matrix(MATRIX)
        cls.ids = {r["name"]: i for i, r in cls.m.rows.items()}

    def order(self, *names):
        return [{"menu_item_id": self.ids[n], "quantity": 1} for n in names]

    def test_default_k_is_six(self):
        r = recommend(self.m, self.order("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp"), {"answers": {}})
        self.assertEqual(DEFAULT_K, 6)
        self.assertEqual(len(r["recommendations"]), 6)

    def test_scores_sorted_descending(self):
        r = recommend(self.m, self.order("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp"), {"answers": {}})
        s = [x["score"] for x in r["recommendations"]]
        self.assertEqual(s, sorted(s, reverse=True))

    def test_top_six_not_all_from_one_category(self):
        r = recommend(self.m, self.order("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp"), {"answers": {}})
        cats = {x["category"] for x in r["recommendations"]}
        self.assertGreater(len(cats), 1)

    def test_ordered_items_never_recommended(self):
        names = ("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp")
        r = recommend(self.m, self.order(*names), {"answers": {}})
        self.assertFalse({x["name"] for x in r["recommendations"]} & set(names))


if __name__ == "__main__":
    unittest.main()