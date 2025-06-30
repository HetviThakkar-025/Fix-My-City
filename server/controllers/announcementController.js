const Announcement = require("../models/Announcement");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, resolvedReports } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      resolvedReports,
    });

    // Notify all users (optional)
    const users = await User.find({}, "_id");
    const notifications = users.map((u) => ({
      user: u._id,
      title: `📢 New Announcement: ${title}`,
      message: content.substring(0, 100) + "...",
      type: "info",
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(announcement);
  } catch (err) {
    console.error("Error in createAnnouncement:", err);
    res.status(500).json({ message: "Failed to post announcement" });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const data = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate("resolvedReports", "title");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};
