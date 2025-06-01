import React from "react";

export default function SeveritySelector({ value, onChange }) {
  const options = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "critical", label: "Critical", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-2">
      <label className="block font-medium">Severity</label>
      <div className="flex space-x-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name="severity"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="hidden"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                value === option.value ? option.color : "bg-gray-200"
              } cursor-pointer`}
              onClick={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
