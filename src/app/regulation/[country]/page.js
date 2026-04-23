// Regulation page
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
export default function RegulationPage({ params }) {
  const name = params.country.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())
  const statuses = { pakistan:'Restricted', india:'Regulated', 'united-states':'Legal', 'united-kingdom':'Legal', uae:'Legal', turkey:'Regulated', nigeria:'Restricted' }
  const status = statuses[params.country] || 'Varies'
  const colors = { Legal:'var(--green)', Regulated:'var(--gold)', Restricted:'var(--red)', Varies:'var(--text3)' }
  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'32px 24px'}}>
      <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>
        <Link href="/">Home</Link> › <span>Crypto Regulation {name}</span>
      </div>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'8px'}}>Is Crypto Legal in {name}?</h1>
      <div style={{display:'inline-block',background:'var(--card)',border:`1px solid ${colors[status]}`,color:colors[status],borderRadius:'8px',padding:'6px 16px',fontWeight:700,marginBottom:'20px'}}>{status}</div>
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
        <Link href={`/exchange/${params.country}`} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>🏦 Best Exchanges</Link>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
      </div>
    </div>
  )
}