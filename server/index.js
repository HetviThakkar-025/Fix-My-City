const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const issueRoutes = require("./routes/issueRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const pollRoutes = require("./routes/pollRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const wardReportRoutes = require("./routes/wardRoutes");

const app = express();
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ward", wardReportRoutes);

// Connect to MongoDB Atlas
connectDB();

// Default test route
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
