import React, { useState } from "react";
import StatsCards from "../../components/admin/dashboard/StatsCards";
import IssuesChart from "../../components/admin/dashboard/IssuesChart";
import Heatmap from "../../components/admin/dashboard/Heatmap";

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState("all");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <StatsCards selectedZone={selectedZone} onZoneChange={setSelectedZone} />

      <IssuesChart />

      <Heatmap />

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Recent Feedback</h3>
          <button className="text-blue-600 text-sm">Export Data</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-3">
              <div className="flex justify-between">
                <span className="font-medium">Road Maintenance</span>
                <span className="flex items-center text-yellow-500">
                  {4.2} ★
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                "The pothole on my street was fixed within 2 days. Good
                service."
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
