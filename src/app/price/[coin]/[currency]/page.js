// src/app/price/[coin]/[currency]/page.js
// "Bitcoin price in PKR" — 17,000 coins × 12 currencies = 204,000 pages

import { getCoinDetail, getCoinMultiPrice, formatPrice, formatMarketCap, CURRENCIES } from '@/lib/coingecko'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

const CURRENCY_MAP = Object.fromEntries(CURRENCIES.map(c => [c.code, c]))

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }) {
  const cur = CURRENCY_MAP[params.currency]
  if (!cur) return { title: 'Not Found' }
  const coin = await getCoinDetail(params.coin)
  if (!coin) return { title: 'Not Found' }
  const multiPrice = await getCoinMultiPrice(params.coin)
  const price = multiPrice?.[params.coin]?.[params.currency]
  return {
    title: `${coin.name} Price in ${cur.name} (${cur.code.toUpperCase()}) Today — Live ${coin.symbol?.toUpperCase()}/${cur.code.toUpperCase()} Rate`,
    description: `${coin.name} price today in ${cur.name} is ${cur.symbol}${price?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}. Track live ${coin.name} to ${cur.code.toUpperCase()} conversion rate, charts, and market data.`,
  }
}

export default async function PriceCurrencyPage({ params }) {
  const cur = CURRENCY_MAP[params.currency]
  if (!cur) return notFound()

  const [coin, multiPrice] = await Promise.all([
    getCoinDetail(params.coin),
    getCoinMultiPrice(params.coin)
  ])
  if (!coin || coin.error) return notFound()

  const prices = multiPrice?.[params.coin] || {}
  const priceInCur = prices[params.currency]
  const priceUSD = prices.usd || coin.market_data?.current_price?.usd
  const md = coin.market_data
  const chg24 = md?.price_change_percentage_24h

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${coin.name} price in ${cur.name} today?`,
        acceptedAnswer: { '@type': 'Answer', text: `The current ${coin.name} price in ${cur.name} is ${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()}. The price has changed ${chg24?.toFixed(2)}% in the last 24 hours.` }
      },
      {
        '@type': 'Question',
        name: `How much is 1 ${coin.name} in ${cur.code.toUpperCase()}?`,
        acceptedAnswer: { '@type': 'Answer', text: `1 ${coin.name} (${coin.symbol?.toUpperCase()}) = ${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()} at today's rate.` }
      },
      {
        '@type': 'Question',
        name: `How to convert ${coin.name} to ${cur.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `To convert ${coin.name} to ${cur.name}, multiply the amount of ${coin.name} by the current rate (${cur.symbol}${priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 })}). For example, 0.1 ${coin.symbol?.toUpperCase()} = ${cur.symbol}${(priceInCur * 0.1)?.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${cur.code.toUpperCase()}.` }
      },
    ]
  }

  // Conversion table amounts
  const amounts = [0.001, 0.01, 0.1, 0.5, 1, 5, 10, 50, 100]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="breadcrumb">
        <a href="/">Home</a> › <a href={`/coins/${params.coin}`}>{coin.name}</a> › <span>Price in {cur.name}</span>
      </div>

      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '28px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <img src={coin.image?.large} alt={coin.name} width={48} height={48} style={{ borderRadius: '50%' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700 }}>
                {coin.name} ({coin.symbol?.toUpperCase()}) Price in {cur.flag} {cur.name} ({cur.code.toUpperCase()})
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '13px', marginTop: '4px' }}>Live rate · Updates every 60 seconds</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', minWidth: '200px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>1 {coin.symbol?.toUpperCase()} =</div>
              <div style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '6px', color: 'var(--gold)' }}>
                {cur.symbol}{priceInCur?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || 'N/A'}
              </div>
              <div style={{ fontSize: '12px', color: chg24 >= 0 ? 'var(--green)' : 'var(--red)', marginTop: '4px' }}>
                {chg24 >= 0 ? '▲' : '▼'} {Math.abs(chg24)?.toFixed(2)}% (24h)
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', minWidth: '200px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>USD Price</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '6px' }}>{formatPrice(priceUSD)}</div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>Market Cap: {formatMarketCap(md?.market_cap?.usd)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 24px' }}>
        {/* CONVERSION TABLE */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>{coin.name} to {cur.name} Conversion Table</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>{coin.symbol?.toUpperCase()} Amount</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>{cur.code.toUpperCase()} Value</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', color: 'var(--text3)', fontWeight: 600 }}>USD Value</th>
              </tr>
            </thead>
            <tbody>
              {amounts.map(amt => (
                <tr key={amt} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '11px 16px', fontFamily: 'var(--mono)', fontWeight: 500 }}>{amt} {coin.symbol?.toUpperCase()}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--gold)' }}>{cur.symbol}{(priceInCur * amt)?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--text2)' }}>${(priceUSD * amt)?.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '16px' }}>FAQs: {coin.name} Price in {cur.name}</h2>
          <div className="faq">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{faq.name}</div>
                <div className="faq-a">{faq.acceptedAnswer.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OTHER CURRENCIES */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '14px' }}>{coin.name} Price in Other Currencies</h2>
          <div className="currency-grid">
            {CURRENCIES.filter(c => c.code !== params.currency).map(c => {
              const p = prices[c.code]
              return (
                <Link key={c.code} href={`/price/${params.coin}/${c.code}`} className="currency-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="flag">{c.flag}</div>
                  <div className="cur-name">{c.name}</div>
                  <div className="cur-price">{p ? c.symbol + p.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}</div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href={`/buy/${params.coin}/pakistan`} style={{ background: 'var(--green)', color: '#000', padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}>
            Buy {coin.name} Now →
          </Link>
        </div>
      </div>
    </>
  )
}
