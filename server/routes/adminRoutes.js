const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");

router.get("/profile", protect, restrictTo("admin"), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.id}` });
});

module.exports = router;
