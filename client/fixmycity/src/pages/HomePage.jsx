import React from "react";
import {
  MapPin,
  Users,
  FileText,
  HelpCircle,
  Camera,
  Bell,
  Shield,
  CheckCircle,
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: <Camera className="h-8 w-8 text-blue-600" />,
      title: "Report Issues",
      description:
        "Upload photos and describe problems in your neighborhood for quick government attention",
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Location Tracking",
      description:
        "Pinpoint exact locations of issues with GPS and interactive maps",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Engagement",
      description:
        "Join discussions, vote on priorities, and participate in local polls",
    },
    {
      icon: <Bell className="h-8 w-8 text-blue-600" />,
      title: "Real-time Updates",
      description:
        "Get notifications when your reported issues are being addressed",
    },
  ];

  const civicRights = [
    "Right to clean and safe environment",
    "Access to basic municipal services",
    "Participation in local governance",
    "Transparency in government actions",
    "Equal treatment and non-discrimination",
    "Freedom of expression and assembly",
  ];

  const faqs = [
    {
      question: "How do I report an issue?",
      answer:
        "Simply register, take a photo of the problem, add a description, and submit. Our system will automatically detect your location.",
    },
    {
      question: "How long does it take to resolve issues?",
      answer:
        "Response times vary by issue type and severity. Critical issues are prioritized and typically addressed within 24-48 hours.",
    },
    {
      question: "Can I track the progress of my reports?",
      answer:
        "Yes, you can monitor all your reports in your dashboard and receive real-time notifications on status changes.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "We prioritize your privacy. You can report anonymously, and we only use your data to improve city services.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Fix My City</h1>
        <div className="space-x-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Register
          </a>
          <a
            href="/login"
            className="bg-gray-200 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
          >
            Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div className="mb-8">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-md font-medium mb-6">
              🏛️ Civic Engagement Platform
            </span>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              Keep Your City
              <span className="block text-yellow-300">SPOTLESS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
              Connect with your local government, report civic issues, and
              participate in community discussions to create positive change in
              your neighborhood.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <a
              href="/register"
              className="bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              Register
            </a>
            <a
              href="/login"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/20 transition duration-300"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              Why Choose Fix My City?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed to strengthen the bond between
              citizens and local government
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Visual Issue Reporting
                  </h3>
                  <p className="text-gray-600">
                    Capture problems with photos and detailed descriptions. Your
                    reports reach the right departments instantly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-600 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Location Intelligence
                  </h3>
                  <p className="text-gray-600">
                    GPS-enabled reporting ensures accurate location data and
                    helps prioritize neighborhood-specific issues.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 p-3 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Democratic Participation
                  </h3>
                  <p className="text-gray-600">
                    Vote on community issues, participate in polls, and have
                    your voice heard in local governance decisions.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Stay Informed
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Real-time status updates
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Government announcements
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Community discussions
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Progress tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Civic Rights Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Your Civic Rights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {civicRights.map((right, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm"
              >
                <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">{right}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City Cleanliness Tips */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Keep Our City Clean
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Proper Waste Disposal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Separate dry and wet waste. Use designated bins and avoid
                littering in public spaces.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Community Participation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Organize neighborhood clean-up drives and encourage others to
                maintain cleanliness.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="text-orange-600 text-2xl" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Report Issues
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Document and report cleanliness issues to help authorities take
                quick action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            <HelpCircle className="inline mr-3 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gray-800">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Shield className="h-6 w-6 text-yellow-300" />
              <span className="text-white font-medium">
                Secure • Transparent • Democratic
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Voice Matters
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Every report, every vote, every discussion contributes to building
              the community you want to live in.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/register"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold px-8 py-4 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition duration-300 shadow-xl"
            >
              Start Your Civic Journey
            </a>
            <a
              href="/login"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/20 transition duration-300"
            >
              Access Your Dashboard
            </a>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <h3 className="text-xl font-bold text-blue-600">Fix My City</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Empowering citizens to build better communities through civic
            engagement.
          </p>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Fix My City. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
