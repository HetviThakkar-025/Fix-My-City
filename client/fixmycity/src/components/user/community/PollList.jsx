import React, { useState, useEffect } from "react";
import PollCard from "./PollCard";
import axios from "axios";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get("/api/polls");
        setPolls(res.data);
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
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/polls/${pollId}/vote`,
        { option },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
