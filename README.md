# CryptoWorld — Worldwide Crypto Site

## Quick Deploy (5 minutes)

### Step 1: GitHub pe Upload karo
```bash
git init
git add .
git commit -m "Initial crypto site"
git remote add origin https://github.com/YOUR_USERNAME/crypto-world.git
git push -u origin main
```

### Step 2: Netlify pe Deploy karo
1. netlify.com pe jaen → "Add new site" → "Import from Git"
2. Apna GitHub repo select karo
3. Build settings auto-detect honge (netlify.toml se)
4. "Deploy site" click karo
5. 2-3 minutes mein site live!

### Step 3: Custom Domain Add karo
1. Netlify dashboard → "Domain settings"
2. "Add custom domain" → apna domain type karo
3. Apne domain registrar pe DNS records update karo:
   - A record: 75.2.60.5
   - CNAME: your-site.netlify.app

### Step 4: Environment Variables
Netlify dashboard → Site settings → Environment variables:
```
NEXT_PUBLIC_SITE_URL = https://your-actual-domain.com
```

## Site Structure
```
src/app/
├── page.js              # Homepage — top 100 coins table
├── layout.js            # Navbar + footer
├── globals.css          # All styles
├── sitemap.js           # Auto XML sitemap
├── robots.js            # robots.txt
├── coins/
│   └── [slug]/page.js   # Individual coin pages (17,000+)
└── compare/
    └── [pair]/page.js   # Coin vs coin comparison

src/lib/
└── coingecko.js         # API functions + formatters

public/
└── llms.txt             # LLM optimization
```

## Scaling to Lakhs Pages

### More Coin Pages (already works):
The `generateStaticParams` in `coins/[slug]/page.js` currently builds top 250 coins.
To increase to ALL 17,000 coins:
```js
// In src/app/coins/[slug]/page.js, replace generateStaticParams:
export async function generateStaticParams() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/list')
  const coins = await res.json()
  return coins.map(c => ({ slug: c.id }))
}
```

### Add Price-in-Currency Pages:
Create `src/app/price/[coin]/[currency]/page.js`
URL pattern: /price/bitcoin/pkr, /price/ethereum/inr, etc.
This alone = 17,000 coins × 12 currencies = 204,000 pages!

### Add "How to Buy" Pages:
Create `src/app/buy/[coin]/[country]/page.js`
URL: /buy/bitcoin/pakistan, /buy/ethereum/india
= 17,000 coins × 50 countries = 850,000 pages!

## Free Hosting Limits (Netlify)
- 100GB bandwidth/month — free
- 300 build minutes/month — free
- Unlimited sites — free
- Custom domain — free
- HTTPS/SSL — free

## CoinGecko API Free Limits
- 10,000 calls/month on free tier
- Use ISR (revalidate: 60) to cache and reduce calls
- Top 250 coins data cached for 60 seconds
- Coin list cached for 24 hours

## Cost Summary
| Item | Cost |
|------|------|
| Domain (.com) | ~$10/year |
| Netlify hosting | FREE |
| CoinGecko API | FREE |
| **Total** | **~$10/year** |
