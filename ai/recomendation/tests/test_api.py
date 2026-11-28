"""Kiểm thử API. Chạy từ thư mục gốc dự án:  python -m pytest tests -q"""
import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src" / "api"))
import main  # noqa: E402


def client():
    return TestClient(main.app)


def test_health_and_questions():
    with client() as c:
        h = c.get("/health").json()
        assert h["items"] == 237 and h["locked"] is True
        qs = c.get("/survey/questions").json()
        assert {q["id"] for q in qs} >= {"party_size", "companions", "wants_drinking", "table_members",
                                         "ingredients", "novelty"}


def test_recommend_from_order_only():
    with client() as c:
        ordered = [{"menu_item_id": "MENU-019", "quantity": 2}, {"menu_item_id": "MENU-025"}]
        r = c.post("/recommend", json={"ordered_items": ordered, "k": 5})
        assert r.status_code == 200
        body = r.json()
        ids = {x["menu_item_id"] for x in body["recommendations"]}
        assert len(ids) == 5 and not ids & {"MENU-019", "MENU-025"}
        assert body["profile"]["inferred"] and body["profile"]["inference_reliance"] == 1.0


def test_survey_avoid_is_respected():
    with client() as c:
        ordered = [{"menu_item_id": "MENU-019", "quantity": 2}, {"menu_item_id": "MENU-025"}]
        survey = {"party_size": 4, "answers": {"taste_spicy": False, "audience_possible_children": True}}
        body = c.post("/recommend", json={"ordered_items": ordered, "survey": survey}).json()
        spicy = {i for i, r in main.state["matrix"].rows.items() if r["taste_spicy"] == 1}
        assert body["recommendations"]
        assert not {x["menu_item_id"] for x in body["recommendations"]} & spicy
        assert body["profile"]["conflicts"] and body["profile"]["party_size"] == 4


def test_survey_only():
    with client() as c:
        r = c.post("/recommend", json={"survey": {"answers": {"taste_light": True}}})
        assert r.status_code == 200 and r.json()["recommendations"]


def test_validation():
    with client() as c:
        assert c.post("/recommend", json={}).status_code == 422
        assert c.post("/recommend", json={"ordered_items": [{"menu_item_id": "MENU-999"}]}).status_code == 404
        assert c.post("/recommend", json={"survey": {"answers": {"khong_co": True}}}).status_code == 422
        assert c.post("/recommend", json={"ordered_items": [{"menu_item_id": "MENU-019", "quantity": 0}]}).status_code == 422
        assert c.post("/recommend", json={"ordered_items": [{"menu_item_id": "MENU-019"}], "k": 0}).status_code == 422