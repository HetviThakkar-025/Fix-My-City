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

    report.status = status;
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
        message: `Officer ${req.user.name} updated status for report #${reportId} in ${zone}. New status: ${status}`,
        metadata: {
          zone,
          reportId,
        },
      });
    }

    res.json({ success: true, message: "Status updated and admin notified" });
  } catch (err) {
    console.error("Error in updateReportStatus:", err); // ✅ log full error
    res.status(500).json({ error: "Failed to update report" });
  }
};
