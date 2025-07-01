const express = require("express");
const router = express.Router();
const {
  getZoneReports,
  updateReportStatus,
} = require("../controllers/wardReportsController");
const { protect, wardOnly } = require("../middleware/auth");

router.get("/reports", protect, wardOnly, getZoneReports);
router.put("/reports/:id/status", protect, wardOnly, updateReportStatus);

module.exports = router;
