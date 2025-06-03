import { buffer } from 'micro';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔥 USING AXIOS VERSION OF RELAY");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const rawString = rawBody.toString('utf8').trim().replace(/[\u0000-\u001F\u007F-\u009F\u200B\u00A0]/g, '');
    console.log("Sanitized body string:", rawString);

    const body = JSON.parse(rawString);

    console.log("🚀 AXIOS POST to https://api.app.reclaim.ai/v1/tasks");

    const { data } = await axios.post('https://api.app.reclaim.ai/v1/tasks', body, {
      headers: {
        Authorization: `Bearer ${process.env.RECLAIM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Reclaim response:", data);
    return res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
}
