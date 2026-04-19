// src/app/trending/page.js
import { getTrending, getTopCoins, formatPrice, formatChange } from '../lib/coingecko'
import Link from 'next/link'

export const revalidate = 300 // 5 minutes

export const metadata = {
  title: 'Trending Cryptocurrencies Today — Top Gainers & Losers',
  description: 'See today\'s trending cryptocurrencies, top gainers, and top losers. Live data updated every 5 minutes.',
}

export default async function TrendingPage() {
  const [trending, coins] = await Promise.all([getTrending(), getTopCoins(1, 100)])

  const gainers = [...(coins || [])].sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)).slice(0, 10)
  const losers  = [...(coins || [])].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)).slice(0, 10)
  const trendingCoins = trending?.coins?.slice(0, 12) || []

  function CoinRow({ coin, rank }) {
    const chg = formatChange(coin.price_change_percentage_24h)
    return (
      <Link href={`/coins/${coin.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}>
        <span style={{ width: '20px', fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{rank}</span>
        <img src={coin.image} alt={coin.name} width={28} height={28} style={{ borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '13px' }}>{coin.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{coin.symbol?.toUpperCase()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, fontSize: '13px' }}>{formatPrice(coin.current_price)}</div>
          <span className={chg.positive === true ? 'badge-up' : 'badge-dn'} style={{ fontSize: '11px' }}>{chg.text}</span>
        </div>
      </Link>
    )
  }

  return (
    <>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px' }}>Trending Cryptocurrencies</h1>
          <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Most searched and trending coins · Updated every 5 minutes</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>

        {/* TRENDING COINS (CoinGecko Search Trending) */}
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '14px' }}>🔥 Most Searched Today</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '32px' }}>
          {trendingCoins.map((c, i) => {
            const item = c.item
            return (
              <Link key={item.id} href={`/coins/${item.id}`} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ width: '20px', height: '20px', background: 'var(--bg3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text3)' }}>{i + 1}</span>
                  <img src={item.small} alt={item.name} width={28} height={28} style={{ borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{item.symbol}</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
                  Market Cap Rank: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>#{item.market_cap_rank}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* GAINERS + LOSERS SIDE BY SIDE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🚀 Top Gainers (24h)</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              {gainers.map((coin, i) => <CoinRow key={coin.id} coin={coin} rank={i + 1} />)}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📉 Top Losers (24h)</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              {losers.map((coin, i) => <CoinRow key={coin.id} coin={coin} rank={i + 1} />)}
            </div>
          </div>
        </div>

        {/* SEO TEXT */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginTop: '32px' }}>
          <h2 style={{ fontSize: '15px', marginBottom: '10px' }}>About Trending Cryptocurrencies</h2>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.8' }}>
            Our trending cryptocurrencies page shows the most searched coins on CryptoWorld in the last 24 hours,
            along with top gainers and losers by price change. Trending coins often signal increased market interest
            and can be early indicators of price movements. Data updates every 5 minutes from CoinGecko.
          </p>
        </div>
      </div>
    </>
  )
}
