const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getNotifications,
  markNotificationRead,
  createNotification,
} = require("../controllers/notificationController");

// Get all notifications for logged-in user
router.get("/", protect, getNotifications);

// Mark a specific notification as read
router.patch("/:id/read", protect, markNotificationRead);

// Create a new notification (admin or system use)
router.post("/", protect, restrictTo("admin"), createNotification); // optionally restrict to admin

module.exports = router;
