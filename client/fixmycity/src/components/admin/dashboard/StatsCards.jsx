import React from "react";

export default function StatsCards({ selectedZone, onZoneChange }) {
  // Mock data - replace with real API data
  const stats = {
    totalReports: 1243,
    resolved: 876,
    inProgress: 234,
    pending: 133,
    avgResolutionTime: "2.3 days",
    satisfactionRating: "4.2/5",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
        <p className="text-gray-500 text-sm">Total Reports</p>
        <p className="text-2xl font-bold">{stats.totalReports}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-green-500">
        <p className="text-gray-500 text-sm">Resolved</p>
        <p className="text-2xl font-bold">{stats.resolved}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-yellow-500">
        <p className="text-gray-500 text-sm">In Progress</p>
        <p className="text-2xl font-bold">{stats.inProgress}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-red-500">
        <p className="text-gray-500 text-sm">Pending</p>
        <p className="text-2xl font-bold">{stats.pending}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-indigo-500">
        <p className="text-gray-500 text-sm">Avg. Resolution</p>
        <p className="text-2xl font-bold">{stats.avgResolutionTime}</p>
      </div>
    </div>
  );
}
