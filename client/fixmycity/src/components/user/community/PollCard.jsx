import React, { useState } from "react";

export default function PollCard({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(poll.hasVoted || false);

  const handleVote = () => {
    if (!selectedOption) return;
    onVote(poll._id, selectedOption);
    setHasVoted(true);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h4 className="font-semibold mb-2">{poll.question}</h4>

      {!hasVoted ? (
        <div className="space-y-2">
          {poll.options.map((opt, i) => (
            <label key={i} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`poll-${poll._id}`}
                value={opt}
                onChange={() => setSelectedOption(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded disabled:bg-blue-300"
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="text-sm text-green-700 mt-2">You voted. Thanks!</div>
      )}
    </div>
  );
}
