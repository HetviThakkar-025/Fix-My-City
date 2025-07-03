const Report = require("../models/Issue");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.getZoneReports = async (req, res) => {
  try {
    const role = req.user.role; // "ward_north", etc.
    const zone =
      role.split("_")[1].charAt(0).toUpperCase() + role.split("_")[1].slice(1);

    const reports = await Report.find({ zone });
    console.log(zone);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

exports.updateReportStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.status = status.toLowerCase();
    report.resolutionNotes = notes || "";
    report.resolvedBy = req.user.name;
    report.resolutionTime = new Date();
    await report.save();

    // Notify admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        type: "officer_update",
        message: `Officer ${req.user.name} updated status for report #${report._id} in ${report.zone}. New status: ${status}`,
        metadata: {
          zone: report.zone,
          reportId: report._id,
        },
      });
    }

    res.json({ success: true, message: "Status updated and admin notified" });
  } catch (err) {
    console.error("Error in updateReportStatus:", err); // ✅ log full error
    res.status(500).json({ error: "Failed to update report" });
  }
};

// controllers/wardReportsController.js
exports.notifyUserResolved = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id).populate("createdBy");
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (issue.notified) {
      return res.status(400).json({ message: "User already notified" });
    }

    await Notification.create({
      user: issue.createdBy._id,
      type: "resolved",
      message: `Your report titled "${issue.title}" has been marked as resolved.`,
    });

    issue.notified = true; // ✅ persist
    await issue.save(); // ✅ SAVE it

    res.json({ success: true, message: "User notified", report: issue });
  } catch (err) {
    console.error("Error in notifyUserResolved:", err);
    res.status(500).json({ message: "Failed to notify user" });
  }
};
