const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  service: {
    type: String,
    enum: [
      "road_maintenance",
      "waste_management",
      "public_transport",
      "water_supply",
      "other",
    ],
    required: true,
  },

  rating: { type: Number, min: 1, max: 5, required: true },

  comments: { type: String },
  suggestions: { type: String, required: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
