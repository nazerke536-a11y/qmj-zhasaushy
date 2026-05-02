// Vercel Serverless Function — Google Gemini API проксиі
// ✅ Тегін деңгей (free tier) — несие картасы қажет емес
// API кілті осы сервер жағында сақталады, браузерде көрінбейді

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed. Use POST." } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message:
          "GEMINI_API_KEY не задан. Vercel → Settings → Environment Variables — қосыңыз.",
      },
    });
  }

  const { system, userText, images } = req.body || {};

  // Gemini форматы: суреттер бұрын, текст соңында
  const parts = [];
  if (Array.isArray(images)) {
    for (const img of images) {
      if (img && img.data && img.mediaType) {
        parts.push({
          inline_data: {
            mime_type: img.mediaType,
            data: img.data,
          },
        });
      }
    }
  }
  parts.push({ text: userText || "Generate the lesson plan JSON." });

  const geminiBody = {
    system_instruction: {
      parts: [{ text: system || "" }],
    },
    contents: [{ role: "user", parts }],
    generationConfig: {
      maxOutputTokens: 8000,
      temperature: 0.7,
      responseMimeType: "application/json",
    },
  };

  // Gemini 2.5 Flash — тегін деңгейде суреттерді талдайды, үш тілді біледі
  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: { message: data?.error?.message || "Gemini API error " + upstream.status },
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    if (!text) {
      return res.status(500).json({
        error: { message: "Empty response from Gemini. Try again." },
      });
    }

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({
      error: { message: "Proxy error: " + (e?.message || String(e)) },
    });
  }
}
