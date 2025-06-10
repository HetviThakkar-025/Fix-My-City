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
