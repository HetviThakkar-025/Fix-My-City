const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");

router.get("/profile", protect, restrictTo("user"), (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

module.exports = router;
