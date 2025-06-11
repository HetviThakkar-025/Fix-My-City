const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

router.post("/", protect, restrictTo("admin"), createAnnouncement);
router.get("/", getAnnouncements);

module.exports = router;
