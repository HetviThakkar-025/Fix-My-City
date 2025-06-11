const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  resolvedReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Announcement", announcementSchema);
