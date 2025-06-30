// routes/pollRoutes.js
const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  createPoll,
  getPolls,
  getPollsForAdmin,
  votePoll,
  deletePoll,
} = require("../controllers/pollController");

router.post("/", protect, createPoll); // user/admin create poll
router.get("/", getPolls); // user view polls
router.get("/admin", protect, restrictTo("admin"), getPollsForAdmin); // admin view
router.delete("/:id", protect, restrictTo("admin"), deletePoll); // admin delete
router.post("/:id/vote", protect, votePoll); // vote

module.exports = router;
