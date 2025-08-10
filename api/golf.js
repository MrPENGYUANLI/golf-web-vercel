// /api/golf.js - Vercel Serverless Function (JS, uses global fetch)
const BASE = 'https://api.golfapi.io'

export default async function handler(req, res) {
  try {
    const key = process.env.GOLF_API_KEY
    if (!key) return res.status(500).json({ error: 'Missing GOLF_API_KEY' })

    const upstreamPath = (req.url || '').replace(/^\/api\/golf/, '') || '/'
    const url = new URL(BASE + upstreamPath)

    const q = req.query || {}
    Object.entries(q).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach(val => url.searchParams.append(k, String(val)))
      else url.searchParams.set(k, String(v))
    })
    url.searchParams.set('api_key', key)

    const r = await fetch(url.toString(), { method: 'GET' })
    const text = await r.text()
    res.status(r.status).send(text)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'proxy error' })
  }
}
