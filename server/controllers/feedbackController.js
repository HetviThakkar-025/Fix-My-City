const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { comment, improvement, rating } = req.body;

    const feedback = await Feedback.create({
      user: req.user.id,
      comment,
      improvement,
      rating,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};
