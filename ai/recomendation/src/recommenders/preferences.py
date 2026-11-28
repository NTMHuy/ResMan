"""Suy luận sở thích của bàn ăn từ dữ liệu phiên ăn (chưa tính điểm gợi ý).

Các bước:
1. Đọc danh sách món đã gọi kèm số lượng từng món.
2. Tra thuộc tính của từng món trong ma trận đặc trưng (đã khóa).
3. Tổng hợp thành bộ sở thích của bàn: với mỗi thuộc tính, tính tỷ lệ phần ăn có
   thuộc tính đó, làm mượt về tỷ lệ trung bình của thực đơn khi bằng chứng còn ít.
4. Tách sở thích KHÁCH XÁC NHẬN (từ khảo sát) khỏi sở thích HỆ THỐNG SUY LUẬN.
5. Khi có khảo sát: câu trả lời của khách luôn thắng suy luận, và mức phụ thuộc vào
   suy luận (inference_reliance) giảm theo tỷ lệ sở thích đang dùng đến từ khảo sát.

Quy tắc thiết kế (đọc kỹ, đây là quyết định cần được xác nhận):
- Ô để trống trong ma trận = chưa biết, KHÔNG tính là 0.
- Chỉ suy luận các nhóm taste_, ingredient_, cooking_, meal_need_, meal_style_
  (trừ taste_other, cooking_other, ingredient_other_meat: nhóm "khác/chưa rõ").
  Nhóm audience_* (có trẻ em, ăn chay, ăn kiêng, thích cay) CHỈ nhận từ khảo sát:
  gọi món hợp trẻ em không chứng minh bàn có trẻ em.
- Suy luận chỉ cho ra sở thích dạng "có xu hướng chọn". Không gọi món không có
  nghĩa là không thích, nên "tránh X" chỉ đến từ khảo sát.
- Khi khảo sát nói "tránh X" mà bàn lại gọi nhiều món X, hệ thống ghi nhận mâu thuẫn
  (conflicts) và vẫn theo câu trả lời của khách.

Tham số khởi đầu (PARAMS) là giá trị tạm, cần hiệu chỉnh bằng dữ liệu thực:
- smoothing      : số "phần ăn ảo" kéo điểm về tỷ lệ trung bình của thực đơn.
- min_confidence : bằng chứng tối thiểu để một suy luận được xem là có hiệu lực.
- min_lift       : điểm phải cao hơn tỷ lệ trung bình của thực đơn ít nhất bấy nhiêu.

Định dạng đầu vào:
  phiên : [{"menu_item_id": "MENU-019", "quantity": 2}, ...]  (hoặc danh sách mã món)
  khảo sát: {"answers": {"taste_spicy": false, "audience_possible_children": true}}
            true = bàn muốn / cần thuộc tính này, false = bàn muốn tránh.

Chạy:
    python src/recommenders/preferences.py --session session.json [--survey survey.json] [--json]
"""
import argparse
import csv
import hashlib
import json
from collections import Counter
from pathlib import Path

DEFAULT_MATRIX = "data/processed/resman_menu_feature_matrix_v7.csv"
PREFIXES = ("taste_", "ingredient_", "cooking_", "meal_need_", "audience_", "meal_style_")
INFERABLE_PREFIXES = ("taste_", "ingredient_", "cooking_", "meal_need_", "meal_style_")
# các cột *_other giờ còn chứa cả món "chưa rõ", nên không dùng để suy luận sở thích
NOT_INFERABLE = {"taste_other", "cooking_other", "ingredient_other_meat"}
PARAMS = {"smoothing": 2.0, "min_confidence": 0.4, "min_lift": 0.15}
# Một món chỉ được tính tối đa chừng này phần khi suy luận sở thích, để một món gọi quá nhiều không áp đảo cả bàn.
MAX_PORTIONS_PER_DISH = 4

LABEL = {
    "taste_spicy": "vị cay", "taste_sour": "vị chua", "taste_sweet": "vị ngọt",
    "taste_fatty": "vị béo", "taste_light": "vị thanh nhẹ",
    "ingredient_seafood": "hải sản", "ingredient_beef": "bò", "ingredient_chicken": "gà",
    "ingredient_vegetable": "rau củ", "ingredient_pork": "heo",
    "ingredient_field_animal": "động vật đồng ruộng", "ingredient_other_meat": "thịt khác",
    "cooking_grilled": "nướng", "cooking_fried": "chiên", "cooking_steamed": "hấp",
    "cooking_boiled": "luộc",
    "meal_need_light": "bữa nhẹ", "meal_need_filling": "ăn no", "meal_need_side_dish": "món ăn kèm",
    "audience_possible_children": "phù hợp trẻ em", "audience_spicy_lovers": "người thích cay",
    "audience_vegetarian": "ăn chay", "audience_dieting": "ăn kiêng",
    "meal_style_drinking": "nhậu", "meal_style_family": "gia đình", "meal_style_friends": "bạn bè",
}


class MatrixLockError(Exception):
    pass


def label(attr):
    return LABEL.get(attr, attr)


def is_inferable(attr):
    return attr.startswith(INFERABLE_PREFIXES) and attr not in NOT_INFERABLE


class Matrix:
    """Ma trận đặc trưng món ăn. Nếu có file .lock.json thì kiểm tra mã băm."""

    def __init__(self, path=DEFAULT_MATRIX):
        path = Path(path)
        lock_path = path.with_suffix(".lock.json")
        self.locked = lock_path.exists()
        if self.locked:
            expected = json.loads(lock_path.read_text(encoding="utf-8"))["sha256"]
            if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
                raise MatrixLockError(
                    f"{path.name} đã bị sửa sau khi khóa. Kiểm tra lại rồi khóa lại bằng "
                    "validate_matrix.py --lock")
        with open(path, encoding="utf-8-sig", newline="") as f:
            raw = list(csv.DictReader(f))
        self.attrs = [c for c in raw[0] if c.startswith(PREFIXES)]
        self.rows = {}
        for r in raw:
            self.rows[r["menu_item_id"]] = {
                "name": r["name"],
                "category": r.get("category", ""),        # <-- DÒNG MỚI
                "availability_status": r.get("availability_status", "active"),
                **{a: (None if r[a] == "" else int(r[a])) for a in self.attrs},
            }
        # tỷ lệ trung bình của thực đơn, mỗi tên món tính một lần, bỏ ô chưa biết
        seen, unique = set(), []
        for mid, row in self.rows.items():
            key = " ".join(row["name"].lower().split())
            if key not in seen:
                seen.add(key)
                unique.append(row)
        self.base_rate = {}
        for a in self.attrs:
            known = [r[a] for r in unique if r[a] is not None]
            self.base_rate[a] = sum(known) / len(known) if known else 0.0


def normalize_session(session):
    counts = Counter()
    for entry in session:
        if isinstance(entry, str):
            mid, qty = entry, 1
        else:
            mid, qty = str(entry["menu_item_id"]), entry.get("quantity", 1)
        if isinstance(qty, bool) or not isinstance(qty, (int, float)) or qty <= 0:
            raise ValueError(f"Số lượng không hợp lệ cho {mid}: {qty!r}")
        counts[mid] += qty
        # giới hạn sau khi cộng dồn: gọi món đó ở nhiều lần vẫn chỉ tính tối đa MAX_PORTIONS_PER_DISH phần
    return Counter({mid: min(q, MAX_PORTIONS_PER_DISH) for mid, q in counts.items()})
    


def normalize_survey(survey, matrix):
    if not survey:
        return {}
    if isinstance(survey, dict) and "answers" in survey:
        answers = survey["answers"]
    else:  # party_size (số người) được ghi nhận nhưng chưa dùng để suy luận
        answers = {k: v for k, v in (survey or {}).items() if k != "party_size"}
    out = {}
    for attr, value in answers.items():
        if attr not in matrix.attrs:
            raise ValueError(f"Khảo sát có thuộc tính không tồn tại trong ma trận: {attr}")
        if not isinstance(value, bool):
            raise ValueError(f"Câu trả lời cho {attr} phải là true hoặc false, nhận được {value!r}")
        out[attr] = value
    return out


def infer_preferences(matrix, session, survey=None, params=None):
    p = {**PARAMS, **(params or {})}
    counts = normalize_session(session)
    unknown = [m for m in counts if m not in matrix.rows]
    ordered = {m: q for m, q in counts.items() if m in matrix.rows}
    confirmed = normalize_survey(survey, matrix)

    details = {}
    for attr in matrix.attrs:
        if not is_inferable(attr):
            continue
        known = sum(q for m, q in ordered.items() if matrix.rows[m][attr] is not None)
        positive = sum(q for m, q in ordered.items() if matrix.rows[m][attr] == 1)
        base = matrix.base_rate[attr]
        score = (positive + p["smoothing"] * base) / (known + p["smoothing"])
        confidence = known / (known + p["smoothing"])
        details[attr] = {
            "score": round(score, 4),
            "base_rate": round(base, 4),
            "confidence": round(confidence, 4),
            "portions_with_attribute": positive,
            "portions_known": known,
            "active": bool(confidence >= p["min_confidence"] and score - base >= p["min_lift"]),
        }

    def evidence(attr):
        d = details[attr]
        return (f"{d['portions_with_attribute']:g}/{d['portions_known']:g} phần đã gọi có "
                f"'{label(attr)}' (thực đơn: {d['base_rate']:.0%})")

    inferred = {a: {**d, "evidence": evidence(a)} for a, d in details.items()
                if d["active"] and a not in confirmed}
    conflicts = [
        {"attribute": a, "confirmed": False, "evidence": evidence(a),
         "note": f"Khách chọn tránh '{label(a)}' nhưng bàn đang gọi nhiều món này; theo câu trả lời của khách"}
        for a, v in confirmed.items() if v is False and a in details and details[a]["active"]
    ]
    active_total = len(confirmed) + len(inferred)
    return {
        "session": {
            "distinct_items": len(ordered),
            "total_portions": sum(ordered.values()),
            "unknown_item_ids": unknown,
        },
        "survey_answered": bool(confirmed),
        "confirmed": confirmed,
        "inferred": inferred,
        "conflicts": conflicts,
        "inference_reliance": round(len(inferred) / active_total, 4) if active_total else None,
        "details": details,
        "params": p,
    }


def format_report(result):
    s = result["session"]
    lines = [f"Phiên: {s['distinct_items']} món, {s['total_portions']:g} phần"]
    if s["unknown_item_ids"]:
        lines.append(f"  Bỏ qua mã không có trong ma trận: {', '.join(s['unknown_item_ids'])}")
    lines.append(f"Khảo sát: {'đã trả lời' if result['survey_answered'] else 'chưa có'}")
    lines.append("\nSở thích KHÁCH XÁC NHẬN:")
    if result["confirmed"]:
        for a, v in result["confirmed"].items():
            lines.append(f"  {'CÓ  ' if v else 'TRÁNH'}  {label(a)}")
    else:
        lines.append("  (không có)")
    lines.append("\nSở thích HỆ THỐNG SUY LUẬN:")
    if result["inferred"]:
        for a, d in sorted(result["inferred"].items(), key=lambda x: -x[1]["score"]):
            lines.append(f"  {d['score']:.2f} (tin cậy {d['confidence']:.2f})  {label(a)}: {d['evidence']}")
    else:
        lines.append("  (chưa đủ bằng chứng)")
    for c in result["conflicts"]:
        lines.append(f"\nMÂU THUẪN: {c['note']} [{c['evidence']}]")
    rel = result["inference_reliance"]
    lines.append("\nMức phụ thuộc vào suy luận: " + ("không có sở thích nào" if rel is None else f"{rel:.0%}"))
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--matrix", default=DEFAULT_MATRIX)
    parser.add_argument("--session", required=True, help="file JSON danh sách món đã gọi")
    parser.add_argument("--survey", help="file JSON câu trả lời khảo sát (không bắt buộc)")
    parser.add_argument("--json", action="store_true", help="in kết quả dạng JSON")
    args = parser.parse_args()

    matrix = Matrix(args.matrix)
    session = json.loads(Path(args.session).read_text(encoding="utf-8"))
    survey = json.loads(Path(args.survey).read_text(encoding="utf-8")) if args.survey else None
    result = infer_preferences(matrix, session, survey)
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(format_report(result))


if __name__ == "__main__":
    main()