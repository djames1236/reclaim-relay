import { buffer } from 'micro';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🔥 USING RELAY");

  const apiKey = process.env.RECLAIM_API_KEY;
  console.log("🟢 Loaded API Key:", apiKey);
  if (!apiKey) {
    return res.status(500).json({ error: "Missing RECLAIM_API_KEY in environment variables." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const sanitized = rawBody.toString().trim();
    console.log("📦 Sanitized Body:", sanitized);

    const payload = JSON.parse(sanitized);
    console.log("🚀 POSTING to https://api.app.reclaim.ai/v1/tasks");
console.log("🛠 Full headers:", {
  Authorization: `Bearer ${process.env.RECLAIM_API_KEY}`
});
    const response = await axios.post('https://api.app.reclaim.ai/v1/tasks', payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Success:", response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Relay Error:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || error.message });
  }
}
