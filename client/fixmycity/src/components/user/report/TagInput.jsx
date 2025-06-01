import React, { useState, useRef } from "react";

export default function TagInput({ tags = [], onChange }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const commonTags = [
    "#pothole",
    "#streetlight",
    "#garbage",
    "#waterleak",
    "#road",
  ];

  const handleKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue)) {
      onChange([
        ...tags,
        inputValue.startsWith("#") ? inputValue : `#${inputValue}`,
      ]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const addCommonTag = (tag) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-blue-100 px-2 py-1 rounded flex items-center"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Add tags..."
          className="flex-grow p-1 border-b focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {commonTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => addCommonTag(tag)}
            className={`text-xs px-2 py-1 rounded ${
              tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
