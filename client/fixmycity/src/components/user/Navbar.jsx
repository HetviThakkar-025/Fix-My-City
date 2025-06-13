import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiAlertCircle,
  FiUsers,
  FiLogOut,
  FiMap,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navLinks = [
    { to: "/user", label: "Home", icon: <FiHome /> },
    { to: "/user/report", label: "Report Issue", icon: <FiAlertCircle /> },
    { to: "/user/community", label: "Community", icon: <FiUsers /> },
    { to: "/user/trackprogress", label: "Track Progress", icon: <FiMap /> },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/user"
            className="text-xl font-bold text-blue-600 flex items-center"
          >
            Fix My City
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === link.to
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {link.icon}
                <span className="ml-1">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden sm:flex sm:items-center">
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

          {/* Mobile Hamburger Button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block text-gray-700 hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && role === "user" ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left text-gray-700 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-gray-700 hover:underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
