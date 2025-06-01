import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiAlertCircle, FiUsers, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/user"
              className="text-xl font-bold text-blue-600 flex items-center"
            >
              <span>Fix My City</span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link
              to="/user"
              className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              <FiHome className="mr-1" /> Home
            </Link>
            <Link
              to="/user/report"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              <FiAlertCircle className="mr-1" /> Report Issue
            </Link>
            <Link
              to="/user/community"
              className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              <FiUsers className="mr-1" /> Community
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn && role === "user" ? (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 inline-flex items-center text-sm font-medium"
              >
                <FiLogOut className="mr-1" /> Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 inline-flex items-center text-sm font-medium"
              >
                <FiLogOut className="mr-1 rotate-180" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
