import React, { useState } from "react";
import ReportsTable from "../../components/admin/dashboard/ReportsTable";

export default function AllReports() {
  // Mock data
  const [reports, setReports] = useState([
    {
      id: 1001,
      title: "Large pothole on main road",
      category: "Pothole",
      zone: "Central Zone",
      status: "Pending",
      assignedTo: "",
    },
    // Add more reports...
  ]);

  const handleAssign = (reportId, department) => {
    if (department === "auto") {
      // AI assignment logic would go here
      department = "Road Maintenance"; // Mock auto-assignment
    }

    setReports(
      reports.map((report) =>
        report.id === reportId
          ? { ...report, assignedTo: department, status: "In Progress" }
          : report
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Reports</h1>
        <div className="flex space-x-2">
          <select className="border rounded p-2 text-sm">
            <option>Filter by Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="border rounded p-2 text-sm">
            <option>Filter by Zone</option>
            <option>Central Zone</option>
            <option>West Zone</option>
            {/* Other zones */}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            Export
          </button>
        </div>
      </div>

      <ReportsTable reports={reports} onAssign={handleAssign} />
    </div>
  );
}
