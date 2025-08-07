// controllers/userController.js
const Issue = require("../models/Issue");
const User = require("../models/User");

exports.getUserHomeData = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: "resolved" });

    const resolutionRate =
      totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    const stats = [
      { value: totalIssues.toString(), label: "Issues Reported" },
      { value: `${resolutionRate}%`, label: "Issues Resolved" },
      { value: "48h", label: "Avg. Response Time" }, // Placeholder
      { value: "4.2★", label: "Citizen Satisfaction" }, // Placeholder
    ];

    // Get top trending tags
    const trendingAgg = await Issue.aggregate([
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 4 },
    ]);

    const trendingIssues = trendingAgg.map((t, i) => ({
      id: i + 1,
      type: t._id,
      count: t.count,
    }));

    const user = await User.findById(req.user.id).select("name");
    console.log(user);

    res.status(200).json({ stats, trendingIssues, user: user.name });
  } catch (err) {
    console.error("Error fetching home data", err);
    res.status(500).json({ message: "Failed to load user home data" });
  }
};
