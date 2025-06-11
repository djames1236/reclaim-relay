module.exports.tasks = async (event) => {
  console.log("Received event:", event);

  // Example: Forward to Reclaim API (you can implement this later)
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok", message: "Lambda received task" }),
  };
};
