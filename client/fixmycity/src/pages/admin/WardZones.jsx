import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSend,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiBell,
  FiX,
  FiFlag,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";

const zones = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "South West",
  "North West",
];

export default function WardZones() {
  const [zoneReports, setZoneReports] = useState({});
  const [activeZone, setActiveZone] = useState("Central");
  const [resolutionTimes, setResolutionTimes] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifiedReports, setNotifiedReports] = useState([]);
  const [spamReports, setSpamReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toxicReports, setToxicReports] = useState([]);
  const [toxicityLoading, setToxicityLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch reports from backend on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/reports`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const reportsByZone = {};

        res.data.forEach((report) => {
          const zone = report.zone || "Unspecified Zone";
          if (!reportsByZone[zone]) reportsByZone[zone] = [];

          reportsByZone[zone].push({
            id: report._id,
            description: report.description,
            title: report.title,
            status:
              report.status === "resolved"
                ? "Resolved"
                : report.status === "in_progress"
                ? "In Progress"
                : "Pending",
            resolvedBy: report.resolvedBy || "",
            resolutionTime: report.resolutionTime || "",
            createdAt: new Date(report.createdAt),
            severity: report.severity,
            createdBy: report.createdBy,
            notified: report.hasOwnProperty("notified")
              ? report.notified
              : false,
          });
        });

        setZoneReports(reportsByZone);
      } catch (err) {
        console.error("Failed to fetch zone reports", err);
      }
    };

    fetchReports();
  }, []);

  // Load real notifications from backend for logged-in admin
  useEffect(() => {
    const fetchAdminNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const formatted = res.data.map((n) => ({
          id: n._id,
          message: n.message,
          title: n.title || "Notification",
          timestamp: new Date(n.createdAt),
          read: n.read,
          zone: n.metadata?.zone || "", // fallback if you store zone in metadata
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("❌ Failed to load notifications:", err);
      }
    };

    fetchAdminNotifications();
  }, []);

  const addNotification = (n) => setNotifications((prev) => [n, ...prev]);
  const markNotificationAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${API_URL}/notifications/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications([]);
    } catch (err) {
      console.error("❌ Failed to clear notifications:", err);
    }
  };

  const handleResolutionTimeChange = (id, time) =>
    setResolutionTimes((prev) => ({ ...prev, [id]: time }));

  const handleMarkResolved = async (zone, reportId) => {
    const resolutionTime = resolutionTimes[reportId] || "1 day";
    const token = localStorage.getItem("token");
    const report = zoneReports[zone].find((r) => r.id === reportId);

    try {
      if (report.status !== "Resolved") {
        // 🔁 1. Mark as resolved
        const res = await axios.put(
          `${API_URL}/admin/zones/resolve/${reportId}`,
          {
            resolutionTime,
            resolvedBy: "Admin",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedReport = res.data.report;

        // 🔁 2. Update UI
        setZoneReports((prev) => ({
          ...prev,
          [zone]: prev[zone].map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  status: updatedReport.status,
                  resolutionTime: updatedReport.resolutionTime,
                  resolvedBy: updatedReport.resolvedBy,
                }
              : report
          ),
        }));

        addNotification({
          id: Date.now(),
          zone,
          reportId,
          message: `Report #${reportId} resolved successfully in ${resolutionTime}`,
          timestamp: new Date(),
          read: false,
        });
      } else {
        // ✅ Notify user manually for already resolved
        const notifyRes = await axios.post(
          `${API_URL}/notifications`,
          {
            user: report.createdBy, // Required
            title: "Issue Resolved", // ✅ REQUIRED
            message: `Your report titled "${report.title}" has been marked as resolved.`,
            type: "resolved", // ✅ must be one of the enum values
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // After successful notification creation
        setNotifiedReports((prev) => [...prev, reportId]);

        console.log("✅ Notification sent to user");
        addNotification({
          id: Date.now(),
          zone,
          reportId,
          message: `User notified for report #${reportId}`,
          timestamp: new Date(),
          read: false,
        });
      }
    } catch (err) {
      console.error("❌ Failed:", err.response?.data || err.message);
    }
  };

  const zoneSummaries = zones.map((zone) => {
    const reports = zoneReports[zone] || [];
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const pending = reports.length - resolved;
    return {
      name: zone,
      resolved,
      pending,
      status: pending > 0 ? "In Progress" : "Clear",
    };
  });

  const handleDetectToxicReports = async () => {
    setToxicityLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/admin/reports/detect-toxic`,
        { zone: activeZone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToxicReports(response.data.toxicReports);
    } catch (err) {
      console.error("Failed to detect toxic reports", err);
    } finally {
      setToxicityLoading(false);
    }
  };

  // Improved mark as spam handler
  const handleMarkAsSpam = async (reportId, reasons = []) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/admin/reports/${reportId}/mark-spam`,
        { reason: reasons.join(", ") },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.report;
      if (updated) {
        // update UI across all zones (report IDs may be string/object)
        setZoneReports((prev) => {
          const updatedState = { ...prev };
          for (const zone in updatedState) {
            updatedState[zone] = updatedState[zone].map((r) =>
              r.id === updated._id.toString() || r.id === updated._id
                ? { ...r, isSpam: true }
                : r
            );
          }
          return updatedState;
        });

        // remove from toxic list if needed
        setToxicReports((prev) => prev.filter((r) => r._id !== reportId));

        addNotification({
          id: Date.now(),
          message: `Report ${reportId} marked as spam`,
          title: "Marked Spam",
          timestamp: new Date(),
          read: false,
        });
      }
    } catch (err) {
      console.error("Failed to mark as spam", err);
      addNotification({
        id: Date.now(),
        message: `Failed to mark ${reportId} as spam`,
        title: "Error",
        timestamp: new Date(),
        read: false,
      });
    }
  };

  // Improved delete handler
  const handleDeleteReport = async (reportId) => {
    if (
      window.confirm("Delete this spam report? This action cannot be undone")
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_URL}/admin/reports/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update UI
        setZoneReports((prev) => {
          const updated = { ...prev };
          for (const zone in updated) {
            updated[zone] = updated[zone].filter((r) => r.id !== reportId);
          }
          return updated;
        });
      } catch (err) {
        console.error("Failed to delete report", err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto max-w-7xl mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ward/Zones Management</h2>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white border rounded-full relative"
            >
              <FiBell />
              {notifications.some((n) => !n.read) && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow border rounded z-50">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-blue-600"
                    >
                      Clear All
                    </button>
                    <button onClick={() => setShowNotifications(false)}>
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          !n.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.zone) {
                            setActiveZone(n.zone);

                            // Delay to wait for zoneReports to render
                            setTimeout(() => {
                              const el = document.getElementById(
                                `report-${n.reportId}`
                              );
                              if (el)
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                            }, 300);
                          }
                        }}
                      >
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {n.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            label="Total Zones"
            value={zones.length}
            icon={<FiMapPin />}
          />
          <SummaryCard
            label="Issues Resolved"
            value={zoneSummaries.reduce((sum, z) => sum + z.resolved, 0)}
            icon={<FiCheckCircle />}
            color="green"
          />
          <SummaryCard
            label="Issues Pending"
            value={zoneSummaries.reduce((sum, z) => sum + z.pending, 0)}
            icon={<FiClock />}
            color="orange"
          />
        </div>

        {/* Split Panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Zone List */}
          <div className="lg:w-1/3 bg-white border rounded">
            <div className="p-4 border-b font-medium">All Zones</div>
            <div className="divide-y">
              {zoneSummaries.map((zone) => (
                <div
                  key={zone.name}
                  onClick={() => setActiveZone(zone.name)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    activeZone === zone.name ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between font-semibold text-md">
                    <h4>{zone.name}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        zone.status === "Clear"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {zone.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>✅ {zone.resolved} resolved</span>
                    <span>⚠️ {zone.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Zone Reports */}
          <div className="lg:w-2/3 bg-white border rounded">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-medium flex-1 truncate">
                {activeZone} Reports
              </span>

              <div className="flex items-center mx-4">
                <button
                  onClick={handleDetectToxicReports}
                  disabled={toxicityLoading}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5
                ${
                  toxicityLoading
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }
                transition-colors duration-200`}
                >
                  {toxicityLoading ? (
                    <FiClock className="animate-spin h-3 w-3" />
                  ) : (
                    <FiAlertTriangle className="h-3 w-3" />
                  )}
                  <span className="whitespace-nowrap">Detect Spam Reports</span>
                </button>
              </div>

              <span className="text-sm text-gray-500 flex-1 text-right">
                ({zoneReports[activeZone]?.length || 0} issues)
              </span>
            </div>
            {zoneReports[activeZone]?.length > 0 ? (
              <div className="divide-y">
                {zoneReports[activeZone]?.map((r) => {
                  const toxicReport = toxicReports.find(
                    (tr) => tr._id === r.id
                  );
                  return (
                    <div
                      key={r.id}
                      className={`p-4 hover:bg-gray-50 ${
                        r.isSpam
                          ? "bg-red-50 border-l-4 border-red-500"
                          : toxicReport
                          ? "bg-orange-50 border-l-4 border-orange-500"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            #{r.id} - {r.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {r.description}
                          </p>
                          <p className="mt-1 text-sm text-gray-700 font-semibold">
                            Reported: {r.createdAt.toLocaleDateString()}
                          </p>
                          {toxicReport && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1 mb-2">
                                {toxicReport.reasons.map((reason) => (
                                  <span
                                    key={reason}
                                    className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800"
                                  >
                                    {reason}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkAsSpam(r.id, toxicReport.reasons);
                                }}
                                className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                              >
                                <FiFlag className="h-3 w-3" />
                                Mark as Spam
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              r.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : r.status === "In Progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </div>
                      {r.isSpam && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteReport(r.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                          >
                            <FiTrash2 className="h-3 w-3" />
                            Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No reports in {activeZone}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color = "blue" }) {
  const colorClass = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
  }[color];

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-2xl font-bold`}>{value}</p>
        </div>
        <div className={`${colorClass} p-2 rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}
