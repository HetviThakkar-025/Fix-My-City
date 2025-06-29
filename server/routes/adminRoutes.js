const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const {
  getAdminDashboardData,
  getAllReports,
  getZoneWiseReports,
  markZoneReportResolved,
} = require("../controllers/adminController");

// Admin dashboard stats (used in AdminDashboard.jsx)
router.get("/dashboard", protect, restrictTo("admin"), getAdminDashboardData);

// Admin: Get all user-reported issues (used in AllReports.jsx)
router.get("/reports", protect, restrictTo("admin"), getAllReports);

// Zones (Ward-wise reporting)
router.get("/zones", protect, restrictTo("admin"), getZoneWiseReports);
router.put(
  "/zones/resolve/:id",
  protect,
  restrictTo("admin"),
  markZoneReportResolved
);

module.exports = router;
