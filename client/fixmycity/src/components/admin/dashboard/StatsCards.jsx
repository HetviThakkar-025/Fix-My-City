import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCards({ selectedZone, onZoneChange }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard stats...</div>;
  }

  if (!stats) {
    return <div>No dashboard stats available.</div>;
  }

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
        <p className="text-2xl font-bold">{stats.avgResolutionTime || "N/A"}</p>
      </div>
    </div>
  );
}
