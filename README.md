# Harjeet Singh Pannu — Portfolio Website

A single-page portfolio built with plain HTML, CSS, and vanilla JavaScript. No build tools, no npm — just static files you upload directly to your web host.

## File structure

```
/
├── index.html              the whole site (static — deploys to Hostinger)
├── /css/style.css          all styling
├── /js/main.js             role-cycling text, theme toggle, mobile menu, stat count-up, footer year, back-to-top
├── /js/bg3d.js             three.js floating-particle background (auto-disabled for reduced-motion users)
├── /js/chatbot.js          AI chat widget frontend — talks to the /api/chat backend below
├── /assets/images/         your headshot goes here
├── /assets/resumes/        your resume PDFs go here
├── /api/chat.py            AI chatbot backend (Vercel Python function — NOT uploaded to Hostinger)
├── /api/profile_context.py the facts the chatbot is allowed to answer from
├── requirements.txt        Python deps for the backend (must live at project root for Vercel)
├── .env.example            template for your Groq API key (copy to .env for local testing)
├── .gitignore              keeps .env and other secrets out of git
└── README.md
```

**Two deployments, not one:** `index.html`, `css/`, `js/`, and `assets/` go to Hostinger as before. The `api/` folder is a separate small deployment to Vercel — Hostinger can't run Python. Vercel auto-detects `api/chat.py` as a Python serverless function, no config file needed. See "Setting up the AI chatbot" below.

## Before you go live

Your email (harjeetpannu2004@gmail.com), phone (+91 7259466505), LinkedIn, and GitHub links are already wired into the hero, Connect section, and Connect card. Formspree is already connected. What's still open:

### 1. Swap your photo

Replace `assets/images/photo.jpeg` with your own headshot (keep the same filename, or update the `src` in the hero section of `index.html` if you rename it). A square image works best since it's cropped into a circle.

### 2. Swap your resumes

Drop your three PDFs into `assets/resumes/`, replacing:
- `resume-finance.pdf`
- `resume-semiconductor.pdf`
- `resume-gaming.pdf`

Keep the filenames the same and the download cards in the Resume section will just work. If you rename them, update the `href` values in the Resume section of `index.html` to match.

### 3. Set up the AI chatbot (optional, but see below)

The chat widget is fully built but points at a placeholder backend URL until you deploy it — see "Setting up the AI chatbot" further down. Until then, clicking it just shows a friendly "not connected yet" message instead of erroring.

## Editing text

Everything is plain HTML in `index.html` — open it in any text editor, find the section you want (each is marked with an `<!-- ===== Section Name ===== -->` comment), and edit the text directly.

## Editing colors

All colors are defined once at the top of `css/style.css` under `:root` (dark theme) and `html.light-theme` (light theme). Change the hex values there and the whole site updates.

## Uploading to Hostinger

1. Log in to Hostinger and open **hPanel**.
2. Go to **Files → File Manager**.
3. Open the `public_html` folder (this is your site's root).
4. Delete any default/placeholder files already in there (like a default `index.html`), unless you're setting up a subfolder instead.
5. Upload every file and folder from this project **except `api/`, `.env`, and `.env.example`** — those are for the chatbot backend, not Hostinger. Upload `index.html`, `css/`, `js/`, and `assets/` directly into `public_html`, keeping the same folder structure.
6. Visit your domain in a browser. Your site should be live immediately — no build step, no server restart needed.

If you ever want to update the site, just re-upload the changed file(s) through File Manager, overwriting the old ones.

## Setting up the AI chatbot

The chat widget (bottom-left bubble) is fully built on the frontend, but needs its backend deployed separately — Hostinger can't run it. This takes about 10 minutes, once.

### Why two hosts?
Hostinger only serves static files (HTML/CSS/JS) — no Python. The chatbot needs a tiny server to safely hold your Groq API key and call the LLM (an API key can never sit in browser-side JavaScript, or anyone could steal it from view-source and run up your usage). So: **Hostinger keeps hosting the site as normal**, and a small serverless function on **Vercel** (free) handles just the `/api/chat` endpoint. Your chat widget calls out to that Vercel URL.

### Step 1 — Get a free Groq API key
Go to [console.groq.com/keys](https://console.groq.com/keys), sign up, and create a key.

### Step 2 — Push the project to GitHub
Already done — the repo lives at [github.com/harjeet2004/portfolio-website](https://github.com/harjeet2004/portfolio-website). Because `.env` is in `.gitignore`, your real API key was never committed.

### Step 3 — Deploy to Vercel
1. Go to [vercel.com](https://vercel.com), sign up with your GitHub account.
2. **Add New Project** → import the `portfolio-website` repo.
3. Vercel auto-detects `api/chat.py` as a Python serverless function from the file itself — no config file needed, don't change any build settings.
4. Before (or right after) the first deploy, go to **Project Settings → Environment Variables** and add:
   - `GROQ_API_KEY` = the key from Step 1
   - `ALLOWED_ORIGIN` = your Hostinger domain once you know it (e.g. `https://harjeetpannu.com`) — leave unset (defaults to `*`) until then.
5. Deploy. Vercel gives you a URL like `https://portfolio-website-xxxx.vercel.app`. Your API endpoint is `https://portfolio-website-xxxx.vercel.app/api/chat`.
6. Sanity check: open that URL in a browser — you should see `{"status": "ok", "model": "llama-3.3-70b-versatile"}`.

### Step 4 — Point the widget at your backend
Open `js/chatbot.js`, find the line near the top:
```js
const CHAT_API_URL = 'https://YOUR-VERCEL-PROJECT.vercel.app/api/chat';
```
Replace it with your real Vercel URL from Step 3, then re-upload `js/chatbot.js` to Hostinger. The widget will now actually talk to the model.

### Step 5 — Lock it down once your domain is live
Once your Hostinger domain is working, go back to Vercel's environment variables and set `ALLOWED_ORIGIN` to that exact domain (e.g. `https://harjeetpannu.com`), then redeploy. This stops other websites from quietly calling your API and burning through your Groq quota — right now it's open to any origin (`*`) so you can test it before the domain is finalized.

### Cost & abuse notes (read this)
- Groq's free tier is generous, but this endpoint uses **one shared key for every visitor** — there's no per-user login. The backend caps message length, trims conversation history, and limits reply length to keep each request cheap, but there's no persistent rate limiter (that would need an extra service like Upstash Redis, overkill for a portfolio demo).
- Realistic portfolio traffic (a handful of visitors at a time, occasionally) is well within free-tier limits.
- If you ever see unexpected usage in the [Groq console](https://console.groq.com), it likely means the `ALLOWED_ORIGIN` lockdown (Step 5) hasn't been done yet, or your key leaked somewhere — rotate the key in Groq's dashboard and update it in Vercel's environment variables.
- The chatbot only answers from `api/profile_context.py` — edit that file (and redeploy on Vercel) any time your resume/experience changes, so it never goes stale or says something inaccurate about you.
