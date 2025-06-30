import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";

export default function IssuesChart() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [statusCounts, setStatusCounts] = useState({
    resolved: 0,
    inProgress: 0,
    pending: 0,
  });
  const [zoneCounts, setZoneCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategoryCounts(res.data.categoryCounts || {});
        setStatusCounts({
          resolved: res.data.resolved || 0,
          inProgress: res.data.inProgress || 0,
          pending: res.data.pending || 0,
        });
        setZoneCounts(res.data.zoneCounts || {});
      } catch (err) {
        console.error("Error fetching chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading chart data...</div>;

  const issuesByType = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
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
        label: "Issues by Status",
        data: [
          statusCounts.resolved,
          statusCounts.inProgress,
          statusCounts.pending,
        ],
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
            data={issuesByStatus}
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
