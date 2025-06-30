const Issue = require("../models/Issue");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.getAdminDashboardData = async (req, res) => {
  try {
    // Get all issues
    const issues = await Issue.find();

    const totalReports = issues.length;
    const resolved = issues.filter((i) => i.status === "resolved").length;
    const inProgress = issues.filter((i) => i.status === "in_progress").length;
    const pending = issues.filter((i) => i.status === "open").length;

    // Dummy avg resolution time for now (real = use timestamps)
    const avgResolutionTime = 2.3;

    // Category counts for pie chart
    const categoryCounts = {
      Potholes: 0,
      Garbage: 0,
      "Street Lights": 0,
      "Water Leaks": 0,
      Others: 0,
    };

    for (let issue of issues) {
      const tags = issue.tags.map((tag) => tag.toLowerCase().replace(/^#/, ""));
      if (tags.includes("pothole")) categoryCounts.Potholes++;
      else if (tags.includes("garbage")) categoryCounts.Garbage++;
      else if (tags.includes("light") || tags.includes("street light"))
        categoryCounts["Street Lights"]++;
      else if (tags.includes("water")) categoryCounts["Water Leaks"]++;
      else categoryCounts.Others++;
    }

    // Count by zone for bar chart
    const zoneCounts = {
      Central: 0,
      North: 0,
      South: 0,
      East: 0,
      West: 0,
      "North West": 0,
      "South West": 0,
    };

    for (let issue of issues) {
      if (issue.zone && zoneCounts.hasOwnProperty(issue.zone)) {
        zoneCounts[issue.zone]++;
      }
    }

    // Recent feedback (latest 3)
    const recentFeedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    res.json({
      totalReports,
      resolved,
      inProgress,
      pending,
      avgResolutionTime,
      categoryCounts,
      zoneCounts,
      recentFeedback,
    });
  } catch (err) {
    console.error("Error in admin dashboard:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Issue.find().sort({ createdAt: -1 }).lean();
    res.json(reports);
  } catch (err) {
    console.error("Error fetching all reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// Get all issues grouped by zone
exports.getZoneWiseReports = async (req, res) => {
  try {
    const zones = [
      "North",
      "South",
      "East",
      "West",
      "Central",
      "South West",
      "North West",
    ];

    const issues = await Issue.find().populate("user").sort({ createdAt: -1 });
    const grouped = {};

    zones.forEach((zone) => {
      grouped[zone] = issues.filter((i) => i.zone === zone);
    });

    res.json(grouped);
  } catch (err) {
    console.error("Error in getZoneWiseReports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark issue resolved by admin + notify user
exports.markZoneReportResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionTime, resolvedBy } = req.body;

    const issue = await Issue.findById(id).populate("user");
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = "resolved";
    issue.resolutionTime = resolutionTime;
    issue.resolvedBy = resolvedBy;
    issue.resolvedAt = new Date();
    await issue.save();

    // Admin notifies the user who reported it
    await Notification.create({
      user: issue.user._id,
      type: "resolution",
      message: `Your report (ID: ${issue._id}) has been resolved by Admin. Resolution Time: ${resolutionTime}.`,
    });

    res.json({
      message: "Marked as resolved and user notified.",
      report: issue,
    });
  } catch (err) {
    console.error("Error in markZoneReportResolved:", err);
    res.status(500).json({ message: "Failed to resolve issue" });
  }
};

// Simulated Officer Update from Zone Officer -> Notify Admin
exports.notifyAdminFromOfficer = async (req, res) => {
  try {
    const { zone, reportId, officer, status } = req.body;

    // Notify admin (assuming single admin user or admin role filter)
    const admins = await User.find({ role: "admin" });

    const adminNotifications = admins.map((admin) => ({
      user: admin._id,
      type: "officer_update",
      message: `Officer ${officer} updated status for report #${reportId} in ${zone}. New status: ${status}`,
    }));

    await Notification.insertMany(adminNotifications);

    res.json({ message: "Admin notified about officer update." });
  } catch (err) {
    console.error("Error notifying admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
