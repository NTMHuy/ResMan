"""Chấm điểm toàn bộ menu theo hồ sơ sở thích của bàn rồi lấy các món điểm cao nhất.

Quy trình:
1. preferences.infer_preferences cho ra sở thích khách xác nhận (khảo sát) và sở thích suy luận.
2. Mỗi nhãn trong hồ sơ có một HỆ SỐ:
   - nhãn khách xác nhận "muốn": 1.0 (cao nhất)
   - nhãn hệ thống suy luận: bằng điểm suy luận (tỷ lệ phần ăn có nhãn đó, đã làm mượt),
     nên nhãn xuất hiện càng nhiều trong món đã gọi thì hệ số càng cao
3. Điểm một món = tổng hệ số của các nhãn món đó có / tổng hệ số của cả hồ sơ, nhân 100.
   (100 = món có đủ mọi nhãn bàn cần; không có ngưỡng cắt, chỉ xếp hạng.)
   Lấy k món điểm cao nhất (k=None: 6 món, hoặc 10 món khi bàn từ 7 người). Khi nhiều món CÙNG ĐIỂM thì phá hòa theo thứ tự:
     (1) món khớp nhiều nhãn hơn xếp trước;
     (2) vẫn hòa: ưu tiên món thuộc nhóm món (category) CHƯA có trong các món bàn đã gọi,
         rồi xen kẽ giữa các nhóm để k món không dồn vào một nhóm;
     (3) cuối cùng mới theo mã món, để kết quả luôn ổn định giữa các lần chạy.
   Đa dạng nhóm món chỉ dùng để phá hòa, không bao giờ làm món điểm thấp hơn vượt món điểm cao hơn.
4. Loại trước khi xếp hạng:
   - món đã gọi, món trùng tên với món đã gọi hoặc với món cùng tên đứng trước;
   - món availability_status khác "active";
   - món có nhãn mà khách xác nhận là TRÁNH;
   - nếu khách ăn chay (audience_vegetarian = true): món không đánh dấu ăn chay;
   - món có điểm 0.
5. Mỗi món trả về kèm lý do (các nhãn khớp).

Giả định cần xác nhận: câu trả lời "có trẻ em / ăn kiêng" chỉ cộng điểm cho món có nhãn
audience_possible_children / audience_dieting; chưa tự loại món cay khi có trẻ em.
party_size (số người) được ghi nhận nhưng CHƯA dùng, vì chưa có quy tắc quy đổi sang nhãn.

Chạy:
    python src/recommenders/scoring.py --session session.json [--survey survey.json] [--k 6]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from preferences import DEFAULT_MATRIX, Matrix, infer_preferences, label, normalize_session
from survey import resolve_survey

CONFIRMED_WEIGHT = 1.0
DEFAULT_K = 6
AUDIENCE_PREFIX = "audience_"
# nhãn "khác/chưa rõ" không mang nghĩa nguyên liệu/cách chế biến cụ thể nên không tính là "mới lạ"
NOVELTY_EXCLUDED = {"ingredient_other_meat", "cooking_other"}
NOVELTY_WEIGHT = 1.0
NOVELTY_LABELS = {"novel_ingredient": "nguyên liệu mới", "novel_cooking": "cách chế biến mới"}


def build_profile(prefs):
    """Hồ sơ cuối cùng: nhãn muốn (kèm hệ số), nhãn tránh, có ăn chay không.

    Với nhãn khẩu vị / nguyên liệu / chế biến..., trả lời false nghĩa là "khách muốn TRÁNH món có nhãn này".
    Với nhóm audience_* (trẻ em, ăn kiêng, ăn chay, thích cay) thì false chỉ nghĩa là "bàn KHÔNG thuộc nhóm
    này": nó không được loại món nào. Ví dụ "không có trẻ em" không có nghĩa là bỏ các món hợp trẻ em.
    """
    want = {a: CONFIRMED_WEIGHT for a, v in prefs["confirmed"].items() if v is True}
    avoid = {a for a, v in prefs["confirmed"].items()
             if v is False and not a.startswith(AUDIENCE_PREFIX)}
    for a, d in prefs["inferred"].items():
        if a not in avoid:
            want[a] = d["score"]
    return want, avoid, prefs["confirmed"].get("audience_vegetarian") is True

def _round_robin(buckets, order):
    out = []
    while any(buckets[c] for c in order):
        for c in order:
            if buckets[c]:
                out.append(buckets[c].pop(0))
    return out


def _diversify(group, ordered_categories):
    """Sắp lại một nhóm món CÙNG ĐIỂM, CÙNG SỐ NHÃN KHỚP: xen kẽ giữa các nhóm món CHƯA gọi
    cho đến hết, rồi mới đến các nhóm món bàn đã gọi (cũng xen kẽ)."""
    buckets = {}
    for item in group:                       # group đã xếp theo mã món nên giữ ổn định
        buckets.setdefault(item["category"], []).append(item)
    fresh = [c for c in buckets if c not in ordered_categories]
    used = [c for c in buckets if c in ordered_categories]
    return _round_robin(buckets, fresh) + _round_robin(buckets, used)


def rank(scored, ordered_categories, k):
    """Xếp hạng: điểm giảm dần -> nhiều nhãn khớp hơn -> đa dạng nhóm món -> mã món."""
    scored = sorted(scored, key=lambda x: (-x["score"], -x["matched_count"], x["menu_item_id"]))
    out, i = [], 0
    while i < len(scored) and len(out) < k:
        key = (scored[i]["score"], scored[i]["matched_count"])
        j = i
        while j < len(scored) and (scored[j]["score"], scored[j]["matched_count"]) == key:
            j += 1
        out.extend(_diversify(scored[i:j], ordered_categories))
        i = j
    return out[:k]


def _group_attrs(matrix, prefix):
    return [a for a in matrix.attrs if a.startswith(prefix) and a not in NOVELTY_EXCLUDED]


def recommend(matrix, session, survey=None, k=None, params=None):
    """k=None: lấy theo số người của bàn (6 món, hoặc 10 món từ 7 người), không có số người thì 6."""
    rs = resolve_survey(survey)
    k = k or rs["default_k"]
    prefs = infer_preferences(matrix, session, {"answers": rs["answers"]}, params)
    want, avoid, vegetarian = build_profile(prefs)
    ordered = set(normalize_session(session))
    ordered = {m for m in ordered if m in matrix.rows} | (ordered - set(matrix.rows))

    # Chế độ "món mới lạ": bỏ nhãn nguyên liệu/cách chế biến suy luận từ món đã gọi, rồi cộng điểm
    # cho món có nguyên liệu/cách chế biến mà các món đã gọi chưa có. Nhãn khách chọn vẫn giữ.
    ing_attrs, cook_attrs = _group_attrs(matrix, "ingredient_"), _group_attrs(matrix, "cooking_")
    novelty = rs["wants_novelty"] and any(m in matrix.rows for m in ordered)
    if novelty:
        for a in [a for a in want if a in prefs["inferred"] and a.startswith(("ingredient_", "cooking_"))]:
            del want[a]
        seen_ing = {a for a in ing_attrs if any(matrix.rows[m][a] == 1 for m in ordered if m in matrix.rows)}
        seen_cook = {a for a in cook_attrs if any(matrix.rows[m][a] == 1 for m in ordered if m in matrix.rows)}
        want["novel_ingredient"] = NOVELTY_WEIGHT
        want["novel_cooking"] = NOVELTY_WEIGHT
    ordered_categories = {matrix.rows[m]["category"] for m in ordered if m in matrix.rows}
    ordered_names = {" ".join(matrix.rows[m]["name"].lower().split()) for m in ordered if m in matrix.rows}
    total = sum(want.values())

    result = {"preferences": prefs, "profile": want, "avoid": sorted(avoid), "recommendations": [], "note": None,
              "k": k, "party_group": rs["party_group"], "novelty_applied": novelty}
    if rs["wants_novelty"] and not novelty:
        result["note"] = "Khách muốn thử món mới nhưng chưa gọi món nào nên chưa biết món nào là mới; bỏ qua yêu cầu này."
    if not want:
        result["note"] = "Chưa đủ thông tin (không có khảo sát và món đã gọi chưa cho ra sở thích rõ) nên chưa gợi ý."
        return result


    scored, seen = [], set()
    for mid, row in matrix.rows.items():
        key = " ".join(row["name"].lower().split())
        if mid in ordered or key in ordered_names or key in seen:
            continue
        seen.add(key)
        if row["availability_status"] != "active":
            continue
        if any(row[a] == 1 for a in avoid):
            continue
        if vegetarian and row["audience_vegetarian"] != 1:
            continue
        matched = {a: w for a, w in want.items() if a in row and row[a] == 1}
        if novelty:
            if any(row[a] == 1 for a in ing_attrs if a not in seen_ing):
                matched["novel_ingredient"] = NOVELTY_WEIGHT
            if any(row[a] == 1 for a in cook_attrs if a not in seen_cook):
                matched["novel_cooking"] = NOVELTY_WEIGHT
        if not matched:
            continue
        scored.append({
            "menu_item_id": mid,
            "name": row["name"],
            "score": round(100 * sum(matched.values()) / total, 1),
            "matched_count": len(matched),
            "category": row["category"],
            "reasons": [_reason(a, prefs) for a in sorted(matched, key=lambda x: -matched[x])],
        })
    result["recommendations"] = rank(scored, ordered_categories, k)
    if vegetarian and not scored:
        result["note"] = "Khách ăn chay nhưng ma trận chưa có món nào đánh dấu ăn chay."
    return result


def _reason(attr, prefs):
    if attr in NOVELTY_LABELS:
        return NOVELTY_LABELS[attr] + " (khách muốn thử món mới)"
    return label(attr) + (" (khách chọn)" if attr in prefs["confirmed"] else " (suy luận)")


def format_report(result):
    lines = ["Nhãn bàn cần (hệ số): " + (", ".join(f"{NOVELTY_LABELS.get(a) or label(a)} {w:.2f}" for a, w in
             sorted(result["profile"].items(), key=lambda x: -x[1])) or "(chưa có)")]
    if result["avoid"]:
        lines.append("Tránh: " + ", ".join(label(a) for a in result["avoid"]))
    if result["note"]:
        lines.append(result["note"])
    lines.append("\nGợi ý:")
    for i, r in enumerate(result["recommendations"], 1):
        lines.append(f"  {i}. {r['name']} [{r['menu_item_id']}]  {r['score']:.1f}/100  - {'; '.join(r['reasons'])}")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--matrix", default=DEFAULT_MATRIX)
    ap.add_argument("--session", required=True)
    ap.add_argument("--survey")
    ap.add_argument("--k", type=int, default=None, help="số món gợi ý; bỏ trống = theo số người (6 hoặc 10)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    matrix = Matrix(args.matrix)
    session = json.loads(Path(args.session).read_text(encoding="utf-8"))
    survey = json.loads(Path(args.survey).read_text(encoding="utf-8")) if args.survey else None
    result = recommend(matrix, session, survey, args.k)
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else format_report(result))


if __name__ == "__main__":
    main()