"""Kiểm tra và KHÓA ma trận đặc trưng món ăn (resman_menu_feature_matrix_*.csv).

Kiểm tra:
- mã món không trùng; mọi cột đặc trưng chỉ nhận 0 hoặc 1 (ô trống là lỗi);
- các món trùng tên phải có đặc trưng giống nhau;
- mâu thuẫn logic (cay nhưng không thuộc nhóm thích cay, cay nhưng phù hợp trẻ em,
  vừa thanh nhẹ vừa béo, đánh dấu ăn chay nhưng có thịt/hải sản);
- món chưa có cờ nào trong một nhóm taste/ingredient/cooking (phải rơi vào cột *_other).

--lock ghi file .lock.json chứa mã băm SHA-256 của ma trận. Từ đó các bước sau sẽ
từ chối chạy nếu ma trận bị sửa. Sửa ma trận thì khóa lại bằng --lock.

Chạy:
    python src/features/validate_matrix.py
    python src/features/validate_matrix.py --lock
"""
import argparse
import csv
import hashlib
import json
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

DEFAULT = "data/processed/resman_menu_feature_matrix_v7.csv"
PREFIXES = ("taste_", "ingredient_", "cooking_", "meal_need_", "audience_", "meal_style_")
# ingredient_other_meat là nhóm "khác/chưa rõ" (có cả đậu hũ, trứng), nên không tính là thịt
# khi kiểm tra món ăn chay. Món ăn chay thuộc nhóm này phải do người chốt danh sách tự kiểm tra.
MEAT = ("ingredient_seafood", "ingredient_beef", "ingredient_chicken", "ingredient_pork",
        "ingredient_field_animal")


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--matrix", default=DEFAULT)
    parser.add_argument("--lock", action="store_true", help="ghi file khóa nếu không có lỗi")
    args = parser.parse_args()

    with open(args.matrix, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    feats = [c for c in rows[0] if c.startswith(PREFIXES)]
    errors, warnings = [], []

    dup = [k for k, v in Counter(r["menu_item_id"] for r in rows).items() if v > 1]
    if dup:
        errors.append(f"mã món trùng: {dup}")
    for c in feats:
        bad = {r["menu_item_id"]: r[c] for r in rows if r[c] not in ("0", "1")}
        if bad:
            errors.append(f"cột {c} có giá trị không hợp lệ: {bad}")

    by_name = defaultdict(list)
    for r in rows:
        by_name[" ".join(r["name"].lower().split())].append(r)
    for name, rs in by_name.items():
        if len(rs) > 1:
            diff = [c for c in feats if len({x[c] for x in rs}) > 1]
            if diff:
                errors.append(f"món trùng tên '{name}' {[x['menu_item_id'] for x in rs]} khác nhau ở {diff}")

    def ids(cond):
        return [r["menu_item_id"] for r in rows if cond(r)]

    checks = [
        ("cay nhưng không đánh dấu audience_spicy_lovers",
         ids(lambda r: r["taste_spicy"] == "1" and r["audience_spicy_lovers"] != "1")),
        ("audience_spicy_lovers nhưng không cay",
         ids(lambda r: r["audience_spicy_lovers"] == "1" and r["taste_spicy"] != "1")),
        ("cay nhưng đánh dấu phù hợp trẻ em",
         ids(lambda r: r["taste_spicy"] == "1" and r["audience_possible_children"] == "1")),
        ("vừa thanh nhẹ vừa béo", ids(lambda r: r["taste_light"] == "1" and r["taste_fatty"] == "1")),
        ("đánh dấu ăn chay nhưng có thịt/hải sản",
         ids(lambda r: r["audience_vegetarian"] == "1" and any(r[c] == "1" for c in MEAT))),
    ]
    for label, found in checks:
        if found:
            errors.append(f"{label}: {found}")

    for prefix in ("taste_", "ingredient_", "cooking_"):
        cs = [c for c in feats if c.startswith(prefix)]
        none = ids(lambda r: all(r[c] != "1" for c in cs))
        if none:
            errors.append(f"món chưa có cờ nào trong nhóm {prefix}*: {none}")
    veg = sum(1 for r in rows if r["audience_vegetarian"] == "1")
    if veg == 0:
        warnings.append("không có món nào được đánh dấu audience_vegetarian = 1")

    if "label_review" in rows[0]:
        errors.append("còn cột label_review")

    print(f"Ma trận: {args.matrix}")
    print(f"{len(rows)} món, {len(feats)} cột đặc trưng")
    print(f"\nLỖI ({len(errors)}):" if errors else "\nLỖI: không có")
    for e in errors:
        print("  - " + e)
    print(f"\nCẢNH BÁO ({len(warnings)}):")
    for w in warnings:
        print("  - " + w)

    if args.lock:
        if errors:
            sys.exit("\nKhông khóa vì còn lỗi.")
        lock = {
            "matrix": Path(args.matrix).name,
            "sha256": sha256(args.matrix),
            "rows": len(rows),
            "feature_columns": len(feats),
            "locked_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        }
        lock_path = Path(args.matrix).with_suffix(".lock.json")
        lock_path.write_text(json.dumps(lock, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"\nĐã khóa: {lock_path}")


if __name__ == "__main__":
    main()