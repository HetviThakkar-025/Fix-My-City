import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiHome,
  FiList,
  FiLogOut,
  FiMaximize2,
  FiBell,
  FiX,
} from "react-icons/fi";

const zones = [
  "Central Zone",
  "West Zone",
  "East Zone",
  "North Zone",
  "South Zone",
  "North West Zone",
  "South West Zone",
];

export default function WardZones() {
  const [resolutionTimes, setResolutionTimes] = useState({});
  const [activeZone, setActiveZone] = useState("Central Zone");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data with reports for each zone
  const [zoneReports, setZoneReports] = useState({
    "Central Zone": [
      {
        id: 1001,
        title: "Pothole near park",
        status: "Resolved",
        resolvedBy: "Officer A",
        resolutionTime: "2 days",
        createdAt: new Date("2023-06-25"),
        severity: "high",
      },
      {
        id: 1002,
        title: "Broken street light",
        status: "Pending",
        resolvedBy: "",
        resolutionTime: "",
        createdAt: new Date("2023-06-28"),
        severity: "medium",
      },
    ],
    "West Zone": [
      {
        id: 2001,
        title: "Garbage accumulation",
        status: "In Progress",
        resolvedBy: "Officer B",
        resolutionTime: "",
        createdAt: new Date("2023-06-27"),
        severity: "high",
      },
    ],
    "East Zone": [
      {
        id: 3001,
        title: "Water logging",
        status: "In Progress",
        resolvedBy: "Officer C",
        resolutionTime: "",
        createdAt: new Date("2023-06-26"),
        severity: "high",
      },
    ],
    "North Zone": [
      {
        id: 6001,
        title: "Pothole near park",
        status: "Resolved",
        resolvedBy: "Officer A",
        resolutionTime: "2 days",
        createdAt: new Date("2023-06-25"),
        severity: "high",
      },
    ],
    "South Zone": [],
    "North West Zone": [],
    "South West Zone": [],
  });

  // Mock WebSocket connection to simulate real-time updates
  useEffect(() => {
    // This would be a WebSocket connection in a real app
    const mockWebSocket = {
      onmessage: (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "OFFICER_UPDATE") {
          addNotification({
            id: Date.now(),
            zone: data.zone,
            reportId: data.reportId,
            message: `Officer ${data.officer} updated status for report #${data.reportId}`,
            timestamp: new Date(),
            read: false,
          });
        }
      },
    };

    // Simulate receiving officer updates
    const interval = setInterval(() => {
      // Randomly generate officer updates for demo purposes
      if (Math.random() > 0.7) {
        const zonesWithReports = Object.keys(zoneReports).filter(
          (zone) => zoneReports[zone].length > 0
        );
        if (zonesWithReports.length > 0) {
          const randomZone =
            zonesWithReports[
              Math.floor(Math.random() * zonesWithReports.length)
            ];
          const reports = zoneReports[randomZone];
          const randomReport =
            reports[Math.floor(Math.random() * reports.length)];

          if (randomReport.resolvedBy) {
            mockWebSocket.onmessage({
              data: JSON.stringify({
                type: "OFFICER_UPDATE",
                zone: randomZone,
                reportId: randomReport.id,
                officer: randomReport.resolvedBy,
                status: randomReport.status,
              }),
            });
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [zoneReports]);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleMarkResolved = (zone, reportId) => {
    const resolutionTime = resolutionTimes[reportId] || "1 day";

    setZoneReports((prev) => ({
      ...prev,
      [zone]: prev[zone].map((report) =>
        report.id === reportId
          ? {
              ...report,
              status: "Resolved",
              resolutionTime,
              resolvedBy: "Admin",
            }
          : report
      ),
    }));

    console.log(
      `Report ${reportId} in ${zone} marked as resolved in ${resolutionTime}`
    );
  };

  const handleResolutionTimeChange = (reportId, time) => {
    setResolutionTimes((prev) => ({ ...prev, [reportId]: time }));
  };

  // Calculate summary statistics for each zone
  const zoneSummaries = zones.map((zone) => {
    const reports = zoneReports[zone] || [];
    const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
    const pendingCount = reports.filter((r) => r.status !== "Resolved").length;

    return {
      name: zone,
      resolved: resolvedCount,
      pending: pendingCount,
      status: pendingCount > 0 ? "In Progress" : "Clear",
    };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Header with notification bell */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Ward/Zones Management
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 border border-gray-200"
              >
                <FiBell className="text-gray-700" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            setActiveZone(notification.zone);
                          }}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Zones</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {zones.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FiMapPin className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Issues Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {zoneSummaries.reduce(
                      (sum, zone) => sum + zone.resolved,
                      0
                    )}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-full">
                  <FiCheckCircle className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Issues Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {zoneSummaries.reduce((sum, zone) => sum + zone.pending, 0)}
                  </p>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                  <FiClock className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Split Panel */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Zones List */}
            <div className="lg:w-1/3 bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-medium text-gray-800">All Zones</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {zoneSummaries.map((zone) => (
                  <div
                    key={zone.name}
                    onClick={() => setActiveZone(zone.name)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      activeZone === zone.name ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">{zone.name}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          zone.status === "In Progress"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-500">
                        <span className="text-green-600 font-medium">
                          {zone.resolved}
                        </span>{" "}
                        resolved
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="text-orange-600 font-medium">
                          {zone.pending}
                        </span>{" "}
                        pending
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Reports */}
            <div className="lg:w-2/3 bg-white rounded-lg shadow-sm border">
              {activeZone ? (
                <>
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        {activeZone} Reports
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({zoneReports[activeZone]?.length || 0} issues)
                        </span>
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          zoneSummaries.find((z) => z.name === activeZone)
                            ?.status === "In Progress"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {
                          zoneSummaries.find((z) => z.name === activeZone)
                            ?.status
                        }
                      </span>
                    </div>
                  </div>

                  {zoneReports[activeZone]?.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {zoneReports[activeZone].map((report) => (
                        <div key={report.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                #{report.id} - {report.title}
                                {report.severity === "high" && (
                                  <FiAlertCircle className="text-red-500" />
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Reported:{" "}
                                {report.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
                                report.status === "Resolved"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {report.status === "Resolved" ? (
                                <FiCheckCircle size={12} />
                              ) : (
                                <FiClock size={12} />
                              )}
                              {report.status}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Assigned Officer
                              </p>
                              <p className="text-sm">
                                {report.resolvedBy || "Unassigned"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Resolution Time
                              </p>
                              <p className="text-sm">
                                {report.resolutionTime || "Pending"}
                              </p>
                            </div>
                            {report.status !== "Resolved" && (
                              <div className="flex items-end gap-2">
                                <input
                                  type="text"
                                  placeholder="Estimated time"
                                  value={resolutionTimes[report.id] || ""}
                                  onChange={(e) =>
                                    handleResolutionTimeChange(
                                      report.id,
                                      e.target.value
                                    )
                                  }
                                  className="border rounded p-1 text-sm w-full"
                                />
                                <button
                                  onClick={() =>
                                    handleMarkResolved(activeZone, report.id)
                                  }
                                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                                  title="Mark Resolved"
                                >
                                  <FiSend size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No reports found for {activeZone}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Select a zone to view reports
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
