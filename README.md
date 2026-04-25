# Jyotish — Vedic Master Reading System

A complete 23-module Vedic astrology reading website powered by Claude AI.

## Files
```
vedic-reading/
├── index.html       ← Main website
├── css/style.css    ← All styles
├── js/app.js        ← All logic + API calls
└── README.md        ← This file
```

## How It Works
- User fills in birth details + selects modules
- Uploads handwriting / palm / face images (optional — unlocks Modules 19, 20, 21)
- Enters their Anthropic API key (used only in-browser, never stored)
- Clicks Generate — calls Claude API directly from the browser
- Results appear tab-by-tab, exportable as text

---

## Deployment Options

### Option 1 — Netlify (Recommended, Free, 5 minutes)
1. Go to https://netlify.com and sign up free
2. Drag and drop the entire `vedic-reading/` folder onto the Netlify dashboard
3. Netlify gives you a live URL instantly (e.g. https://jyotish-reading.netlify.app)
4. To use a custom domain: Site settings → Domain management → Add custom domain

### Option 2 — Vercel (Free, also 5 minutes)
1. Install Vercel CLI: `npm i -g vercel`
2. Inside the `vedic-reading/` folder, run: `vercel`
3. Follow prompts — live URL in seconds

### Option 3 — GitHub Pages (Free)
1. Create a new GitHub repo
2. Push all files to the repo root
3. Go to repo Settings → Pages → Source: Deploy from branch (main)
4. Your site is live at https://yourusername.github.io/repo-name

### Option 4 — Cloudflare Pages (Free, fastest CDN)
1. Go to https://pages.cloudflare.com
2. Connect your GitHub repo OR upload files directly
3. No build command needed — it's pure HTML/CSS/JS
4. Live on Cloudflare's global CDN

### Option 5 — Local / Self-hosted
Just open `index.html` in any browser. Works completely offline except for API calls.

---

## API Key Setup
Users need an Anthropic API key:
1. Sign up at https://console.anthropic.com
2. Create an API key under API Keys
3. Paste it into the website's API Key field
4. The key is used only in the browser session — never stored

To avoid users needing their own key, you can hardcode yours in js/app.js:
Find `const apiKey = gv('f-apikey');` and replace with `const apiKey = 'sk-ant-YOUR-KEY-HERE';`
Then remove the API key form field from index.html Step 05.

**Warning:** If you hardcode the key, the website must be password-protected or private,
otherwise anyone can use your API credits.

---

## Customisation
- **Branding**: Change "Jyotish" in index.html nav and footer
- **Default modules**: Edit `DEFAULT_ON` set in js/app.js
- **Model**: Change `claude-opus-4-5` in app.js to `claude-sonnet-4-6` for faster/cheaper responses
- **Colors**: Edit `#c4a97d` (gold), `#07050f` (dark bg), `#e8d5a3` (light gold) in style.css

---

## Notes
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Fully mobile responsive
- Images (palm, face, handwriting) are base64-encoded in the browser — never uploaded to any server
- Export function saves the full reading as a .txt file
