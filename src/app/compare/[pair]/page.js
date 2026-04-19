// src/app/compare/[pair]/page.js
import { getCoinDetail, formatPrice, formatChange, formatMarketCap } from '../../lib/coingecko'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  // Pre-build top comparisons
  const topPairs = [
    'bitcoin-vs-ethereum', 'bitcoin-vs-solana', 'ethereum-vs-solana',
    'bitcoin-vs-binancecoin', 'ethereum-vs-binancecoin', 'solana-vs-cardano',
    'ripple-vs-cardano', 'bitcoin-vs-ripple', 'ethereum-vs-cardano',
    'bitcoin-vs-avalanche-2', 'ethereum-vs-polkadot', 'solana-vs-avalanche-2',
  ]
  return topPairs.map(pair => ({ pair }))
}

export async function generateMetadata({ params }) {
  const [a, b] = params.pair.split('-vs-')
  if (!a || !b) return { title: 'Compare Crypto' }
  const [coinA, coinB] = await Promise.all([getCoinDetail(a), getCoinDetail(b)])
  const priceA = coinA?.market_data?.current_price?.usd
  const priceB = coinB?.market_data?.current_price?.usd
  return {
    title: `${coinA?.name || a} vs ${coinB?.name || b} — Price, Market Cap & Performance Comparison`,
    description: `Compare ${coinA?.name} vs ${coinB?.name}: ${coinA?.name} price is ${formatPrice(priceA)} while ${coinB?.name} price is ${formatPrice(priceB)}. See full comparison of price, market cap, volume and more.`,
  }
}

function CompareRow({ label, valueA, valueB, highlight }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text3)', width: '200px' }}>{label}</td>
      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: highlight ? 700 : 400, color: highlight === 'a' ? 'var(--green)' : 'var(--text)', textAlign: 'center' }}>{valueA}</td>
      <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: highlight ? 700 : 400, color: highlight === 'b' ? 'var(--green)' : 'var(--text)', textAlign: 'center' }}>{valueB}</td>
    </tr>
  )
}

export default async function ComparePage({ params }) {
  const parts = params.pair.split('-vs-')
  if (parts.length < 2) return notFound()
  const slugA = parts[0]
  const slugB = parts.slice(1).join('-')

  const [coinA, coinB] = await Promise.all([getCoinDetail(slugA), getCoinDetail(slugB)])
  if (!coinA || !coinB) return notFound()

  const mA = coinA.market_data, mB = coinB.market_data
  const priceA = mA?.current_price?.usd, priceB = mB?.current_price?.usd
  const mcA = mA?.market_cap?.usd, mcB = mB?.market_cap?.usd
  const chgA = mA?.price_change_percentage_24h, chgB = mB?.price_change_percentage_24h

  const schemaA = { '@type': 'Question', name: `Is ${coinA.name} better than ${coinB.name}?`, acceptedAnswer: { '@type': 'Answer', text: `${coinA.name} has a market cap of ${formatMarketCap(mcA)} and is ranked #${coinA.market_cap_rank}. ${coinB.name} has a market cap of ${formatMarketCap(mcB)} and is ranked #${coinB.market_cap_rank}. The better investment depends on your risk tolerance and goals.` } }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [schemaA] }) }} />

      <div className="breadcrumb">
        <a href="/">Home</a> › <span>Compare</span> › <span>{coinA.name} vs {coinB.name}</span>
      </div>

      <div className="container" style={{ paddingTop: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
          {coinA.name} vs {coinB.name} — Price Comparison
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '28px' }}>
          Compare {coinA.name} and {coinB.name} side by side — price, market cap, trading volume, and performance.
        </p>

        {/* HERO COMPARE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[{ coin: coinA, slug: slugA }, { coin: coinB, slug: slugB }].map(({ coin, slug }) => {
            const chg = formatChange(coin.market_data?.price_change_percentage_24h)
            return (
              <Link key={slug} href={`/coins/${slug}`} className="card" style={{ padding: '24px', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <img src={coin.image?.large} width={48} height={48} style={{ borderRadius: '50%' }} alt={coin.name} />
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{coin.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{coin.symbol?.toUpperCase()} · #{coin.market_cap_rank}</div>
                  </div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                  {formatPrice(coin.market_data?.current_price?.usd)}
                </div>
                <div className={chg.positive ? 'up' : 'dn'} style={{ fontSize: '14px', marginTop: '4px' }}>{chg.text} (24h)</div>
              </Link>
            )
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '200px 1fr 1fr', fontWeight: 600, fontSize: '14px' }}>
            <div>Metric</div>
            <div style={{ textAlign: 'center' }}>{coinA.name}</div>
            <div style={{ textAlign: 'center' }}>{coinB.name}</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <CompareRow label="Current Price" valueA={formatPrice(priceA)} valueB={formatPrice(priceB)} highlight={priceA > priceB ? 'a' : 'b'} />
              <CompareRow label="Market Cap" valueA={formatMarketCap(mcA)} valueB={formatMarketCap(mcB)} highlight={mcA > mcB ? 'a' : 'b'} />
              <CompareRow label="24h Change" valueA={<span className={chgA >= 0 ? 'up' : 'dn'}>{formatChange(chgA).text}</span>} valueB={<span className={chgB >= 0 ? 'up' : 'dn'}>{formatChange(chgB).text}</span>} />
              <CompareRow label="24h Volume" valueA={formatMarketCap(mA?.total_volume?.usd)} valueB={formatMarketCap(mB?.total_volume?.usd)} />
              <CompareRow label="All-Time High" valueA={'$' + mA?.ath?.usd?.toLocaleString()} valueB={'$' + mB?.ath?.usd?.toLocaleString()} />
              <CompareRow label="Circulating Supply" valueA={mA?.circulating_supply?.toLocaleString(undefined,{maximumFractionDigits:0})} valueB={mB?.circulating_supply?.toLocaleString(undefined,{maximumFractionDigits:0})} />
              <CompareRow label="Market Cap Rank" valueA={`#${coinA.market_cap_rank}`} valueB={`#${coinB.market_cap_rank}`} highlight={coinA.market_cap_rank < coinB.market_cap_rank ? 'a' : 'b'} />
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>FAQs: {coinA.name} vs {coinB.name}</h2>
          <div className="faq">
            <div className="faq-item">
              <div className="faq-q">Which has a higher market cap: {coinA.name} or {coinB.name}?</div>
              <div className="faq-a">{mcA > mcB ? coinA.name : coinB.name} has a higher market cap of {formatMarketCap(Math.max(mcA, mcB))} compared to {formatMarketCap(Math.min(mcA, mcB))}.</div>
            </div>
            <div className="faq-item">
              <div className="faq-q">What is {coinA.name}'s price compared to {coinB.name}?</div>
              <div className="faq-a">{coinA.name} is currently priced at {formatPrice(priceA)}, while {coinB.name} is priced at {formatPrice(priceB)}. {coinA.name} is {priceA > priceB ? 'more expensive' : 'cheaper'} than {coinB.name}.</div>
            </div>
          </div>
        </div>

        {/* MORE COMPARISONS */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>More Comparisons</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              [`${slugA}-vs-solana`, `${coinA.name} vs Solana`],
              [`${slugA}-vs-binancecoin`, `${coinA.name} vs BNB`],
              [`${slugB}-vs-bitcoin`, `${coinB.name} vs Bitcoin`],
              [`bitcoin-vs-ethereum`, 'Bitcoin vs Ethereum'],
            ].filter(([pair]) => pair !== params.pair).map(([pair, label]) => (
              <Link key={pair} href={`/compare/${pair}`} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', color: 'var(--text2)' }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
