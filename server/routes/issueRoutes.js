const express = require("express");
const router = express.Router();
const { createIssue, getMyIssues } = require("../controllers/issueController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/", protect, restrictTo("user"), createIssue);
router.get("/my-reports", protect, restrictTo("user"), getMyIssues);

module.exports = router;
