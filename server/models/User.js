const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "ward_north",
        "ward_south",
        "ward_east",
        "ward_west",
        "ward_central",
        "ward_northwest",
        "ward_southwest",
      ],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
