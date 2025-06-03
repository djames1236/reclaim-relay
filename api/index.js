
const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { name, start, duration, calendar_id, color } = req.body;

  try {
    const response = await axios.post(
      "https://api.app.reclaim.ai/v1/tasks",
      {
        name,
        start,
        duration,
        calendar_id,
        color,
      },
      {
        headers: {
          Authorization: `Bearer 10584c08-4ff8-4b75-93fd-d71140b10bc5`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
