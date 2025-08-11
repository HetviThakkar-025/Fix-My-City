const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getAdminDashboardData,
  getAllReports,
  getZoneWiseReports,
  markZoneReportResolved,
  notifyAdminFromOfficer,
  mergeReports,
  detectToxicReports,
  markReportAsSpam,
  deleteReport,
} = require("../controllers/adminController");

// Admin dashboard stats (used in AdminDashboard.jsx)
router.get("/dashboard", protect, restrictTo("admin"), getAdminDashboardData);

// Admin: Get all user-reported issues (used in AllReports.jsx)
router.get("/reports", protect, restrictTo("admin"), getAllReports);

// Zones (Ward-wise reporting)
router.get("/zones", protect, restrictTo("admin"), getZoneWiseReports);

// Officer → Admin notification (officer updates a report, admin gets notified)
router.post(
  "/zones/officer-update",
  protect,
  restrictTo("officer"),
  notifyAdminFromOfficer
);

// Admin marks report resolved + notifies user
router.put(
  "/zones/resolve/:id",
  protect,
  restrictTo("admin"),
  markZoneReportResolved
);

// Merge two duplicate reports
router.post("/reports/merge", protect, restrictTo("admin"), mergeReports);

// Admin notifies user (after resolving the issue)
router.post(
  "/reports/:id/notify",
  protect,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const reportId = req.params.id;

      const Report = require("../models/Issue"); // adjust path if needed
      const Notification = require("../models/Notification");

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      if (report.notified) {
        return res
          .status(400)
          .json({ message: "User already notified for this report" });
      }

      // Create notification
      await Notification.create({
        user: report.createdBy,
        title: "Issue Resolved",
        message: `Your report titled "${report.title}" has been marked as resolved.`,
        type: "resolved",
        metadata: {
          reportId: report._id,
          zone: report.zone,
        },
      });

      report.notified = true;
      await report.save();

      res.status(200).json({ message: "User notified successfully" });
    } catch (err) {
      console.error("❌ Admin notify error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Detect toxic reports in a zone
router.post(
  "/reports/detect-toxic",
  protect,
  restrictTo("admin"),
  detectToxicReports
);

// Mark report as spam
router.put(
  "/reports/:id/mark-spam",
  protect,
  restrictTo("admin"),
  markReportAsSpam
);

router.delete("/reports/:id", protect, restrictTo("admin"), deleteReport);

module.exports = router;
