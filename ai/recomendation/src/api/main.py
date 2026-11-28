"""API cho AI Recommendation Service. NestJS (ResMan) gọi qua HTTP.

Chạy:
    python src/api/main.py                      (http://127.0.0.1:8000)
    Tài liệu tương tác tự sinh: http://127.0.0.1:8000/docs

Endpoint:
    GET  /health
    GET  /survey/questions     bộ câu hỏi hỏi khách (frontend dùng để hiển thị)
    POST /recommend            gợi ý theo món đã gọi + khảo sát (nếu có)

Body của POST /recommend:
    {
      "ordered_items": [{"menu_item_id": "MENU-019", "quantity": 2}],
      "survey": {"party_size": 8, "companions": "friends", "wants_drinking": true,
                 "wants_novelty": false,
                 "answers": {"audience_possible_children": true, "ingredient_beef": true}},
      "k": 6
    }
    - ordered_items có thể rỗng nếu đã có khảo sát; cả hai cùng rỗng thì trả 422.
    - answers: true = khách muốn/cần (khóa là tên cột trong ma trận). false = khách muốn tránh
      (riêng audience_* thì false chỉ nghĩa là bàn không thuộc nhóm đó, không loại món nào).
    - k bỏ trống: 6 món, hoặc 10 món khi party_size từ 7 trở lên. Quy tắc số người xem survey.py.

Ma trận đặc trưng nạp từ MATRIX_PATH (mặc định data/processed/resman_menu_feature_matrix_v7.csv).
Nếu có file .lock.json kèm theo mà ma trận bị sửa, service từ chối khởi động.
"""
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, List, Literal, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
from preferences import Matrix, label  # noqa: E402
from scoring import recommend  # noqa: E402
from survey import resolve_survey  # noqa: E402

MATRIX_PATH = Path(os.environ.get("MATRIX_PATH", ROOT / "data/processed/resman_menu_feature_matrix_v7.csv"))
state = {}

# Bộ câu hỏi khảo sát (backend thu thập, frontend hiển thị theo danh sách này).
# - field: trường ở cấp survey (party_size, companions, wants_drinking, wants_novelty).
# - attribute: khóa gửi trong survey.answers; khách chọn đáp án nào thì gửi attribute đó = true.
# - show_if: chỉ hỏi khi điều kiện đúng.
SURVEY_QUESTIONS = [
    {"id": "party_size", "text": "Số lượng người của bàn bạn là bao nhiêu?", "kind": "number", "field": "party_size"},
    {"id": "companions", "text": "Hôm nay bạn đi cùng ai?", "kind": "single", "field": "companions",
     "show_if": {"party_size_min": 7},
     "options": [{"value": "family", "text": "Gia đình"}, {"value": "friends", "text": "Bạn bè / đồng nghiệp"}]},
    {"id": "wants_drinking", "text": "Hôm nay các bạn có muốn say không?", "kind": "yes_no", "field": "wants_drinking",
     "show_if": {"party_size_min": 7}},
    {"id": "table_members", "text": "Bàn của bạn có người ăn chay hoặc trẻ em không?", "kind": "multi",
     "options": [{"attribute": "audience_possible_children", "text": "Có trẻ em"},
                 {"attribute": "audience_vegetarian", "text": "Có người ăn chay"}],
     "none_option": "Không có"},
    {"id": "ingredients", "text": "Bạn thích những loại nguyên liệu nào?", "kind": "multi",
     "options": [{"attribute": "ingredient_seafood", "text": "Hải sản"},
                 {"attribute": "ingredient_beef", "text": "Bò"},
                 {"attribute": "ingredient_chicken", "text": "Gà"},
                 {"attribute": "ingredient_pork", "text": "Heo"},
                 {"attribute": "ingredient_vegetable", "text": "Rau củ"},
                 {"attribute": "ingredient_field_animal", "text": "Động vật đồng ruộng (ếch, lươn, cua đồng...)"},
                 {"attribute": "ingredient_other_meat", "text": "Khác (thỏ, dê, vịt, đậu hũ, trứng...)"}]},
    {"id": "novelty", "text": "Bạn có muốn thử các món mới lạ của quán không?", "kind": "yes_no",
     "field": "wants_novelty"},
]


@asynccontextmanager
async def lifespan(app):
    state["matrix"] = Matrix(MATRIX_PATH)
    yield


app = FastAPI(title="AI Food Recommendation", version="2.0", lifespan=lifespan)


class OrderedItem(BaseModel):
    menu_item_id: str
    quantity: float = Field(1, gt=0)


class Survey(BaseModel):
    party_size: Optional[int] = Field(None, ge=1)
    companions: Optional[Literal["family", "friends"]] = None
    wants_drinking: Optional[bool] = None
    wants_novelty: bool = False
    answers: Dict[str, bool] = {}


class RecommendRequest(BaseModel):
    ordered_items: List[OrderedItem] = []
    survey: Optional[Survey] = None
    k: Optional[int] = Field(None, ge=1, le=20, description="Bỏ trống: 6 món, hoặc 10 món khi từ 7 người")


@app.get("/health")
def health():
    m = state["matrix"]
    return {"status": "ok", "items": len(m.rows), "matrix": MATRIX_PATH.name, "locked": m.locked}


@app.get("/survey/questions")
def survey_questions():
    return SURVEY_QUESTIONS


@app.post("/recommend")
def recommend_endpoint(body: RecommendRequest):
    m = state["matrix"]
    survey = body.survey.model_dump() if body.survey else {}
    answers = resolve_survey(survey)["answers"]
    if not body.ordered_items and not answers:
        raise HTTPException(status_code=422, detail="Cần ít nhất một món đã gọi hoặc một câu trả lời khảo sát")
    unknown = [i.menu_item_id for i in body.ordered_items if i.menu_item_id not in m.rows]
    if unknown:
        raise HTTPException(status_code=404, detail=f"Không có trong menu: {', '.join(unknown)}")
    bad = [a for a in survey.get("answers", {}) if a not in m.attrs]
    if bad:
        raise HTTPException(status_code=422, detail=f"Thuộc tính khảo sát không hợp lệ: {', '.join(bad)}")

    session = [i.model_dump() for i in body.ordered_items]
    result = recommend(m, session, survey, body.k)
    prefs = result["preferences"]
    return {
        "recommendations": result["recommendations"],
        "note": result["note"],
        "profile": {
            "party_size": survey.get("party_size"),
            "party_group": result["party_group"],
            "k": result["k"],
            "novelty_applied": result["novelty_applied"],
            "confirmed": [{"attribute": a, "label": label(a), "wanted": v}
                          for a, v in prefs["confirmed"].items()],
            "inferred": [{"attribute": a, "label": label(a), "score": d["score"], "evidence": d["evidence"]}
                         for a, d in sorted(prefs["inferred"].items(), key=lambda x: -x[1]["score"])],
            "conflicts": prefs["conflicts"],
            "inference_reliance": prefs["inference_reliance"],
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.environ.get("HOST", "127.0.0.1"), port=int(os.environ.get("PORT", 8000)))