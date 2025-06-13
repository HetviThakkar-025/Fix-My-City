const express = require("express");
const router = express.Router();
const {
  createIssue,
  getMyIssues,
  getCommunityReports,
  upvoteIssue,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/", protect, restrictTo("user"), createIssue);
router.get("/my-reports", protect, restrictTo("user"), getMyIssues);
router.post("/:id/upvote", protect, upvoteIssue);
router.get("/community", getCommunityReports);
router.patch("/:id", protect, restrictTo("user"), updateIssue);
router.delete("/:id", protect, restrictTo("user"), deleteIssue);
// router.get("/:id", getSingleIssue); // in issueroutes.js

module.exports = router;
