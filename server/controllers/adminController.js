const Issue = require("../models/Issue");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");
const User = require("../models/User");
const axios = require("axios");
const ML_API_URL = process.env.ML_API_URL;

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
      else if (tags.includes("light") || tags.includes("streetlight"))
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
    const reports = await Issue.find()
      .select(
        "title description tags zone severity status location createdAt upvotes images"
      )
      .sort({ createdAt: -1 })
      .lean();

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

    const issue = await Issue.findById(id).populate("createdBy");
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = "resolved";
    issue.resolutionTime = resolutionTime;
    issue.resolvedBy = resolvedBy;
    issue.resolvedAt = new Date();
    issue.notified = true;

    await issue.save();

    // Notify the user who reported it
    await Notification.create({
      user: issue.createdBy._id,
      type: "resolution",
      message: `Your report (ID: ${issue._id}) titled "${issue.title}" has been resolved by Admin in ${resolutionTime}.`,
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

// POST /api/admin/reports/merge
exports.mergeReports = async (req, res) => {
  try {
    const { report1Id, report2Id } = req.body;
    if (!report1Id || !report2Id) {
      return res.status(400).json({ message: "Missing report IDs" });
    }

    // Mark report2 as merged into report1
    await Issue.findByIdAndUpdate(report2Id, { mergedInto: report1Id });
    res.json({ message: "Reports merged successfully" });
  } catch (err) {
    console.error("Error merging reports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toxicity detection for zone reports
exports.detectToxicReports = async (req, res) => {
  try {
    const { zone } = req.body;

    // 1. Get reports for the zone
    const reports = await Issue.find({
      zone,
      isSpam: { $ne: true },
      status: { $ne: "resolved" },
    }).lean();

    if (!reports.length) {
      return res.json({
        success: true,
        toxicReports: [],
        message: "No reports to analyze in this zone",
      });
    }

    // 2. Prepare texts for ML analysis
    const texts = reports.map((r) => `${r.title}\n${r.description}`);

    // 3. Call ML service
    const mlResponse = await axios.post(`${ML_API_URL}/detect-toxicity`, {
      texts,
      threshold: 0.85,
    });

    // 4. Map toxic reports with original report data
    const toxicReports = reports
      .filter((_, index) => mlResponse.data.results[index]?.is_toxic)
      .map((report, index) => ({
        ...report,
        toxicity: mlResponse.data.results[index],
      }));

    console.log("ML Service Response:", mlResponse.data);

    console.log(toxicReports);

    res.json({
      success: true,
      toxicReports: toxicReports.map((tr) => ({
        _id: tr._id,
        title: tr.title,
        reasons: Object.entries(tr.toxicity.scores)
          .filter(([_, score]) => score > 0.85)
          .map(([label]) => label),
      })),
    });
  } catch (err) {
    console.error("Error detecting toxic reports:", err);
    res.status(500).json({
      success: false,
      error: err.response?.data?.error || err.message,
    });
  }
};

// Mark report as spam
exports.markReportAsSpam = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // 1. Update report
    const report = await Issue.findByIdAndUpdate(
      id,
      {
        isSpam: true,
        spamReason: reason || "irrelevant",
        status: "resolved", // Automatically resolve spam reports
      },
      { new: true }
    ).populate("createdBy");

    if (!report) {
      return res.status(404).json({
        success: false,
        error: "Report not found",
      });
    }

    // 2. Notify the user — don't fail the whole endpoint if notification errors
    try {
      await Notification.create({
        user: report.createdBy._id,
        title: "Report Marked as Spam",
        message: `Your report "${report.title}" was marked as spam. Reason: ${
          reason || "irrelevant"
        }`,
        type: "rejected", // <-- use allowed enum value
        metadata: {
          reportId: report._id,
          zone: report.zone,
        },
      });
    } catch (notifErr) {
      // log and continue — marking spam still succeeded
      console.warn("Failed to create notification for spam-mark:", notifErr);
    }

    // 3. Return the updated report to the frontend
    res.json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Error marking report as spam:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Issue.findById(id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, error: "Report not found" });
    }

    await report.deleteOne();

    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
