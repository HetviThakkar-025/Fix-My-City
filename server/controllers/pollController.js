const Poll = require("../models/Poll");

exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const newPoll = await Poll.create({
      question,
      options: options.map((text) => ({ text })),
      createdBy: req.user.id,
    });
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ message: "Failed to create poll" });
  }
};

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch polls" });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const pollId = req.params.id;
    const { option } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const optionIndex = poll.options.findIndex((opt) => opt.text === option);
    if (optionIndex === -1) {
      return res.status(400).json({ message: "Invalid option selected" });
    }

    console.log("Option before increment:", poll.options[optionIndex]);
    poll.options[optionIndex].votes += 1;
    console.log("Option after increment:", poll.options[optionIndex]);
    poll.markModified("options");
    await poll.save();

    res.status(200).json({ message: "Vote recorded", poll });
  } catch (err) {
    console.error("Vote Poll Error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};
