const Report = require("../models/Issue");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.getZoneReports = async (req, res) => {
  try {
    const role = req.user.role; // "ward_north", etc.
    const zone =
      role.split("_")[1].charAt(0).toUpperCase() + role.split("_")[1].slice(1);

    const reports = await Report.find({ zone, mergedInto: null });
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
    // Find the main report and all reports merged into it
    const reports = await Report.find({
      $or: [{ _id: id }, { mergedInto: id }],
    }).populate("createdBy"); // populate users to notify

    if (!reports || reports.length === 0) {
      return res.status(404).json({ error: "Report(s) not found" });
    }

    // Update each report
    for (let issue of reports) {
      issue.status = status.toLowerCase();
      issue.resolutionNotes = notes || "";
      issue.resolvedBy = req.user.name;
      issue.resolutionTime = new Date();
      issue.notified = true;
      await issue.save();

      // Notify the user who created this report
      await Notification.create({
        user: issue.createdBy._id,
        type: "resolved",
        message: `Your report titled "${issue.title}" has been resolved by officer ${req.user.name}.`,
      });
    }

    // Notify admin about officer update (only once)
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notification.create({
        user: admin._id,
        type: "officer_update",
        message: `Officer ${req.user.name} updated status for report #${id} (and merged reports if any). New status: ${status}`,
        metadata: {
          reportId: id,
          zone: reports[0].zone,
        },
      });
    }

    res.json({
      success: true,
      message: "Status updated, users notified, and admin notified",
    });
  } catch (err) {
    console.error("Error in updateReportStatus:", err);
    res.status(500).json({ error: "Failed to update report(s)" });
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
