const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
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
const mlRoutes = require("./routes/mlroutes");

const app = express();

// Enable JSON parsing
app.use(express.json());

// Allow CORS from client (React dev server)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Connect to MongoDB Atlas
connectDB();

// Your existing API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ward", wardReportRoutes);
app.use("/api/ml", mlRoutes);

// Default test route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
