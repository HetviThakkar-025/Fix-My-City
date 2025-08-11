const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["resolved", "rejected", "info", "officer_update", "resolution"],
      default: "info",
    },
    title: { type: String, default: "" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
