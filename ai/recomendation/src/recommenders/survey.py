"""Quy đổi câu trả lời khảo sát của bàn thành nhãn cho bộ chấm điểm.

Định dạng khảo sát (mọi trường đều không bắt buộc):
    {
      "party_size": 8,                  # số người
      "companions": "friends",          # "family" | "friends" (hỏi khi từ 7 người trở lên)
      "wants_drinking": true,           # có muốn uống/say không (hỏi khi từ 7 người trở lên)
      "wants_novelty": false,           # có muốn thử món mới lạ không
      "answers": {"audience_possible_children": true, "ingredient_beef": true, ...}
    }
  answers: khóa là tên cột trong ma trận; true = khách muốn/cần.
  false = khách muốn tránh (chỉ với nhóm taste_/ingredient_/cooking_...; riêng audience_* thì false
  chỉ nghĩa là bàn không thuộc nhóm đó, xem scoring.build_profile).

Quy tắc theo số người (nhãn được cộng điểm với hệ số như câu trả lời khách xác nhận):
    1-3 người      : không nhóm đặc biệt, không nhãn, 6 món
    4-6 người      : meal_style_family, 6 món
    từ 7 người     : meal_need_filling (ăn no), 10 món; không tự gán meal_style_family
Câu hỏi thêm khi từ 7 người:
    companions     : "family" -> meal_style_family, "friends" -> meal_style_friends
    wants_drinking : true -> meal_style_drinking; false -> không làm gì (không loại món nhậu)
Câu trả lời tường minh trong `answers` luôn thắng nhãn suy ra từ số người/câu hỏi thêm.
"""
CROWD_MIN = 7
FAMILY_MIN = 4
K_BY_GROUP = {"normal": 6, "family": 6, "crowd": 10}
COMPANIONS = {"family": "meal_style_family", "friends": "meal_style_friends"}


def party_group(party_size):
    if party_size is None:
        return None
    if party_size >= CROWD_MIN:
        return "crowd"
    if party_size >= FAMILY_MIN:
        return "family"
    return "normal"


def resolve_survey(survey):
    """Trả về dict: answers (đã gộp nhãn suy ra), party_size, party_group, wants_novelty, default_k."""
    survey = survey or {}
    size = survey.get("party_size")
    if size is not None and (isinstance(size, bool) or not isinstance(size, int) or size < 1):
        raise ValueError(f"party_size phải là số nguyên từ 1 trở lên, nhận được {size!r}")
    companions = survey.get("companions")
    if companions is not None and companions not in COMPANIONS:
        raise ValueError(f"companions phải là một trong {sorted(COMPANIONS)}, nhận được {companions!r}")
    for key in ("wants_drinking", "wants_novelty"):
        if survey.get(key) is not None and not isinstance(survey[key], bool):
            raise ValueError(f"{key} phải là true hoặc false, nhận được {survey[key]!r}")

    group = party_group(size)
    derived = {}
    if group == "family":
        derived["meal_style_family"] = True
    elif group == "crowd":
        derived["meal_need_filling"] = True
    if companions:
        derived[COMPANIONS[companions]] = True
    if survey.get("wants_drinking") is True:
        derived["meal_style_drinking"] = True

    answers = {**derived, **(survey.get("answers") or {})}
    return {
        "answers": answers,
        "party_size": size,
        "party_group": group,
        "wants_novelty": bool(survey.get("wants_novelty")),
        "default_k": K_BY_GROUP.get(group, K_BY_GROUP["normal"]),
    }