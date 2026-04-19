// src/app/about/page.js
export const metadata = {
  title: 'About CryptoWorld — Our Data Sources, Team & Methodology',
  description: 'CryptoWorld provides live cryptocurrency price data for 17,000+ coins. Learn about our data sources, methodology, and commitment to accuracy.',
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>About CryptoWorld</h1>
      <p style={{ color: 'var(--text2)', fontSize: '15px', marginBottom: '32px' }}>Your trusted source for live cryptocurrency data</p>

      {[
        { title: 'What We Do', body: 'CryptoWorld tracks live prices, market data, and analysis for over 17,000 cryptocurrencies. Our data updates every 60 seconds from CoinGecko, one of the most trusted crypto data providers in the world. We provide prices in 150+ global currencies including USD, EUR, GBP, PKR, INR, and AED.' },
        { title: 'Our Data Sources', body: 'All price and market data is sourced from the CoinGecko API. CoinGecko aggregates data from 500+ cryptocurrency exchanges worldwide. Our historical data goes back to each coin\'s inception. On-chain data is sourced from public blockchain explorers. We never fabricate or estimate data — all figures are sourced directly from verified APIs.' },
        { title: 'Editorial Standards', body: 'Our coin descriptions and analysis are generated with AI assistance and reviewed for accuracy. Price predictions are clearly labeled as speculative estimates based on historical analysis — not financial advice. We clearly disclose our methodology for all forecasts. We do not accept payment to alter data, rankings, or analysis.' },
        { title: 'Data Accuracy', body: 'We strive for 100% accuracy in all price data. Our API integration validates data before display. If you notice any errors, please contact us. Prices may differ slightly from exchange prices due to the aggregation methodology used by CoinGecko.' },
        { title: 'Not Financial Advice', body: 'All content on CryptoWorld is for informational and educational purposes only. Nothing on this site constitutes financial, investment, legal, or tax advice. Cryptocurrency markets are highly volatile. Always do your own research (DYOR) and consult a qualified financial advisor before making investment decisions.' },
      ].map(({ title, body }) => (
        <div key={title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 22px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>{title}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: '1.8' }}>{body}</p>
        </div>
      ))}

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 22px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px' }}>Data Attribution</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[['Price & Market Data', 'CoinGecko API', 'https://coingecko.com'], ['Exchange Data', '500+ Exchanges via CoinGecko', null], ['On-chain Data', 'Public Blockchain Explorers', null]].map(([label, source, link]) => (
            <div key={label} style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '12px 14px', minWidth: '180px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>{label}</div>
              {link ? <a href={link} target="_blank" rel="noopener" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>{source}</a> : <div style={{ fontSize: '13px', fontWeight: 600 }}>{source}</div>}
            </div>
          ))}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization',
        name: 'CryptoWorld', url: 'https://your-domain.com',
        description: 'Live cryptocurrency prices and market data for 17,000+ coins',
        foundingDate: '2025',
        knowsAbout: ['Cryptocurrency', 'Bitcoin', 'Blockchain', 'DeFi', 'Digital Assets'],
      }) }} />
    </div>
  )
}
