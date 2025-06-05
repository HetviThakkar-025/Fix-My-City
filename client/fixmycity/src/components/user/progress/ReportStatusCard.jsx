import React from "react";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";

export default function ReportStatusCard({
  report,
  editingId,
  editForm,
  setEditForm,
  onEdit,
  onEditSubmit,
  onCancelEdit,
  onDelete,
}) {
  const isEditing = editingId === report._id;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            rows={3}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => onEditSubmit(report._id)}
              className="px-3 py-1 bg-green-500 text-white rounded flex items-center"
            >
              <FiCheck className="mr-1" /> Save
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 bg-gray-500 text-white rounded flex items-center"
            >
              <FiX className="mr-1" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                report.status === "resolved"
                  ? "bg-green-100 text-green-800"
                  : report.status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {report.status.replace("_", " ")}
            </span>
          </div>

          <p className="my-2">{report.description}</p>

          {report.resolutionComment && report.status === "resolved" && (
            <div className="mt-3 p-3 bg-green-50 rounded">
              <p className="font-semibold">Resolution:</p>
              <p>{report.resolutionComment}</p>
              {report.resolvedAt && (
                <p className="text-sm text-gray-600 mt-1">
                  Resolved on:{" "}
                  {new Date(report.resolvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => onEdit(report)}
              className="p-1 text-blue-500 hover:text-blue-700"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => onDelete(report._id)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <FiTrash2 />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
