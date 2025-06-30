import React, { useState } from "react";
import Filters from "../../components/admin/allreports/Filters";
import ReportCard from "../../components/admin/allreports/ReportCard";
import ExportButton from "../../components/admin/allreports/ExportButton";

export default function AllReports() {
  const [reports, setReports] = useState([
    {
      id: 1001,
      title: "Large pothole on main road",
      description: "There is a very deep pothole causing traffic jams.",
      category: "Pothole",
      zone: "Central Zone",
      severity: "high",
      status: "Pending",
      assignedZone: "",
      createdAt: new Date("2023-06-15"),
    },
    {
      id: 1002,
      title: "Street light broken",
      description: "Light not working at night near community park.",
      category: "Street Lights",
      zone: "East Zone",
      severity: "medium",
      status: "Pending",
      assignedZone: "",
      createdAt: new Date("2023-06-16"),
    },
    {
      id: 1003,
      title: "Garbage not collected",
      description: "Trash hasn't been picked up for 3 days.",
      category: "Garbage",
      zone: "West Zone",
      severity: "low",
      status: "In Progress",
      assignedZone: "West Zone",
      createdAt: new Date("2023-06-14"),
    },
    {
      id: 1004,
      title: "Water leakage",
      description: "Pipe burst near the market area.",
      category: "Water",
      zone: "North Zone",
      severity: "high",
      status: "Resolved",
      assignedZone: "North Zone",
      createdAt: new Date("2023-06-10"),
    },
  ]);

  const [filters, setFilters] = useState({
    status: "All",
    zone: "All",
    category: "All",
    severity: "All",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredReports = reports.filter((report) => {
    return (
      (filters.status === "All" || report.status === filters.status) &&
      (filters.zone === "All" || report.zone.includes(filters.zone)) &&
      (filters.category === "All" || report.category === filters.category) &&
      (filters.severity === "All" ||
        report.severity === filters.severity.toLowerCase())
    );
  });

  const handleAssign = (reportId, zone) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, assignedZone: zone, status: "In Progress" }
          : r
      )
    );
  };

  const handleDuplicateDetection = () => {
    console.log("🔍 Detecting duplicates...");
    alert("Duplicate detection will be handled here (ML)");
  };

  const handlePriorityPrediction = () => {
    console.log("⚙️ Predicting priority...");
    alert("Priority prediction will be handled here (ML)");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Reports</h1>
        <div className="flex flex-wrap gap-2">
          <ExportButton reports={filteredReports} />
          <button
            onClick={handleDuplicateDetection}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Detect Duplicates (AI)
          </button>
          <button
            onClick={handlePriorityPrediction}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Predict Priority (AI)
          </button>
        </div>
      </div>

      <Filters filters={filters} onChange={handleFilterChange} />

      {filteredReports.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No reports found matching your filters
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onAssign={handleAssign}
            />
          ))}
        </div>
      )}
    </div>
  );
}
