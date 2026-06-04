// ============================================================================
//  /api/recognize-plan  —  СЕРВЕРНАЯ функция (работает на Vercel)
// ----------------------------------------------------------------------------
//  ЗАЧЕМ ОНА НУЖНА:
//  Приложение НЕ хранит ключ AI внутри себя (иначе его можно украсть).
//  Браузер/телефон отправляют фото сюда, на сервер. Здесь — и ТОЛЬКО здесь —
//  лежит ваш ключ. Сервер обращается к AI и возвращает приложению результат.
//
//  КУДА ВСТАВИТЬ КЛЮЧ:
//  Ключ НЕ пишется в этот файл! Он хранится в переменных окружения Vercel
//  (Settings → Environment Variables). Подробно — в папке 05-ИНСТРУКЦИЯ.
//
//  Нужная переменная:  ANTHROPIC_API_KEY = sk-ant-xxxxxxxx
//  (Если используете OpenAI — смотрите альтернативный блок ниже в файле.)
// ============================================================================

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Только POST-запросы" });
  }

  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ ok: false, error: "Нет изображения (imageBase64)" });
    }

    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({
        ok: false,
        error: "На сервере не задан ключ ANTHROPIC_API_KEY (см. Settings → Environment Variables на Vercel)",
      });
    }

    // Модель можно сменить через переменную окружения AI_MODEL.
    // По умолчанию Sonnet 4.6 — лучше «читает» планировки.
    // Хотите дешевле — поставьте AI_MODEL=claude-haiku-4-5-20251001
    const MODEL = process.env.AI_MODEL || "claude-sonnet-4-6";

    const prompt = [
      "Ты — помощник по чтению планов квартир. На изображении план квартиры.",
      "Определи помещения, их примерные площади в м² и положение.",
      "Верни СТРОГО JSON без markdown, без пояснений, в формате:",
      '{"rooms":[{"name":"Кухня","area":12,"cx":0.2,"cy":0.5}],"apt":null,"walls":[]}',
      "Где: name — название комнаты по-русски; area — площадь в м² (число);",
      "cx,cy — центр комнаты в долях от 0 до 1 (левый верхний угол = 0,0).",
      "Если площадь не подписана — оцени по пропорциям. Только JSON.",
    ].join(" ");

    const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageBase64 },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      return res.status(502).json({ ok: false, error: "AI вернул ошибку: " + errText.slice(0, 300) });
    }

    const data = await aiResp.json();
    let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");

    // Убираем возможные ```json ... ``` и берём только JSON
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return res.status(200).json({ ok: false, error: "Не удалось разобрать ответ AI" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text.slice(start, end + 1));
    } catch (e) {
      return res.status(200).json({ ok: false, error: "Ответ AI не в формате JSON" });
    }

    return res.status(200).json({
      ok: true,
      rooms: Array.isArray(parsed.rooms) ? parsed.rooms : [],
      apt: parsed.apt || null,
      walls: Array.isArray(parsed.walls) ? parsed.walls : [],
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Сервер: " + (err && err.message ? err.message : String(err)) });
  }
}

// ============================================================================
//  АЛЬТЕРНАТИВА: если у вас ключ OpenAI, а не Anthropic.
//  Закомментируйте функцию выше и используйте этот вариант — модель gpt-4o
//  тоже умеет «видеть» изображения. Переменная: OPENAI_API_KEY.
//
//  const API_KEY = process.env.OPENAI_API_KEY;
//  const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
//    method: "POST",
//    headers: { "content-type": "application/json", authorization: "Bearer " + API_KEY },
//    body: JSON.stringify({
//      model: "gpt-4o",
//      max_tokens: 1500,
//      messages: [{ role: "user", content: [
//        { type: "text", text: prompt },
//        { type: "image_url", image_url: { url: "data:image/jpeg;base64," + imageBase64 } },
//      ]}],
//    }),
//  });
//  ... далее разбираете data.choices[0].message.content так же, как text выше.
// ============================================================================
