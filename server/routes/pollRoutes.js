const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createPoll,
  getPolls,
  votePoll,
} = require("../controllers/pollController");

router.post("/", protect, createPoll);
router.get("/", getPolls);
router.post(
  "/:id/vote",
  protect,
  (req, res, next) => {
    console.log("➡️ Vote route hit:", req.params.id, req.body.option);
    next();
  },
  votePoll
);
// router.post("/:id/vote", protect, votePoll);

module.exports = router;
