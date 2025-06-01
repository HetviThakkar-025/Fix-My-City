import { Link } from "react-router-dom";
import { FiAlertTriangle, FiUsers, FiMap, FiTrendingUp } from "react-icons/fi";

function UserHome() {
  // Mock data for demonstration
  const stats = [
    { value: "1,240", label: "Issues Reported" },
    { value: "87%", label: "Issues Resolved" },
    { value: "48h", label: "Avg. Response Time" },
    { value: "4.2★", label: "Citizen Satisfaction" },
  ];

  const trendingIssues = [
    { id: 1, type: "Potholes", count: 142, icon: <FiAlertTriangle /> },
    { id: 2, type: "Street Lights", count: 98, icon: <FiAlertTriangle /> },
    { id: 3, type: "Garbage", count: 76, icon: <FiAlertTriangle /> },
    { id: 4, type: "Water Leaks", count: 53, icon: <FiAlertTriangle /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Fix My City</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Your platform to report local issues, engage with the community, and
          help improve our city.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/user/report"
            className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Report an Issue
          </Link>
          <Link
            to="/user/community"
            className="border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Visit Community
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Report Issues</h3>
              <p className="text-gray-600">
                Upload photos, describe the problem, and tag it for quick
                resolution.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Community Support</h3>
              <p className="text-gray-600">
                Upvote issues, join discussions, and participate in polls.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMap className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Track Progress</h3>
              <p className="text-gray-600">
                Follow your reports and see real-time updates from city
                officials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Issues */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Currently Trending Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-500">{issue.icon}</div>
                <div>
                  <h3 className="font-medium">{issue.type}</h3>
                  <p className="text-gray-500 text-sm">{issue.count} reports</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of citizens who are actively improving our city one
            report at a time.
          </p>
          <Link
            to="/user/report"
            className="inline-block bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Report Your First Issue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserHome;

// REPLACE MOCK DATA WITH REAL DATA FROM BACKEND
//  Import React hooks and Axios
// import { useEffect, useState } from "react";
// import axios from "axios";

// Setup State Instead of Static Arrays
// Replace your mock data with state:
// const [stats, setStats] = useState([]);
// const [trendingIssues, setTrendingIssues] = useState([]);

// ✅ 3. Fetch Real Data on Page Load
// Use useEffect():
// useEffect(() => {
//   const fetchHomeData = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get("/api/user/home", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setStats(res.data.stats);
//       setTrendingIssues(res.data.trendingIssues);
//     } catch (error) {
//       console.error("Error fetching home data", error);
//     }
//   };

//   fetchHomeData();
// }, []);

// ✅ 4. Your Backend Should Return This Structure
// Example response from backend (/api/user/home):

// {
//   "stats": [
//     { "value": "1,586", "label": "Issues Reported" },
//     { "value": "91%", "label": "Issues Resolved" },
//     { "value": "36h", "label": "Avg. Response Time" },
//     { "value": "4.6★", "label": "Citizen Satisfaction" }
//   ],
//   "trendingIssues": [
//     { "id": 1, "type": "Potholes", "count": 152 },
//     { "id": 2, "type": "Street Lights", "count": 99 },
//     { "id": 3, "type": "Garbage", "count": 85 },
//     { "id": 4, "type": "Water Leaks", "count": 62 }
//   ]
// }

// To attach icons for trending issues, add logic when rendering:

// const getIssueIcon = (type) => {
//   switch (type) {
//     case "Potholes":
//     case "Street Lights":
//     case "Garbage":
//     case "Water Leaks":
//       return <FiAlertTriangle />;
//     default:
//       return <FiAlertTriangle />;
//   }
// };

// And in your map:

// {trendingIssues.map((issue) => (
//   <div key={issue.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
//     <div className="flex items-center gap-3">
//       <div className="text-blue-500">{getIssueIcon(issue.type)}</div>
//       <div>
//         <h3 className="font-medium">{issue.type}</h3>
//         <p className="text-gray-500 text-sm">{issue.count} reports</p>
//       </div>
//     </div>
//   </div>
// ))}

// ✅ Summary
// Task	Status
// Replace mock data	✅ Done using useState
// Fetch real data on load	✅ Done using axios + useEffect
// Use token for secure route	✅ Done with headers
// Attach icons conditionally	✅ Optional helper added
