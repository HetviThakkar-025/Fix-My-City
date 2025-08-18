const express = require("express");
const router = express.Router();
const axios = require("axios");

const ML_API_URL = process.env.ML_API_URL;

// POST /api/ml/predict-priority
router.post("/predict-priority", async (req, res) => {
  console.log("[Node] Received request to /api/ml/predict-priority");

  try {
    const { descriptions } = req.body;
    console.log("[Node] Forwarding descriptions to FastAPI:", descriptions);

    const response = await axios.post(`${ML_API_URL}/predict-priority`, {
      descriptions,
    });
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
      `${ML_API_URL}/predict-duplicates`,
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

    const response = await axios.post(`${ML_API_URL}/generate-summary`, {
      descriptions,
    });

    console.log("[Node] Got summaries from FastAPI:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ [Node] Error calling FastAPI summarizer:", error.message);
    res.status(500).json({ error: "Failed to generate summaries" });
  }
});

// POST /api/ml/detect-toxicity
router.post("/detect-toxicity", async (req, res) => {
  console.log("[Node] Received request to /api/ml/detect-toxicity");

  try {
    const { texts, threshold } = req.body;
    console.log("[Node] Forwarding texts to FastAPI toxicity detector:", {
      textCount: texts.length,
      threshold,
    });

    const response = await axios.post(`${ML_API_URL}/detect-toxicity`, {
      texts,
      threshold: threshold || 0.85, // Default threshold if not provided
    });

    console.log("[Node] Got toxicity results from FastAPI:", {
      resultCount: response.data.results.length,
    });

    res.json({
      success: true,
      results: response.data.results.map((result, index) => ({
        text: texts[index],
        ...result,
      })),
    });
  } catch (error) {
    console.error(
      "❌ [Node] Error calling FastAPI toxicity detector:",
      error.message
    );

    // Enhanced error response
    res.status(500).json({
      success: false,
      error: "Failed to detect toxicity",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
