export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, duration, days, start, end, calendar, overlap, hide } = req.body;

  try {
    const reclaimResponse = await fetch("https://api.reclaim.ai/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RECLAIM_API_KEY}`,
      },
      body: JSON.stringify({
        title,
        duration,
        days,
        start,
        end,
        calendarId: calendar,
        overlap,
        isHidden: hide,
      }),
    });

    const data = await reclaimResponse.json();

    res.status(reclaimResponse.status).json(data);
  } catch (error) {
    console.error("Error posting to Reclaim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
