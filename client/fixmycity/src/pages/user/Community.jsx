import React, { useState } from "react";
import ReportList from "../../components/user/community/ReportList";
// import PollCreator from "../../components/user/community/PollCreator";
import PollList from "../../components/user/community/PollList";
import AnnouncementList from "../../components/user/community/AnnouncementList";
import { Tabs, Tab } from "../../components/ui/Tabs"; // Assume you have a Tabs component

export default function Community() {
  const [activeTab, setActiveTab] = useState("reports");
  const [cityFilter, setCityFilter] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Community Hub</h1>

      <div className="mb-4">
        <input
          type="text"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          placeholder="Filter by city..."
          className="w-full p-2 border rounded"
        />
      </div>

      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <Tab label="Reports" value="reports">
          <ReportList cityFilter={cityFilter} />
        </Tab>
        <Tab label="Polls" value="polls">
          {/* <PollCreator onPollCreated={() => setActiveTab("polls")} /> */}
          <PollList />
        </Tab>
        <Tab label="Announcements" value="announcements">
          <AnnouncementList />
        </Tab>
      </Tabs>
    </div>
  );
}
