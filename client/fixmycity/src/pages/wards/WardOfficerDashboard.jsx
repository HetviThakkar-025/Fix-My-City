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
  FiPhone,
  FiMap,
} from "react-icons/fi";

const WardOfficerDashboard = () => {
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

  //  Determine zone and name after login
  useEffect(() => {
    const role = localStorage.getItem("role"); // e.g., "ward_east"
    if (role?.startsWith("ward_")) {
      const zone =
        role.split("_")[1].charAt(0).toUpperCase() +
        role.split("_")[1].slice(1) +
        " Zone";
      setOfficerZone(zone);
      setOfficerName("Officer " + zone.split(" ")[0]);
    }
  }, []);

  // Mock data - in real app this would come from API
  const allZoneReports = {
    "Central Zone": [
      {
        id: 1001,
        title: "Pothole near Central Park",
        status: "Resolved",
        resolvedBy: "Officer A",
        resolutionTime: "2 days",
        createdAt: new Date("2023-06-25"),
        severity: "high",
        category: "Road",
        location: "Near Main Square",
      },
      {
        id: 1002,
        title: "Broken street light on 5th Ave",
        status: "Pending",
        resolvedBy: "",
        resolutionTime: "",
        createdAt: new Date("2023-06-28"),
        severity: "medium",
        category: "Electricity",
        location: "5th Avenue",
      },
    ],
    "North Zone": [
      {
        id: 2001,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 3001,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
    "East Zone": [
      {
        id: 4001,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 3009,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
    "West Zone": [
      {
        id: 4701,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 3059,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
    "South Zone": [
      {
        id: 4081,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 3006,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
    "Northwest Zone": [
      {
        id: 6001,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 3005,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
    "Southwest Zone": [
      {
        id: 6129,
        title: "Garbage accumulation near market",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
        category: "Sanitation",
        location: "North Market Area",
      },
      {
        id: 4540,
        title: "Garbage accumulation near market",
        status: "Resolved",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "low",
        category: "Sanitation",
        location: "North Market Area",
      },
    ],
  };

  useEffect(() => {
    if (!officerZone) return;

    const zoneReports = allZoneReports[officerZone] || [];

    const filtered = zoneReports.filter((report) => {
      return (
        (filters.status === "all" || report.status === filters.status) &&
        (filters.severity === "all" || report.severity === filters.severity) &&
        (filters.dateRange === "all" ||
          (filters.dateRange === "week" && isWithinWeek(report.createdAt)))
      );
    });

    setReports(filtered);
  }, [officerZone, filters]);

  const isWithinWeek = (date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date > oneWeekAgo;
  };

  const handleStatusUpdate = (reportId, newStatus) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: newStatus,
            resolvedBy: officerName,
            resolutionTime: newStatus === "Resolved" ? "0 days" : "",
          }
        : report
    );

    setReports(updatedReports);

    // Notify admin
    const report = reports.find((r) => r.id === reportId);
    sendNotificationToAdmin({
      type: "STATUS_UPDATE",
      zone: officerZone,
      reportId,
      officer: officerName,
      newStatus,
      reportTitle: report.title,
      notes: resolutionNotes[reportId] || "",
    });

    setNotification({
      type: "success",
      message: "Status updated and admin notified",
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const sendNotificationToAdmin = (data) => {
    console.log("Notification to admin:", data);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
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
                {reports.filter((r) => r.status === "Resolved").length} Resolved
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                <FiClock size={14} />
                {reports.filter((r) => r.status !== "Resolved").length} Pending
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiFilter /> Filters <FiChevronDown />
          </button>
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

      {/* Filters Panel */}
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
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
                <option value="high">High</option>
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

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Report Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{report.id} - {report.title}
                      </h3>
                      {report.severity === "high" && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                          <FiAlertCircle size={12} />
                          High Priority
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiCalendar size={14} />
                        Reported: {report.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiMap size={14} />
                        {report.location}
                      </div>
                      <div className="text-gray-600">
                        Category:{" "}
                        <span className="font-medium">{report.category}</span>
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

                {/* Report Actions */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        handleStatusUpdate(report.id, e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resolution Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Add your notes here..."
                      value={resolutionNotes[report.id] || ""}
                      onChange={(e) =>
                        setResolutionNotes({
                          ...resolutionNotes,
                          [report.id]: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        handleStatusUpdate(report.id, "Resolved");
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiMessageSquare size={16} />
                      Notify Admin
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
