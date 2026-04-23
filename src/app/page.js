// src/app/page.js
import { getTopCoins, getGlobalData, getTrending, formatPrice, formatChange, formatMarketCap } from '@/lib/coingecko'
import Link from 'next/link'

export const revalidate = 60 // ISR — auto refresh every 60 seconds

export const metadata = {
  title: 'CryptoWorld — Live Cryptocurrency Prices & Market Cap',
  description: 'Track live cryptocurrency prices for 17,000+ coins. Bitcoin, Ethereum, and all crypto prices in USD, EUR, GBP, PKR and 150+ currencies.',
}

function Sparkline({ prices, positive }) {
  if (!prices?.length) return null
  const min = Math.min(...prices), max = Math.max(...prices)
  const range = max - min || 1
  const w = 80, h = 28, p = 2
  const pts = prices.map((v, i) => {
    const x = p + (i / (prices.length - 1)) * (w - p * 2)
    const y = h - p - ((v - min) / range) * (h - p * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const color = positive ? '#00d4aa' : '#ff4d6a'
  const last = pts.split(' ').at(-1).split(',')
  const fill = `${pts} ${last[0]},${h - p} ${p},${h - p}`
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`}>
      <polygon points={fill} fill={positive ? 'rgba(0,212,170,0.08)' : 'rgba(255,77,106,0.08)'} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default async function HomePage() {
  const [coins, global, trending] = await Promise.all([
    getTopCoins(1, 100),
    getGlobalData(),
    getTrending()
  ])

  const g = global?.data
  const trendingCoins = trending?.coins?.slice(0, 8) || []

  return (
    <>
      {/* TICKER */}
      {coins && (
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...coins.slice(0, 20), ...coins.slice(0, 20)].map((c, i) => {
              const chg = formatChange(c.price_change_percentage_24h)
              return (
                <div key={i} className="ticker-item">
                  <span className="n">{c.symbol.toUpperCase()}</span>
                  <span className="p">{formatPrice(c.current_price)}</span>
                  <span className={chg.positive ? 'up' : 'dn'}>{chg.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* GLOBAL STATS */}
      <div className="stat-pills">
        <div className="stat-pill">
          <div className="label">Total Market Cap</div>
          <div className="value">{g ? formatMarketCap(g.total_market_cap?.usd) : '—'}</div>
        </div>
        <div className="stat-pill">
          <div className="label">24h Volume</div>
          <div className="value">{g ? formatMarketCap(g.total_volume?.usd) : '—'}</div>
        </div>
        <div className="stat-pill">
          <div className="label">BTC Dominance</div>
          <div className="value up">{g ? g.market_cap_percentage?.btc?.toFixed(1) + '%' : '—'}</div>
        </div>
        <div className="stat-pill">
          <div className="label">ETH Dominance</div>
          <div className="value">{g ? g.market_cap_percentage?.eth?.toFixed(1) + '%' : '—'}</div>
        </div>
        <div className="stat-pill">
          <div className="label">Active Coins</div>
          <div className="value">{g ? g.active_cryptocurrencies?.toLocaleString() : '—'}</div>
        </div>
      </div>

      {/* TRENDING */}
      {trendingCoins.length > 0 && (
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '100%', overflow: 'hidden' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>🔥 Trending</span>
          {trendingCoins.map((c, i) => (
            <Link key={i} href={`/coins/${c.item.id}`} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}>
              <img src={c.item.small} width={16} height={16} style={{ borderRadius: '50%' }} alt={c.item.name} />
              {c.item.symbol.toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="container" style={{ paddingTop: '24px' }}>
        <div className="section-header">
          <h1 className="section-title" style={{ fontSize: '18px' }}>Live Cryptocurrency Prices by Market Cap</h1>
          <span className="live">Auto-updating</span>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Coin</th>
                  <th className="r">Price</th>
                  <th className="r">1h %</th>
                  <th className="r">24h %</th>
                  <th className="r">7d %</th>
                  <th className="r">Market Cap</th>
                  <th className="r">Volume (24h)</th>
                  <th className="r">7d Chart</th>
                </tr>
              </thead>
              <tbody>
                {coins?.map((coin, i) => {
                  const chg1h = formatChange(coin.price_change_percentage_1h_in_currency)
                  const chg24 = formatChange(coin.price_change_percentage_24h)
                  const chg7d = formatChange(coin.price_change_percentage_7d_in_currency)
                  const spark = coin.sparkline_in_7d?.price || []
                  return (
                    <tr key={coin.id}>
                      <td><Link href={`/coins/${coin.id}`} style={{ display: 'contents' }}>
                        <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '12px' }}>{coin.market_cap_rank}</span>
                      </Link></td>
                      <td>
                        <Link href={`/coins/${coin.id}`} style={{ display: 'block' }}>
                          <div className="coin-cell">
                            <img className="coin-img" src={coin.image} alt={coin.name} width={32} height={32} />
                            <div>
                              <div className="coin-name-text">{coin.name}</div>
                              <span className="coin-sym">{coin.symbol.toUpperCase()}</span>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="r"><span className="price">{formatPrice(coin.current_price)}</span></td>
                      <td className="r"><span className={chg1h.positive === true ? 'badge-up' : chg1h.positive === false ? 'badge-dn' : ''}>{chg1h.text}</span></td>
                      <td className="r"><span className={chg24.positive === true ? 'badge-up' : chg24.positive === false ? 'badge-dn' : ''}>{chg24.text}</span></td>
                      <td className="r"><span className={chg7d.positive === true ? 'badge-up' : chg7d.positive === false ? 'badge-dn' : ''}>{chg7d.text}</span></td>
                      <td className="r"><span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text2)' }}>{formatMarketCap(coin.market_cap)}</span></td>
                      <td className="r"><span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--text2)' }}>{formatMarketCap(coin.total_volume)}</span></td>
                      <td className="r"><Sparkline prices={spark} positive={chg7d.positive !== false} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO TEXT */}
        <div style={{ marginTop: '40px', padding: '24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>About CryptoWorld</h2>
          <p style={{ color: 'var(--text2)', fontSize: '14px', lineHeight: '1.8' }}>
            CryptoWorld tracks live cryptocurrency prices, market capitalizations, trading volumes, and price charts for over 17,000 cryptocurrencies.
            Our data is sourced from CoinGecko and updates every 60 seconds. Track Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), Solana (SOL),
            and thousands more digital assets in real-time. View prices in USD, EUR, GBP, PKR, INR, and 150+ global currencies.
          </p>
        </div>
      </div>
    </>
  )
}
