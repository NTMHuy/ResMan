"""Đánh giá bộ chấm điểm gợi ý bằng các tình huống (bàn) mẫu do bạn tự đặt.

Bước 1 - tạo file mẫu (chỉ chạy một lần, không ghi đè nếu file đã có):
    python src/evaluation/eval_scoring.py --make-template

Bước 2 - mở data/eval/scenarios.csv, điền cột `relevant_ids`: các món bạn cho là NÊN được
gợi ý cho bàn đó (cách nhau bằng dấu ;). Điền ít nhất 8-10 tình huống. Có thể sửa/thêm dòng.
  ordered : món đã gọi, dạng MENU-019:2;MENU-025:1 (số lượng sau dấu :, bỏ trống = 1)
  survey  : câu trả lời, dạng taste_spicy=0;audience_possible_children=1;party_size=4
            (1 = muốn/cần, 0 = tránh). Thêm được: companions=friends|family;
            wants_drinking=1;wants_novelty=1

Bước 3 - chạy đánh giá:
    python src/evaluation/eval_scoring.py [--k 6] [--verbose]   (không có --k: 6 món, hoặc 10 món khi từ 7 người)

Kết quả:
- Precision@k, Hit@k (có ít nhất một món đúng trong top-k) - chỉ tính trên dòng đã điền;
- Kiểm tra ràng buộc cho MỌI dòng: không gợi ý món đã gọi, không gợi ý món có nhãn khách tránh.
"""
import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src" / "recommenders"))
from preferences import DEFAULT_MATRIX, Matrix  # noqa: E402
from scoring import recommend  # noqa: E402

PATH = ROOT / "data/eval/scenarios.csv"
SEEDS = [
    ("S01", "Bàn gọi hai món bò cay, chưa có khảo sát", "MENU-019:2;MENU-025:1", ""),
    ("S02", "Cùng phiên S01 nhưng khách có trẻ em và tránh cay", "MENU-019:2;MENU-025:1",
     "audience_possible_children=1;taste_spicy=0;party_size=4"),
    ("S03", "Chỉ có khảo sát: thích chua, thanh nhẹ, đang ăn kiêng", "",
     "taste_sour=1;taste_light=1;audience_dieting=1;party_size=2"),
    ("S04", "Bàn gọi lẩu cua đồng và cháo bò", "MENU-158:1;MENU-161:1", ""),
    ("S05", "Bàn gọi tôm nướng và ghẹ rang me", "MENU-132:1;MENU-064:1", ""),
    ("S06", "Bàn gọi ốc xào sả, khách tránh vị béo", "MENU-101:2", "taste_fatty=0"),
    ("S07", "Khách ăn chay (chưa gọi món)", "", "audience_vegetarian=1"),
    ("S08", "Bàn gọi cá chình nướng nghệ và mực lá nướng sate", "MENU-003:1;MENU-124:1", ""),
]
HEADER = ["scenario_id", "description", "ordered", "survey", "relevant_ids"]


def parse_ordered(text):
    out = []
    for part in filter(None, (p.strip() for p in text.split(";"))):
        mid, _, qty = part.partition(":")
        out.append({"menu_item_id": mid.strip(), "quantity": float(qty) if qty.strip() else 1})
    return out


def parse_survey(text):
    answers, extra = {}, {}
    for part in filter(None, (p.strip() for p in text.split(";"))):
        key, _, val = part.partition("=")
        key, val = key.strip(), val.strip()
        if key == "party_size":
            extra["party_size"] = int(val)
        elif key == "companions":
            extra["companions"] = val
        elif key in ("wants_drinking", "wants_novelty"):
            extra[key] = val == "1"
        elif val in ("0", "1"):
            answers[key] = val == "1"
        else:
            raise ValueError(f"survey sai ở '{part}': giá trị phải là 0 hoặc 1")
    return {"answers": answers, **extra}


def make_template():
    if PATH.exists():
        sys.exit(f"{PATH} đã tồn tại, không ghi đè.")
    PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(PATH, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(HEADER)
        for sid, desc, ordered, survey in SEEDS:
            w.writerow([sid, desc, ordered, survey, ""])
    print(f"Đã tạo {PATH}: {len(SEEDS)} tình huống. Hãy điền cột relevant_ids rồi chạy lại không kèm --make-template.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--make-template", action="store_true")
    ap.add_argument("--matrix", default=str(ROOT / DEFAULT_MATRIX))
    ap.add_argument("--k", type=int, default=None, help="bỏ trống: theo số người (6 hoặc 10 món)")
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--file", default=str(PATH))
    args = ap.parse_args()
    if args.make_template:
        return make_template()

    matrix = Matrix(args.matrix)
    with open(args.file, encoding="utf-8-sig", newline="") as f:
        scenarios = list(csv.DictReader(f))
    prec, hits, violations, skipped = [], [], [], []
    for sc in scenarios:
        ordered = parse_ordered(sc["ordered"])
        survey = parse_survey(sc["survey"])
        res = recommend(matrix, ordered, survey, args.k)
        recs = res["recommendations"]
        ids = [r["menu_item_id"] for r in recs]
        ordered_ids = {o["menu_item_id"] for o in ordered}
        bad = [i for i in ids if i in ordered_ids or any(matrix.rows[i][a] == 1 for a in res["avoid"])]
        if bad:
            violations.append((sc["scenario_id"], bad))
        relevant = {x.strip() for x in sc["relevant_ids"].split(";") if x.strip()}
        # món cùng tên với món đúng cũng được tính đúng (menu có nhiều bản trùng tên)
        names = {" ".join(matrix.rows[i]["name"].lower().split()) for i in relevant if i in matrix.rows}
        good = [i for i in ids if i in relevant or " ".join(matrix.rows[i]["name"].lower().split()) in names]
        if relevant:
            prec.append(len(good) / max(len(ids), 1))
            hits.append(1 if good else 0)
        else:
            skipped.append(sc["scenario_id"])
        if args.verbose or not relevant:
            print(f"\n[{sc['scenario_id']}] {sc['description']}" + ("" if relevant else "   (chưa điền relevant_ids)"))
            for r in recs:
                mark = "  ✓" if r["menu_item_id"] in good else "   "
                print(f"{mark} {r['name']} [{r['menu_item_id']}] {r['score']:.1f} - {'; '.join(r['reasons'])}")
            if res["note"]:
                print("   ghi chú:", res["note"])

    kname = args.k or "theo số người"
    print(f"\n== Kết quả (k={kname}) ==")
    if prec:
        print(f"Số tình huống đã điền: {len(prec)}/{len(scenarios)}")
        print(f"Precision@k: {sum(prec) / len(prec):.3f}")
        print(f"Hit@k: {sum(hits) / len(hits):.3f}")
    else:
        print("Chưa có tình huống nào được điền relevant_ids, chưa tính được Precision/Hit.")
    if skipped:
        print(f"Chưa điền: {', '.join(skipped)}")
    print("Vi phạm ràng buộc: " + ("không có" if not violations else f"{violations}"))


if __name__ == "__main__":
    main()