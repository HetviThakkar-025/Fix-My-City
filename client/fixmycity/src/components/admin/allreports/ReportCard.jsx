export default function ReportCard({ report, onAssign, predictedPriority }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-200 text-red-900";
      case "medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800"; // fallback
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {report.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{report.description}</p>

          {predictedPriority && (
            <div
              className={`mt-2 inline-block font-semibold px-3 py-1 rounded-full text-base ${getPriorityStyle(
                predictedPriority
              )}`}
            >
              Predicted Priority: {predictedPriority}
            </div>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Reported on: {report.createdAt.toLocaleDateString()}
        </div>

        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(
            report.status
          )}`}
        >
          {report.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
          {report.zone}
        </span>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
          {report.category}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${getSeverityStyle(
            report.severity
          )}`}
        >
          Severity: {report.severity}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          onChange={(e) => onAssign(report.id, e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Assign Zone
          </option>
          <option value="Central Zone">Central Zone</option>
          <option value="East Zone">East Zone</option>
          <option value="West Zone">West Zone</option>
          <option value="North Zone">North Zone</option>
          <option value="South Zone">South Zone</option>
          <option value="North West Zone">North West Zone</option>
          <option value="South West Zone">South West Zone</option>
        </select>
        <button
          onClick={() => onAssign(report.id, "auto")}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Auto-Assign
        </button>
      </div>
    </div>
  );
}
