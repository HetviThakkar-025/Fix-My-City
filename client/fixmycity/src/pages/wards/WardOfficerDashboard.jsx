import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiMessageSquare,
  FiUser,
  FiMap,
  FiLogOut,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const WardOfficerDashboard = () => {
  const navigate = useNavigate();
  const [officerZone, setOfficerZone] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [reports, setReports] = useState([]);
  const [resolutionNotes, setResolutionNotes] = useState({});
  const [filters, setFilters] = useState({
    status: "all",
    severity: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loadingSummaries, setLoadingSummaries] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role?.startsWith("ward_")) {
      const zone =
        role.split("_")[1].charAt(0).toUpperCase() +
        role.split("_")[1].slice(1) +
        " Zone";
      setOfficerZone(zone);
      setOfficerName("Officer " + zone.split(" ")[0]);
    }
  }, []);

  useEffect(() => {
    const fetchZoneReports = async () => {
      const res = await fetch("/api/ward/reports", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setReports(data); // Store all reports, including resolved
    };

    if (officerZone) fetchZoneReports();
  }, [officerZone]);

  const isWithinWeek = (date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(date) > oneWeekAgo;
  };

  const activeReports = reports.filter(
    (r) => r.status.toLowerCase() !== "resolved"
  );

  const filteredReports = activeReports.filter((report) => {
    return (
      (filters.status === "all" || report.status === filters.status) &&
      (filters.severity === "all" || report.severity === filters.severity) &&
      (filters.dateRange === "all" ||
        (filters.dateRange === "week" && isWithinWeek(report.createdAt)))
    );
  });

  const handleStatusUpdate = async (reportId, newStatus) => {
    const notes = resolutionNotes[reportId] || "";

    try {
      const res = await fetch(`/api/ward/reports/${reportId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      const result = await res.json();

      if (res.ok) {
        if (newStatus.toLowerCase() === "resolved") {
          // Remove resolved report
          setReports((prev) => prev.filter((r) => r._id !== reportId));
        } else {
          // Update report status
          setReports((prev) =>
            prev.map((r) =>
              r._id === reportId
                ? {
                    ...r,
                    status: newStatus,
                    resolvedBy: officerName,
                    resolutionNotes: notes,
                    resolutionTime: new Date().toISOString(),
                  }
                : r
            )
          );
        }

        setNotification({
          type: "success",
          message: result.message || "Status updated and admin notified",
        });
      } else {
        throw new Error(result.error || "Failed to update status");
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Something went wrong",
      });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // handler to call your backend summarize endpoint
  const handleGenerateSummaries = async () => {
    try {
      setLoadingSummaries(true);
      setNotification(null);

      // Extract descriptions from already-loaded reports in state
      const descriptions = reports.map((r) => r.description);

      if (descriptions.length === 0) {
        setNotification({ type: "info", message: "No reports to summarize" });
        setLoadingSummaries(false);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("/api/ml/generate-summary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ descriptions }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(
          payload.error || payload.message || "Failed to summarize"
        );
      }

      // payload will be your summaries array from FastAPI → Node → frontend
      // Merge summaries into your existing reports state
      const updatedReports = reports.map((report, idx) => ({
        ...report,
        summary: payload.summaries ? payload.summaries[idx] : "",
      }));

      console.log(updatedReports);
      setReports(updatedReports);
    } catch (err) {
      console.error("Summarize error:", err);
    } finally {
      setLoadingSummaries(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiMap className="text-blue-600" />
              {officerZone} Dashboard
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <FiUser size={14} />
                {officerName}
              </span>
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <FiCheckCircle size={14} />
                {
                  reports.filter((r) => r.status?.toLowerCase() === "resolved")
                    .length
                }{" "}
                Resolved
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                <FiClock size={14} />
                {
                  reports.filter((r) => r.status?.toLowerCase() !== "resolved")
                    .length
                }{" "}
                Pending
              </span>
            </div>
          </div>

          {/* button placed between */}
          <div className="mt-4">
            <button
              onClick={handleGenerateSummaries}
              disabled={loadingSummaries}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                loadingSummaries
                  ? "bg-purple-600 cursor-not-allowed opacity-80"
                  : "bg-purple-700 hover:bg-purple-600"
              }`}
            >
              {loadingSummaries ? "Generating..." : "Generate Summaries (AI)"}
            </button>
          </div>

          <div className="sm:ml-6 sm:fl.ex sm:flex-col sm:items-start gap-2">
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 inline-flex items-center text-md font-medium mb-1"
            >
              <FiLogOut className="mr-1" /> Logout
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiFilter /> Filters <FiChevronDown />
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${
            notification.type === "success"
              ? "bg-green-100 border border-green-200 text-green-800"
              : "bg-red-100 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiCheckCircle className="flex-shrink-0" />
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="font-medium text-lg mb-4 text-gray-800">
            Filter Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) =>
                  setFilters({ ...filters, severity: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters({ ...filters, dateRange: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{report._id.slice(-4)} - {report.title}
                      </h3>
                      {report.severity === "high" && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          <FiAlertCircle size={12} /> High Priority
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <p className="text-md text-gray-700">
                        {report.summary ? report.summary : report.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiCalendar size={14} />
                        Reported:{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiMapPin size={14} />
                        {report.location?.address || "Unknown Location"}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium ${
                      report.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : report.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {report.status === "Resolved" ? (
                      <FiCheckCircle size={14} />
                    ) : (
                      <FiClock size={14} />
                    )}
                    {report.status}
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusUpdate(report._id, e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="open">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution Time
                    </label>
                    <input
                      type="text"
                      placeholder="Resolution time"
                      value={resolutionNotes[report._id] || ""}
                      onChange={(e) =>
                        setResolutionNotes({
                          ...resolutionNotes,
                          [report._id]: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => handleStatusUpdate(report._id, "Resolved")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiMessageSquare size={16} /> Notify Admin & User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500 mb-4">
              <FiAlertCircle className="mx-auto text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              No reports found
            </h3>
            <p className="text-gray-500">
              There are currently no reports for {officerZone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardOfficerDashboard;
