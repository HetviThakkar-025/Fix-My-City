import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportStatusCard from "./ReportStatusCard";

export default function UserReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/issues/my-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
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
      await axios.patch(`/api/issues/${reportId}`, editForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
      await axios.delete(`/api/issues/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
