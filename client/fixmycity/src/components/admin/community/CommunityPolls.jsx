// src/components/CommunityPolls.jsx
import React from "react";
import { FiBarChart2, FiCheckCircle, FiTrash2, FiEdit2 } from "react-icons/fi";

const CommunityPolls = ({
  polls,
  onVote,
  onDelete,
  onEdit,
  adminView = false,
  showResults = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full">
      {/* Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{poll.question}</h3>
              {adminView && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(poll)}
                    className="text-blue-500"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => onDelete(poll._id)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="mt-4 space-y-3">
              {poll.options.map((option, index) => {
                const percentage =
                  poll.totalVotes > 0
                    ? Math.round((option.votes / poll.totalVotes) * 100)
                    : 0;

                return (
                  <div key={index}>
                    {!showResults && onVote ? (
                      // Voting interface
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`poll-${poll._id}`}
                          onChange={() => onVote(poll._id, option.text)}
                          disabled={poll.hasVoted}
                        />
                        <span>{option.text}</span>
                      </label>
                    ) : (
                      // Results display
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{option.text}</span>
                          <span>
                            {option.votes} votes ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage >= 50
                                ? "bg-green-500"
                                : percentage >= 15
                                ? "bg-blue-500"
                                : "bg-red-400"
                            }`}
                            style={{
                              width: `${Math.max(percentage, 10)}%`, // minimum visible bar width
                              opacity: percentage === 0 ? 0.3 : 1,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {showResults && (
              <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                Total votes: {poll.totalVotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPolls;
