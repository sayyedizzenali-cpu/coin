import Link from 'next/link'
export const dynamicParams = true
export const revalidate = 86400
export async function generateStaticParams() { return [] }
export async function generateMetadata({ params }) {
  const term = params.term.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())
  return {
    title: `What is ${term}? Definition & Guide | CryptoWorld`,
    description: `Learn what ${term} means in cryptocurrency. Simple explanation with examples.`,
  }
}
export default function GlossaryTermPage({ params }) {
  const term = params.term.replace(/-/g,' ').replace(/\b\w/g,l=>l.toUpperCase())
  return (
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'32px 24px'}}>
      <div style={{fontSize:'13px',color:'var(--text3)',marginBottom:'16px'}}>
        <Link href="/">Home</Link> › <Link href="/glossary">Glossary</Link> › <span>{term}</span>
      </div>
      <h1 style={{fontSize:'28px',fontWeight:700,marginBottom:'16px'}}>What is {term}?</h1>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
        <p style={{color:'var(--text2)',lineHeight:'1.8'}}>{term} is an important concept in cryptocurrency and blockchain technology.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'8px',marginTop:'20px'}}>
        <Link href="/glossary" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>📚 All Terms</Link>
        <Link href="/" style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px',fontSize:'12px',color:'var(--text2)',display:'block'}}>💰 Live Prices</Link>
      </div>
    </div>
  )
}