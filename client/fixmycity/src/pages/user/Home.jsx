import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Users,
  MapPin,
  TrendingUp,
  Camera,
  CheckCircle,
  MessageCircle,
  Heart,
  Shield,
} from "lucide-react";

function UserHome() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState([]);
  const [trendingIssues, setTrendingIssues] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(res.data.user);
        setStats(res.data.stats);
        setTrendingIssues(res.data.trendingIssues);
      } catch (err) {
        console.error("Error fetching home data", err);
      }
    };

    fetchHomeData();
  }, []);

  const getIssueIcon = (type) => {
    switch (type.toLowerCase()) {
      case "potholes":
      case "garbage":
      case "water leaks":
      case "street lights":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-14 text-center text-white">
          <div className="mb-6">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-md font-medium mb-5">
              Welcome to Your Dashboard, {username}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Make Your Neighborhood
              <span className="block text-yellow-300">Better Together</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
              Report local issues, engage with your community, and track
              progress on improving our shared spaces.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/user/report"
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              Report an Issue
            </Link>
            <Link
              to="/user/community"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/20 transition duration-300"
            >
              Visit Community
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition duration-300"
            >
              <p className="text-4xl font-bold text-blue-600 mb-3">
                {stat.value}
              </p>
              <p className="text-gray-600 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              How Fix My City Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple three-step process to report issues and see real change
              in your community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-gray-800">
                1. Report Issues
              </h3>
              <p className="text-gray-600 text-center">
                Upload photos, describe the problem, and tag it for quick
                resolution.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-gray-800">
                2. Community Support
              </h3>
              <p className="text-gray-600 text-center">
                Upvote issues, join discussions, and participate in polls.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-center text-gray-800">
                3. Track Progress
              </h3>
              <p className="text-gray-600 text-center">
                Follow your reports and see real-time updates from city
                officials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Issues */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            <TrendingUp className="inline mr-3 text-blue-600" />
            Currently Trending Issues
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    {getIssueIcon(issue.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{issue.type}</h3>
                    <p className="text-gray-500">
                      {issue.count} active reports
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Engagement */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Community Engagement
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the conversation and help prioritize issues in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Active Discussions
                </h3>
              </div>
              <p className="text-gray-600">
                Participate in community forums about local improvements and
                city planning.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Vote on Priorities
                </h3>
              </div>
              <p className="text-gray-600">
                Help determine which issues get addressed first through
                community voting.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Safety Alerts
                </h3>
              </div>
              <p className="text-gray-600">
                Receive and share important safety notifications in your
                neighborhood.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <CheckCircle className="h-6 w-6 text-yellow-300" />
              <span className="text-white font-medium">
                Your Reports Make a Difference
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Improve Your City?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Every report contributes to building the community you want to
              live in. Start making an impact today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/user/report"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition duration-300 shadow-xl"
            >
              Report an Issue Now
            </Link>
            <Link
              to="/user/community"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/20 transition duration-300"
            >
              Join Community
            </Link>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

export default UserHome;
