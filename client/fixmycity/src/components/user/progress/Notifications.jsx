import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3 mb-4 text-blue-800">
        Notifications
      </h2>
      {/* <h2 className="text-xl font-bold">Notifications</h2> */}

      {loading ? (
        <div>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div>No notifications yet</div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => markAsRead(notification._id)}
              className={`p-3 rounded-lg cursor-pointer ${
                notification.read
                  ? "bg-gray-100"
                  : notification.type === "resolved"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <div className="flex items-start">
                {notification.type === "resolved" ? (
                  <FiCheckCircle className="text-green-500 mt-1 mr-2" />
                ) : (
                  <FiAlertCircle className="text-red-500 mt-1 mr-2" />
                )}
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
