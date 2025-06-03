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

    let body;
    try {
      body = JSON.parse(rawString);
    } catch (parseErr) {
      console.error("❌ JSON parse error:", parseErr.message);
      return res.status(400).json({ error: "Invalid JSON in request body" });
    }

    console.log("🚀 AXIOS POST to https://api.app.reclaim.ai/v1/tasks");

    const { data } = await axios.post('https://api.app.reclaim.ai/v1/tasks', body, {
      headers: {
        Authorization: `Bearer ${process.env.RECLAIM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Reclaim response:", data);
    return res.status(200).json(data);

  } catch (err) {
    const errorData = err.response?.data || err.message;
    const statusCode = err.response?.status || 500;

    console.error("❌ Relay Error:", errorData);
    return res.status(statusCode).json({ error: errorData });
  }
}
