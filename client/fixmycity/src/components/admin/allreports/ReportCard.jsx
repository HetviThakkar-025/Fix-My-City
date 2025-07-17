export default function ReportCard({
  report,
  onAssign,
  predictedPriority,
  duplicatePairs = [],
}) {
  const isDuplicate = duplicatePairs.some(
    (pair) => pair.report1 === report.id || pair.report2 === report.id
  );

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
        return "bg-red-200 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "⚠️"; // warning
      case "medium":
        return "🔶"; // moderate / caution diamond
      case "low":
        return "🟩"; // calm green = low urgency
      default:
        return "🔍";
    }
  };

  return (
    <div
      className={`rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow duration-200 mb-4 ${
        isDuplicate ? "bg-rose-50 border-rose-200" : "bg-white border-gray-100"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={`text-xl font-bold ${
                isDuplicate ? "text-rose-800" : "text-gray-900"
              }`}
            >
              {report.title}
            </h3>
            {isDuplicate && (
              <span className="bg-rose-200 text-rose-900 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Duplicate
              </span>
            )}
          </div>

          <p
            className={`mb-4 ${
              isDuplicate ? "text-rose-700" : "text-gray-700"
            }`}
          >
            {report.description}
          </p>

          {predictedPriority && (
            <div
              className={`
                inline-flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm
                ${getPriorityStyle(predictedPriority)}
                ${
                  predictedPriority.toLowerCase() === "high"
                    ? "animate-pulse"
                    : ""
                }
              `}
            >
              <span className="text-lg">
                {getPriorityIcon(predictedPriority)}
              </span>
              Predicted Priority: {predictedPriority}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end ml-4">
          <span
            className={`text-xs mb-2 ${
              isDuplicate ? "text-rose-600" : "text-gray-500"
            }`}
          >
            Reported on: {report.createdAt.toLocaleDateString()}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(
              report.status
            )}`}
          >
            {report.status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            isDuplicate
              ? "bg-rose-100 text-rose-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {report.zone}
        </span>
        <span
          className={`text-sm px-3 py-1 rounded-full ${
            isDuplicate
              ? "bg-rose-100 text-rose-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {report.category}
        </span>
        <span
          className={`text-sm px-3 py-1 rounded-full ${getSeverityStyle(
            report.severity
          )}`}
        >
          Severity: {report.severity}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          onChange={(e) => onAssign(report.id, e.target.value)}
          className={`border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
            isDuplicate
              ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
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
          className={`text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isDuplicate
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Auto-Assign
        </button>
      </div>
    </div>
  );
}
