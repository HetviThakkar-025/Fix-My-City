import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  //   backend
  //   useEffect(() => {
  //     const fetchAnnouncements = async () => {
  //       try {
  //         const response = await axios.get("/api/announcements");
  //         setAnnouncements(response.data);
  //       } catch (error) {
  //         console.error("Error fetching announcements:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchAnnouncements();
  //   }, []);

  //   mock
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const mockAnnouncements = [
        {
          _id: "a1",
          title: "Water supply maintenance",
          content:
            "Water will be unavailable in Sector 12 tomorrow from 9AM–1PM.",
          createdAt: new Date().toISOString(),
          resolvedReports: [
            { _id: "r1", title: "Leakage near main road" },
            { _id: "r2", title: "Water overflow in lane 3" },
          ],
        },
      ];

      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">City Announcements</h2>

      {loading ? (
        <div>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div>No announcements yet</div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="border rounded-lg p-4 bg-blue-50"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{announcement.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2">{announcement.content}</p>
              {announcement.resolvedReports && (
                <div className="mt-3">
                  <p className="text-sm font-semibold">Recently resolved:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {announcement.resolvedReports.map((report) => (
                      <li key={report._id}>{report.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
