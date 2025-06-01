import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Fix My City</h1>
          <p className="text-sm text-gray-500">Citizen & Admin Login</p>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} Fix My City. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;

// Updated handleLogin with Backend

// const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await axios.post("/api/auth/login", { email, password });

//     const { token, role } = res.data;

//     // Store securely
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);

//     // Redirect based on role
//     if (role === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/user");
//     }
//   } catch (err) {
//     console.error(err);
//     if (err.response?.status === 401) {
//       setError("Invalid email or password.");
//     } else {
//       setError("Login failed. Please try again later.");
//     }
//   }
// };

// Proxy Setup (if backend is on localhost:5000)
// In client/package.json:
// "proxy": "http://localhost:5000"
