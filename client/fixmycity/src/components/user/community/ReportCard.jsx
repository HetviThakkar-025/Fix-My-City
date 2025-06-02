import React from "react";
import { FiArrowUp, FiMessageSquare, FiMapPin } from "react-icons/fi";

export default function ReportCard({ report, onUpvote }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{report.title}</h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <FiMapPin className="mr-1" />
            {report.location.address}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            report.severity === "critical"
              ? "bg-red-100 text-red-800"
              : report.severity === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {report.severity}
        </span>
      </div>

      <p className="my-2">{report.description}</p>

      {report.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 my-2">
          {report.images.slice(0, 3).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Report ${i}`}
              className="h-20 w-full object-cover rounded"
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onUpvote(report._id)}
            disabled={report.userUpvoted}
            className={`flex items-center space-x-1 ${
              report.userUpvoted
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            <FiArrowUp />
            <span>{report.upvotes || 0}</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <FiMessageSquare />
            <span>{report.comments?.length || 0}</span>
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {report.isAnonymous ? "Anonymous" : report.createdBy?.username}
        </div>
      </div>
    </div>
  );
}
