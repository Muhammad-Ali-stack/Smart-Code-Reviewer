# Smart Code Reviewer — AI-Powered Android Code Analysis

> **Careem AI Challenge Submission** — Smart Code Reviewer (Challenge #1)

---

## Setup

### 1. Configure your API key (one time only)

```bash
cd backend
cp .env.example .env
```

Open `.env` and paste your Groq key:
```
GROQ_API_KEY=gsk_your_actual_key_here
```

Get a free key at **https://console.groq.com**

### 2. Start the backend

```bash
cd backend
npm install
node server.js
# → Server running on http://localhost:3001
```

### 3. Open the frontend

Just open `frontend/index.html` in your browser — no build step needed.

---

## Features

- API key lives in `.env` — never exposed to the browser
- Scores code across Readability, Structure, Maintainability, and Overall (0–100)
- **Language mismatch detection** — if you paste Python into a Kotlin reviewer, it tells you immediately instead of giving a wrong review
- 3 prioritised improvements (bugs vs. code smells)
- 1 key refactoring suggestion
- Supports Kotlin (Android), Java (Android), Kotlin Multiplatform
- 4 built-in sample snippets

---

## Project Structure

```
smart-code-reviewer/
├── backend/
│   ├── server.js        ← Express API + Groq integration
│   ├── package.json
│   ├── .env.example     ← Copy to .env and add your key
│   └── .gitignore       ← .env is gitignored
└── frontend/
    └── index.html       ← Full UI, no build step
```

---

## 100-Word Summary

> Smart Code Reviewer is an AI tool that analyses Android/Kotlin code before it reaches human reviewers. Powered by Groq's LLaMA 3.3 70B, it evaluates code across readability, structure, and maintainability — returning a scored report with specific, actionable feedback. A key feature is automatic language mismatch detection: if the pasted code doesn't match the selected language, the tool flags it immediately with a clear explanation instead of producing a misleading review. The API key is stored securely in a server-side `.env` file and never exposed to the browser. This reduces reviewer fatigue, catches anti-patterns early, and accelerates feedback loops in Android engineering teams.
