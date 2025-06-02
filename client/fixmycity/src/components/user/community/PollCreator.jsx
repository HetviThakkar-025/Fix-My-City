import React, { useState } from "react";
import axios from "axios";

export default function PollCreator({ onPollCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validOptions = options.filter((opt) => opt.trim() !== "");
      const response = await axios.post("/api/polls", {
        question,
        options: validOptions,
      });
      onPollCreated(response.data);
      setQuestion("");
      setOptions(["", ""]);
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-bold mb-3">Create New Poll</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="space-y-2 mb-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow p-2 border rounded mr-2"
                required={index < 2}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {options.length < 5 && (
            <button
              type="button"
              onClick={addOption}
              className="text-blue-500 text-sm"
            >
              + Add Option
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
          >
            {isSubmitting ? "Creating..." : "Create Poll"}
          </button>
        </div>
      </form>
    </div>
  );
}
