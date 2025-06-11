const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  submitFeedback,
  getAllFeedbacks,
} = require("../controllers/feedbackController");

router.post("/", protect, submitFeedback); // POST /api/feedback
router.get("/", getAllFeedbacks); // GET /api/feedback

module.exports = router;
