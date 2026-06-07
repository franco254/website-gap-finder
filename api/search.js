export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { q, ll, gl, next } = req.query;
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return res.status(500).json({ error: 'SERPAPI_KEY not set.' });

  try {
    let url;
    if (next) {
      url = decodeURIComponent(next) + '&api_key=' + apiKey;
    } else {
      const params = new URLSearchParams({ engine: 'google_maps', type: 'search', q, ll, gl, api_key: apiKey });
      url = 'https://serpapi.com/search.json?' + params;
    }
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
