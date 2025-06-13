import React, { useState, useEffect } from "react";
import ReportCard from "./ReportCard";
import axios from "axios";

export default function ReportList({ cityFilter }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/issues/community", {
          params: {
            city: cityFilter,
            status: filter !== "all" ? filter : undefined,
          },
        });
        setReports(res.data || []);
      } catch (err) {
        console.error("Error fetching community reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [cityFilter, filter]);

  const handleUpvote = async (reportId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `/api/issues/${reportId}/upvote`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports( 
        reports.map((report) =>
          report._id === reportId
            ? { ...report, upvotes: report.upvotes + 1, userUpvoted: true }
            : report
        )
      );
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Community Reports</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div>Loading reports...</div>
      ) : reports.length === 0 ? (
        <div>No reports found for your city</div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
