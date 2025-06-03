export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    console.log('Incoming request:', body);

    const reclaimRes = await fetch('https://api.app.reclaim.ai/v1/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RECLAIM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await reclaimRes.json();

    if (!reclaimRes.ok) {
      console.error('Reclaim API error:', data);
      return res.status(reclaimRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Internal error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
