export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/random')
    const data = await response.json()
    const item = data[0]
    if (item?.q && item?.a) {
      res.setHeader('Cache-Control', 's-maxage=3600')
      res.json({ content: item.q, author: item.a })
    } else {
      res.status(502).json({ error: 'bad response' })
    }
  } catch {
    res.status(502).json({ error: 'fetch failed' })
  }
}
