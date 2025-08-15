import React, { useState, useEffect } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiUsers,
} from "react-icons/fi";
import axios from "axios";
import PollCreator from "../../components/user/community/PollCreator";
import AnnouncementList from "../../components/user/community/AnnouncementList";
import CommunityPolls from "../../components/admin/community/CommunityPolls";

const AdminCommunityPage = () => {
  const [activeTab, setActiveTab] = useState("announcements");
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(true);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [showAnnouncementCreator, setShowAnnouncementCreator] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    resolvedReports: [],
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch polls with admin privileges
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoadingPolls(true);
        const res = await axios.get(`${API_URL}/polls/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPolls(res.data || []);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoadingPolls(false);
      }
    };
    fetchPolls();
  }, []);

  const handlePollCreated = (newPoll) => {
    setPolls([newPoll, ...polls]);
    setShowPollCreator(false);
  };

  const handlePollUpdated = (updatedPoll) => {
    setPolls(polls.map((p) => (p._id === updatedPoll._id ? updatedPoll : p)));
    setEditingPoll(null);
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await axios.delete(`${API_URL}/polls/${pollId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPolls(polls.filter((p) => p._id !== pollId));
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/announcements`, newAnnouncement, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAnnouncement({ title: "", content: "", resolvedReports: [] });
      setShowAnnouncementCreator(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Community Management
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiUsers className="text-blue-500" />
          <span>Admin View</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            activeTab === "announcements"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("announcements")}
        >
          <FiAlertCircle />
          Announcements
        </button>
        <button
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            activeTab === "polls"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("polls")}
        >
          <FiBarChart2 />
          Polls
        </button>
      </div>

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Announcements</h2>
            <button
              onClick={() =>
                setShowAnnouncementCreator(!showAnnouncementCreator)
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus /> New Announcement
            </button>
          </div>

          {showAnnouncementCreator && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="font-medium text-lg mb-4">Create Announcement</h3>
              <form onSubmit={handleCreateAnnouncement}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        content: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementCreator(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Publish Announcement
                  </button>
                </div>
              </form>
            </div>
          )}

          <AnnouncementList />
        </section>
      )}

      {/* Polls Tab */}
      {activeTab === "polls" && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Community Polls</h2>
            <button
              onClick={() => {
                setEditingPoll(null);
                setShowPollCreator(!showPollCreator);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiPlus /> New Poll
            </button>
          </div>

          {(showPollCreator || editingPoll) && (
            <PollCreator
              onPollCreated={handlePollCreated}
              onPollUpdated={handlePollUpdated}
              existingPoll={editingPoll}
              onCancel={() => {
                setShowPollCreator(false);
                setEditingPoll(null);
              }}
            />
          )}

          <CommunityPolls
            polls={polls}
            loading={loadingPolls}
            adminView={true}
            showResults={true}
            onDelete={handleDeletePoll}
            onEdit={(poll) => {
              setEditingPoll(poll);
              setShowPollCreator(true);
            }}
          />
        </section>
      )}
    </div>
  );
};

export default AdminCommunityPage;
