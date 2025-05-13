import openai
import os
import json
from django.conf import settings

openai.api_key = os.getenv("OPENAI_API_KEY") or getattr(settings, "OPENAI_API_KEY", None)

def parse_query(user_message: str, model_fields: dict = None):
    SYSTEM_PROMPT = """
Ти аналізуєш запит користувача та повертаєш JSON у форматі:

{
  "intent": "count_by_field",
  "params": {
    "model": "Driver",
    "field": "gender",
    "value": "F"
  }
}

🧠 Розпізнавай такі патерни:
- "жінка", "жіноча стать", "жіночої статі" → gender = "F"
- "чоловік", "чоловіча стать" → gender = "M"
- "старше X років", "віком понад X років" → vehicle_age_query або driver_age_query
- "червоний", "білий", "синій" → color

🔑 Додаткові поля, які може згадати користувач:
- "номер", "держномер" → license_plate
- "пошта", "мейл" → email
- "телефон", "тел." → phone_number
- "іпн" → ipn
- "адреса", "поштова адреса" → address
- "він", "вінкод" → vin
- "водійське посвідчення", "ліцензія" → license_number
- "рік народження" → birth_date
- "машина", "авто", "автівка" → Vehicle
- "водій" → Driver

🆕 Новий intent:
- "телефон водія Ім’я Прізвище", "email водія Іван" → intent: get_field_by_name, params: {model: Driver, name: ..., target_field: phone_number або email}
- "Скільки машин", "Скільки водіїв", "how many cars", "скільки записів у базі" → intent: count_all, params: {model: ...}

🔁 Додатково підтримуй англійську:
- "how many vehicles", "how many cars" → Vehicle
- "how many drivers", "driver count" → Driver

Ти помічник для ERP-системи. Твоє завдання — зрозуміти суть запиту користувача (навіть з помилками), визначити намір (intent) і параметри (params).
Поверни лише JSON у форматі:

{
  "intent": "vehicle_age_query",
  "params": {
    "years": 5
  }
}

Можливі intent-и:
- vehicle_age_query
- driver_age_query
- color_filter
- count_by_field
- count_all
- get_field_by_name
- unknown

Якщо треба, використовуй наданий список полів моделі.
"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Запит: {user_message}\nПоля моделей: {model_fields or '{}'}"}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.3,
        )
        reply = response.choices[0].message.content.strip()
        print("Semantic Parser GPT output:", reply)
        return json.loads(reply)
    except Exception as e:
        print("Semantic parsing error:", e)
        return {"intent": "unknown", "params": {}}
