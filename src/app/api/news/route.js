// src/app/api/news/route.js
// CryptoPanic public API — free, no key needed for public posts

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const coin = searchParams.get('coin') // coin symbol e.g. "BTC"
  const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 12)

  try {
    const filterParam = coin ? `&currencies=${coin.toUpperCase()}` : ''
    const res = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=public${filterParam}&kind=news&public=true`,
      {
        next: { revalidate: 300 }, // 5 min cache
        headers: { 'Accept': 'application/json' }
      }
    )

    if (!res.ok) throw new Error('News fetch failed')
    const data = await res.json()

    const news = (data.results || []).slice(0, limit).map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      source: item.source?.title || 'CryptoPanic',
      published: item.published_at,
      currencies: item.currencies?.map(c => c.code) || [],
      votes: {
        positive: item.votes?.positive || 0,
        negative: item.votes?.negative || 0,
      }
    }))

    return Response.json({ news })
  } catch {
    // Fallback: return empty — handled gracefully in UI
    return Response.json({ news: [] })
  }
}
