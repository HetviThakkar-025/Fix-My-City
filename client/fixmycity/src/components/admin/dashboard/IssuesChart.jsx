import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function IssuesChart() {
  // Mock data
  const issuesByType = {
    labels: ["Potholes", "Street Lights", "Garbage", "Water Leaks", "Others"],
    datasets: [
      {
        data: [320, 190, 280, 200, 110],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
      },
    ],
  };

  const issuesByStatus = {
    labels: ["Resolved", "In Progress", "Pending"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-4">Issues by Type</h3>
        <div className="h-64">
          <Pie data={issuesByType} />
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-medium mb-4">Issues by Status</h3>
        <div className="h-64">
          <Bar
            data={{
              labels: [
                "Central",
                "West",
                "East",
                "North",
                "South",
                "New West",
                "South West",
              ],
              datasets: [
                {
                  label: "Reports by Zone",
                  data: [120, 190, 90, 140, 200, 170, 150],
                  backgroundColor: "#3B82F6",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
