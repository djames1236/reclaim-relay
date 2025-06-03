import { buffer } from 'micro';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔥 RELAY INVOKED");

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const bodyString = rawBody.toString('utf8').trim();
    console.log("🧼 Sanitized body string:", bodyString);

    const taskData = JSON.parse(bodyString);

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    console.log("🔐 Using token:", token.slice(0, 6) + '...');

    const response = await axios.post(
      'https://api.app.reclaim.ai/v1/tasks',
      taskData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ Reclaim response:", response.data);
    return res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Relay Error:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json(
      err.response?.data || { error: 'Internal server error' }
    );
  }
}
