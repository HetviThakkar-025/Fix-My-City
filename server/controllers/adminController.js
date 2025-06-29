const Issue = require("../models/Issue");
const Feedback = require("../models/Feedback");

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
      const tags = issue.tags.map((tag) => tag.toLowerCase());
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

exports.getZoneWiseReports = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 }).lean();

    const zones = [
      "North",
      "South",
      "East",
      "West",
      "Central",
      "South West",
      "North West",
    ];

    const grouped = {};
    for (const zone of zones) {
      grouped[zone] = issues.filter((i) => i.zone === zone);
    }

    res.json(grouped);
  } catch (err) {
    console.error("Error in getZoneWiseReports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark report as resolved with resolution time
exports.markZoneReportResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionTime, resolvedBy } = req.body;

    const updated = await Issue.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolutionTime,
        resolvedBy,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ message: "Report marked as resolved", report: updated });
  } catch (err) {
    console.error("Error in markZoneReportResolved:", err);
    res.status(500).json({ message: "Failed to update report" });
  }
};
