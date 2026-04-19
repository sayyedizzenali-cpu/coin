// src/app/api/search/route.js
// Server-side proxy for CoinGecko search — avoids CORS + caches results

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query || query.length < 2) {
    return Response.json({ coins: [] })
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 60 },
        headers: { 'Accept': 'application/json' }
      }
    )
    if (!res.ok) throw new Error('Search failed')
    const data = await res.json()

    // Return top 8 coins with clean data
    const coins = (data.coins || []).slice(0, 8).map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      thumb: c.thumb,
      market_cap_rank: c.market_cap_rank,
    }))

    return Response.json({ coins })
  } catch {
    return Response.json({ coins: [] }, { status: 500 })
  }
}
