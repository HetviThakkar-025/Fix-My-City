const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getAdminDashboardData,
  getAllReports,
  getZoneWiseReports,
  markZoneReportResolved,
  notifyAdminFromOfficer,
} = require("../controllers/adminController");

// ✅ Admin dashboard stats (used in AdminDashboard.jsx)
router.get("/dashboard", protect, restrictTo("admin"), getAdminDashboardData);

// ✅ Admin: Get all user-reported issues (used in AllReports.jsx)
router.get("/reports", protect, restrictTo("admin"), getAllReports);

// ✅ Zones (Ward-wise reporting)
router.get("/zones", protect, restrictTo("admin"), getZoneWiseReports);

// ✅ Officer → Admin notification (officer updates a report, admin gets notified)
router.post(
  "/zones/officer-update",
  protect,
  restrictTo("officer"),
  notifyAdminFromOfficer
);

// ✅ Admin marks report resolved + notifies user
router.put(
  "/zones/resolve/:id",
  protect,
  restrictTo("admin"),
  markZoneReportResolved
);

module.exports = router;
