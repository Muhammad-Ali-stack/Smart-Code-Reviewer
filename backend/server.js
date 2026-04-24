require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.error("ERROR: GROQ_API_KEY is missing. Create a .env file with GROQ_API_KEY=gsk_...");
  process.exit(1);
}

const client = new Groq({ apiKey: GROQ_API_KEY });

app.post("/api/review", async (req, res) => {
  const { code, language, focus } = req.body;

  if (!code) {
    return res.status(400).json({ error: "code is required" });
  }

  const prompt = `You are an expert code reviewer at a top-tier tech company.

The user has selected language: "${language || "Kotlin (Android)"}".
Focus area: "${focus || "All (readability, structure, maintainability)"}".

STEP 1 — LANGUAGE DETECTION:
First, detect the actual programming language of the code snippet provided.

STEP 2 — MISMATCH CHECK:
If the detected language does NOT match the selected language, return this exact JSON shape:
{
  "mismatch": true,
  "detectedLanguage": "<what the code actually is>",
  "selectedLanguage": "<what user selected>",
  "message": "<short friendly message explaining the mismatch, e.g. This looks like Python, not Kotlin. Please select the correct language or paste the right code.>"
}

STEP 3 — REVIEW (only if languages match):
If the code matches the selected language, return ONLY this exact JSON — no markdown, no preamble:
{
  "mismatch": false,
  "scores": {
    "readability": <integer 0-100>,
    "structure": <integer 0-100>,
    "maintainability": <integer 0-100>,
    "overall": <integer 0-100>
  },
  "summary": "<2-3 sentence plain-English verdict>",
  "positives": [
    { "title": "<short title>", "detail": "<explanation>" }
  ],
  "improvements": [
    { "title": "<short title>", "detail": "<specific actionable fix>", "severity": "warning|error" }
  ],
  "suggestion": {
    "title": "<one key refactor title>",
    "detail": "<the most impactful refactoring suggestion with a brief code hint if helpful>"
  }
}

Rules for review:
- positives: 1-2 items
- improvements: exactly 3 items
- severity "error" for bugs/anti-patterns, "warning" for style/smell
- Be specific to the detected language best practices
- Raw JSON only — no code fences, no explanation outside the JSON

Code to review:
\`\`\`
${code}
\`\`\``;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer. Always respond with raw JSON only — no markdown, no explanation, no code fences.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Review failed" });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
