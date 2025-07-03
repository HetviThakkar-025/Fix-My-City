const express = require("express");
const router = express.Router();
const {
  getZoneReports,
  updateReportStatus,
  notifyUserResolved,
} = require("../controllers/wardReportsController");
const { protect, wardOnly } = require("../middleware/auth");

router.get("/reports", protect, wardOnly, getZoneReports);
router.put("/reports/:id/status", protect, wardOnly, updateReportStatus);
router.post("/reports/:id/notify", protect, wardOnly, notifyUserResolved);

module.exports = router;
