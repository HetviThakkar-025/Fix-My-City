const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// POST /api/notifications
exports.createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;

    if (!user || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotif = await Notification.create({
      user,
      title,
      message,
      type: type || "info",
    });

    res.status(201).json(newNotif);
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ message: "Failed to create notification" });
  }
};
