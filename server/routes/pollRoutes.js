const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPoll,
  getPolls,
  votePoll,
} = require("../controllers/pollController");

router.post("/", protect, createPoll);
router.get("/", getPolls);
router.post("/vote", protect, votePoll);

module.exports = router;
