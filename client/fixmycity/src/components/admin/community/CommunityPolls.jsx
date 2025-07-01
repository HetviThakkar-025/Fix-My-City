import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

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
      <div className="space-y-6">
        {polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          const maxVotesInPoll = Math.max(
            ...poll.options.map((opt) => opt.votes)
          );

          return (
            <div
              key={poll._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Poll Header */}
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

              {/* Poll Options */}
              <div className="mt-4 space-y-3">
                {poll.options.map((option, index) => {
                  const percentage =
                    totalVotes > 0
                      ? Math.round((option.votes / totalVotes) * 100)
                      : 0;

                  // Width based on max in this poll
                  const width =
                    maxVotesInPoll > 0
                      ? `${(option.votes / maxVotesInPoll) * 100}%`
                      : "2%";

                  // Color logic based on raw vote count
                  let color = "bg-gray-400";
                  if (option.votes > 0) {
                    if (option.votes <= 2) color = "bg-red-500";
                    else if (option.votes <= 5) color = "bg-blue-500";
                    else color = "bg-green-500";
                  }

                  return (
                    <div key={index}>
                      {!showResults && onVote ? (
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
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{option.text}</span>
                            <span>
                              {option.votes} votes ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${color}`}
                              style={{
                                width,
                                opacity: option.votes === 0 ? 0.3 : 1,
                                minWidth:
                                  option.votes > 0 && width === "0%"
                                    ? "4%"
                                    : undefined,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total votes */}
              {showResults && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  Total votes: {totalVotes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityPolls;
