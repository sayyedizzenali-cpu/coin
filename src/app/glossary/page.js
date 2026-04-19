// src/app/glossary/page.js
import { GLOSSARY_TERMS, getAllCategories } from '@/lib/glossary'
import Link from 'next/link'

export const metadata = {
  title: 'Crypto Glossary — 2000+ Cryptocurrency Terms Explained',
  description: 'Complete cryptocurrency glossary with definitions for blockchain, DeFi, NFT, trading terms and more. Learn crypto terminology from beginner to advanced.',
}

const DIFFICULTY_COLOR = {
  Beginner: { bg: 'var(--green-dim)', color: 'var(--green)' },
  Intermediate: { bg: 'rgba(240,180,41,0.12)', color: 'var(--gold)' },
  Advanced: { bg: 'var(--red-dim)', color: 'var(--red)' },
}

export default function GlossaryPage() {
  const categories = getAllCategories()
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Group terms by first letter
  const byLetter = {}
  GLOSSARY_TERMS.forEach(t => {
    const letter = t.term[0].toUpperCase()
    if (!byLetter[letter]) byLetter[letter] = []
    byLetter[letter].push(t)
  })

  return (
    <>
      {/* HERO */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Crypto Glossary</h1>
          <p style={{ color: 'var(--text2)', fontSize: '15px', marginBottom: '20px' }}>
            {GLOSSARY_TERMS.length}+ cryptocurrency and blockchain terms explained — from beginner to advanced.
          </p>
          {/* Alphabet Nav */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {alphabet.map(letter => (
              <a key={letter} href={`#letter-${letter}`} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: byLetter[letter] ? 'var(--card)' : 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: byLetter[letter] ? 'var(--green)' : 'var(--text3)', cursor: byLetter[letter] ? 'pointer' : 'default' }}>
                {letter}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        {/* CATEGORIES */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Browse by Category</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <span key={cat} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', color: 'var(--text2)', cursor: 'pointer' }}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* TERMS BY LETTER */}
        {Object.entries(byLetter).sort().map(([letter, terms]) => (
          <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--green)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>{letter}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
              {terms.map(term => {
                const dc = DIFFICULTY_COLOR[term.difficulty] || DIFFICULTY_COLOR.Beginner
                return (
                  <Link key={term.slug} href={`/glossary/${term.slug}`} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'block', transition: 'border-color 0.15s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{term.term}</span>
                      <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: dc.bg, color: dc.color, whiteSpace: 'nowrap', marginLeft: '8px' }}>{term.difficulty}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {term.definition}
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text3)' }}>{term.category}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* SEO */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>About This Crypto Glossary</h2>
          <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: '1.8' }}>
            This comprehensive cryptocurrency glossary covers all important terms in the blockchain and crypto industry.
            From basic concepts like Bitcoin, blockchain, and wallets — to advanced topics like DeFi protocols,
            Layer 2 scaling, zero-knowledge proofs, and DAO governance. Each term includes a clear definition,
            detailed explanation, related concepts, and links to relevant cryptocurrencies.
          </p>
        </div>
      </div>
    </>
  )
}
