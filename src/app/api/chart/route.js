// src/app/api/chart/route.js
// Proxy for CoinGecko chart data — caches by coin+days

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const coin = searchParams.get('coin')
  const days = searchParams.get('days') || '7'
  const currency = searchParams.get('currency') || 'usd'

  if (!coin) return Response.json({ error: 'Missing coin' }, { status: 400 })

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${currency}&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`,
      {
        next: { revalidate: days <= 1 ? 300 : 3600 },
        headers: { 'Accept': 'application/json' }
      }
    )
    if (!res.ok) throw new Error('Chart fetch failed')
    const data = await res.json()

    return Response.json({
      prices: data.prices || [],
      volumes: data.total_volumes || [],
    })
  } catch (e) {
    return Response.json({ error: 'Chart data unavailable' }, { status: 500 })
  }
}
