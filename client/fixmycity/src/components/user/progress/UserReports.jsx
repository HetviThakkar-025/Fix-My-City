import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportStatusCard from "./ReportStatusCard";

export default function UserReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  //   backend ----
  //   useEffect(() => {
  //     const fetchUserReports = async () => {
  //       try {
  //         const response = await axios.get("/api/reports/my-reports");
  //         setReports(response.data);
  //       } catch (error) {
  //         console.error("Error fetching reports:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchUserReports();
  //   }, []);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const mockReports = [
        {
          _id: "r1",
          title: "Broken Drain Cover",
          description: "Drain cover is missing near sector 10 market.",
          location: { address: "Sector 10, Gurugram" },
          severity: "medium",
          status: "open",
        },
        {
          _id: "r2",
          title: "Water Leakage",
          description: "Water leaking from underground pipe.",
          location: { address: "Lajpat Nagar, Delhi" },
          severity: "critical",
          status: "resolved",
        },
      ];

      setReports(mockReports);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const handleEdit = (report) => {
    setEditingId(report._id);
    setEditForm({
      title: report.title,
      description: report.description,
    });
  };

  const handleEditSubmit = async (reportId) => {
    try {
      await axios.patch(`/api/reports/${reportId}`, editForm);
      setReports(
        reports.map((report) =>
          report._id === reportId ? { ...report, ...editForm } : report
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      await axios.delete(`/api/reports/${reportId}`);
      setReports(reports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3 mb-4 text-blue-800">
        Your Submitted Reports
      </h2>

      {/* <h2 className="text-xl font-bold">Your Submitted Reports</h2> */}

      {loading ? (
        <div>Loading your reports...</div>
      ) : reports.length === 0 ? (
        <div>You haven't submitted any reports yet</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportStatusCard
              key={report._id}
              report={report}
              editingId={editingId}
              editForm={editForm}
              setEditForm={setEditForm}
              onEdit={handleEdit}
              onEditSubmit={handleEditSubmit}
              onCancelEdit={() => setEditingId(null)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
