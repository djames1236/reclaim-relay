import { buffer } from 'micro';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const rawString = rawBody.toString('utf8');

    console.log("Raw body string:", rawString);

    let body;
    try {
      body = JSON.parse(rawString);
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError.message);
      return res.status(400).json({ error: "Invalid JSON in request body" });
    }

    const response = await fetch('https://api.app.reclaim.ai/v1/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RECLAIM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Reclaim API error:", data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Internal error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
