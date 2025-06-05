import React, { useState } from "react";
import axios from "axios";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    service: "",
    rating: "",
    comments: "",
    suggestions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/feedback", formData);
      setIsSubmitted(true);
      setFormData({
        service: "",
        rating: "",
        comments: "",
        suggestions: "",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-lg">
        Thank you for your feedback! The city administration will review it.
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mt-6">
      <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3 mb-4 text-blue-800">
        Service Feedback Form
      </h2>

      {/* <h2 className="text-xl font-bold mb-4">Service Feedback Form</h2> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">City Service</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a service</option>
            <option value="road_maintenance">Road Maintenance</option>
            <option value="waste_management">Waste Management</option>
            <option value="public_transport">Public Transport</option>
            <option value="water_supply">Water Supply</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Rating</label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={formData.rating === star.toString()}
                  onChange={handleChange}
                  required
                  className="mr-1"
                />
                {star}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Suggestions for Improvement
          </label>
          <textarea
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
