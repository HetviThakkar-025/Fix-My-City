import React, { useState } from "react";
import { Tabs, Tab } from "../../components/ui/Tabs";
import UserReports from "../../components/user/progress/UserReports";
import FeedbackForm from "../../components/user/progress/FeedbackForm";
import Notifications from "../../components/user/progress/Notifications";

export default function TrackProgress() {
  const [activeTab, setActiveTab] = useState("reports");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-blue-700">
          Track Your Reports
        </h1>

        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <Tab label="Your Reports" value="reports">
            <UserReports />
          </Tab>
          <Tab label="Feedback" value="feedback">
            <FeedbackForm />
          </Tab>
          <Tab label="Notifications" value="notifications">
            <Notifications />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
