import profile from "@/data/profile.json";

export const runtime = "nodejs";

function buildPrompt(userMsg: string) {
  return `
You are the personal website assistant for ${profile.name}.
Answer using ONLY the PROFILE JSON below.
If the answer is not in PROFILE, say: "I don’t have that information yet."

Be concise, friendly, and structured. Use bullet points when helpful.

PRIVACY RULES:
${[
  "Only answer using the PROFILE JSON.",
  "Do not invent facts. If not in profile, say: \"I don’t have that information yet.\"",
  "Do not share sensitive/private info (passwords, API keys, exact address).",
  "Visa/employer: answer only what is in profile."
].map((r) => `- ${r}`).join("\n")}


PROFILE JSON:
${JSON.stringify(profile, null, 2)}

USER QUESTION:
${userMsg}
  `.trim();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const userMsg = String(message ?? "").slice(0, 2000);

    if (!userMsg) return Response.json({ reply: "Please type a question." }, { status: 400 });

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";



    if (!apiKey) {
      return Response.json({ reply: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local" }, { status: 500 });
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    // add timeout so it never hangs
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(userMsg) }] }],
        generationConfig: { temperature: 0.3 }
      }),
      signal: controller.signal
    }).finally(() => clearTimeout(t));

    const data = await res.json();

    // show clear error message if Gemini rejects
    if (!res.ok) {
      const msg = data?.error?.message || JSON.stringify(data);
      return Response.json({ reply: `Gemini error (${res.status}): ${msg}` }, { status: 200 });
    }

    // extract text
    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts)
      ? parts.map((p: any) => p?.text).filter(Boolean).join("\n").trim()
      : "";

    return Response.json({ reply: reply || "Gemini returned no text. Try a different model name." }, { status: 200 });
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Gemini request timed out. Try again." : "Server error. Please try again.";
    return Response.json({ reply: msg }, { status: 200 });
  }
}
