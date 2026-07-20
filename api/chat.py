"""
Vercel Python serverless function backing the portfolio chatbot.

Endpoint: POST /api/chat
Body:     {"message": "...", "history": [{"role": "user"|"assistant", "content": "..."}]}
Response: {"reply": "..."}

Why this lives on Vercel and not Hostinger: Hostinger shared hosting only serves static
files (no Python/Node runtime), and the Groq API key must never sit in client-side JS
where anyone could steal it. So this one small endpoint lives on Vercel (free tier), and
the static site on Hostinger calls it over the network -- see js/chatbot.js.

Cost/abuse safety (this is a public endpoint with a shared API key -- see README):
- Message length is capped.
- Conversation history sent to the model is capped to the last few turns.
- The model's response length is capped via max_tokens.
There is no persistent rate limiter here (would need an external store like Upstash
Redis, extra setup for a portfolio demo) -- keep an eye on usage in the Groq console.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

from groq import Groq

# Vercel's Python loader imports this file directly without adding its own
# directory to sys.path, so a bare sibling import (profile_context.py lives
# right next to this file) fails at runtime with ModuleNotFoundError even
# though the file is right there. Add the directory explicitly first.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from profile_context import SYSTEM_PROMPT  # noqa: E402 -- must follow the sys.path fix above

MODEL_NAME = "llama-3.3-70b-versatile"
MAX_MESSAGE_CHARS = 600
MAX_HISTORY_TURNS = 6  # last N messages (user+assistant combined) kept for context
MAX_REPLY_TOKENS = 400

# Set this to your real Hostinger domain once you know it, e.g. "https://harjeetpannu.com"
# Using "*" for now so the widget works from any origin during setup/testing.
ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")


def _cors_headers():
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        # Simple health check so you can sanity-check the deployment in a browser.
        self._send_json(200, {"status": "ok", "model": MODEL_NAME})

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length) if length else b"{}"
            body = json.loads(raw or b"{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"error": "Invalid JSON body."})
            return

        user_message = (body.get("message") or "").strip()
        history = body.get("history") or []

        if not user_message:
            self._send_json(400, {"error": "Missing 'message'."})
            return
        if len(user_message) > MAX_MESSAGE_CHARS:
            self._send_json(400, {"error": f"Message too long (max {MAX_MESSAGE_CHARS} characters)."})
            return

        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            self._send_json(500, {"error": "Server misconfigured: GROQ_API_KEY is not set."})
            return

        # Build the message list: system prompt + trimmed history + new user message.
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for turn in history[-MAX_HISTORY_TURNS:]:
            role = turn.get("role")
            content = (turn.get("content") or "")[:MAX_MESSAGE_CHARS]
            if not content or role not in ("user", "assistant"):
                continue
            messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": user_message})

        try:
            client = Groq(api_key=api_key)
            completion = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.4,
                max_tokens=MAX_REPLY_TOKENS,
            )
            reply = completion.choices[0].message.content
        except Exception as exc:  # noqa: BLE001 -- surface a clean error to the widget
            self._send_json(502, {"error": f"Chat backend error: {exc}"})
            return

        self._send_json(200, {"reply": reply})

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        for k, v in _cors_headers().items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
