import React, { useState, useEffect } from "react";
import ReportCard from "./ReportCard";
import axios from "axios";

export default function ReportList({ cityFilter }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  //   for backend
  //   useEffect(() => {
  //     const fetchReports = async () => {
  //       try {
  //         const response = await axios.get("/api/reports", {
  //           params: { city: cityFilter, status: filter },
  //         });
  //         setReports(response.data);
  //       } catch (error) {
  //         console.error("Error fetching reports:", error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchReports();
  //   }, [cityFilter, filter]);

  //   mock data
  useEffect(() => {
    setLoading(true);

    // Simulate backend delay
    const timeout = setTimeout(() => {
      const mockReports = [
        {
          _id: "1",
          title: "Overflowing Garbage in Sector 5",
          description: "There’s been no garbage pickup for 3 days.",
          location: {
            address: "Sector 5, Noida, Uttar Pradesh",
          },
          severity: "critical",
          images: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          upvotes: 4,
          userUpvoted: false,
          comments: [{ id: 1, text: "Same issue here!" }],
          status: "open",
          isAnonymous: false,
          createdBy: { username: "Ravi123" },
        },
        {
          _id: "2",
          title: "Streetlight not working",
          description: "The streetlight near the park is broken.",
          location: {
            address: "Rajiv Chowk, Delhi",
          },
          severity: "medium",
          images: [],
          upvotes: 2,
          userUpvoted: true,
          comments: [],
          status: "resolved",
          isAnonymous: true,
          createdBy: { username: "Priya89" },
        },
      ];

      // Filter by city and status (if not "all")
      const filtered = mockReports.filter(
        (r) =>
          (!cityFilter ||
            r.location?.address
              ?.toLowerCase()
              .includes(cityFilter.toLowerCase())) &&
          (filter === "all" || r.status === filter)
      );

      setReports(filtered);
      setLoading(false);
    }, 500); // simulate 500ms load

    return () => clearTimeout(timeout);
  }, [cityFilter, filter]);

  const handleUpvote = async (reportId) => {
    try {
      await axios.post(`/api/reports/${reportId}/upvote`);
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
