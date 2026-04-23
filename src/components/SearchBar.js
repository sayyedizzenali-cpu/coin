'use client'
// src/components/SearchBar.js
// Full search: debounced API, keyboard nav, recent searches, mobile friendly

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const dropRef = useRef(null)
  const router = useRouter()
  const timer = useRef(null)

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem('cw_recent') || '[]')
      setRecent(r.slice(0, 5))
    } catch {}
  }, [])

  // Debounced search
  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.coins || [])
    } catch { setResults([]) }
    setLoading(false)
  }, [])

  useEffect(() => {
    clearTimeout(timer.current)
    if (query.length >= 2) {
      setLoading(true)
      timer.current = setTimeout(() => search(query), 280)
    } else {
      setResults([])
      setLoading(false)
    }
    return () => clearTimeout(timer.current)
  }, [query, search])

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (!dropRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setOpen(false)
        setActive(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard / shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const saveRecent = (coin) => {
    try {
      const prev = JSON.parse(localStorage.getItem('cw_recent') || '[]')
      const updated = [coin, ...prev.filter(c => c.id !== coin.id)].slice(0, 5)
      localStorage.setItem('cw_recent', JSON.stringify(updated))
      setRecent(updated)
    } catch {}
  }

  const goToCoin = (coin) => {
    saveRecent(coin)
    setOpen(false)
    setQuery('')
    setResults([])
    router.push(`/coins/${coin.id}`)
  }

  const handleKey = (e) => {
    const list = results.length > 0 ? results : recent
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(p => Math.min(p + 1, list.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(p => Math.max(p - 1, -1)) }
    if (e.key === 'Enter' && active >= 0 && list[active]) goToCoin(list[active])
  }

  const showDropdown = open && (results.length > 0 || loading || (query.length < 2 && recent.length > 0))
  const displayList = results.length > 0 ? results : (query.length < 2 ? recent : [])

  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--text3)', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActive(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search coins... (⌘K)"
          style={{
            width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '9px', padding: '8px 40px 8px 36px', color: 'var(--text)',
            fontSize: '13px', fontFamily: 'var(--font)', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onMouseOver={e => e.target.style.borderColor = 'var(--border2)'}
          onMouseOut={e => e.target.style.borderColor = 'var(--border)'}
        />
        {/* Loading spinner / clear */}
        {loading && (
          <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        )}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '16px', lineHeight: 1, padding: '2px' }}>×</button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div ref={dropRef} style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
          background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: '11px',
          overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {query.length < 2 && recent.length > 0 && (
            <div style={{ padding: '8px 14px 4px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>Recent</div>
          )}
          {query.length >= 2 && results.length === 0 && !loading && (
            <div style={{ padding: '16px', fontSize: '13px', color: 'var(--text3)', textAlign: 'center' }}>No results for "{query}"</div>
          )}
          {displayList.map((coin, i) => (
            <div key={coin.id} onClick={() => goToCoin(coin)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
              cursor: 'pointer', background: i === active ? 'var(--bg3)' : 'transparent',
              borderBottom: i < displayList.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.1s',
            }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(-1)}
            >
              {coin.thumb && <img src={coin.thumb} alt={coin.name} width={26} height={26} style={{ borderRadius: '50%', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coin.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{coin.symbol?.toUpperCase()}</div>
              </div>
              {coin.market_cap_rank && (
                <span style={{ fontSize: '10px', color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>#{coin.market_cap_rank}</span>
              )}
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  )
}
