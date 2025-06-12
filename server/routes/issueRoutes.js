const express = require("express");
const router = express.Router();
const {
  createIssue,
  getMyIssues,
  getCommunityReports,
  upvoteReport,
} = require("../controllers/issueController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/", protect, restrictTo("user"), createIssue);
router.get("/my-reports", protect, restrictTo("user"), getMyIssues);
// router.post("/:id/upvote", upvoteReport);
router.get("/community", getCommunityReports);

module.exports = router;
