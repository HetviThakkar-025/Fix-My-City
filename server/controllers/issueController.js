const Issue = require("../models/Issue");

const getZoneFromAddress = (address) => {
  if (!address) return null;
  const lower = address.toLowerCase();

  const zoneMap = {
    Central: [
      "jamalpur",
      "kalupur",
      "shahpur",
      "dariyapur",
      "astodia",
      "khamasa",
      "raikhad",
      "gheekanta",
      "khadia",
    ],
    South: [
      "maninagar",
      "ghodasar",
      "isanpur",
      "vatva",
      "narol",
      "lambha",
      "khokhra",
      "amraiwadi",
    ],
    North: [
      "sabarmati",
      "chandkheda",
      "motera",
      "ranip",
      "kali",
      "d-cabin",
      "sughad",
      "ongc",
    ],
    East: [
      "naroda",
      "nikol",
      "odhav",
      "vastral",
      "bapunagar",
      "rakhial",
      "saraspur",
      "india colony",
      "ramol",
      "hathijan",
    ],
    West: [
      "vejalpur",
      "ambawadi",
      "satellite",
      "vasna",
      "jivraj park",
      "shyamal",
      "prahladnagar",
      "anandnagar",
      "juhapura",
    ],
    "South West": [
      "gota",
      "sola",
      "thaltej",
      "bodakdev",
      "bopal",
      "ghuma",
      "science city",
      "hebatpur",
      "zundal",
      "shilaj",
      "sp ring road",
      "chandlodiya",
    ],
    "North West": [
      "nava vadaj",
      "naranpura",
      "memnagar",
      "usmanpura",
      "vadaj",
      "vastrapur",
      "navrangpura",
      "gurukul",
      "bhuyangdev",
      "akhbarnagar",
    ],
  };

  // Extract all matching zones with their matching area
  const matches = [];

  for (const [zone, areas] of Object.entries(zoneMap)) {
    for (const area of areas) {
      if (lower.includes(area)) {
        matches.push({ zone, match: area, index: lower.indexOf(area) });
      }
    }
  }

  // Sort by index of match to prefer the earliest occurring area
  if (matches.length > 0) {
    matches.sort((a, b) => a.index - b.index);
    return matches[0].zone;
  }

  return null;
};

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

    const zone = getZoneFromAddress(location?.address); // 🧠 Auto-assign zone

    const issue = await Issue.create({
      title,
      description,
      location,
      severity,
      tags,
      images,
      isAnonymous,
      createdBy: req.user.id,
      zone, // 👈 Save in DB
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

exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    // Initialize if not present
    if (typeof issue.upvotes !== "number") {
      issue.upvotes = 0;
    }

    issue.upvotes += 1;
    await issue.save();

    res
      .status(200)
      .json({ message: "Upvoted successfully", upvotes: issue.upvotes });
  } catch (error) {
    console.error("Upvote error:", error);
    res.status(500).json({ message: "Failed to upvote" });
  }
};

// PATCH /api/issues/:id
exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Failed to update issue" });
  }
};

// DELETE /api/issues/:id
exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.status(200).json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete issue" });
  }
};

// exports.getSingleIssue = async (req, res) => {
//   try {
//     const issue = await Issue.findById(req.params.id);
//     if (!issue) return res.status(404).json({ message: "Not found" });
//     res.status(200).json(issue);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching report" });
//   }
// };
