# PRD.md — Crypto Fear And Greed Dash

## Service Name: Crypto Fear And Greed Dash

## Short Title: Crypto Market Index

---
1
## 0. How To Use This Document (Harness Instructions for Claude Code)

This PRD follows the **Harness Design Method**. Claude Code must operate autonomously using the structure below. **No human intervention should be needed between milestones.**

### Agent Roles

| Role | Responsibility |
|---|---|
| **Planner Agent** | Reads this PRD, generates `feature_list.json` and `claude-progress.txt` |
| **Initializer Agent** | Creates project scaffold, installs deps, creates `init.sh` |
| **Coding Agent** | Picks next feature from `feature_list.json`, implements, tests, commits |
| **Reviewer Agent** | After each feature, reviews code quality, accessibility, responsiveness, SEO |

### Session Start Routine (EVERY session)

```
1. Read claude-progress.txt → know where you left off
2. Read feature_list.json → know what's next
3. Run tests / dev server → confirm nothing is broken
4. Pick the next incomplete feature → implement it
5. Test the feature → verify it works
6. Git commit with descriptive message
7. Update claude-progress.txt
8. If milestone reached → git push + update progress
9. Move to next feature or end session
```

### Files To Create On First Run

| File | Purpose |
|---|---|
| `feature_list.json` | Ordered array of all features with status (`pending` / `done`) |
| `claude-progress.txt` | Human-readable log: which features are done, current blockers, next steps |
| `init.sh` | One-command project bootstrap: install deps, env setup, dev server start |

---

## 1. Product Overview

A simple, fast, responsive dashboard that shows the **Crypto Fear & Greed Index** and **top coin prices** at a glance. Crypto investors check this data multiple times per day — the goal is to be the fastest, cleanest way to see it.

### Target Users

- Crypto investors & traders who check market sentiment daily
- Beginners looking for a simple market overview
- Anyone who wants fear/greed + price data on one page

### Core Value Proposition

- **One glance** = market sentiment + top coin prices
- **Zero cost** to run (free APIs, free hosting, free data collection)
- **Fast load** = static site, no backend required
- **Ad-monetized** from day one

---

## 2. Tech Stack & Cost Constraints

### CRITICAL: $0 Budget Rule

Every technology choice MUST be free-tier. No paid services, no credit card required.

| Layer | Choice | Why |
|---|---|---|
| Framework | **HTML + Tailwind CSS + Vanilla JS** (single page) OR **Vite + React** (if needed) | Zero build cost, fast, simple |
| Fear & Greed API | `https://api.alternative.me/fng/` | Free, no API key needed |
| Coin Price API | **CoinGecko free API** (`https://api.coingecko.com/api/v3/`) | Free, no API key, generous limits |
| Hosting | **Vercel** or **Netlify** (free tier) | Auto-deploy from GitHub, custom domain support, free SSL |
| Data Collection | **Google Sheets + Apps Script webhook** | Free, no database needed |
| Ads | **Adsterra** (primary), Google AdSense (secondary/later) | Adsterra: fast approval, good CPM for crypto niche |
| Analytics/Visitors | **Visitor counter via countapi or self-built with Google Sheets** | Free |
| Version Control | **GitHub** (created via `gh` CLI) | Free |

---

## 3. Feature Specification

### 3.1 Fear & Greed Index Gauge

- Fetch current index value from Alternative.me API
- Render as a **semicircular gauge chart** (0–100)
- Color gradient: Red (Extreme Fear) → Orange (Fear) → Yellow (Neutral) → Light Green (Greed) → Green (Extreme Greed)
- Display: numeric value, label (e.g., "Extreme Fear"), and timestamp
- Show historical data: yesterday, last week, last month values below the gauge
- Auto-refresh every 5 minutes (API updates daily, but keep UX fresh)

### 3.2 Top Coin Prices

- Fetch top 10 coins by market cap from CoinGecko API
- Display in a clean card grid or compact table:
  - Coin icon (use CoinGecko image URL)
  - Name + ticker symbol
  - Current price (USD)
  - 24h change (% with green/red color)
  - 7d sparkline mini-chart (optional, use CoinGecko sparkline data)
- Auto-refresh every 60 seconds
- Responsive: 2 columns on mobile, 4-5 on desktop

### 3.3 Responsive Design

- **Mobile-first** approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly tap targets (min 44px)
- Gauge chart must scale properly on all screens
- No horizontal scroll on any device

### 3.4 Soft Color Theme

- Background: soft dark theme (e.g., `#0f1019` or `#1a1a2e`) — NOT pure black
- Card backgrounds: slightly lighter (e.g., `#16213e` or `#1e1e30`)
- Text: soft white (`#e0e0e0`) — NOT pure white
- Accent colors: muted teal/cyan for highlights (`#00d4aa` or similar)
- Overall feel: **calm, professional, easy on the eyes** for people checking multiple times a day
- Subtle gradients and soft shadows for depth
- NO harsh contrasts, NO neon overload

### 3.5 Visitor Counter

- Track **Today's Visitors** and **Total Visitors**
- Display in footer or a subtle corner position — **must NOT interfere with main content UX**
- Implementation options (pick the simplest free one):
  - Option A: Use a free counter API (countapi.xyz or similar)
  - Option B: Google Sheets as a backend via Apps Script (POST on page load, GET for count)
- Small, muted text style — informational, not attention-grabbing

### 3.6 Data Collection via Google Sheets

- **Google Sheets webhook via Apps Script** integration
- When user clicks a "Calculate" or "Check Sentiment" button:
  - Collect: timestamp, selected coins (if any), fear/greed value at time of click, user's screen size (for analytics)
  - Auto POST to Google Sheets via Apps Script web app URL
- **Claude Code must actually create the Apps Script code** (not just a guide):
  - Provide the full `Code.gs` file content
  - Provide step-by-step deployment instructions in a `SETUP_GOOGLE_SHEETS.md` file
  - Include the fetch POST code in the frontend
  - Use a placeholder URL (`GOOGLE_SHEETS_WEBHOOK_URL`) that the user replaces after deploying

### 3.7 Ad Integration — Adsterra (Primary)

- **Adsterra** is the primary ad network (faster approval than AdSense for crypto sites)
- Ad placements (non-intrusive but visible):
  - **Banner ad** (728x90) at top of page, below header
  - **Native ad** unit between coin price cards and footer
  - **Social bar** or **popunder** (Adsterra specialty) — optional, only if it doesn't kill UX
- Implementation:
  - Create clearly marked `<!-- AD SLOT -->` placeholders in HTML
  - Include Adsterra script tags with placeholder `data-key` attributes
  - Add a comment: `// REPLACE_WITH_ADSTERRA_KEY — get from Adsterra dashboard after creating ad unit`
  - Ensure ads are responsive (Adsterra provides responsive ad codes)
  - Document in `SETUP_ADS.md`: how to sign up for Adsterra, create ad units, get keys, and paste them in

### 3.8 SEO Optimization

- Proper `<title>`: "Crypto Fear & Greed Index — Live Market Sentiment Dashboard | CryptoMood Dash"
- Meta description optimized for search
- Open Graph tags for social sharing (og:title, og:description, og:image)
- Twitter Card meta tags
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- `<h1>` for main title, proper heading hierarchy
- Schema.org structured data (WebApplication type)
- `robots.txt` and `sitemap.xml`
- Fast load time (< 2s) — critical for SEO
- `alt` text on all images
- Canonical URL tag
- `lang="en"` on `<html>`

---

## 4. Deployment & Link Privacy

### IMPORTANT: Do NOT expose GitHub username

- Deploy to **Vercel** or **Netlify** using CLI:
  - Vercel: `npx vercel --prod`
  - Netlify: `npx netlify deploy --prod`
- The public URL will be `project-name.vercel.app` or `project-name.netlify.app` — no GitHub ID exposed
- **Actually deploy the site** — do not just write a deployment guide
- If CLI login is needed, prompt the user ONCE, then automate everything else

### GitHub Repo Setup

```bash
# Create repo using gh CLI — MUST use this method
gh repo create cryptomood-dash --public --description "Crypto Fear & Greed Index Dashboard" --clone
cd cryptomood-dash
git init
git add .
git commit -m "Initial commit: project scaffold"
git push -u origin main
```

---

## 5. Git Workflow & Milestones

### Milestone-Based Git Pushes

Every milestone MUST end with `git add . && git commit -m "milestone: ..." && git push`.

| Milestone | Features Included | Commit Message |
|---|---|---|
| M1 | Project scaffold, file structure, init.sh, feature_list.json | `milestone: M1 - project scaffold and harness files` |
| M2 | Fear & Greed gauge chart working with live API | `milestone: M2 - fear and greed index gauge with live data` |
| M3 | Top coin prices grid with live CoinGecko data | `milestone: M3 - top coin prices with live data` |
| M4 | Responsive design complete + soft theme applied | `milestone: M4 - responsive design and soft color theme` |
| M5 | SEO meta tags, sitemap, robots.txt, structured data | `milestone: M5 - SEO optimization complete` |
| M6 | Visitor counter integrated | `milestone: M6 - visitor counter` |
| M7 | Google Sheets webhook + Apps Script code | `milestone: M7 - google sheets data collection` |
| M8 | Adsterra ad slots integrated with placeholder keys | `milestone: M8 - adsterra ad integration` |
| M9 | Final polish, testing, deploy to Vercel/Netlify | `milestone: M9 - final deploy to production` |

---

## 6. Automation Rules

### When Stuck, Use CLI

- If a problem can be solved via CLI → solve it via CLI. Do NOT ask the user.
- Examples:
  - `npm install` fails → fix with CLI
  - Need to check API response → `curl` it
  - Need to create directories → `mkdir -p`
  - Need to deploy → use `vercel` or `netlify` CLI
  - Need to check git status → `git status`
  - Port conflict → `lsof -i :PORT` and kill it

### Never Ask The User For

- File creation decisions (follow this PRD)
- Which package to install (follow this PRD)
- How to structure code (follow this PRD)
- Whether to commit (follow milestone table)

---

## 7. File Structure

```
cryptomood-dash/
├── index.html              # Main dashboard page
├── css/
│   └── style.css           # Custom styles (Tailwind via CDN or custom)
├── js/
│   ├── app.js              # Main app logic
│   ├── gauge.js            # Fear & Greed gauge renderer
│   ├── coins.js            # Coin price fetcher & renderer
│   ├── counter.js          # Visitor counter logic
│   └── sheets.js           # Google Sheets webhook POST
├── assets/
│   └── og-image.png        # Open Graph preview image
├── robots.txt
├── sitemap.xml
├── feature_list.json       # Harness: feature tracking
├── claude-progress.txt     # Harness: progress log
├── init.sh                 # Harness: bootstrap script
├── SETUP_GOOGLE_SHEETS.md  # Guide: Apps Script setup
├── SETUP_ADS.md            # Guide: Adsterra ad unit setup
├── CODE_GS.js              # Full Google Apps Script code (copy-paste ready)
├── vercel.json             # Vercel config (if needed)
└── README.md               # Project overview
```

---

## 8. API Reference

### Fear & Greed Index

```
GET https://api.alternative.me/fng/?limit=30&format=json
Response: { data: [{ value: "25", value_classification: "Extreme Fear", timestamp: "..." }] }
```

### CoinGecko Prices

```
GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d
Response: [{ id, symbol, name, image, current_price, price_change_percentage_24h, sparkline_in_7d: { price: [...] } }]
```

---

## 9. Quality Checklist (Reviewer Agent)

After each feature, verify:

- [ ] Mobile responsive (test at 320px, 768px, 1024px)
- [ ] No console errors
- [ ] API calls succeed (check with `curl` first if unsure)
- [ ] Lighthouse score > 90 for Performance and SEO
- [ ] All text is readable on soft dark background
- [ ] Ads don't break layout
- [ ] Git committed and pushed at milestone

---

## 10. Google Apps Script Code (CODE_GS.js)

Claude Code must create this file with the following content:

```javascript
// CODE_GS.js — Deploy this as a Google Apps Script Web App

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),                          // Timestamp
      data.fearGreedValue || '',           // Fear & Greed value
      data.fearGreedLabel || '',           // Fear & Greed label
      data.screenWidth || '',              // Screen width
      data.screenHeight || '',             // Screen height
      data.userAgent || '',                // User agent
      data.selectedCoins || '',            // Selected coins (if any)
      data.referrer || ''                  // Referrer
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  var data = sheet.getDataRange().getValues();
  var totalVisitors = data.length - 1; // Exclude header
  var todayVisitors = 0;
  
  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][0]);
    rowDate.setHours(0, 0, 0, 0);
    if (rowDate.getTime() === today.getTime()) {
      todayVisitors++;
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({
      today: todayVisitors,
      total: totalVisitors
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## 11. Adsterra Integration Notes

### Ad Formats to Use

1. **Banner 728x90** — top of page (responsive: becomes 320x50 on mobile)
2. **Native Banner** — between content sections
3. **Social Bar** — Adsterra's proprietary format, high CPM for crypto

### Code Pattern

```html
<!-- ADSTERRA BANNER — REPLACE data-key WITH YOUR KEY -->
<script async="async" data-cfasync="false" src="//pl_________.profitablegatecpm.com/REPLACE_WITH_ADSTERRA_KEY/invoke.js"></script>
<div id="container-REPLACE_WITH_ADSTERRA_KEY"></div>
```

### Setup File (SETUP_ADS.md) Must Include

1. Go to https://www.adsterra.com → Sign up as Publisher
2. Add your site URL (the Vercel/Netlify URL)
3. Wait for approval (usually < 24 hours for crypto sites)
4. Go to Dashboard → Create Ad Unit → Choose Banner / Native / Social Bar
5. Copy the provided script tag and key
6. Replace `REPLACE_WITH_ADSTERRA_KEY` in the code with your actual key

---

## 12. Final Acceptance Criteria

The project is DONE when:

1. ✅ Dashboard loads and shows live Fear & Greed gauge
2. ✅ Top 10 coin prices display with 24h change
3. ✅ Fully responsive on mobile, tablet, desktop
4. ✅ Soft dark theme — comfortable for repeated daily viewing
5. ✅ Visitor counter visible but non-intrusive
6. ✅ Google Sheets webhook POSTs data on button click
7. ✅ Adsterra ad placeholders are in place with clear replacement instructions
8. ✅ SEO meta tags, sitemap, robots.txt all present
9. ✅ Deployed to Vercel or Netlify with a clean public URL
10. ✅ GitHub repo created via `gh` CLI with all milestones pushed
11. ✅ `SETUP_GOOGLE_SHEETS.md` and `SETUP_ADS.md` documentation complete
12. ✅ Page load < 2 seconds on 4G connection
