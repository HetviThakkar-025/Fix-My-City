const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/ml/predict-priority
router.post("/predict-priority", async (req, res) => {
  console.log("[Node] Received request to /api/ml/predict-priority");

  try {
    const { descriptions } = req.body;
    console.log("[Node] Forwarding descriptions to FastAPI:", descriptions);

    const response = await axios.post(
      "http://127.0.0.1:8001/predict-priority",
      { descriptions }
    );
    console.log("[Node] Got response from FastAPI:", response.data);

    res.json(response.data);
  } catch (error) {
    console.error("❌ [Node] Error calling FastAPI:", error.message);
    res.status(500).json({ error: "Failed to predict priority" });
  }
});

module.exports = router;
