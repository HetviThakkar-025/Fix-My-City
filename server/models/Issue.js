const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    zone: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "Central",
        "South West",
        "North West",
      ], // Ahmedabad zones
      default: null,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "critical"],
      default: "medium",
    },
    tags: [{ type: String }],
    images: [{ type: String }],
    isAnonymous: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },

    resolutionTime: {
      type: String,
      default: "",
    },
    resolvedBy: {
      type: String, // can be officer/admin name
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    notified: {
      type: Boolean,
      default: false,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    mergedInto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    isSpam: {
      type: Boolean,
      default: false,
    },
    spamReason: {
      type: String,
      enum: ["profanity", "shouting", "repetitive", "irrelevant", "warning", null],
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
