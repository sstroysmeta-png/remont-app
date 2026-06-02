// api/recognize-plan.js
// Vercel Serverless Function — получает base64-фото плана, отправляет в Claude Vision,
// возвращает список комнат с площадями.
// API-ключ хранится ТОЛЬКО в переменных окружения Vercel — в браузер не попадает.

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { imageBase64 } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ ok: false, error: "imageBase64 is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "API key not configured" });
  }

  const prompt = `Ты — эксперт по анализу планировок квартир.
Тебе передаётся изображение плана квартиры (чертёж или фото).

Твоя задача — извлечь все помещения и их примерную площадь в кв.м.

Верни ТОЛЬКО JSON в формате (без пояснений, только JSON):
{
  "rooms": [
    {"name": "Кухня", "area": 12, "cx": 0.2, "cy": 0.4},
    {"name": "Гостиная", "area": 25, "cx": 0.5, "cy": 0.5},
    {"name": "Спальня", "area": 18, "cx": 0.7, "cy": 0.3},
    {"name": "Санузел совмещённый", "area": 6, "cx": 0.3, "cy": 0.7},
    {"name": "Коридор", "area": 8, "cx": 0.5, "cy": 0.8}
  ]
}

Правила:
- name: русское название (Кухня, Спальня, Гостиная, Санузел, Коридор, Балкон и т.д.)
- area: число в кв.м, минимум 3, максимум 80
- cx, cy: относительные координаты центра комнаты (0..1) от левого-верхнего угла плана
- Если площадь не читается — оцени по пропорциям
- Если план не распознан — верни пустой массив rooms: []`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(502).json({ ok: false, error: "AI service error: " + response.status });
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text || "";

    // Извлекаем JSON из ответа
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({ ok: false, error: "AI не вернул JSON", rooms: [] });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(200).json({ ok: false, error: "Ошибка парсинга JSON", rooms: [] });
    }

    const rooms = (parsed.rooms || []).filter(
      (r) => r.name && typeof r.area === "number" && r.area >= 3
    );

    return res.status(200).json({
      ok: rooms.length > 0,
      rooms,
      walls: [],
      apt: null,
    });
  } catch (err) {
    console.error("recognize-plan error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
}
