'use client'
// src/components/PriceChart.js
// Interactive price chart: 1D/7D/30D/1Y tabs, candlestick line, volume bars
// Uses lightweight-charts (TradingView) OR Chart.js fallback via CDN

import { useState, useEffect, useRef, useCallback } from 'react'

const PERIODS = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
]

function formatDate(ts, days) {
  const d = new Date(ts)
  if (days <= 1) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  if (days <= 30) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function formatPrice(p) {
  if (!p && p !== 0) return '$—'
  if (p >= 1e6) return '$' + (p / 1e6).toFixed(2) + 'M'
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (p >= 1) return '$' + p.toFixed(4)
  return '$' + p.toFixed(8)
}

export default function PriceChart({ coinId, coinName, currentPrice }) {
  const [period, setPeriod] = useState(1) // days
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hover, setHover] = useState(null)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const fetchChart = useCallback(async (days) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/chart?coin=${coinId}&days=${days}`)
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (e) {
      setError('Chart data unavailable')
    }
    setLoading(false)
  }, [coinId])

  useEffect(() => { fetchChart(period) }, [period, fetchChart])

  // Draw canvas chart
  useEffect(() => {
    if (!data?.prices?.length || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    const W = rect.width, H = rect.height
    const PAD = { top: 20, right: 12, bottom: 40, left: 70 }
    const chartW = W - PAD.left - PAD.right
    const chartH = H - PAD.top - PAD.bottom - 50 // reserve for volume

    ctx.clearRect(0, 0, W, H)

    const prices = data.prices
    const volumes = data.volumes || []
    const minP = Math.min(...prices.map(p => p[1]))
    const maxP = Math.max(...prices.map(p => p[1]))
    const rangeP = maxP - minP || 1
    const maxV = Math.max(...volumes.map(v => v[1])) || 1
    const positive = prices[prices.length - 1]?.[1] >= prices[0]?.[1]
    const lineColor = positive ? '#00d4aa' : '#ff4d6a'
    const fillColor = positive ? 'rgba(0,212,170,0.08)' : 'rgba(255,77,106,0.08)'

    const px = (i) => PAD.left + (i / (prices.length - 1)) * chartW
    const py = (p) => PAD.top + (1 - (p - minP) / rangeP) * chartH

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (i / 4) * chartH
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke()
    }

    // Y axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const p = minP + ((4 - i) / 4) * rangeP
      ctx.fillText(formatPrice(p), PAD.left - 6, PAD.top + (i / 4) * chartH + 4)
    }

    // X axis labels
    ctx.textAlign = 'center'
    const xSteps = Math.min(6, prices.length - 1)
    for (let i = 0; i <= xSteps; i++) {
      const idx = Math.floor(i / xSteps * (prices.length - 1))
      const x = px(idx)
      ctx.fillText(formatDate(prices[idx][0], period), x, H - PAD.bottom / 2 + 10)
    }

    // Volume bars
    const volH = 40
    const volY = H - PAD.bottom - volH + 5
    volumes.forEach((v, i) => {
      const barW = Math.max(1, chartW / volumes.length - 1)
      const barH = (v[1] / maxV) * volH
      const x = PAD.left + (i / (volumes.length - 1)) * chartW
      ctx.fillStyle = positive ? 'rgba(0,212,170,0.2)' : 'rgba(255,77,106,0.2)'
      ctx.fillRect(x - barW / 2, volY + volH - barH, barW, barH)
    })

    // Fill under line
    ctx.beginPath()
    ctx.moveTo(px(0), py(prices[0][1]))
    prices.forEach((p, i) => ctx.lineTo(px(i), py(p[1])))
    ctx.lineTo(px(prices.length - 1), PAD.top + chartH)
    ctx.lineTo(px(0), PAD.top + chartH)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()

    // Price line
    ctx.beginPath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 1.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    prices.forEach((p, i) => {
      if (i === 0) ctx.moveTo(px(i), py(p[1])); else ctx.lineTo(px(i), py(p[1]))
    })
    ctx.stroke()

    // Hover crosshair
    if (hover !== null) {
      const idx = Math.max(0, Math.min(prices.length - 1, Math.round(hover * (prices.length - 1))))
      const x = px(idx), y = py(prices[idx][1])
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 0.5
      ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + chartH); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke()
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = lineColor; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
    }
  }, [data, hover, period])

  const handleMouseMove = (e) => {
    if (!canvasRef.current || !data?.prices?.length) return
    const rect = canvasRef.current.getBoundingClientRect()
    const PAD_LEFT = 70, PAD_RIGHT = 12
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, (x - PAD_LEFT) / (rect.width - PAD_LEFT - PAD_RIGHT)))
    setHover(pct)
  }

  const hoverIdx = hover !== null && data?.prices?.length ? Math.round(hover * (data.prices.length - 1)) : null
  const hoverData = hoverIdx !== null ? data?.prices?.[hoverIdx] : null
  const priceChange = data?.prices?.length > 1
    ? ((data.prices[data.prices.length - 1][1] - data.prices[0][1]) / data.prices[0][1] * 100)
    : null

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '4px' }}>{coinName} Price Chart</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--mono)' }}>
              {hoverData ? formatPrice(hoverData[1]) : formatPrice(currentPrice)}
            </span>
            {priceChange !== null && (
              <span style={{ fontSize: '13px', fontWeight: 600, color: priceChange >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            )}
          </div>
          {hoverData && (
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
              {formatDate(hoverData[0], period)}
            </div>
          )}
        </div>
        {/* Period tabs */}
        <div style={{ display: 'flex', gap: '3px' }}>
          {PERIODS.map(p => (
            <button key={p.days} onClick={() => { setPeriod(p.days); setHover(null) }} style={{
              background: period === p.days ? 'var(--green-dim)' : 'transparent',
              border: `1px solid ${period === p.days ? 'var(--green)' : 'var(--border)'}`,
              color: period === p.days ? 'var(--green)' : 'var(--text3)',
              borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {/* Chart canvas */}
      <div ref={containerRef} style={{ padding: '8px 0 0', position: 'relative' }}>
        {loading && (
          <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Loading chart...
          </div>
        )}
        {error && !loading && (
          <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: '13px' }}>{error}</div>
        )}
        {!loading && !error && data?.prices?.length > 0 && (
          <canvas ref={canvasRef} style={{ width: '100%', height: '260px', cursor: 'crosshair', display: 'block' }}
            onMouseMove={handleMouseMove} onMouseLeave={() => setHover(null)} />
        )}
      </div>
      <div style={{ padding: '8px 20px 14px', fontSize: '10px', color: 'var(--text3)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Source: CoinGecko API</span>
        <span>Scroll over chart to see historical prices</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
