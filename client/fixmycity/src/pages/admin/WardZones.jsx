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

  // 🔁 Fetch reports from backend on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/admin/reports", {
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
        const res = await axios.get("/api/notifications", {
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
      await axios.delete("/api/notifications/clear", {
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
          `/api/admin/zones/resolve/${reportId}`,
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
          "/api/notifications",
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

  const handleNotifyUser = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/admin/reports/${reportId}/notify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // update UI state
      setZoneReports((prev) => {
        const updatedZone = prev[activeZone].map((r) =>
          r.id === reportId ? { ...r, notified: true } : r
        );
        return { ...prev, [activeZone]: updatedZone };
      });
    } catch (err) {
      console.error("Failed to notify user", err);
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
            <div className="p-4 border-b font-medium flex justify-between">
              {activeZone} Reports{" "}
              <span className="text-gray-500 text-sm">
                ({zoneReports[activeZone]?.length || 0} issues)
              </span>
            </div>
            {zoneReports[activeZone]?.length > 0 ? (
              <div className="divide-y">
                {zoneReports[activeZone].map((r) => (
                  <div key={r.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        #{r.id} - {r.title}
                      </h4>
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
                    <p className="text-xs text-gray-500">
                      Reported: {r.createdAt.toLocaleDateString()}
                    </p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Officer</p>
                        <p>{r.resolvedBy || "Unassigned"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Resolution Time</p>
                        <p>{r.resolutionTime || "Pending"}</p>
                      </div>

                      {/* ✅ Show estimated time input + button if NOT resolved AND NOT notified */}
                      {/* ✅ Show estimated time input + button logic */}
                      {r.notified !== true && (
                        <div className="flex items-end gap-2">
                          <input
                            type="text"
                            placeholder="Est. time"
                            value={resolutionTimes[r.id] || ""}
                            onChange={(e) =>
                              handleResolutionTimeChange(r.id, e.target.value)
                            }
                            className="border rounded p-1 text-sm w-full"
                          />
                          <button
                            onClick={() =>
                              r.status !== "Resolved"
                                ? handleMarkResolved(activeZone, r.id)
                                : handleNotifyUser(r.id)
                            }
                            className="bg-green-600 text-white p-2 rounded"
                            title={
                              r.status === "Resolved"
                                ? "Notify User"
                                : "Mark as Resolved"
                            }
                          >
                            <FiSend size={16} />
                          </button>
                        </div>
                      )}

                      {/* ✅ If resolved and already notified, show a message */}
                      {r.status === "Resolved" && r.notified === true && (
                        <div className="md:col-span-1 text-green-600 text-xs flex items-center">
                          ✅ User has been notified
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
