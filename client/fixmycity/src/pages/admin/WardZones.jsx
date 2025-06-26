import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

const zones = [
  "Central Zone",
  "West Zone",
  "East Zone",
  "North Zone",
  "South Zone",
  "New West Zone",
  "South West Zone",
];

export default function WardZones() {
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [resolutionTime, setResolutionTime] = useState("");

  // Mock data
  const zoneReports = {
    "Central Zone": [
      {
        id: 1001,
        title: "Pothole near park",
        status: "Resolved",
        resolvedBy: "Officer A",
        resolutionTime: "2 days",
      },
      // More reports...
    ],
    // Other zones...
  };

  const handleMarkResolved = (reportId) => {
    // In a real app, this would update the backend
    console.log(
      `Marking report ${reportId} as resolved with time ${resolutionTime}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Ward/Zones Management
        </h1>
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border rounded p-2"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Officer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resolution Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zoneReports[selectedZone]?.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.resolvedBy || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.resolutionTime || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status !== "Resolved" && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Resolution time"
                        value={resolutionTime}
                        onChange={(e) => setResolutionTime(e.target.value)}
                        className="border rounded p-1 text-sm w-24"
                      />
                      <button
                        onClick={() => handleMarkResolved(report.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Mark Resolved"
                      >
                        <FiSend />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
