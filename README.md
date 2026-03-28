# CryptoMood Dash

A fast, responsive dashboard showing the **Crypto Fear & Greed Index** and **top cryptocurrency prices** at a glance.

## Features

- Live Fear & Greed Index with animated semicircular gauge
- Top 10 cryptocurrency prices with 24h change and 7-day sparklines
- Auto-refreshing data (gauge: 5 min, prices: 60 sec)
- Soft dark theme optimized for repeated daily viewing
- Fully responsive (mobile, tablet, desktop)
- SEO optimized with Open Graph and Twitter Card meta tags
- Visitor counter
- Google Sheets data collection webhook
- Adsterra ad placeholders

## Quick Start

```bash
# Clone and serve locally
git clone <repo-url>
cd cryptomood-dash
bash init.sh
```

Or just open `index.html` in your browser.

## APIs Used

- [Alternative.me Fear & Greed Index](https://alternative.me/crypto/fear-and-greed-index/) — free, no key needed
- [CoinGecko API](https://www.coingecko.com/en/api) — free, no key needed

## Setup Guides

- [Google Sheets Data Collection](SETUP_GOOGLE_SHEETS.md)
- [Adsterra Ad Integration](SETUP_ADS.md)

## Tech Stack

- HTML + Tailwind CSS (CDN) + Vanilla JS
- Zero dependencies, zero build step
- Deployed on Vercel/Netlify (free tier)
