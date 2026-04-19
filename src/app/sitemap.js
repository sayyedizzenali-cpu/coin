// src/app/sitemap.js — Updated with buy + price pages
export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'
  let coinUrls = [], buyUrls = [], priceUrls = []
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1',
      { next: { revalidate: 86400 } }
    )
    const coins = await res.json()
    const topCountries = ['pakistan','india','united-states','united-kingdom','nigeria','uae','turkey','brazil','indonesia','philippines','south-africa','canada','australia','saudi-arabia','kenya']
    const currencies = ['pkr','inr','aed','sar','gbp','eur','try','brl','jpy']
    coinUrls = (coins||[]).map(c => ({ url: `${BASE}/coins/${c.id}`, lastModified: new Date(), changeFrequency: 'hourly', priority: c.market_cap_rank <= 10 ? 1.0 : c.market_cap_rank <= 50 ? 0.9 : 0.8 }))
    for (const coin of (coins||[]).slice(0,100)) {
      for (const country of topCountries) { buyUrls.push({ url: `${BASE}/buy/${coin.id}/${country}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }) }
      for (const cur of currencies) { priceUrls.push({ url: `${BASE}/price/${coin.id}/${cur}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.85 }) }
    }
  } catch(e) {}
  const comparePairs = ['bitcoin-vs-ethereum','bitcoin-vs-solana','ethereum-vs-solana','bitcoin-vs-binancecoin']
  const compareUrls = comparePairs.map(pair => ({ url: `${BASE}/compare/${pair}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 }))
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    ...coinUrls, ...buyUrls, ...priceUrls, ...compareUrls,
  ]
}
