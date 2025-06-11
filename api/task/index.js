export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, duration, days, start, end, calendar, overlap, hide } = req.body;

  try {
    const testResponse = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    const data = await testResponse.json();

    // 👇 Log the test API response so you can see it in Vercel logs
    console.log("TEST API response:", testResponse.status, JSON.stringify(data));

    res.status(testResponse.status).json(data);
  } catch (error) {
    console.error("Error posting to TEST API:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
