export default function ExportButton({ reports }) {
  const handleExport = () => {
    const csv = [
      ["ID", "Title", "Category", "Zone", "Status", "Assigned To"],
      ...reports.map((r) => [
        r.id,
        r.title,
        r.category,
        r.zone,
        r.status,
        r.assignedTo,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold"
    >
      Export CSV
    </button>
  );
}
