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

// POST /api/ml/predict-duplicates
router.post("/predict-duplicates", async (req, res) => {
  console.log("[Node] Received request to /api/ml/predict-duplicates");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8001/predict-duplicates",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("❌ [Node] Error calling FastAPI:", error.message);
    res.status(500).json({ error: "Failed to detect duplicates" });
  }
});

// POST /api/ml/generate-summary
router.post("/generate-summary", async (req, res) => {
  console.log("[Node] Received request to /api/ml/generate-summary");
  try {
    const { descriptions } = req.body;
    console.log(
      "[Node] Forwarding to FastAPI summarizer:",
      descriptions.length
    );

    const response = await axios.post(
      "http://127.0.0.1:8001/generate-summary",
      { descriptions }
    );

    console.log("[Node] Got summaries from FastAPI:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ [Node] Error calling FastAPI summarizer:", error.message);
    res.status(500).json({ error: "Failed to generate summaries" });
  }
});

module.exports = router;  
