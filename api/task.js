import { buffer } from 'micro';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔥 USING RELAY");

  // ✅ Log the API key to verify it's being loaded correctly (you can redact before pushing public)
  console.log("🟢 Loaded API Key:", process.env.RECLAIM_API_KEY);
console.log("🔑 Using API Key:", process.env.RECLAIM_API_KEY || '❌ Not set');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const sanitized = rawBody.toString().trim();

    console.log("Sanitized body string:", sanitized);

    const payload = JSON.parse(sanitized);

    console.log("🚀 AXIOS POST to https://api.app.reclaim.ai/v1/tasks");
    const response = await axios.post('https://api.app.reclaim.ai/v1/tasks', payload, {
      headers: {
        'Authorization': `Bearer${process.env.RECLAIM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Relay Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
}
