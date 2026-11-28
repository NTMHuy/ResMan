"""Chuẩn hóa ma trận đặc trưng: v6 -> v7.

Quy tắc (theo yêu cầu):
- bỏ cột label_review (các câu hỏi bếp được lưu sang file riêng, không mất);
- mọi ô đặc trưng chỉ là 0 hoặc 1: ô trống được đặt = 0;
- món không có cờ nào trong nhóm taste_  -> taste_other = 1;
- món không có cờ nào trong nhóm ingredient_ -> ingredient_other_meat = 1;
- món không có cờ nào trong nhóm cooking_ -> cooking_other = 1.

Không đoán thêm giá trị nào khác. Mọi ô bị đổi được ghi vào file nhật ký thay đổi.

Chạy:
    python src/features/fix_matrix.py
"""
import argparse
import csv
from pathlib import Path

SRC = "data/processed/resman_menu_feature_matrix_v6.csv"
DST = "data/processed/resman_menu_feature_matrix_v7.csv"
QUESTIONS = "data/processed/kitchen_questions_v6.csv"
CHANGES = "data/processed/matrix_v7_changes.csv"
PREFIXES = ("taste_", "ingredient_", "cooking_", "meal_need_", "audience_", "meal_style_")
FALLBACK = {"taste_": "taste_other", "ingredient_": "ingredient_other_meat", "cooking_": "cooking_other"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=SRC)
    ap.add_argument("--dst", default=DST)
    args = ap.parse_args()

    with open(args.src, encoding="utf-8-sig", newline="") as f:
        rd = csv.DictReader(f)
        rows = list(rd)
        cols = [c for c in rd.fieldnames if c != "label_review"]
    feats = [c for c in cols if c.startswith(PREFIXES)]

    questions, changes = [], []
    for r in rows:
        q = r.pop("label_review", "").strip()
        if q:
            questions.append({"menu_item_id": r["menu_item_id"], "name": r["name"], "question": q})
        for c in feats:
            if r[c] == "":
                r[c] = "0"
                changes.append((r["menu_item_id"], r["name"], c, "", "0", "ô trống -> 0"))
        for prefix, other in FALLBACK.items():
            if all(r[c] == "0" for c in feats if c.startswith(prefix)):
                r[other] = "1"
                changes.append((r["menu_item_id"], r["name"], other, "0", "1",
                                f"không có cờ nào trong nhóm {prefix}"))

    def write(path, header, data):
        with open(path, "w", encoding="utf-8-sig", newline="") as f:
            w = csv.writer(f)
            w.writerow(header)
            w.writerows(data)

    write(args.dst, cols, [[r[c] for c in cols] for r in rows])
    write(QUESTIONS, ["menu_item_id", "name", "question"],
          [[q["menu_item_id"], q["name"], q["question"]] for q in questions])
    write(CHANGES, ["menu_item_id", "name", "column", "old", "new", "reason"], changes)
    print(f"Ghi {args.dst}: {len(rows)} món, {len(cols)} cột, đã bỏ label_review")
    print(f"Câu hỏi bếp lưu tại {QUESTIONS}: {len(questions)} dòng")
    print(f"Nhật ký thay đổi {CHANGES}: {len(changes)} ô")


if __name__ == "__main__":
    main()