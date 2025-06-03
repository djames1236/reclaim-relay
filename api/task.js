export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  let body;

  try {
    body = req.body || JSON.parse(req.body); // handles both parsed & raw JSON
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  const { name, start, duration, calendar_id, color } = body;

  if (!name || !start || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  return res.status(200).json({
    message: "Task received",
    task: { name, start, duration, calendar_id, color },
  });
}
