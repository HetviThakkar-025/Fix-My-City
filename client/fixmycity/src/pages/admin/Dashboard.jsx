import React, { useState, useEffect } from "react";
import StatsCards from "../../components/admin/dashboard/StatsCards";
import IssuesChart from "../../components/admin/dashboard/IssuesChart";
import Heatmap from "../../components/admin/dashboard/Heatmap";
import axios from "axios";

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data || []);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <StatsCards selectedZone={selectedZone} onZoneChange={setSelectedZone} />
      <IssuesChart />
      <Heatmap />

      {/* Feedback Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Recent Feedback</h3>
        </div>

        {loadingFeedback ? (
          <p>Loading feedback...</p>
        ) : feedbacks.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbacks.slice(0, 6).map((f) => (
              <div key={f._id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="font-medium capitalize">
                    {f.service
                      ? f.service.replace(/_/g, " ")
                      : "Unknown Service"}
                  </span>

                  <span className="flex items-center text-blue-600 font-semibold">
                    {f.rating?.toFixed(1)} ★
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">"{f.comments}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
