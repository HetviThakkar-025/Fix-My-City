import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../components/user/report/LocationSelector";
import SeveritySelector from "../../components/user/report/SeveritySelector";
import TagInput from "../../components/user/report/TagInput";
import ImageUploader from "../../components/user/report/ImageUploader";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: null,
    severity: "medium",
    tags: [],
    images: [],
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleImageAnalysis = (imageFile) => {
    // Placeholder for future AI integration
    console.log("Image ready for analysis:", imageFile);
    // This would call your AI model to analyze the image
    // and potentially auto-fill category/tags
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would submit to your backend here
      console.log("Submitting:", formData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to confirmation or home page
      navigate("/user");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium">Title*</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="w-full p-2 border rounded"
            placeholder="Brief description of the issue"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Description*</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Provide detailed information about the issue..."
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Location*</label>
          <LocationSelector
            onLocationSelect={handleLocationSelect}
            initialValue={formData.location?.address || ""}
          />
        </div>

        <SeveritySelector
          value={formData.severity}
          onChange={(value) => handleChange("severity", value)}
        />

        <div className="space-y-2">
          <label className="block font-medium">Tags</label>
          <TagInput
            tags={formData.tags}
            onChange={(tags) => handleChange("tags", tags)}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Images</label>
          <ImageUploader
            images={formData.images}
            onChange={(images) => handleChange("images", images)}
            onImageAnalysis={handleImageAnalysis}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.isAnonymous}
            onChange={(e) => handleChange("isAnonymous", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="anonymous">Report anonymously</label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/user")}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
