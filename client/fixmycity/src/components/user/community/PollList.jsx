import React, { useState, useEffect } from "react";
import PollCard from "./PollCard";
import axios from "axios";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with real API later
    const fetchPolls = async () => {
      try {
        const mockPolls = [
          {
            _id: "1",
            question: "Should we install more streetlights?",
            options: ["Yes", "No", "Maybe"],
            hasVoted: false,
          },
          {
            _id: "2",
            question: "Which area needs cleaning first?",
            options: ["Sector 5", "Sector 12", "Sector 22"],
            hasVoted: false,
          },
        ];
        // const res = await axios.get("/api/polls");
        // setPolls(res.data);
        setPolls(mockPolls);
      } catch (err) {
        console.error("Error fetching polls", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, option) => {
    try {
      // await axios.post(`/api/polls/${pollId}/vote`, { option });
      setPolls((prev) =>
        prev.map((poll) =>
          poll._id === pollId ? { ...poll, hasVoted: true } : poll
        )
      );
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Community Polls</h3>
      {loading ? (
        <p>Loading polls...</p>
      ) : (
        polls.map((poll) => (
          <PollCard key={poll._id} poll={poll} onVote={handleVote} />
        ))
      )}
    </div>
  );
}
