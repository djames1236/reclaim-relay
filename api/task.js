export default async function handler(req, res) {
  const { name, start, duration, calendar_id, color } = req.body;

  console.log("Received task data:", req.body);

  return res.status(200).json({
    message: "Task received successfully",
    task: {
      name,
      start,
      duration,
      calendar_id,
      color,
    },
  });
}
