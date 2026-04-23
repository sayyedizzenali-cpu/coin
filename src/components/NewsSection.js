'use client'
// src/components/NewsSection.js
// Crypto news from CryptoPanic — per coin, with sentiment, time ago

import { useState, useEffect } from 'react'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function SentimentBadge({ positive, negative }) {
  const total = positive + negative
  if (!total) return null
  const pct = Math.round((positive / total) * 100)
  const bullish = pct >= 60
  const bearish = pct <= 40
  if (!bullish && !bearish) return null
  return (
    <span style={{
      fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
      background: bullish ? 'var(--green-dim)' : 'var(--red-dim)',
      color: bullish ? 'var(--green)' : 'var(--red)',
      flexShrink: 0,
    }}>
      {bullish ? '▲ Bullish' : '▼ Bearish'}
    </span>
  )
}

export default function NewsSection({ coinSymbol, coinName }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/news?coin=${coinSymbol}&limit=8`)
        const data = await res.json()
        if (data.news?.length) {
          setNews(data.news)
        } else {
          // General crypto news if no coin-specific
          const res2 = await fetch(`/api/news?limit=6`)
          const data2 = await res2.json()
          setNews(data2.news || [])
        }
      } catch {
        setError('News unavailable')
      }
      setLoading(false)
    }
    fetchNews()
  }, [coinSymbol])

  const displayNews = expanded ? news : news.slice(0, 4)

  if (error) return null

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{coinName} Latest News</h2>
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>Source: CryptoPanic · Updates every 5 min</div>
        </div>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', color: 'var(--text3)', fontSize: '13px' }}>
            <div style={{ width: '14px', height: '14px', border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Loading news...
          </div>
        </div>
      ) : news.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text3)' }}>
          No recent news found for {coinName}
        </div>
      ) : (
        <>
          {displayNews.map((item, i) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener nofollow"
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '14px 20px', borderBottom: i < displayNews.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Source favicon */}
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                📰
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', lineHeight: '1.5', marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{item.source}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text3)' }}>·</span>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{timeAgo(item.published)}</span>
                  {item.currencies?.length > 0 && item.currencies.slice(0, 3).map(c => (
                    <span key={c} style={{ fontSize: '10px', fontWeight: 600, padding: '1px 5px', borderRadius: '3px', background: 'var(--bg3)', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{c}</span>
                  ))}
                  <SentimentBadge positive={item.votes?.positive} negative={item.votes?.negative} />
                </div>
              </div>

              {/* Arrow */}
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text3)', flexShrink: 0, marginTop: '2px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}

          {news.length > 4 && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setExpanded(!expanded)} style={{
                background: 'transparent', border: '1px solid var(--border)', borderRadius: '7px',
                color: 'var(--text2)', fontSize: '12px', fontWeight: 500, padding: '7px 16px',
                cursor: 'pointer', fontFamily: 'var(--font)', width: '100%',
              }}>
                {expanded ? 'Show less ↑' : `Show ${news.length - 4} more stories ↓`}
              </button>
            </div>
          )}
        </>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
