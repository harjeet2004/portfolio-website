# Claude Code Build Plan — Harjeet Singh Pannu Portfolio (Optimized Version)

## HOW TO USE THIS FILE
1. Create an empty folder, e.g. `harjeet-portfolio`, open it in VS Code, start Claude Code inside it.
2. **Use Sonnet 5** (default). Do not switch models mid-build unless one specific piece is stuck — switching models resets context and costs more tokens overall.
3. Paste the ONE prompt below as your first message. Don't paste the "steps to reduce tokens" section into Claude Code — that part is for you, not for it.
4. Have ready before you start (saves a round-trip): your headshot photo, and the 3 resume PDFs (Finance/Semiconductor/Gaming), renamed simply e.g. `photo.jpg`, `resume-finance.pdf`, `resume-semiconductor.pdf`, `resume-gaming.pdf`.

=====

Build a complete, production-ready single-page portfolio website for me as **plain static files only** — HTML5, CSS3, vanilla JavaScript. No React, no build tools, no npm — this deploys by direct file upload to Hostinger shared hosting.

### STACK (CDN only, nothing paid, nothing requiring install)
- Tailwind CSS via CDN
- AOS (Animate on Scroll) via CDN — this is the ONLY animation library. Do not add GSAP or any other animation library.
- Lucide Icons via CDN
- Google Fonts: "Space Grotesk" for headings, "Inter" for body text

### DESIGN
- Dark theme by default with a light/dark toggle (store preference in a JS variable, not localStorage — keep it simple, resetting on refresh is fine).
- Background: deep navy/charcoal (#0d1117 range). One accent color used consistently throughout — electric blue (#3b82f6). No gradients-on-everything, no particle backgrounds, no parallax.
- Clean grid layout, generous whitespace, mobile-first responsive.
- Sticky navbar with smooth-scroll anchor links.

### ANIMATION SCOPE — KEEP TO EXACTLY THIS, NOTHING MORE
1. Hero heading + subtext fade-in on page load (pure CSS animation, no JS needed).
2. Role tagline in hero cycles through 4 words ("Financial Analyst" / "Research Analyst" / "Hardware Engineer" / "AI Systems Designer") via a small vanilla JS interval — simple fade or typewriter, whichever is less code.
3. AOS fade-up on scroll for each major section (one `data-aos="fade-up"` attribute per section — don't over-animate individual child elements).
That's it. No hover-lift cards, no magnetic buttons, no scroll-linked parallax. Simplicity keeps this fast, light, and easy for you to maintain later.

### SECTIONS (single page, in this order)
1. **Hero** — Name, role-cycling tagline, one-line positioning statement (ECE grad, VIT Chennai, ex-JPMorgan CIB Research Analyst Intern, WorldQuant top-100 rank), buttons: View Resume / Contact / LinkedIn. Include a placeholder circular image spot for my headshot (`assets/images/photo.jpg`).
2. **About** — short narrative paragraph + a 4-stat strip (CGPA 9.5+/10 · WorldQuant Rank #79/76,886 · Patent Under Review · 6-Month JPMorgan CIB Internship).
3. **Experience** — JPMorgan Chase & Co., CRG Research Analyst Intern, CIB Division, Mumbai (Jan–Jun 2026). Use these exact bullets:
   - Conducted company, industry, and market research supporting institutional credit and risk evaluation across multiple sectors.
   - Analyzed financial statements, earnings releases, and performance metrics to build data-backed intelligence briefs for stakeholders.
   - Authored research reports, executive summaries, and analytical presentations reviewed by senior CIB stakeholders.
   - Applied quantitative and qualitative research frameworks to track business trends, competitive positioning, and sector-specific risk factors.
4. **Projects** — single clean grid (no filter tabs), ordered with finance-relevant projects first:
   - Portfolio MIS Dashboard, Comparable-Company Valuation Model, Autonomous Deal Screener (Finance)
   - Smart Multi-Biometric UPI Payment Authentication System — Patent Under Review (Fintech/Hardware)
   - IntelliWeed — AI-Powered Autonomous Agricultural Robot (AI/Hardware)
   - Smart Plant Health Monitoring System (IoT/Hardware)
   - Stepped Bowtie Antenna for Underwater Wireless Communication (Hardware)
   Each card: title, 1-2 line description, small tech-stack tag chips, placeholder `#` links for GitHub/Demo.
5. **Achievements** — simple badge grid: WorldQuant Rank #79/76,886 · Academic Excellence Award (VIT ECE) · 1st Runner-Up Pitch-A-Thon (70+ teams) · International Research Finalist, ICDTSA · VLSI Design & Verification Certified · Patent Under Review.
6. **Skills** — 3 columns: Financial & Analytical (Financial Statement Analysis, Credit Analysis, Market Research, Quantitative Research, Business Intelligence) · Programming & Data (Python, SQL, MATLAB, Java, C++, Verilog) · Tools & Platforms (Excel Advanced, PowerPoint, Git, VS Code, ANSYS HFSS, Cadence, ModelSim).
7. **Education** — VIT Chennai B.Tech ECE (CGPA 9.5+/10, 2022–2026) · Apeejay School Kolkata CBSE XII 98% · Podar International School Aurangabad CBSE X 96%.
8. **Resume** — 3 download cards linking to `assets/resumes/resume-finance.pdf`, `resume-semiconductor.pdf`, `resume-gaming.pdf`.
9. **Connect With Me** (bottom section, before footer) — this should feel like the site's closing CTA, not an afterthought:
   - A working contact form (Name, Email, Message fields) with `action="https://formspree.io/f/YOUR_FORM_ID"` and `method="POST"` — this sends submissions directly to my email via Formspree's free tier. Leave `YOUR_FORM_ID` as a clearly marked placeholder with a comment: `<!-- Replace YOUR_FORM_ID after creating a free form at formspree.io -->`.
   - A prominent WhatsApp button/card using a click-to-chat link: `https://wa.me/91XXXXXXXXXX` (replace XXXXXXXXXX with my number, no spaces or symbols) with `?text=Hi%20Harjeet%2C%20I%20came%20across%20your%20portfolio...` appended so the chat opens with a pre-filled friendly message. Style it as its own card with the WhatsApp icon (Lucide has one), separate from the form — not buried as a small icon link.
   - Keep email/phone/LinkedIn/GitHub as smaller icon links alongside, but the form + WhatsApp button should be the visual focus of this section.
10. **Footer** — name, nav links, socials, current year via one line of JS.

### FILE STRUCTURE
```
/
├── index.html
├── /css/style.css
├── /js/main.js
├── /assets/images/   (placeholder folder)
├── /assets/resumes/  (placeholder folder)
└── README.md         (plain-language: how to swap photo/resume, edit text, and upload to Hostinger public_html via File Manager)
```

### BUILD APPROACH — DO THIS IN ONE PASS
Build the entire site in a single response rather than section-by-section back-and-forth — the scope above is fully specified, so there's no need to check in with me mid-build. Only pause to ask me something if a genuine ambiguity comes up. Once it's built, I'll review the whole thing and give you one consolidated list of changes rather than one-off requests.

### SELF-REVIEW BEFORE HANDING BACK TO ME
Once the site is built, use your browser/screenshot tooling (if available in this environment) to open `index.html` and take a screenshot at both desktop width (~1440px) and mobile width (~390px). Look at the screenshot critically against the design goals above (clean spacing, readable hierarchy, no overlapping/cut-off text or broken layout, consistent accent color use). If you spot an issue, fix it and take another screenshot to confirm the fix worked before moving on. Repeat this screenshot-review-fix loop until both the desktop and mobile views look clean and professional, then hand the finished site back to me. If browser/screenshot tooling isn't available in this environment, skip this step and just tell me so, and I'll review manually in my own browser instead.

=====

## Steps to keep token usage low while working with Claude Code

1. **Let it build in one shot.** The prompt above is fully specified on purpose — the more decisions you leave open, the more back-and-forth (and tokens) it takes. Resist the urge to add "oh and also" mid-build; save changes for a review pass.
2. **Review everything, then batch your feedback.** After the first build, open `index.html` in a browser, look at the whole site, and write ONE message listing every change you want ("make hero text bigger, fix mobile nav spacing, change accent color to X, swap achievement icons"). One batched message costs far fewer tokens than five separate small requests, because Claude Code re-reads relevant file context each time you send a message.
3. **Use `/clear` between unrelated tasks.** Once the site is done and you move to something unrelated (e.g. a different project), start a fresh Claude Code session rather than continuing in the same long conversation — long conversation history is repeatedly re-sent as context and burns tokens even on simple requests.
4. **Point Claude Code at specific files for small edits.** For a small fix ("change the accent color"), say so explicitly and name the file (`in css/style.css, change the accent...`) rather than a vague "can you improve the styling" — vague requests make it re-scan more files than needed.
5. **Don't ask it to "explain what it did" unless you need to know.** Explanations are extra output tokens. If you just want the change made, say "just make the change, no need to explain."
6. **Stay on Sonnet 5 throughout.** It's fully capable of this build and is Anthropic's cost-efficient default — don't switch to Opus/Fable unless something is genuinely stuck after 2-3 attempts.

## Before your form and WhatsApp button work live, do this (5 minutes, can't be done by Claude Code — needs your accounts)

1. **Formspree setup**: Go to formspree.io → sign up free (no card needed) → "New Form" → give it a name like "Portfolio Contact" → it'll give you a form endpoint like `https://formspree.io/f/abc123xyz`. Copy that.
2. In `index.html`, find the placeholder comment `<!-- Replace YOUR_FORM_ID -->` and replace `YOUR_FORM_ID` with just the code part (e.g. `abc123xyz`).
3. **WhatsApp number**: In the same file, find `91XXXXXXXXXX` and replace with your real number in international format, no spaces/dashes (e.g. `919876543210` for a 10-digit Indian number with country code 91).
4. Re-upload just `index.html` to Hostinger's `public_html` (overwrite the old one) — no need to re-upload everything.
5. Test it: submit the form once yourself and check your email lands; click your own WhatsApp button and confirm the chat opens correctly.

## Uploading to Hostinger once done
1. hPanel → File Manager → `public_html`.
2. Delete any default placeholder files there.
3. Upload the *contents* of your project folder (`index.html`, `/css`, `/js`, `/assets`) directly into `public_html`.
4. Visit your domain — live immediately, no build step.

# Harjeet Singh Pannu — Background Profile (for Portfolio Website Context)

## Basic Info
- **Name:** Harjeet Singh Pannu
- **Location:** Mumbai (strong preference to stay based here)
- **Status:** Fresher, actively job hunting, available to join immediately
- **LinkedIn:** linkedin.com/in/harjeet-singh-pannu-677b2524b
- **GitHub:** github.com/harjeet2004

## Education
- **B.Tech, Electronics & Communication Engineering (ECE)** — VIT Chennai
- **Duration:** 2022–2026
- **CGPA:** 9.4+/10

## Professional Experience
**Research Analyst Intern — JPMorgan Chase, CIB Centralized Research Group (Mid-Cap Investment Banking), Mumbai**
- Duration: 6 months, Jan–Jun 2026 (during 8th semester)
- Actual scope of work: pitch book preparation, financial analysis, valuation work, and industry/sector research
- This should be framed accurately — it was research and analysis support work, not deal execution or client-facing banking

## Career Positioning
Harjeet has 4 distinct professional "tracks" he presents depending on the audience — the portfolio site can either pick a primary lens (recommended: Finance, since it's his main target) or present a general profile with these as areas of interest:

1. **Finance (Primary target)** — Financial Analyst / Research Analyst / Credit & Investment Analysis. Core tools: Python, SQL, Excel, MATLAB.
2. **Product Management** — User Research & Growth, 0→1 Product Building.
3. **Semiconductor/Hardware** — VLSI & Embedded Systems, Hardware Design. Tools: Verilog, Cadence, ModelSim, ANSYS HFSS, ESP32.
4. **AI/Gaming** — AI-Driven Systems, Interactive Experience Design. Tools: YOLOv8, OpenCV, TensorFlow.

**For the portfolio site, the primary headline should lead with Finance/Research Analyst positioning**, since that's his active job-search focus, with the other tracks shown as broader technical range (not diluting the main pitch).

Suggested headline style (matches his LinkedIn): *"Aspiring Research Analyst | Ex-JPMorgan Chase (CIB) Intern | Business & Financial Analysis | Data Analytics | B.Tech ECE, VIT Chennai"*

## Key Achievements & Credentials
- **Patent under review:** Smart Multi-Biometric UPI Payment Authentication System
- **WorldQuant Quantitative Championship 2025:** Ranked #79 globally out of 76,886 participants
- **Pitch-A-Thon:** 1st Runner-Up (70+ teams)
- **ICDTSA Conference:** International Research Finalist
- **Certification:** Ethnus VLSI Design & Verification
- **Leadership:** Led sponsorship and outreach for the Fraternity of Young Innovators

## Portfolio Projects

### 1. Smart Multi-Biometric UPI Payment Authentication System (patent under review)
- Identified a security gap in OTP-based UPI authentication (vulnerable to fraud)
- Designed a dynamic, biometric-linked authentication layer as a fix
- Framing: found a non-obvious problem, validated it, designed a solution — good 0→1 story

### 2. IntelliWeed — AI-based selective weed detection
- Tech: YOLOv8, OpenCV, Raspberry Pi
- Result: 90% detection accuracy, ~40% reduction in manual labor vs. blanket herbicide spraying
- Framing: identified the real-world problem of indiscriminate herbicide use, validated via field research, built and deployed a working robot

### 3. Smart Plant Health Monitoring System
- Tech: IoT, Arduino, Blynk app
- Result: ~50% improvement in water-use efficiency

### 4. Portfolio Risk Analyzer with AI News Sentiment Overlay (in progress — next flagship project)
- Tech stack: FinBERT (sentiment analysis on financial news), yfinance (market data), Firebase (backend/storage)
- Purpose: overlays real-time news sentiment on portfolio risk metrics — directly relevant to the Research Analyst positioning
- This should be a featured/flagship project once complete, since it's the most directly aligned with his target roles

### 5. Deal Screener
- Tech: Serper.dev API (search), Groq API (LLM), Gmail API (automated alerts)
- Note: currently has API quota constraints limiting a live shareable demo; recommended fix is decoupling computation via GitHub Actions cron jobs + Firestore for storage — worth mentioning on the site as "in refinement" if not yet live

### 6. Job Alert Bot
- Tech: Adzuna API, Claude API, Twilio, GitHub Actions
- Automated job-matching and SMS/notification alerts

### 7. Portfolio MIS Dashboard (built for MGA Ventures interview)
- Tech: Streamlit
- Features: Indian rupee formatting, CAGR calculations, analyst notes section

### 8. Comparable-Company Valuation Model
- Built for MGA Ventures (Mumbai family office — Seed to Series B, Consumer/Fintech/SaaS focus) interview prep

### 9. Stepped Bowtie Antenna for Underwater Wireless Communications
- Tech: ANSYS HFSS, 10GHz frequency design
- Hardware/RF engineering project — relevant to Semiconductor track only

## Skills Summary
- **Finance/Analysis:** Equity Research, Financial Modeling, Valuation, Pitch Book Preparation, Comparable Company Analysis, MS Excel
- **Programming/Data:** Python, SQL, MATLAB
- **AI/ML:** YOLOv8, OpenCV, TensorFlow, FinBERT
- **Hardware/VLSI:** Verilog, Cadence, ModelSim, ANSYS HFSS, ESP32, IoT (Arduino/Blynk)
- **Other tools:** Firebase, GitHub Actions, Streamlit, Twilio, various APIs (Serper, Groq, Adzuna, Claude)

## Tone & Content Guidance for the Site
- Prioritize the **Finance/Research Analyst** narrative — this is his active job search target
- Present other tracks (Gaming, Semiconductor, Product) as breadth/technical range, not competing headlines
- Keep project write-ups outcome-focused (metrics: 90% accuracy, 50% efficiency, #79/76,886 rank) rather than deeply technical/code-level, since Harjeet prefers explaining things at a workflow/reasoning level rather than deep implementation detail
- Include a resume download — ideally supporting multiple tracks if the site allows toggling, otherwise default to the Finance resume
- Contact: WhatsApp click-to-chat + a contact form (Formspree), consistent with his existing site prompt
- Overall goal of the site: support his active Mumbai-based Financial Analyst/Research Analyst job search — should read as credible, quantified, and recruiter-scannable rather than portfolio-for-portfolio's-sake
