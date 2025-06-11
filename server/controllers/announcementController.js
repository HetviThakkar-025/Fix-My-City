const Announcement = require("../models/Announcement");

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, resolvedReports } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      resolvedReports,
    });
    res.status(201).json(announcement);
  } catch (err) {
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
