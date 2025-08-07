import React, { useEffect, useState } from "react";
import axios from "axios";
import Filters from "../../components/admin/allreports/Filters";
import ReportCard from "../../components/admin/allreports/ReportCard";
import ExportButton from "../../components/admin/allreports/ExportButton";

export default function AllReports() {
  const [predictedPriorities, setPredictedPriorities] = useState({});
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [loadingPriority, setLoadingPriority] = useState(false);
  const [duplicatePairs, setDuplicatePairs] = useState([]);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    upvotes: "All",
    category: "All",
    severity: "All",
  });

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/admin/reports", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const formatted = res.data.map((r) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          category: getCategoryFromTags(r.tags),
          zone: r.zone || "Unknown",
          severity: r.severity,
          status: mapStatus(r.status),
          assignedZone: r.zone || "",
          createdAt: new Date(r.createdAt),
          lat: r.location?.coordinates?.lat || null,
          lng: r.location?.coordinates?.lng || null,
          upvotes: r.upvotes || 0,
        }));

        setReports(formatted);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, []);

  const getCategoryFromTags = (tags = []) => {
    const lowerTags = tags.map((t) => t.toLowerCase());
    if (lowerTags.some((t) => t.includes("pothole"))) return "Pothole";
    if (lowerTags.some((t) => t.includes("garbage"))) return "Garbage";
    if (lowerTags.some((t) => t.includes("light"))) return "Street Lights";
    if (lowerTags.some((t) => t.includes("water"))) return "Water";
    return "Others";
  };

  const mapStatus = (s) => {
    if (s === "resolved") return "Resolved";
    if (s === "in_progress") return "In Progress";
    return "Pending";
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // const filteredReports = reports.filter((report) => {
  //   return (
  //     (filters.status === "All" || report.status === filters.status) &&
  //     (filters.zone === "All" || report.zone === filters.zone) &&
  //     (filters.category === "All" || report.category === filters.category) &&
  //     (filters.severity === "All" ||
  //       report.severity.toLowerCase() === filters.severity.toLowerCase())
  //   );
  // });

  const filteredReports = reports
    .filter((report) => {
      return (
        (filters.status === "All" || report.status === filters.status) &&
        (filters.category === "All" || report.category === filters.category) &&
        (filters.severity === "All" ||
          report.severity.toLowerCase() === filters.severity.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (filters.upvotes === "Most Upvoted") return b.upvotes - a.upvotes;
      if (filters.upvotes === "Least Upvoted") return a.upvotes - b.upvotes;
      return 0;
    });

  // ✅ Handle manual or auto-assign
  const handleAssign = async (reportId, zone) => {
    try {
      // optionally call backend: await axios.put(...)
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, assignedZone: zone, status: "In Progress" }
            : r
        )
      );
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  // ✅ Handle detect duplicates
  const handleDetectDuplicates = async () => {
    try {
      setLoadingDuplicates(true);

      const response = await axios.post(
        "/api/ml/predict-duplicates",
        {
          reports: filteredReports.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            lat: r.lat,
            lng: r.lng,
          })),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Duplicates:", response.data.duplicates);
      setDuplicatePairs(response.data.duplicates);
    } catch (err) {
      console.error("Failed to detect duplicates:", err);
      alert("Failed to detect duplicates");
    } finally {
      setLoadingDuplicates(false);
    }
  };

  // ✅ Handle priority prediction
  const handlePriorityPrediction = async () => {
    try {
      setLoadingPriority(true);

      const descriptions = filteredReports.map((r) => r.description);
      const res = await axios.post(
        "/api/ml/predict-priority",
        { descriptions },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const newPredictions = {};
      filteredReports.forEach((report, idx) => {
        newPredictions[report.id] = res.data.predictions[idx];
      });

      setPredictedPriorities(newPredictions);
    } catch (err) {
      console.error("Priority prediction failed:", err);
      alert("Failed to predict priority.");
    } finally {
      setLoadingPriority(false);
    }
  };

  const handleMerge = async (reportId1, reportId2) => {
    try {
      const res = await axios.post(
        "/api/admin/reports/merge",
        { report1Id: reportId1, report2Id: reportId2 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Merge successful:", res.data.message);

      // remove merged reports, or update state if needed
      setReports(
        (prev) => prev.filter((r) => r.id !== reportId2) // keep reportId1, remove merged one
      );

      alert(res.data.message || "Reports merged successfully");
    } catch (err) {
      console.error("Merge failed:", err);
      alert("Failed to merge reports");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">All Reports</h1>
        <div className="flex flex-wrap gap-2">
          <ExportButton reports={filteredReports} />
          <button
            onClick={handleDetectDuplicates}
            disabled={loadingDuplicates}
            className={`bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded text-sm font-medium ${
              loadingDuplicates ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingDuplicates ? "Detecting..." : "Detect Duplicates (AI)"}
          </button>
          <button
            onClick={handlePriorityPrediction}
            disabled={loadingPriority}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium ${
              loadingPriority ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loadingPriority ? "Predicting..." : "Predict Priority (AI)"}
          </button>
        </div>
      </div>

      <Filters filters={filters} onChange={handleFilterChange} />

      {filteredReports.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No reports found matching your filters
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onAssign={handleAssign}
              predictedPriority={predictedPriorities[report.id]}
              duplicatePairs={duplicatePairs}
              onMerge={handleMerge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
