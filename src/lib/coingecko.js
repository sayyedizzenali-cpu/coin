// src/lib/coingecko.js
// CoinGecko Free API — no key needed for basic endpoints

const BASE = 'https://api.coingecko.com/api/v3'

// Cache duration in seconds
const CACHE_SHORT = 60        // 1 min — live prices
const CACHE_LONG  = 3600      // 1 hour — coin list
const CACHE_DAY   = 86400     // 1 day — static info

// Helper: fetch with Next.js cache
async function fetchCG(path, revalidate = CACHE_SHORT) {
  const url = `${BASE}${path}`
  try {
    const res = await fetch(url, {
      next: { revalidate },
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`)
    return await res.json()
  } catch (e) {
    console.error('CoinGecko fetch error:', e.message)
    return null
  }
}

// ─── GET TOP COINS (for homepage + sitemap) ───────────────────────────────
export async function getTopCoins(page = 1, perPage = 250) {
  return fetchCG(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
    CACHE_SHORT
  )
}

// ─── GET ALL COIN IDS (for generateStaticParams — builds all pages) ────────
export async function getAllCoinIds() {
  const data = await fetchCG('/coins/list?include_platform=false', CACHE_DAY)
  if (!data) return []
  return data.map(c => ({ slug: c.id }))
}

// ─── GET SINGLE COIN DETAIL ───────────────────────────────────────────────
export async function getCoinDetail(id) {
  return fetchCG(
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
    CACHE_SHORT
  )
}

// ─── GET COIN PRICE IN MULTIPLE CURRENCIES ────────────────────────────────
export async function getCoinMultiPrice(id, currencies = 'usd,eur,gbp,pkr,inr,aed,sar,try,brl') {
  return fetchCG(
    `/simple/price?ids=${id}&vs_currencies=${currencies}&include_24hr_change=true&include_market_cap=true`,
    CACHE_SHORT
  )
}

// ─── GET GLOBAL MARKET DATA ──────────────────────────────────────────────
export async function getGlobalData() {
  return fetchCG('/global', CACHE_SHORT)
}

// ─── GET TRENDING COINS ──────────────────────────────────────────────────
export async function getTrending() {
  return fetchCG('/search/trending', CACHE_SHORT)
}

// ─── GET COIN CHART DATA (7d, 30d, 1y) ───────────────────────────────────
export async function getCoinChart(id, days = 7, currency = 'usd') {
  return fetchCG(
    `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
    CACHE_SHORT
  )
}

// ─── SEARCH COINS ────────────────────────────────────────────────────────
export async function searchCoins(query) {
  return fetchCG(`/search?query=${encodeURIComponent(query)}`, CACHE_SHORT)
}

// ─── FORMAT HELPERS ──────────────────────────────────────────────────────
export function formatPrice(price, currency = 'USD') {
  if (!price && price !== 0) return 'N/A'
  const symbols = { USD:'$', EUR:'€', GBP:'£', PKR:'₨', INR:'₹', AED:'د.إ', SAR:'﷼', TRY:'₺', BRL:'R$' }
  const sym = symbols[currency.toUpperCase()] || currency + ' '
  if (price >= 1e9)  return sym + (price/1e9).toFixed(2)  + 'B'
  if (price >= 1e6)  return sym + (price/1e6).toFixed(2)  + 'M'
  if (price >= 1e3)  return sym + price.toLocaleString('en-US', {maximumFractionDigits:2})
  if (price >= 1)    return sym + price.toFixed(4)
  if (price >= 0.01) return sym + price.toFixed(6)
  return sym + price.toFixed(8)
}

export function formatChange(pct) {
  if (pct == null) return { text: '—', positive: null }
  const positive = pct >= 0
  return { text: (positive ? '+' : '') + pct.toFixed(2) + '%', positive }
}

export function formatMarketCap(val) {
  if (!val) return 'N/A'
  if (val >= 1e12) return '$' + (val/1e12).toFixed(2) + 'T'
  if (val >= 1e9)  return '$' + (val/1e9).toFixed(2)  + 'B'
  if (val >= 1e6)  return '$' + (val/1e6).toFixed(2)  + 'M'
  return '$' + val.toLocaleString()
}

// Supported currencies with names (for multi-currency pages)
export const CURRENCIES = [
  { code: 'usd', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'eur', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'gbp', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'pkr', name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰' },
  { code: 'inr', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'aed', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'sar', name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
  { code: 'try', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  { code: 'brl', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
]
