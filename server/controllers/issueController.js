const Issue = require("../models/Issue");

exports.createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      severity,
      tags,
      images,
      isAnonymous,
    } = req.body;

    const issue = await Issue.create({
      title,
      description,
      location,
      severity,
      tags,
      images,
      isAnonymous,
      createdBy: req.user.id,
    });

    res.status(201).json(issue);
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Failed to create issue" });
  }
};

exports.getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ createdBy: req.user.id });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your issues" });
  }
};

exports.getCommunityReports = async (req, res) => {
  try {
    const { city, status } = req.query;
    const query = {};

    if (city) query["location.address"] = { $regex: city, $options: "i" };
    if (status && status !== "all") query.status = status;

    const reports = await Issue.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
