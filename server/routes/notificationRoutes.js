const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");

const {
  getNotifications,
  markNotificationRead,
  createNotification,
} = require("../controllers/notificationController");

router.post("/", protect, restrictTo("admin"), createNotification);
router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markNotificationRead);

module.exports = router;
