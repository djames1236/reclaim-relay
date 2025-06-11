const reclaimResponse = await fetch("https://api.app.reclaim.ai/v1/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.RECLAIM_API_KEY}`,
  },
  body: JSON.stringify({
    name: title,  // was `title` before, needs to be `name`
    duration,
    time_preferences: {
      time_windows: [
        {
          day: Array.isArray(days) ? days[0] : days,  // if days is an array, use first day
          start: start,  // must be "HH:mm:ss"
          end: end       // must be "HH:mm:ss"
        }
      ]
    },
    calendarId: calendar,
    overlap,
    isHidden: hide,
  }),
});
