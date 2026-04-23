import Link from 'next/link'
export const dynamicParams = true
export const revalidate = 86400
export async function generateStaticParams() {
  // Auto-generated 2026-04-23T22:52:21.489Z
  const topics = [
    'how-to-buy-bitcoin-pakistan',
    'how-to-buy-ethereum-india',
    'how-to-buy-bitcoin-indonesia',
    'how-to-buy-bitcoin-philippines',
    'how-to-buy-bitcoin-bangladesh',
    'how-to-buy-bitcoin-malaysia',
    'how-to-buy-bitcoin-vietnam',
    'how-to-buy-bitcoin-uae',
    'how-to-buy-bitcoin-nigeria',
    'how-to-buy-bitcoin-turkey',
    'how-to-buy-ethereum-pakistan',
    'how-to-buy-solana-pakistan',
    'how-to-buy-bnb-pakistan',
    'how-to-buy-xrp-pakistan',
    'how-to-buy-cardano-india',
    'how-to-buy-solana-india',
    'crypto-tax-pakistan',
    'crypto-tax-india',
    'crypto-tax-indonesia',
    'crypto-tax-philippines',
    'crypto-tax-nigeria',
    'crypto-tax-uae',
    'crypto-tax-turkey',
    'crypto-tax-brazil',
    'crypto-tax-malaysia',
    'crypto-legal-pakistan',
    'crypto-legal-india',
    'crypto-legal-indonesia',
    'is-crypto-legal-pakistan',
    'is-crypto-legal-india',
    'best-crypto-exchange-pakistan',
    'best-crypto-exchange-india',
    'best-crypto-exchange-indonesia',
    'best-crypto-exchange-nigeria',
    'best-crypto-exchange-uae',
    'best-crypto-exchange-turkey',
    'binance-tutorial-beginners',
    'okx-tutorial-beginners',
    'kucoin-tutorial-beginners',
    'coinbase-tutorial-beginners',
    'jazzcash-crypto-pakistan',
    'easypaisa-crypto-pakistan',
    'upi-crypto-india',
    'gcash-crypto-philippines',
    'bkash-crypto-bangladesh',
    'mpesa-crypto-kenya',
    'momo-crypto-vietnam',
    'best-crypto-wallet-2026',
    'best-hardware-wallet-2026',
    'metamask-setup-guide',
    'trust-wallet-guide',
    'ledger-guide',
    'trezor-guide',
    'phantom-wallet-guide',
    'exodus-wallet-guide',
    'crypto-for-beginners',
    'bitcoin-explained',
    'ethereum-explained',
    'defi-explained',
    'nft-guide',
    'blockchain-explained',
    'crypto-security-tips',
    'how-to-avoid-crypto-scams',
    'cold-storage-guide',
    'hardware-wallet-vs-software-wallet',
    'bitcoin-halving-explained',
    'ethereum-merge-explained',
    'defi-yield-farming-guide',
    'nft-buying-guide-asia',
    'staking-guide-beginners',
    'crypto-staking-pakistan',
    'bitcoin-price-prediction-2025',
    'ethereum-price-prediction-2025',
    'solana-price-prediction-2025',
    'bnb-price-prediction-2025',
    'xrp-price-prediction-2025',
    'cardano-price-prediction-2025',
    'bitcoin-price-prediction-2030',
    'ethereum-price-prediction-2030',
    'crypto-portfolio-beginners',
    'diversified-crypto-portfolio',
    'dollar-cost-averaging-crypto',
    'best-time-buy-bitcoin',
    'bitcoin-vs-gold',
    'ethereum-vs-bitcoin',
    'solana-vs-ethereum',
    'binance-vs-coinbase',
    'okx-vs-binance',
    'kucoin-vs-binance',
    'crypto-mining-guide',
    'bitcoin-mining-2026',
    'ethereum-mining-history',
    'proof-of-work-vs-proof-of-stake',
    'layer2-explained',
    'arbitrum-guide',
    'optimism-guide',
    'polygon-guide',
    'uniswap-guide',
    'aave-guide',
    'compound-guide',
    'crypto-passive-income',
    'crypto-lending-guide',
    'wrapped-bitcoin-explained',
    'stablecoin-guide',
    'usdc-vs-usdt',
    'dai-stablecoin-explained'
  ]
  return topics.map(slug => ({ slug }))
}
export default function LearnPage({ params }) {
  const title = params.slug.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())
  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'32px 24px'}}>
      <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>
        <Link href="/">Home</Link> › <Link href="/learn">Learn</Link> › <span>{title}</span>
      </div>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'16px'}}>{title}</h1>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px'}}>
        <p style={{color:'var(--text2)',lineHeight:'1.8'}}>Complete guide about {title} in Asian crypto markets.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'8px',marginTop:'20px'}}>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
        <Link href="/glossary" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>📚 Glossary</Link>
      </div>
    </div>
  )
}