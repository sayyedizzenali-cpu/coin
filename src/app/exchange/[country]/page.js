// Exchange page
import Link from 'next/link'
export const dynamicParams = true
export const revalidate = 86400
export async function generateStaticParams() {
  const countries = [
    'pakistan',
    'india',
    'united-states',
    'united-kingdom',
    'nigeria',
    'uae',
    'turkey',
    'brazil',
    'indonesia',
    'philippines',
    'south-africa',
    'canada',
    'australia',
    'saudi-arabia',
    'kenya',
    'ghana',
    'egypt',
    'malaysia',
    'singapore',
    'thailand',
    'bangladesh',
    'vietnam',
    'south-korea',
    'japan',
    'germany',
    'france',
    'spain',
    'mexico',
    'argentina',
    'sri-lanka',
    'nepal',
    'myanmar',
    'ethiopia',
    'tanzania',
    'cameroon',
    'ivory-coast',
    'senegal',
    'morocco',
    'algeria',
    'tunisia',
    'jordan',
    'iraq',
    'kuwait',
    'qatar',
    'ukraine',
    'russia',
    'poland',
    'netherlands',
    'sweden',
    'norway',
    'denmark',
    'finland',
    'czech-republic',
    'portugal',
    'greece',
    'romania'
  ]
  return countries.map(country => ({ country }))
}
export default function ExchangePage({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())
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
        <Link href={`/regulation/${params.country}`} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>📋 Crypto Regulation</Link>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
      </div>
    </div>
  )
}