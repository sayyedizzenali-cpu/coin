// src/app/buy/[coin]/[country]/page.js
// "How to buy Bitcoin in Pakistan" — 17,000 coins × 50 countries = 850,000+ pages

import { getCoinDetail, getCoinMultiPrice, formatPrice, formatMarketCap } from '@/lib/coingecko'
import { getCountry, getAllCountrySlugs, COUNTRIES } from '@/lib/countries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 3600 // 1 hour — content changes less often

// ── Generate top coins × all countries at build time
export async function generateStaticParams() {
  return []
}

// ── Dynamic SEO metadata
export async function generateMetadata({ params }) {
  const country = getCountry(params.country)
  if (!country) return { title: 'Not Found' }
  const coin = await getCoinDetail(params.coin)
  if (!coin) return { title: 'Not Found' }
  const price = coin.market_data?.current_price?.usd
  return {
    title: `How to Buy ${coin.name} in ${country.name} (${new Date().getFullYear()}) — Step by Step Guide`,
    description: `Learn how to buy ${coin.name} (${coin.symbol?.toUpperCase()}) in ${country.name} today. Current ${coin.name} price is ${formatPrice(price)} USD (${country.symbol}${(price * (coin.market_data?.current_price?.[country.currency.toLowerCase()] / price || 1))?.toFixed(2)} ${country.currency}). Best exchanges, payment methods, and beginner guide.`,
    keywords: [`buy ${coin.name} in ${country.name}`, `how to buy ${coin.name} ${country.name}`, `${coin.name} price ${country.currency}`, `${coin.symbol} ${country.name}`],
    openGraph: {
      title: `How to Buy ${coin.name} in ${country.name}`,
      description: `Complete guide to buying ${coin.name} in ${country.name} with local payment methods.`,
      images: [{ url: coin.image?.large }],
    }
  }
}

// Steps component
function Step({ num, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-dim)', border: '1px solid var(--green)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{num}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '5px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.7' }}>{desc}</div>
      </div>
    </div>
  )
}

export default async function BuyPage({ params }) {
  const country = getCountry(params.country)
  if (!country) return notFound()

  const [coin, multiPrice] = await Promise.all([
    getCoinDetail(params.coin),
    getCoinMultiPrice(params.coin)
  ])
  if (!coin || coin.error) return notFound()

  const md = coin.market_data
  const priceUSD = md?.current_price?.usd
  const priceCur = multiPrice?.[params.coin]?.[country.currency.toLowerCase()]
  const coinName = coin.name
  const coinSym = coin.symbol?.toUpperCase()
  const year = new Date().getFullYear()

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How to buy ${coinName} in ${country.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `To buy ${coinName} in ${country.name}: 1) Create an account on ${country.exchanges[0]}. 2) Verify your identity (KYC). 3) Deposit funds via ${country.paymentMethods[0]}. 4) Search for ${coinSym} and place a buy order. 5) Store your ${coinName} in a secure wallet.` }
      },
      {
        '@type': 'Question',
        name: `What is the price of ${coinName} in ${country.currency}?`,
        acceptedAnswer: { '@type': 'Answer', text: `The current price of ${coinName} is ${priceCur ? country.symbol + priceCur.toLocaleString('en-US', { maximumFractionDigits: 2 }) : formatPrice(priceUSD)} ${country.currency} as of today. The price changes every few seconds based on global market activity.` }
      },
      {
        '@type': 'Question',
        name: `Which is the best exchange to buy ${coinName} in ${country.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `The best exchanges to buy ${coinName} in ${country.name} are: ${country.exchanges.join(', ')}. ${country.exchanges[0]} is the most popular choice due to its low fees, high liquidity, and support for local payment methods like ${country.paymentMethods[0]}.` }
      },
      {
        '@type': 'Question',
        name: `Is it legal to buy ${coinName} in ${country.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Cryptocurrency regulations vary. Always check the latest legal status of crypto in ${country.name} with official government sources before investing. Use regulated exchanges that comply with local laws.` }
      },
      {
        '@type': 'Question',
        name: `What is the minimum amount to buy ${coinName} in ${country.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Most exchanges allow you to buy as little as $10-20 worth of ${coinName} in ${country.name}. You don't need to buy a whole coin — you can buy fractions of ${coinName}.` }
      },
    ]
  }

  // HowTo Schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Buy ${coinName} in ${country.name}`,
    description: `Step-by-step guide to buying ${coinName} in ${country.name}`,
    step: [
      { '@type': 'HowToStep', name: 'Choose an Exchange', text: `Sign up on ${country.exchanges[0]}, the most trusted exchange available in ${country.name}.` },
      { '@type': 'HowToStep', name: 'Verify Identity (KYC)', text: `Upload your national ID or passport for identity verification as required by regulations.` },
      { '@type': 'HowToStep', name: 'Deposit Funds', text: `Add funds to your account using ${country.paymentMethods[0]} or other local payment methods.` },
      { '@type': 'HowToStep', name: `Buy ${coinName}`, text: `Search for ${coinSym}, enter the amount you want to buy, and confirm your purchase.` },
      { '@type': 'HowToStep', name: 'Secure Your Coins', text: `Transfer your ${coinName} to a hardware wallet or trusted software wallet for safekeeping.` },
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <a href="/">Home</a> › <a href={`/coins/${params.coin}`}>{coinName}</a> › <span>Buy in {country.name}</span>
      </div>

      {/* HERO */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <img src={coin.image?.large} alt={coinName} width={52} height={52} style={{ borderRadius: '50%' }} />
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 700 }}>
                How to Buy {coinName} in {country.flag} {country.name} ({year})
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '14px', marginTop: '4px' }}>
                Beginner's guide — step by step, updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Live Price Banner */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Current Price (USD)</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '4px' }}>{formatPrice(priceUSD)}</div>
            </div>
            {priceCur && (
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Price in {country.currency}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '4px', color: 'var(--gold)' }}>{country.symbol}{priceCur.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Market Cap</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)', marginTop: '4px' }}>{formatMarketCap(md?.market_cap?.usd)}</div>
            </div>
            <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
              <Link href={`/coins/${params.coin}`} style={{ background: 'var(--green)', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', display: 'block' }}>
                View Live Price →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

          {/* LEFT — GUIDE */}
          <div>
            {/* INTRO */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '14px' }}>Buying {coinName} in {country.name} — Overview</h2>
              <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8' }}>
                {coinName} ({coinSym}) is currently trading at {formatPrice(priceUSD)} USD
                {priceCur ? ` (${country.symbol}${priceCur.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${country.currency})` : ''}.
                Buying {coinName} in {country.name} is straightforward using local exchanges that support {country.currency}.
                The most popular platforms are {country.exchanges.slice(0, 3).join(', ')}, all of which accept
                {' '}{country.paymentMethods.slice(0, 2).join(' and ')}.
              </p>
            </div>

            {/* STEPS */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Step-by-Step: How to Buy {coinName} in {country.name}</h2>
              <Step num={1} title={`Choose a Crypto Exchange in ${country.name}`} desc={`The best exchanges available in ${country.name} are ${country.exchanges.join(', ')}. ${country.exchanges[0]} is recommended for beginners due to its user-friendly interface, competitive fees, and support for local payment methods.`} />
              <Step num={2} title="Create & Verify Your Account (KYC)" desc={`Sign up with your email address and complete identity verification. You'll need to upload a government-issued ID (CNIC, passport, or driving license). Verification usually takes 10–30 minutes.`} />
              <Step num={3} title={`Deposit Funds in ${country.currency}`} desc={`Add funds to your exchange account using your preferred local payment method: ${country.paymentMethods.join(', ')}. Minimum deposit is typically ${country.symbol}500–1000.`} />
              <Step num={4} title={`Buy ${coinName} (${coinSym})`} desc={`Go to the trading section, search for "${coinSym}" or "${coinSym}/USDT", enter the amount you want to spend, and click Buy. You can set a market order (instant) or limit order (at your desired price).`} />
              <Step num={5} title={`Store Your ${coinName} Safely`} desc={`For small amounts, keeping coins on the exchange is fine. For larger holdings, transfer to a hardware wallet (Ledger, Trezor) or trusted software wallet (Trust Wallet, MetaMask) for maximum security.`} />
            </div>

            {/* EXCHANGES TABLE */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Best Exchanges to Buy {coinName} in {country.name}</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                      {['Exchange', 'Fees', 'Payment Methods', 'Best For'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', fontSize: '11px', fontWeight: 600, color: 'var(--text3)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {country.exchanges.map((ex, i) => (
                      <tr key={ex} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{ex}</span>
                          {i === 0 && <span style={{ marginLeft: '6px', fontSize: '10px', background: 'var(--green-dim)', color: 'var(--green)', padding: '2px 6px', borderRadius: '4px' }}>Recommended</span>}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text2)' }}>0.1% – 0.5%</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text2)' }}>{country.paymentMethods.slice(0, 2).join(', ')}</td>
                        <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text2)' }}>{i === 0 ? 'Beginners' : i === 1 ? 'Low Fees' : 'Advanced'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>FAQs — Buying {coinName} in {country.name}</h2>
              <div className="faq">
                {faqSchema.mainEntity.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <div className="faq-q">{faq.name}</div>
                    <div className="faq-a">{faq.acceptedAnswer.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            {/* Quick Stats */}
            <div className="card" style={{ padding: '18px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>{coinName} Quick Stats</h3>
              {[
                ['Rank', `#${coin.market_cap_rank}`],
                ['Price (USD)', formatPrice(priceUSD)],
                priceCur ? [`Price (${country.currency})`, `${country.symbol}${priceCur.toLocaleString('en-US', { maximumFractionDigits: 2 })}`] : null,
                ['Market Cap', formatMarketCap(md?.market_cap?.usd)],
                ['24h Change', `${md?.price_change_percentage_24h?.toFixed(2)}%`],
                ['All-Time High', `$${md?.ath?.usd?.toLocaleString()}`],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text3)' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Other Countries */}
            <div className="card" style={{ padding: '18px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>Buy {coinName} in Other Countries</h3>
              {COUNTRIES.filter(c => c.slug !== params.country).slice(0, 8).map(c => (
                <Link key={c.slug} href={`/buy/${params.coin}/${c.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text2)' }}>
                  <span>{c.flag}</span>
                  <span>Buy {coinName} in {c.name}</span>
                </Link>
              ))}
            </div>

            {/* Related Coins */}
            <div className="card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '12px' }}>Buy Other Coins in {country.name}</h3>
              {['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano', 'dogecoin'].filter(s => s !== params.coin).slice(0, 6).map(slug => (
                <Link key={slug} href={`/buy/${slug}/${params.country}`} style={{ display: 'block', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text2)', textTransform: 'capitalize' }}>
                  Buy {slug.replace(/-/g, ' ')} in {country.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
