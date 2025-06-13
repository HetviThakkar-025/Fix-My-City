const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/auth");
const { getUserHomeData } = require("../controllers/userController");

// ✅ User dashboard/home data route
router.get("/home", protect, getUserHomeData);

// Example test route (already present)
router.get("/profile", protect, restrictTo("user"), (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

module.exports = router;
