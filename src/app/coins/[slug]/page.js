// src/app/coins/[slug]/page.js — V5 COMPLETE
// NEW: Interactive price chart + crypto news section
// ALL V4 features preserved

import { getCoinDetail, getCoinMultiPrice, formatPrice, formatChange, formatMarketCap, CURRENCIES } from '@/lib/coingecko'
import PriceChart from '@/components/PriceChart'
import NewsSection from '@/components/NewsSection'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1',{next:{revalidate:86400}})
  const coins = await res.json().catch(()=>[])
  return (coins||[]).map(c=>({slug:c.id}))
}

async function getUniqueDescription(coin) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,messages:[{role:'user',content:`Write a 400-word factual description of ${coin.name} (${coin.symbol?.toUpperCase()}) for a crypto data website. Cover: core purpose, technology, use cases, rank #${coin.market_cap_rank}, uniqueness, risks. Factual, no hype. Do not start with "${coin.name} is".`}]})})
    const data = await res.json()
    return data.content?.[0]?.text || null
  } catch { return null }
}

export async function generateMetadata({params}) {
  const coin = await getCoinDetail(params.slug)
  if (!coin) return {title:'Not Found'}
  const price = coin.market_data?.current_price?.usd
  const chg = coin.market_data?.price_change_percentage_24h?.toFixed(2)
  return {
    title:`${coin.name} Price Today — ${formatPrice(price)} (${chg>=0?'+':''}${chg}%) Live Chart & News`,
    description:`${coin.name} (${coin.symbol?.toUpperCase()}) price ${formatPrice(price)} · Interactive 1D/7D/30D chart · Latest news · ${formatMarketCap(coin.market_data?.market_cap?.usd)} market cap · Tokenomics`,
    openGraph:{title:`${coin.name}: ${formatPrice(price)}`,images:[{url:coin.image?.large}]},
  }
}

export default async function CoinPage({params}) {
  const [coin, multiPrice] = await Promise.all([getCoinDetail(params.slug),getCoinMultiPrice(params.slug)])
  if (!coin||coin.error) return notFound()
  const md=coin.market_data, price=md?.current_price?.usd
  const chg24=formatChange(md?.price_change_percentage_24h)
  const chg7d=formatChange(md?.price_change_percentage_7d)
  const chg30d=formatChange(md?.price_change_percentage_30d)
  const chg1y=formatChange(md?.price_change_percentage_1y)
  const prices=multiPrice?.[params.slug]||{}
  const now=new Date().toLocaleString('en-US',{month:'long',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'})+' UTC'
  const athDate=md?.ath_date?.usd?new Date(md.ath_date.usd).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'N/A'
  const atlDate=md?.atl_date?.usd?new Date(md.atl_date.usd).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'N/A'
  const athPct=md?.ath?.usd?(((price-md.ath.usd)/md.ath.usd)*100).toFixed(1):null
  const cirPct=md?.total_supply&&md?.circulating_supply?((md.circulating_supply/md.total_supply)*100).toFixed(1):null
  const mktShare=md?.market_cap?.usd?((md.market_cap.usd/2.7e12)*100).toFixed(3):'—'
  const genYear=coin.genesis_date?new Date(coin.genesis_date).getFullYear():null
  const aiDesc=await getUniqueDescription(coin)
  const desc=aiDesc||coin.description?.en?.replace(/<[^>]*>/g,'').slice(0,800)||`${coin.name} is ranked #${coin.market_cap_rank}.`

  const faqs=[
    {q:`What is the current price of ${coin.name}?`,a:`${coin.name} (${coin.symbol?.toUpperCase()}) is at ${formatPrice(price)} as of ${now}. Changed ${chg24.text} in 24h, ${chg7d.text} in 7d. Source: CoinGecko API.`},
    {q:`What is ${coin.name}'s market cap?`,a:`Market cap ${formatMarketCap(md?.market_cap?.usd)}, ranked #${coin.market_cap_rank} globally (~${mktShare}% of total crypto market).`},
    {q:`What was ${coin.name}'s all-time high?`,a:`ATH: $${md?.ath?.usd?.toLocaleString()} on ${athDate}. Current is ${Math.abs(athPct)}% ${athPct<0?'below':'above'} ATH.`},
    {q:`How many ${coin.name} coins exist?`,a:`${md?.circulating_supply?.toLocaleString(undefined,{maximumFractionDigits:0})} ${coin.symbol?.toUpperCase()} circulating${md?.max_supply?` of ${md.max_supply.toLocaleString()} max`:''}${cirPct?` (${cirPct}% issued)`:''}.`},
    {q:`How has ${coin.name} performed?`,a:`7-day: ${chg7d.text} · 30-day: ${chg30d.text} · 1-year: ${chg1y.text}. Past performance ≠ future results.`},
    {q:`Where to buy ${coin.name}?`,a:`Available on Binance, Coinbase, Kraken, OKX, KuCoin. Use regulated exchanges, store in secure wallet.`},
    {q:`Is ${coin.name} a good investment?`,a:`Ranked #${coin.market_cap_rank}${genYear?`, trading since ${genYear}`:''}, volume ${formatMarketCap(md?.total_volume?.usd)}. Crypto is volatile — research thoroughly, never invest more than you can lose. Not financial advice.`},
  ]

  const schemas=[
    {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
    {'@context':'https://schema.org','@type':'FinancialProduct',name:coin.name,description:desc.slice(0,300),image:coin.image?.large,provider:{'@type':'Organization',name:'CryptoWorld'}},
    {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://your-domain.com'},{'@type':'ListItem',position:2,name:`${coin.name} Price`,item:`https://your-domain.com/coins/${params.slug}`}]}
  ]

  return (<>
    {schemas.map((s,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(s)}}/>)}
    <div className="breadcrumb"><a href="/">Home</a> › <a href="/">Cryptocurrencies</a> › <span>{coin.name}</span></div>

    {/* HERO */}
    <div className="coin-hero"><div className="coin-hero-inner">
      <div className="coin-hero-left">
        <h1><img src={coin.image?.large} alt={coin.name} width={40} height={40} style={{borderRadius:'50%'}}/>{coin.name} <span className="sym-badge">{coin.symbol?.toUpperCase()}</span>{coin.market_cap_rank&&<span className="rank-badge">#{coin.market_cap_rank}</span>}</h1>
        <div className="big-price">{formatPrice(price)} <span style={{fontSize:'18px',marginLeft:'10px'}} className={chg24.positive?'up':'dn'}>{chg24.text}</span></div>
        <div style={{display:'flex',gap:'7px',flexWrap:'wrap',marginBottom:'12px'}}>
          {[['1h',md?.price_change_percentage_1h_in_currency?.usd],['7d',md?.price_change_percentage_7d],['30d',md?.price_change_percentage_30d],['1y',md?.price_change_percentage_1y]].map(([p,v])=>{const c=formatChange(v);return<div key={p} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'6px',padding:'4px 9px',fontSize:'12px'}}><span style={{color:'var(--text3)'}}>{p}: </span><span className={c.positive===true?'up':c.positive===false?'dn':''}>{c.text}</span></div>})}
        </div>
        <div style={{fontSize:'11px',color:'var(--text3)',marginBottom:'12px'}}>Live · {now} · <a href="https://coingecko.com" target="_blank" rel="noopener" style={{color:'var(--green)'}}>CoinGecko</a></div>
        <div className="coin-stats-grid">
          {[['Market Cap',formatMarketCap(md?.market_cap?.usd)],['24h Volume',formatMarketCap(md?.total_volume?.usd)],['All-Time High',`$${md?.ath?.usd?.toLocaleString()}`],['From ATH',`${athPct}%`]].map(([l,v])=>(
            <div key={l} className="coin-stat"><div className="cs-label">{l}</div><div className="cs-value" style={l==='From ATH'?{color:'var(--red)'}:{}}>{v}</div></div>
          ))}
        </div>
      </div>
      <div>
        <h2 style={{fontSize:'13px',fontWeight:600,marginBottom:'10px',color:'var(--text2)'}}>Price in World Currencies</h2>
        <div className="currency-grid">
          {CURRENCIES.map(cur=>{const p=prices[cur.code];return(
            <Link key={cur.code} href={`/price/${params.slug}/${cur.code}`} className="currency-card">
              <div className="flag">{cur.flag}</div><div className="cur-name">{cur.name}</div>
              <div className="cur-price">{p?cur.symbol+p.toLocaleString('en-US',{maximumFractionDigits:p>100?2:p>1?4:8}):'—'}</div>
            </Link>
          )})}
        </div>
      </div>
    </div></div>

    <div className="container" style={{paddingTop:'22px'}}>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'20px'}}>
        <div>
          {/* CHART */}
          <div style={{marginBottom:'20px'}}><PriceChart coinId={params.slug} coinName={coin.name} currentPrice={price}/></div>

          {/* ROI CALCULATOR */}
          <div className="card" style={{padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'16px',marginBottom:'4px'}}>If You Had Invested in {coin.name}...</h2>
            <p style={{fontSize:'12px',color:'var(--text3)',marginBottom:'12px'}}>Historical ROI using real CoinGecko price data</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'11px'}}>
              <div><label style={{fontSize:'10px',color:'var(--text3)',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.6px'}}>Amount (USD)</label><input id="inv-amount" type="number" defaultValue="1000" style={{width:'100%',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',padding:'8px 12px',color:'var(--text)',fontSize:'14px',fontFamily:'var(--mono)'}}/></div>
              <div><label style={{fontSize:'10px',color:'var(--text3)',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.6px'}}>Investment Date</label><input id="inv-date" type="date" defaultValue="2020-01-01" style={{width:'100%',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'7px',padding:'8px 12px',color:'var(--text)',fontSize:'14px'}}/></div>
            </div>
            <button id="calc-btn" style={{background:'var(--green)',color:'#000',border:'none',padding:'9px 20px',borderRadius:'8px',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'var(--font)'}}>Calculate Returns</button>
            <div id="calc-result" style={{display:'none',marginTop:'12px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'10px',padding:'13px'}}><div id="calc-output"></div></div>
            <script dangerouslySetInnerHTML={{__html:`document.getElementById('calc-btn').addEventListener('click',async function(){const amt=parseFloat(document.getElementById('inv-amount').value)||1000;const dt=document.getElementById('inv-date').value;this.textContent='Loading...';this.disabled=true;try{const from=Math.floor(new Date(dt).getTime()/1000);const r=await fetch('https://api.coingecko.com/api/v3/coins/${params.slug}/market_chart/range?vs_currency=usd&from='+from+'&to='+(from+86400));const d=await r.json();const old=d.prices?.[0]?.[1];const cur=${price};if(old){const coins=amt/old,val=coins*cur,pct=((val/amt-1)*100).toFixed(1),pos=val>=amt;const col=pos?'var(--green)':'var(--red)';document.getElementById('calc-output').innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px"><div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Buy Price</div><div style="font-size:16px;font-weight:700;font-family:var(--mono);margin-top:3px">$'+old.toLocaleString('en-US',{maximumFractionDigits:2})+'</div></div><div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Value Today</div><div style="font-size:16px;font-weight:700;font-family:var(--mono);margin-top:3px;color:'+col+'">$'+val.toLocaleString('en-US',{maximumFractionDigits:0})+'</div></div><div><div style="font-size:10px;color:var(--text3);text-transform:uppercase">Return</div><div style="font-size:16px;font-weight:700;font-family:var(--mono);margin-top:3px;color:'+col+'">'+(pos?'+':'')+pct+'%</div></div></div><div style="margin-top:8px;font-size:11px;color:var(--text3)">$'+amt.toLocaleString()+' invested → '+coins.toFixed(6)+' ${coin.symbol?.toUpperCase()} → $'+val.toLocaleString('en-US',{maximumFractionDigits:0})+'</div>';document.getElementById('calc-result').style.display='block';}else throw new Error();}catch(e){document.getElementById('calc-output').innerHTML='<p style="color:var(--red);font-size:12px">No data for this date. Try a more recent date.</p>';document.getElementById('calc-result').style.display='block';}this.textContent='Calculate Returns';this.disabled=false;});`}}/>
          </div>

          {/* AI DESCRIPTION */}
          <div className="card" style={{padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'16px',marginBottom:'11px'}}>What is {coin.name} ({coin.symbol?.toUpperCase()})?</h2>
            <div style={{fontSize:'14px',color:'var(--text2)',lineHeight:'1.9'}}>
              {desc.split('\n').filter(p=>p.trim()).map((para,i)=><p key={i} style={{marginBottom:'10px'}}>{para}</p>)}
            </div>
            <div style={{marginTop:'10px',padding:'7px 11px',background:'var(--bg3)',borderRadius:'7px',fontSize:'10px',color:'var(--text3)',display:'flex',gap:'10px'}}>
              <span>✍️ AI analysis</span><span>📊 CoinGecko</span><span>🕐 {now}</span>
            </div>
          </div>

          {/* NEWS */}
          <div style={{marginBottom:'20px'}}><NewsSection coinSymbol={coin.symbol?.toUpperCase()} coinName={coin.name}/></div>

          {/* HISTORICAL */}
          <div className="card" style={{padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'16px',marginBottom:'13px'}}>Historical Price Milestones</h2>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:'var(--bg3)',borderBottom:'1px solid var(--border)'}}>
                {['Milestone','Price','Date','vs Current'].map(h=><th key={h} style={{padding:'9px 13px',fontSize:'10px',fontWeight:600,color:'var(--text3)',textAlign:'left',textTransform:'uppercase',letterSpacing:'0.6px'}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[['All-Time High',`$${md?.ath?.usd?.toLocaleString()}`,athDate,`${athPct}%`,'dn'],['Current Price',formatPrice(price),'Today','—',''],['All-Time Low',`$${md?.atl?.usd?.toLocaleString()}`,atlDate,md?.atl?.usd?`+${(((price-md.atl.usd)/md.atl.usd)*100).toFixed(0)}%`:'—','up']].map(([m,p,d,vs,cls])=>(
                  <tr key={m} style={{borderBottom:'1px solid var(--border)'}}><td style={{padding:'11px 13px',fontWeight:600,fontSize:'13px'}}>{m}</td><td style={{padding:'11px 13px',fontFamily:'var(--mono)',fontWeight:700}}>{p}</td><td style={{padding:'11px 13px',fontSize:'12px',color:'var(--text3)'}}>{d}</td><td style={{padding:'11px 13px',fontFamily:'var(--mono)',fontSize:'13px'}} className={cls}>{vs}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOKENOMICS */}
          <div className="card" style={{padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'16px',marginBottom:'13px'}}>Tokenomics & Supply</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'8px',marginBottom:'13px'}}>
              {[['Circulating Supply',md?.circulating_supply?md.circulating_supply.toLocaleString(undefined,{maximumFractionDigits:0})+' '+coin.symbol?.toUpperCase():'N/A'],['Total Supply',md?.total_supply?md.total_supply.toLocaleString(undefined,{maximumFractionDigits:0})+' '+coin.symbol?.toUpperCase():'No Limit'],['Max Supply',md?.max_supply?md.max_supply.toLocaleString(undefined,{maximumFractionDigits:0})+' '+coin.symbol?.toUpperCase():'Unlimited'],['Fully Diluted Val.',md?.fully_diluted_valuation?.usd?formatMarketCap(md.fully_diluted_valuation.usd):'N/A'],['Market Dominance',`~${mktShare}%`],['Rank',`#${coin.market_cap_rank}`]].map(([l,v])=>(
                <div key={l} style={{background:'var(--bg3)',borderRadius:'8px',padding:'10px 12px'}}><div style={{fontSize:'10px',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.6px'}}>{l}</div><div style={{fontSize:'13px',fontWeight:600,fontFamily:'var(--mono)',marginTop:'3px'}}>{v}</div></div>
              ))}
            </div>
            {cirPct&&<div><div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'var(--text3)',marginBottom:'4px'}}><span>Circulating ({cirPct}%)</span><span>Remaining ({(100-parseFloat(cirPct)).toFixed(1)}%)</span></div><div style={{height:'7px',background:'var(--border)',borderRadius:'4px',overflow:'hidden'}}><div style={{height:'100%',width:`${cirPct}%`,background:'var(--green)',borderRadius:'4px'}}/></div></div>}
          </div>

          {/* FAQ */}
          <div className="card" style={{padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'16px',marginBottom:'13px'}}>{coin.name} — 7 Frequently Asked Questions</h2>
            <div className="faq">{faqs.map((f,i)=><div key={i} className="faq-item"><div className="faq-q">{f.q}</div><div className="faq-a">{f.a}</div></div>)}</div>
          </div>

          {coin.description?.en&&<div className="card" style={{padding:'20px',marginBottom:'20px'}}><h2 style={{fontSize:'16px',marginBottom:'11px'}}>About {coin.name}</h2><div style={{fontSize:'14px',color:'var(--text2)',lineHeight:'1.8'}} dangerouslySetInnerHTML={{__html:coin.description.en.replace(/<a /g,'<a rel="noopener nofollow" ').slice(0,1000)+'...'}}/></div>}
        </div>

        {/* SIDEBAR */}
        <div>
          <div className="card" style={{padding:'13px',marginBottom:'11px'}}>
            <h3 style={{fontSize:'12px',color:'var(--text2)',marginBottom:'8px'}}>{coin.name} Key Stats</h3>
            {[['Symbol',coin.symbol?.toUpperCase()],['Rank',`#${coin.market_cap_rank}`],['Price',formatPrice(price)],['24h %',chg24.text],['Market Cap',formatMarketCap(md?.market_cap?.usd)],['Volume 24h',formatMarketCap(md?.total_volume?.usd)],['ATH',`$${md?.ath?.usd?.toLocaleString()}`],['ATH Date',athDate],['Launch',genYear||'N/A'],['Algorithm',coin.hashing_algorithm||'N/A']].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid var(--border)',fontSize:'11px'}}><span style={{color:'var(--text3)'}}>{k}</span><span style={{fontWeight:500,fontFamily:'var(--mono)',fontSize:'11px'}}>{v}</span></div>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'6px',marginBottom:'11px'}}>
            <Link href={`/buy/${params.slug}/pakistan`} style={{background:'var(--green)',color:'#000',padding:'10px',borderRadius:'8px',fontWeight:700,fontSize:'13px',textAlign:'center',display:'block'}}>Buy {coin.symbol?.toUpperCase()} →</Link>
            <Link href={`/prediction/${params.slug}/2025`} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'9px',borderRadius:'8px',fontSize:'12px',textAlign:'center',display:'block'}}>Price Prediction 2025 →</Link>
            <Link href={`/compare/${params.slug}-vs-bitcoin`} style={{background:'var(--card)',border:'1px solid var(--border)',color:'var(--text)',padding:'9px',borderRadius:'8px',fontSize:'12px',textAlign:'center',display:'block'}}>Compare with Bitcoin →</Link>
          </div>
          {coin.links&&<div className="card" style={{padding:'13px',marginBottom:'11px'}}>
            <h3 style={{fontSize:'12px',color:'var(--text2)',marginBottom:'7px'}}>Official Links</h3>
            {[[coin.links.homepage?.[0],'🌐 Website'],[coin.links.whitepaper,'📄 Whitepaper'],[coin.links.blockchain_site?.[0],'🔗 Explorer'],[coin.links.repos_url?.github?.[0],'💻 GitHub'],[coin.links.subreddit_url,'💬 Reddit']].filter(([u])=>u).map(([url,label])=>(
              <a key={label} href={url} target="_blank" rel="noopener nofollow" style={{display:'block',color:'var(--green)',fontSize:'12px',padding:'4px 0',borderBottom:'1px solid var(--border)'}}>{label}</a>
            ))}
          </div>}
          <div className="card" style={{padding:'13px'}}>
            <h3 style={{fontSize:'12px',color:'var(--text2)',marginBottom:'7px'}}>Related Coins</h3>
            {['bitcoin','ethereum','binancecoin','solana','cardano','ripple'].filter(s=>s!==params.slug).slice(0,5).map(s=>(
              <Link key={s} href={`/coins/${s}`} style={{display:'block',padding:'4px 0',borderBottom:'1px solid var(--border)',fontSize:'12px',color:'var(--text2)',textTransform:'capitalize'}}>{s.replace(/-/g,' ')} →</Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop:'22px',marginBottom:'32px'}}>
        <h2 style={{fontSize:'14px',marginBottom:'9px'}}>More {coin.name} Pages</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:'7px'}}>
          {[[`/price/${params.slug}/pkr`,'Price in PKR'],[`/price/${params.slug}/inr`,'Price in INR'],[`/price/${params.slug}/aed`,'Price in AED'],[`/price/${params.slug}/eur`,'Price in EUR'],[`/buy/${params.slug}/pakistan`,'Buy in Pakistan'],[`/buy/${params.slug}/india`,'Buy in India'],[`/buy/${params.slug}/uae`,'Buy in UAE'],[`/buy/${params.slug}/nigeria`,'Buy in Nigeria'],[`/prediction/${params.slug}/2025`,'Prediction 2025'],[`/prediction/${params.slug}/2030`,'Prediction 2030'],[`/compare/${params.slug}-vs-bitcoin`,'vs Bitcoin'],[`/compare/${params.slug}-vs-ethereum`,'vs Ethereum']].map(([href,label])=>(
            <Link key={href} href={href} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'8px 11px',fontSize:'12px',color:'var(--text2)',display:'block'}}>{coin.name} {label}</Link>
          ))}
        </div>
      </div>
    </div>
  </>)
}
