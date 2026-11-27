
from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
CSV_INPUT = RAW_DIR / "resman_menu.csv"
JSON_INPUT = RAW_DIR / "resman_menu.json"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
MATRIX_OUTPUT = PROCESSED_DIR / "menu_feature_matrix.csv"
AUDIT_OUTPUT = PROCESSED_DIR / "menu_data_audit.json"

EXPECTED_FIELDS = [
    "menu_item_id", "name", "category", "price", "currency",
    "price_unit", "pricing_type", "availability_status", "notes",
]

# ============================================================
# 26 FEATURE RULES
# Các luật nhận diện ban đầu, cần được kiểm duyệt bằng dữ liệu.
# ============================================================

FEATURE_RULES: dict[str, list[str]] = {

    # 1. KHẨU VỊ
    "taste_spicy": [
        "cay", "ớt", "sa tế", "sate", "tiêu cay",
    ],
    "taste_sour": [
        "chua", "chua ngọt", "me", "chanh", "tắc",
        "lá giang", "mẻ",
    ],
    "taste_sweet": [
        "ngọt", "mật ong", "sốt ngọt",
    ],
    "taste_fatty": [
        "béo", "bơ", "phô mai", "mỡ hành", "pate",
    ],
    "taste_light": [
        "thanh đạm", "thanh mát", "ít dầu", "ít béo",
    ],

    # 2. NGUYÊN LIỆU
    "ingredient_seafood": [
        "cá", "tôm", "tép", "cua", "ghẹ", "mực",
        "bạch tuộc", "nghêu", "ngao", "chíp chíp",
        "hàu", "sò", "ốc", "hến", "lươn",
        "sứa", "hải sản",
    ],
    "ingredient_beef": [
        "bò", "bắp bò", "gân bò", "tủy bò",
        "lưỡi bò", "bê",
    ],
    "ingredient_chicken": [
        "gà", "cánh gà", "sụn gà", "ức gà",
        "đùi gà",
    ],
    "ingredient_vegetable": [
        "rau", "măng", "khổ qua", "mướp",
        "chuối", "khoai", "bầu", "cải",
        "mồng tơi", "rong biển", "ngó",
        "đậu bắp", "bắp non", "lá giang",
        "lá lốt", "cà tím", "cà chua",
        "dưa leo", "xà lách", "nấm",
    ],
    "ingredient_pork": [
        "heo", "lợn", "sườn", "ba chỉ",
        "thịt heo", "thịt lợn", "giò heo",
        "móng heo", "đuôi heo", "lưỡi heo",
        "tai heo", "má heo",
    ],
    "ingredient_field_animal": [
        "ếch", "thỏ", "chim cút", "chim sẻ",
        "chim bồ câu", "bồ câu", "dúi",
        "nhím", "chuột đồng",
    ],
    "ingredient_other_meat": [
        "vịt", "ngan", "ngỗng", "dê",
        "cừu", "trâu", "đà điểu",
    ],

    # 3. CHẾ BIẾN
    "cooking_grilled": [
        "nướng",
    ],
    "cooking_fried": [
        "chiên", "rán",
    ],
    "cooking_steamed": [
        "hấp",
    ],
    "cooking_boiled": [
        "luộc",
    ],

    # 4. NHU CẦU ĂN UỐNG
    "meal_need_light": [
        "ăn nhẹ", "khai vị", "món khai vị",
        "ăn chơi",
    ],
    "meal_need_filling": [
        "ăn no", "món chính", "cơm", "mì",
        "bún", "phở", "lẩu",
    ],
    "meal_need_side_dish": [
        "ăn kèm", "món ăn kèm", "ăn cùng",
    ],

    # 5. ĐỐI TƯỢNG
    "audience_possible_children": [
        "trẻ em", "dành cho trẻ em",
        "không cay", "ít cay",
    ],
    "audience_spicy_lovers": [
        "cay", "ớt", "sa tế", "sate",
    ],
    "audience_vegetarian": [
        "món chay", "đồ chay", "thực phẩm chay",
    ],
    "audience_dieting": [
        "ăn kiêng", "ít dầu", "ít béo",
        "thanh đạm",
    ],

    # 6. PHONG CÁCH BỮA ĂN
    "meal_style_drinking": [
        "ăn nhậu", "món nhậu", "mồi nhậu",
    ],
    "meal_style_family": [
        "gia đình", "mâm cơm gia đình",
    ],
    "meal_style_friends": [
        "nhóm bạn", "bạn bè", "tụ tập bạn bè",
    ],
}

FEATURE_COLUMNS = list(FEATURE_RULES.keys())


def normalize(text: Any) -> str:
    value = "" if text is None else str(text).lower().strip()

    value = unicodedata.normalize("NFD", value)
    value = "".join(
        ch for ch in value
        if unicodedata.category(ch) != "Mn"
    )
    value = value.replace("đ", "d")

    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def has_phrase(text: str, phrase: str) -> bool:
    """So khớp cụm từ hoàn chỉnh sau khi chuẩn hóa."""
    target = normalize(phrase)

    if not target:
        return False

    return f" {target} " in f" {text} "


def load_csv() -> list[dict[str, str]]:
    if not CSV_INPUT.exists():
        raise FileNotFoundError(
            f"Không tìm thấy CSV: {CSV_INPUT}"
        )

    with CSV_INPUT.open(
        "r", encoding="utf-8-sig", newline=""
    ) as file:
        reader = csv.DictReader(file)

        if reader.fieldnames is None:
            raise ValueError("CSV không có hàng tiêu đề.")

        missing = [
            field for field in EXPECTED_FIELDS
            if field not in reader.fieldnames
        ]

        if missing:
            raise ValueError(
                f"CSV thiếu các trường bắt buộc: {missing}"
            )

        return list(reader)


def load_json() -> list[dict[str, Any]]:
    if not JSON_INPUT.exists():
        raise FileNotFoundError(
            f"Không tìm thấy JSON: {JSON_INPUT}"
        )

    with JSON_INPUT.open(
        "r", encoding="utf-8-sig"
    ) as file:
        payload = json.load(file)

    if (
        not isinstance(payload, dict)
        or not isinstance(payload.get("items"), list)
    ):
        raise ValueError(
            "JSON phải có cấu trúc object chứa danh sách 'items'."
        )

    return payload["items"]


def canonical_row(
    row: dict[str, Any]
) -> dict[str, str]:

    return {
        field: (
            ""
            if row.get(field) is None
            else str(row.get(field)).strip()
        )
        for field in EXPECTED_FIELDS
    }


def compare_sources(
    csv_rows: list[dict[str, Any]],
    json_rows: list[dict[str, Any]],
) -> dict[str, Any]:

    csv_by_id = {
        r.get("menu_item_id", "").strip(): canonical_row(r)
        for r in csv_rows
    }

    json_by_id = {
        r.get("menu_item_id", "").strip(): canonical_row(r)
        for r in json_rows
    }

    duplicate_csv_ids = [
        key
        for key, count in Counter(
            r.get("menu_item_id", "").strip()
            for r in csv_rows
        ).items()
        if key and count > 1
    ]

    duplicate_json_ids = [
        key
        for key, count in Counter(
            r.get("menu_item_id", "").strip()
            for r in json_rows
        ).items()
        if key and count > 1
    ]

    csv_ids = set(csv_by_id)
    json_ids = set(json_by_id)

    mismatches = []

    for item_id in sorted(csv_ids & json_ids):
        differences = {
            field: {
                "csv": csv_by_id[item_id][field],
                "json": json_by_id[item_id][field],
            }
            for field in EXPECTED_FIELDS
            if csv_by_id[item_id][field]
            != json_by_id[item_id][field]
        }

        if differences:
            mismatches.append({
                "menu_item_id": item_id,
                "differences": differences,
            })

    return {
        "csv_count": len(csv_rows),
        "json_count": len(json_rows),
        "csv_unique_ids": len(csv_ids),
        "json_unique_ids": len(json_ids),
        "csv_ids_missing_in_json": sorted(csv_ids - json_ids),
        "json_ids_missing_in_csv": sorted(json_ids - csv_ids),
        "duplicate_csv_ids": duplicate_csv_ids,
        "duplicate_json_ids": duplicate_json_ids,
        "field_mismatches": mismatches,
        "sources_match": (
            len(csv_rows) == len(json_rows)
            and not duplicate_csv_ids
            and not duplicate_json_ids
            and csv_ids == json_ids
            and not mismatches
        ),
    }


def build_features(
    row: dict[str, Any]
) -> dict[str, int]:

    # Sử dụng tên món, danh mục và ghi chú.
    # Không sử dụng giá hoặc trạng thái bán để gán nhãn.
    text_parts = [
        normalize(row.get("name")),
        normalize(row.get("category")),
        normalize(row.get("notes")),
    ]

    feature_text = " ".join(
        part for part in text_parts if part
    )

    features = {}

    for feature, phrases in FEATURE_RULES.items():
        features[feature] = int(
            any(
                has_phrase(feature_text, phrase)
                for phrase in phrases
            )
        )

    return features


def main() -> None:
    PROCESSED_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    csv_rows = load_csv()
    json_rows = load_json()

    audit = compare_sources(csv_rows, json_rows)

    if not audit["sources_match"]:
        AUDIT_OUTPUT.write_text(
            json.dumps(
                audit,
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

        raise ValueError(
            "CSV và JSON chưa khớp hoàn toàn. "
            f"Xem báo cáo: {AUDIT_OUTPUT}"
        )

    # JSON là nguồn tạo ma trận sau khi đã đối chiếu CSV.
    output_rows = []

    for item in json_rows:
        row = canonical_row(item)
        row.update(build_features(item))
        output_rows.append(row)

    fieldnames = EXPECTED_FIELDS + FEATURE_COLUMNS

    with MATRIX_OUTPUT.open(
        "w",
        encoding="utf-8-sig",
        newline="",
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames,
        )

        writer.writeheader()
        writer.writerows(output_rows)

    feature_counts = {
        feature: sum(
            row[feature] for row in output_rows
        )
        for feature in FEATURE_COLUMNS
    }

    audit["matrix_rows"] = len(output_rows)
    audit["feature_column_count"] = len(FEATURE_COLUMNS)
    audit["feature_columns"] = FEATURE_COLUMNS
    audit["feature_counts"] = feature_counts

    audit["feature_semantics"] = (
        "Giá trị 1: phát hiện từ khóa/cụm từ theo luật. "
        "Giá trị 0: chưa phát hiện bằng chứng theo luật, "
        "không khẳng định chắc chắn thuộc tính không tồn tại."
    )

    audit["labeling_warning"] = (
        "Ma trận là kết quả gán nhãn tự động ban đầu. "
        "Cần kiểm duyệt thủ công, đặc biệt với thuộc tính "
        "đối tượng và phong cách bữa ăn."
    )

    AUDIT_OUTPUT.write_text(
        json.dumps(
            audit,
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print("FEATURE MATRIX CREATED")
    print(f"Menu items: {len(output_rows)}")
    print(f"Feature columns: {len(FEATURE_COLUMNS)}")
    print(f"Matrix: {MATRIX_OUTPUT}")
    print(f"Audit: {AUDIT_OUTPUT}")

    print("\nFEATURE COUNTS")

    for feature, count in feature_counts.items():
        print(f"{feature}: {count}")


if __name__ == "__main__":
    main()
