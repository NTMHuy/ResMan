"""Quy tắc số người, câu hỏi thêm khi đông người, và chế độ món mới lạ (đặt cạnh tests/test_api.py)."""
import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
sys.path.insert(0, str(ROOT / "src" / "api"))
from preferences import Matrix  # noqa: E402
from scoring import recommend  # noqa: E402
from survey import resolve_survey  # noqa: E402
import main  # noqa: E402

MATRIX = ROOT / "data/processed/resman_menu_feature_matrix_v7.csv"


class PartyRules(unittest.TestCase):
    def test_groups_and_default_k(self):
        for size, group, k in [(1, "normal", 6), (3, "normal", 6), (4, "family", 6),
                               (6, "family", 6), (7, "crowd", 10), (12, "crowd", 10)]:
            r = resolve_survey({"party_size": size})
            self.assertEqual((r["party_group"], r["default_k"]), (group, k), size)

    def test_labels_by_party_size(self):
        self.assertEqual(resolve_survey({"party_size": 3})["answers"], {})
        self.assertEqual(resolve_survey({"party_size": 6})["answers"], {"meal_style_family": True})
        self.assertEqual(resolve_survey({"party_size": 7})["answers"], {"meal_need_filling": True})

    def test_companions_and_drinking(self):
        a = resolve_survey({"party_size": 8, "companions": "friends", "wants_drinking": True})["answers"]
        self.assertEqual(a, {"meal_need_filling": True, "meal_style_friends": True, "meal_style_drinking": True})
        self.assertEqual(resolve_survey({"party_size": 8, "companions": "family"})["answers"],
                         {"meal_need_filling": True, "meal_style_family": True})

    def test_no_drinking_adds_nothing_and_never_avoids(self):
        a = resolve_survey({"party_size": 8, "wants_drinking": False})["answers"]
        self.assertEqual(a, {"meal_need_filling": True})

    def test_explicit_answer_wins(self):
        a = resolve_survey({"party_size": 5, "answers": {"meal_style_family": False}})["answers"]
        self.assertEqual(a, {"meal_style_family": False})

    def test_validation(self):
        for bad in ({"party_size": 0}, {"party_size": "4"}, {"party_size": True}, {"companions": "co-workers"},
                    {"wants_drinking": "yes"}, {"wants_novelty": 1}):
            with self.assertRaises(ValueError, msg=bad):
                resolve_survey(bad)


class OnRealMatrix(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = Matrix(MATRIX)
        ids = {r["name"]: i for i, r in cls.m.rows.items()}
        cls.order = [{"menu_item_id": ids[n], "quantity": 1}
                     for n in ("Tôm hấp", "Cá chim hấp xì dầu", "Mực ống hấp")]

    def test_k_follows_party_size(self):
        self.assertEqual(len(recommend(self.m, self.order, {"party_size": 3})["recommendations"]), 6)
        self.assertEqual(len(recommend(self.m, self.order, {"party_size": 8})["recommendations"]), 10)

    def test_explicit_k_overrides(self):
        self.assertEqual(len(recommend(self.m, self.order, {"party_size": 8}, 4)["recommendations"]), 4)

    def test_crowd_prefers_filling_dishes(self):
        r = recommend(self.m, self.order, {"party_size": 8}, 10)
        ids = [x["menu_item_id"] for x in r["recommendations"]]
        self.assertTrue(all(any("ăn no" in why for why in x["reasons"]) for x in r["recommendations"][:3]), ids)

    def test_novelty_dishes_bring_something_new(self):
        r = recommend(self.m, self.order, {"wants_novelty": True}, 10)
        self.assertTrue(r["novelty_applied"])
        ing = [a for a in self.m.attrs if a.startswith("ingredient_") and a != "ingredient_other_meat"]
        cook = [a for a in self.m.attrs if a.startswith("cooking_") and a != "cooking_other"]
        seen_ing = {a for a in ing if any(self.m.rows[o["menu_item_id"]][a] == 1 for o in self.order)}
        seen_cook = {a for a in cook if any(self.m.rows[o["menu_item_id"]][a] == 1 for o in self.order)}
        for x in r["recommendations"]:
            row = self.m.rows[x["menu_item_id"]]
            new_ing = any(row[a] == 1 for a in ing if a not in seen_ing)
            new_cook = any(row[a] == 1 for a in cook if a not in seen_cook)
            self.assertTrue(new_ing or new_cook, x["name"])

    def test_novelty_drops_inferred_ingredient_and_cooking_labels(self):
        plain = recommend(self.m, self.order, {}, 6)
        nov = recommend(self.m, self.order, {"wants_novelty": True}, 6)
        inferred_ic = [a for a in plain["profile"] if a.startswith(("ingredient_", "cooking_"))]
        self.assertTrue(inferred_ic)
        self.assertFalse([a for a in nov["profile"] if a.startswith(("ingredient_", "cooking_"))])

    def test_novelty_keeps_confirmed_ingredient(self):
        r = recommend(self.m, self.order, {"wants_novelty": True, "answers": {"ingredient_beef": True}}, 6)
        self.assertIn("ingredient_beef", r["profile"])

    def test_novelty_ignored_without_order(self):
        r = recommend(self.m, [], {"wants_novelty": True, "answers": {"taste_light": True}}, 6)
        self.assertFalse(r["novelty_applied"])
        self.assertTrue(r["note"])
        self.assertTrue(r["recommendations"])


class ApiRules(unittest.TestCase):
    def test_party_size_8_returns_10_and_group(self):
        with TestClient(main.app) as c:
            body = c.post("/recommend", json={"ordered_items": [{"menu_item_id": "MENU-019"}],
                                              "survey": {"party_size": 8, "companions": "friends",
                                                         "wants_drinking": True}}).json()
            self.assertEqual(len(body["recommendations"]), 10)
            self.assertEqual(body["profile"]["party_group"], "crowd")
            self.assertEqual(body["profile"]["k"], 10)

    def test_invalid_companions_is_422(self):
        with TestClient(main.app) as c:
            r = c.post("/recommend", json={"survey": {"companions": "co-workers"}})
            self.assertEqual(r.status_code, 422)

    def test_party_size_only_without_order_is_422_when_no_label(self):
        with TestClient(main.app) as c:
            self.assertEqual(c.post("/recommend", json={"survey": {"party_size": 2}}).status_code, 422)
            self.assertEqual(c.post("/recommend", json={"survey": {"party_size": 5}}).status_code, 200)


if __name__ == "__main__":
    unittest.main()