#!/usr/bin/env node
// automation/generate.js — CryptoWorld MEGA Generator v2.0
// Target: 100,000+ pages
// Commands: node generate.js [all|coins|buy|price|prediction|compare|glossary|exchange|regulation|learn|sitemap|status|deploy]

const fs   = require('fs')
const path = require('path')
const https = require('https')

// ── CONFIG ────────────────────────────────────────────────────────────────────
const CONFIG = {
  siteDir:    './src',
  maxCoins:   500,
  batchSize:  5,
  delayMs:    3000,

  countries: [
    'pakistan','india','united-states','united-kingdom','nigeria','uae','turkey',
    'brazil','indonesia','philippines','south-africa','canada','australia',
    'saudi-arabia','kenya','ghana','egypt','malaysia','singapore','thailand',
    'bangladesh','vietnam','south-korea','japan','germany','france','spain',
    'mexico','argentina','sri-lanka','nepal','myanmar','ethiopia','tanzania',
    'cameroon','ivory-coast','senegal','morocco','algeria','tunisia','jordan',
    'iraq','kuwait','qatar','ukraine','russia','poland','netherlands','sweden',
    'norway','denmark','finland','czech-republic','portugal','greece','romania',
  ],

  currencies: [
    'pkr','inr','aed','sar','gbp','eur','try','brl','jpy','cad',
    'aud','myr','usd','sgd','hkd','chf','sek','nok','dkk','thb',
    'krw','idr','php','bdt','vnd','ngn','kes','zar','egp','ars',
  ],

  years: [
    '2025','2026','2027','2028','2029','2030',
    '2031','2032','2033','2034','2035','2040','2050',
  ],

  exchanges: [
    'binance','coinbase','kraken','okx','kucoin','bybit',
    'gate-io','mexc','bitget','huobi','bitfinex','gemini',
  ],

  wallets: [
    'metamask','trust-wallet','ledger','trezor','coinbase-wallet',
    'phantom','exodus','atomic-wallet','myetherwallet','electrum',
  ],

  glossaryTerms: [
    'blockchain','bitcoin','ethereum','defi','nft','smart-contract',
    'proof-of-work','proof-of-stake','wallet','staking','altcoin',
    'stablecoin','gas-fee','mining','dex','halving','dao','web3',
    'market-cap','layer-2','yield-farming','seed-phrase','liquidity-pool',
    'cold-storage','bull-market','bear-market','dca','hodl',
    'impermanent-loss','amm','tokenomics','apy','private-key',
    'hash-rate','fork','cbdc','kyc','metaverse','regulation','whale',
    'gas-limit','consensus-mechanism','block-reward','decentralization',
    'interoperability','layer-1','cross-chain','leverage','futures',
    'volatility','slippage','liquidity','whitepaper','ico','satoshi',
    'wei','gwei','mempool','merkle-tree','genesis-block','block-explorer',
    'confirmations','long-short','margin','stop-loss','candlestick','rsi',
    'tvl','flash-loan','liquidation','collateral','lending-protocol',
    'zero-knowledge-proof','rollup','optimistic-rollup','zk-rollup','evm',
    '51-attack','rug-pull','honeypot','multisig','audit','erc-20',
    'erc-721','wrapped-token','governance-token','utility-token',
    'validator','delegator','node','testnet','mainnet','rpc',
    'fud','fomo','hodl','ngmi','wagmi','dyor','gm','ape-in',
    'mev','front-running','arbitrage','liquidation-cascade',
    'protocol-owned-liquidity','ve-tokenomics','real-yield',
  ],

  learnTopics: [
    'how-to-buy-bitcoin-pakistan','how-to-buy-ethereum-india',
    'how-to-buy-bitcoin-indonesia','how-to-buy-bitcoin-philippines',
    'how-to-buy-bitcoin-bangladesh','how-to-buy-bitcoin-malaysia',
    'how-to-buy-bitcoin-vietnam','how-to-buy-bitcoin-uae',
    'how-to-buy-bitcoin-nigeria','how-to-buy-bitcoin-turkey',
    'how-to-buy-ethereum-pakistan','how-to-buy-solana-pakistan',
    'how-to-buy-bnb-pakistan','how-to-buy-xrp-pakistan',
    'how-to-buy-cardano-india','how-to-buy-solana-india',
    'crypto-tax-pakistan','crypto-tax-india','crypto-tax-indonesia',
    'crypto-tax-philippines','crypto-tax-nigeria','crypto-tax-uae',
    'crypto-tax-turkey','crypto-tax-brazil','crypto-tax-malaysia',
    'crypto-legal-pakistan','crypto-legal-india','crypto-legal-indonesia',
    'is-crypto-legal-pakistan','is-crypto-legal-india',
    'best-crypto-exchange-pakistan','best-crypto-exchange-india',
    'best-crypto-exchange-indonesia','best-crypto-exchange-nigeria',
    'best-crypto-exchange-uae','best-crypto-exchange-turkey',
    'binance-tutorial-beginners','okx-tutorial-beginners',
    'kucoin-tutorial-beginners','coinbase-tutorial-beginners',
    'jazzcash-crypto-pakistan','easypaisa-crypto-pakistan',
    'upi-crypto-india','gcash-crypto-philippines','bkash-crypto-bangladesh',
    'mpesa-crypto-kenya','momo-crypto-vietnam',
    'best-crypto-wallet-2026','best-hardware-wallet-2026',
    'metamask-setup-guide','trust-wallet-guide','ledger-guide',
    'trezor-guide','phantom-wallet-guide','exodus-wallet-guide',
    'crypto-for-beginners','bitcoin-explained','ethereum-explained',
    'defi-explained','nft-guide','blockchain-explained',
    'crypto-security-tips','how-to-avoid-crypto-scams',
    'cold-storage-guide','hardware-wallet-vs-software-wallet',
    'bitcoin-halving-explained','ethereum-merge-explained',
    'defi-yield-farming-guide','nft-buying-guide-asia',
    'staking-guide-beginners','crypto-staking-pakistan',
    'bitcoin-price-prediction-2025','ethereum-price-prediction-2025',
    'solana-price-prediction-2025','bnb-price-prediction-2025',
    'xrp-price-prediction-2025','cardano-price-prediction-2025',
    'bitcoin-price-prediction-2030','ethereum-price-prediction-2030',
    'crypto-portfolio-beginners','diversified-crypto-portfolio',
    'dollar-cost-averaging-crypto','best-time-buy-bitcoin',
    'bitcoin-vs-gold','ethereum-vs-bitcoin','solana-vs-ethereum',
    'binance-vs-coinbase','okx-vs-binance','kucoin-vs-binance',
    'crypto-mining-guide','bitcoin-mining-2026','ethereum-mining-history',
    'proof-of-work-vs-proof-of-stake','layer2-explained',
    'arbitrum-guide','optimism-guide','polygon-guide',
    'uniswap-guide','aave-guide','compound-guide',
    'crypto-passive-income','crypto-lending-guide',
    'wrapped-bitcoin-explained','stablecoin-guide',
    'usdc-vs-usdt','dai-stablecoin-explained',
  ],
}

// ── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  green:  t => `\x1b[32m${t}\x1b[0m`,
  red:    t => `\x1b[31m${t}\x1b[0m`,
  yellow: t => `\x1b[33m${t}\x1b[0m`,
  blue:   t => `\x1b[34m${t}\x1b[0m`,
  bold:   t => `\x1b[1m${t}\x1b[0m`,
  dim:    t => `\x1b[2m${t}\x1b[0m`,
}

function log(emoji, msg, color = 'green') {
  console.log(`${emoji}  ${C[color](msg)}`)
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')) } catch { return null }
}

function writeJSON(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// ── API ───────────────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'CryptoWorld/2.0' }
    }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch(e) { reject(new Error('JSON parse failed')) }
      })
    }).on('error', reject)
  })
}

// ── COIN CACHE ────────────────────────────────────────────────────────────────
const CACHE_FILE = '.cache/coins.json'

async function getCoinsList() {
  // Use cache if fresh (< 1 hour)
  const cached = readJSON(CACHE_FILE)
  if (cached && cached.timestamp && Date.now() - cached.timestamp < 3600000) {
    log('💾', `Using cached coins (${cached.coins.length})`, 'blue')
    return cached.coins
  }

  log('🌐', 'Fetching 500 coins from CoinGecko...', 'yellow')
  const allCoins = []

  for (let page = 1; page <= 2; page++) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const coins = await fetchJSON(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}`
        )
        if (!Array.isArray(coins)) throw new Error('Not an array')
        allCoins.push(...coins)
        log('✓', `Page ${page}: ${coins.length} coins (total: ${allCoins.length})`, 'green')
        if (page < 2) await sleep(CONFIG.delayMs)
        break
      } catch(e) {
        log('⚠', `Page ${page} attempt ${attempt} failed: ${e.message}`, 'yellow')
        if (attempt < 3) await sleep(5000)
      }
    }
  }

  if (allCoins.length === 0) {
    log('❌', 'Could not fetch coins!', 'red')
    process.exit(1)
  }

  ensureDir('.cache')
  writeJSON(CACHE_FILE, { timestamp: Date.now(), coins: allCoins })
  log('💾', `Cached ${allCoins.length} coins`, 'green')
  return allCoins
}

// ── UPDATER ───────────────────────────────────────────────────────────────────
function updateStaticParams(filePath, newFn) {
  if (!fs.existsSync(filePath)) {
    log('❌', `Not found: ${filePath}`, 'red')
    return false
  }
  let content = fs.readFileSync(filePath, 'utf8')
  // Replace existing generateStaticParams
  const regex = /export\s+async\s+function\s+generateStaticParams\s*\(\s*\)\s*\{[\s\S]*?\n\}/
  if (regex.test(content)) {
    content = content.replace(regex, newFn)
  } else {
    // Add after revalidate line or at start
    content = newFn + '\n\n' + content
  }
  fs.writeFileSync(filePath, content, 'utf8')
  return true
}

// ── GENERATORS ────────────────────────────────────────────────────────────────

async function generateCoins(coins) {
  const top100 = coins.slice(0, 100).map(c => `'${c.id}'`).join(',\n    ')
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()}
  const coins = [
    ${top100}
  ]
  return coins.map(id => ({ slug: id }))
}`
  const ok = updateStaticParams(`${CONFIG.siteDir}/app/coins/[slug]/page.js`, fn)
  if (ok) log('✅', `Coin pages: 100 pre-built, ${coins.length} via ISR`, 'green')
  return 100
}

async function generateBuy(coins) {
  const top100 = coins.slice(0, 100).map(c => `'${c.id}'`).join(',\n    ')
  const countries = CONFIG.countries.map(c => `'${c}'`).join(',\n    ')
  const total = 100 * CONFIG.countries.length
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()} — ${total} pages
  const coins = [
    ${top100}
  ]
  const countries = [
    ${countries}
  ]
  const params = []
  for (const coin of coins) {
    for (const country of countries) {
      params.push({ coin, country })
    }
  }
  return params
}`
  const ok = updateStaticParams(`${CONFIG.siteDir}/app/buy/[coin]/[country]/page.js`, fn)
  if (ok) log('✅', `Buy pages: ${total.toLocaleString()} (100 coins × ${CONFIG.countries.length} countries)`, 'green')
  return total
}

async function generatePrice(coins) {
  const allCoins = coins.slice(0, 500).map(c => `'${c.id}'`).join(',\n    ')
  const currencies = CONFIG.currencies.map(c => `'${c}'`).join(',\n    ')
  const total = 500 * CONFIG.currencies.length
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()} — ${total} pages
  const coins = [
    ${allCoins}
  ]
  const currencies = [
    ${currencies}
  ]
  const params = []
  for (const coin of coins) {
    for (const currency of currencies) {
      params.push({ coin, currency })
    }
  }
  return params
}`
  const ok = updateStaticParams(`${CONFIG.siteDir}/app/price/[coin]/[currency]/page.js`, fn)
  if (ok) log('✅', `Price pages: ${total.toLocaleString()} (500 coins × ${CONFIG.currencies.length} currencies)`, 'green')
  return total
}

async function generatePrediction(coins) {
  const top200 = coins.slice(0, 200).map(c => `'${c.id}'`).join(',\n    ')
  const years = CONFIG.years.map(y => `'${y}'`).join(', ')
  const total = 200 * CONFIG.years.length
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()} — ${total} pages
  const coins = [
    ${top200}
  ]
  const years = [${years}]
  return coins.flatMap(coin => years.map(year => ({ coin, year })))
}`
  const ok = updateStaticParams(`${CONFIG.siteDir}/app/prediction/[coin]/[year]/page.js`, fn)
  if (ok) log('✅', `Prediction pages: ${total.toLocaleString()} (200 coins × ${CONFIG.years.length} years)`, 'green')
  return total
}

async function generateCompare(coins) {
  const top50 = coins.slice(0, 50)
  const pairs = []
  for (let i = 0; i < top50.length; i++) {
    for (let j = i + 1; j < top50.length; j++) {
      pairs.push(`'${top50[i].id}-vs-${top50[j].id}'`)
    }
  }
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()} — ${pairs.length} pairs
  const pairs = [
    ${pairs.join(',\n    ')}
  ]
  return pairs.map(pair => ({ pair }))
}`
  const ok = updateStaticParams(`${CONFIG.siteDir}/app/compare/[pair]/page.js`, fn)
  if (ok) log('✅', `Compare pages: ${pairs.length} pairs (top 50 coins)`, 'green')
  return pairs.length
}

async function generateGlossary() {
  const filePath = `${CONFIG.siteDir}/app/glossary/[term]/page.js`
  if (!fs.existsSync(filePath)) {
    log('⚠', 'Glossary [term] page not found — skipping', 'yellow')
    return 0
  }
  const terms = CONFIG.glossaryTerms.map(t => `'${t}'`).join(',\n    ')
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()}
  const terms = [
    ${terms}
  ]
  return terms.map(term => ({ term }))
}`
  updateStaticParams(filePath, fn)
  log('✅', `Glossary: ${CONFIG.glossaryTerms.length} terms`, 'green')
  return CONFIG.glossaryTerms.length
}

async function generateLearn() {
  const filePath = `${CONFIG.siteDir}/app/learn/[slug]/page.js`
  if (!fs.existsSync(filePath)) {
    log('⚠', 'Learn [slug] page not found — skipping', 'yellow')
    return 0
  }
  const topics = CONFIG.learnTopics.map(t => `'${t}'`).join(',\n    ')
  const fn = `export async function generateStaticParams() {
  // Auto-generated ${new Date().toISOString()}
  const topics = [
    ${topics}
  ]
  return topics.map(slug => ({ slug }))
}`
  updateStaticParams(filePath, fn)
  log('✅', `Learn pages: ${CONFIG.learnTopics.length} articles`, 'green')
  return CONFIG.learnTopics.length
}

async function generateExchange() {
  // Create exchange page if missing
  const dir = `${CONFIG.siteDir}/app/exchange/[country]`
  const filePath = `${dir}/page.js`
  if (!fs.existsSync(filePath)) {
    ensureDir(dir)
    fs.writeFileSync(filePath, `// Exchange page
import Link from 'next/link'
export const dynamicParams = true
export const revalidate = 86400
export async function generateStaticParams() { return [] }
export async function generateMetadata({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\\b\\w/g,l=>l.toUpperCase())
  return {
    title: \`Best Crypto Exchanges in \${name} (2026) — Top Rated\`,
    description: \`Compare the best cryptocurrency exchanges in \${name}. Find lowest fees, best security, and local payment methods.\`,
  }
}
export default function ExchangePage({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\\b\\w/g,l=>l.toUpperCase())
  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'32px 24px'}}>
      <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>
        <Link href="/">Home</Link> › <Link href="/exchange">Exchanges</Link> › <span>{name}</span>
      </div>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>Best Crypto Exchanges in {name}</h1>
      <p style={{color:'var(--text2)',marginBottom:'24px'}}>Compare top cryptocurrency exchanges available in {name} by fees, security, and features.</p>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px'}}>
        <h2 style={{fontSize:'18px',marginBottom:'12px'}}>Top Exchanges in {name}</h2>
        {['Binance','OKX','KuCoin','Bybit','Coinbase'].map((ex,i) => (
          <div key={ex} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
            <span style={{fontWeight:600}}>{i+1}. {ex}</span>
            <span style={{color:'var(--green)'}}>★★★★{i<2?'★':'☆'}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:'24px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'8px'}}>
        <Link href={\`/regulation/\${params.country}\`} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>📋 Crypto Regulation</Link>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
      </div>
    </div>
  )
}`, 'utf8')
  }

  const countries = CONFIG.countries.map(c => `'${c}'`).join(',\n    ')
  const fn = `export async function generateStaticParams() {
  const countries = [
    ${countries}
  ]
  return countries.map(country => ({ country }))
}`
  updateStaticParams(filePath, fn)
  log('✅', `Exchange pages: ${CONFIG.countries.length} countries`, 'green')
  return CONFIG.countries.length
}

async function generateRegulation() {
  const dir = `${CONFIG.siteDir}/app/regulation/[country]`
  const filePath = `${dir}/page.js`
  if (!fs.existsSync(filePath)) {
    ensureDir(dir)
    fs.writeFileSync(filePath, `// Regulation page
import Link from 'next/link'
export const dynamicParams = true
export const revalidate = 86400
export async function generateStaticParams() { return [] }
export async function generateMetadata({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\\b\\w/g,l=>l.toUpperCase())
  return {
    title: \`Crypto Regulation in \${name} (2026) — Is Crypto Legal?\`,
    description: \`Complete guide to cryptocurrency laws and regulations in \${name}. Tax rules, legal status, licensed exchanges.\`,
  }
}
export default function RegulationPage({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\\b\\w/g,l=>l.toUpperCase())
  const statuses = { pakistan:'Restricted', india:'Regulated', 'united-states':'Legal', 'united-kingdom':'Legal', uae:'Legal', turkey:'Regulated', nigeria:'Restricted' }
  const status = statuses[params.country] || 'Varies'
  const colors = { Legal:'var(--green)', Regulated:'var(--gold)', Restricted:'var(--red)', Varies:'var(--text3)' }
  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'32px 24px'}}>
      <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>
        <Link href="/">Home</Link> › <span>Crypto Regulation {name}</span>
      </div>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>Is Crypto Legal in {name}?</h1>
      <div style={{display:'inline-block',background:'var(--card)',border:\`1px solid \${colors[status]}\`,color:colors[status],borderRadius:'8px',padding:'6px 16px',fontWeight:700,marginBottom:'20px'}}>{status}</div>
      <p style={{color:'var(--text2)',marginBottom:'24px'}}>Cryptocurrency regulation in {name} as of 2026. Always verify with official sources before investing.</p>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
        <h2 style={{fontSize:'18px',marginBottom:'12px'}}>Key Regulatory Facts</h2>
        {[['Legal Status',status],['Taxation','Capital Gains Tax applies'],['Licensed Exchanges','Binance, OKX, KuCoin'],['Regulatory Body','Financial Authority']].map(([k,v])=>(
          <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:'13px'}}>
            <span style={{color:'var(--text3)'}}>{k}</span><span style={{fontWeight:500}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'8px'}}>
        <Link href={\`/exchange/\${params.country}\`} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>🏦 Best Exchanges</Link>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
      </div>
    </div>
  )
}`, 'utf8')
  }

  const countries = CONFIG.countries.map(c => `'${c}'`).join(',\n    ')
  const fn = `export async function generateStaticParams() {
  const countries = [
    ${countries}
  ]
  return countries.map(country => ({ country }))
}`
  updateStaticParams(filePath, fn)
  log('✅', `Regulation pages: ${CONFIG.countries.length} countries`, 'green')
  return CONFIG.countries.length
}

async function generateSitemap(coins, totals) {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptopakistan.com'
  const urls = [BASE, `${BASE}/trending`, `${BASE}/glossary`, `${BASE}/about`]

  coins.forEach(c => urls.push(`${BASE}/coins/${c.id}`))
  coins.slice(0,100).forEach(c => CONFIG.countries.forEach(country => urls.push(`${BASE}/buy/${c.id}/${country}`)))
  coins.forEach(c => CONFIG.currencies.forEach(cur => urls.push(`${BASE}/price/${c.id}/${cur}`)))
  coins.slice(0,200).forEach(c => CONFIG.years.forEach(year => urls.push(`${BASE}/prediction/${c.id}/${year}`)))
  const top50 = coins.slice(0,50)
  for(let i=0;i<top50.length;i++) for(let j=i+1;j<top50.length;j++) urls.push(`${BASE}/compare/${top50[i].id}-vs-${top50[j].id}`)
  CONFIG.glossaryTerms.forEach(t => urls.push(`${BASE}/glossary/${t}`))
  CONFIG.learnTopics.forEach(t => urls.push(`${BASE}/learn/${t}`))
  CONFIG.countries.forEach(c => urls.push(`${BASE}/exchange/${c}`, `${BASE}/regulation/${c}`))

  ensureDir('.cache')
  fs.writeFileSync('.cache/sitemap-urls.txt', urls.join('\n'), 'utf8')
  log('✅', `Sitemap: ${urls.length.toLocaleString()} URLs`, 'green')
  return urls.length
}

async function showStatus() {
  console.log('\n' + C.bold('═'.repeat(52)))
  console.log(C.bold('  🦎 CryptoWorld Page Generator v2.0'))
  console.log(C.bold('═'.repeat(52)))

  const checks = [
    [`${CONFIG.siteDir}/app/coins/[slug]/page.js`, 'Coin pages'],
    [`${CONFIG.siteDir}/app/buy/[coin]/[country]/page.js`, 'Buy pages'],
    [`${CONFIG.siteDir}/app/price/[coin]/[currency]/page.js`, 'Price pages'],
    [`${CONFIG.siteDir}/app/prediction/[coin]/[year]/page.js`, 'Prediction pages'],
    [`${CONFIG.siteDir}/app/compare/[pair]/page.js`, 'Compare pages'],
    [`${CONFIG.siteDir}/app/glossary/[term]/page.js`, 'Glossary pages'],
    [`${CONFIG.siteDir}/app/exchange/[country]/page.js`, 'Exchange pages'],
    [`${CONFIG.siteDir}/app/regulation/[country]/page.js`, 'Regulation pages'],
    [`${CONFIG.siteDir}/app/learn/[slug]/page.js`, 'Learn pages'],
    [`${CONFIG.siteDir}/app/trending/page.js`, 'Trending page'],
    [`${CONFIG.siteDir}/lib/coingecko.js`, 'CoinGecko lib'],
    [`${CONFIG.siteDir}/lib/countries.js`, 'Countries data'],
    [`${CONFIG.siteDir}/lib/glossary.js`, 'Glossary data'],
    [`${CONFIG.siteDir}/components/SearchBar.js`, 'Search bar'],
    [`${CONFIG.siteDir}/components/PriceChart.js`, 'Price chart'],
    [`${CONFIG.siteDir}/components/NewsSection.js`, 'News section'],
  ]

  checks.forEach(([file, label]) => {
    const exists = fs.existsSync(file)
    console.log(`  ${exists ? C.green('✓') : C.red('✗')}  ${label}`)
  })

  const cached = readJSON(CACHE_FILE)
  if (cached) {
    const n = cached.coins.length
    console.log('\n' + C.bold('  📈 Page Estimates (with cached coins):'))
    const rows = [
      ['Coin pages', `100 pre-built, ${n} via ISR`],
      ['Buy pages', `${(100 * CONFIG.countries.length).toLocaleString()} (100 × ${CONFIG.countries.length} countries)`],
      ['Price pages', `${(n * CONFIG.currencies.length).toLocaleString()} (${n} × ${CONFIG.currencies.length} currencies)`],
      ['Prediction pages', `${(200 * CONFIG.years.length).toLocaleString()} (200 × ${CONFIG.years.length} years)`],
      ['Compare pages', `${(50*49/2)} pairs (top 50 coins)`],
      ['Glossary', `${CONFIG.glossaryTerms.length} terms`],
      ['Learn articles', `${CONFIG.learnTopics.length} articles`],
      ['Exchange pages', `${CONFIG.countries.length} countries`],
      ['Regulation pages', `${CONFIG.countries.length} countries`],
    ]
    const total = 100 + (100*CONFIG.countries.length) + (n*CONFIG.currencies.length) + (200*CONFIG.years.length) + (50*49/2) + CONFIG.glossaryTerms.length + CONFIG.learnTopics.length + (CONFIG.countries.length*2)
    rows.forEach(([label, val]) => console.log(`  ${C.green('●')} ${label.padEnd(20)} ${C.bold(val)}`))
    console.log(`\n  ${C.bold('TOTAL:')}               ${C.green(C.bold(total.toLocaleString() + ' pages'))}`)
  }

  const sitemapCount = fs.existsSync('.cache/sitemap-urls.txt')
    ? fs.readFileSync('.cache/sitemap-urls.txt', 'utf8').split('\n').filter(Boolean).length
    : 0
  if (sitemapCount) console.log(`  ${C.green('●')} Sitemap URLs:        ${C.bold(sitemapCount.toLocaleString())}`)

  console.log('\n' + C.bold('  🚀 Commands:'))
  const cmds = [
    ['node automation/generate.js all', 'Generate everything'],
    ['node automation/generate.js coins', 'Update coin pages'],
    ['node automation/generate.js buy', 'Update buy pages'],
    ['node automation/generate.js price', 'Update price pages'],
    ['node automation/generate.js prediction', 'Update prediction pages'],
    ['node automation/generate.js compare', 'Update compare pages'],
    ['node automation/generate.js glossary', 'Update glossary'],
    ['node automation/generate.js exchange', 'Update exchange pages'],
    ['node automation/generate.js regulation', 'Update regulation pages'],
    ['node automation/generate.js learn', 'Update learn articles'],
    ['node automation/generate.js sitemap', 'Generate sitemap'],
    ['node automation/generate.js deploy "msg"', 'Git push to GitHub'],
    ['node automation/generate.js status', 'Show this status'],
  ]
  cmds.forEach(([cmd, desc]) => console.log(`  ${C.dim(cmd.padEnd(45))} ${desc}`))
  console.log(C.bold('═'.repeat(52)) + '\n')
}

async function deploy(message = 'Auto update pages') {
  const { execSync } = require('child_process')
  log('🚀', 'Deploying to GitHub...', 'blue')
  try {
    execSync('git add .', { stdio: 'inherit' })
    execSync(`git commit -m "${message} — ${new Date().toLocaleDateString()}"`, { stdio: 'inherit' })
    execSync('git push origin main', { stdio: 'inherit' })
    log('✅', 'Deployed! Vercel will auto-redeploy in ~2 minutes', 'green')
  } catch(e) {
    log('⚠', 'Git push failed — may already be up to date', 'yellow')
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const cmd = process.argv[2] || 'status'

  console.log('\n' + C.bold(C.blue('🦎 CryptoWorld Page Generator v2.0')))
  console.log(C.dim('   Automated page generation system\n'))

  if (cmd === 'status') { await showStatus(); return }
  if (cmd === 'deploy') { await deploy(process.argv[3]); return }

  const coins = await getCoinsList()
  console.log(C.green(`\n✓ ${coins.length} coins loaded\n`))

  const startTime = Date.now()
  const totals = {}

  if (cmd === 'all' || cmd === 'coins')      totals.coins      = await generateCoins(coins)
  if (cmd === 'all' || cmd === 'buy')        totals.buy        = await generateBuy(coins)
  if (cmd === 'all' || cmd === 'price')      totals.price      = await generatePrice(coins)
  if (cmd === 'all' || cmd === 'prediction') totals.prediction = await generatePrediction(coins)
  if (cmd === 'all' || cmd === 'compare')    totals.compare    = await generateCompare(coins)
  if (cmd === 'all' || cmd === 'glossary')   totals.glossary   = await generateGlossary()
  if (cmd === 'all' || cmd === 'learn')      totals.learn      = await generateLearn()
  if (cmd === 'all' || cmd === 'exchange')   totals.exchange   = await generateExchange()
  if (cmd === 'all' || cmd === 'regulation') totals.regulation = await generateRegulation()
  if (cmd === 'all' || cmd === 'sitemap')    totals.sitemap    = await generateSitemap(coins, totals)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  const grandTotal = Object.values(totals).reduce((a, b) => a + (b || 0), 0)

  console.log('\n' + C.bold('═'.repeat(52)))
  console.log(C.green(C.bold(`  ✅ Done in ${elapsed}s`)))
  if (cmd === 'all') {
    console.log(C.green(`  📄 ${grandTotal.toLocaleString()} pages configured`))
    console.log(C.dim('\n  Next: node automation/generate.js deploy'))
  }
  console.log(C.bold('═'.repeat(52)) + '\n')
}

main().catch(e => {
  console.error(C.red('\n❌ ' + e.message))
  process.exit(1)
})
