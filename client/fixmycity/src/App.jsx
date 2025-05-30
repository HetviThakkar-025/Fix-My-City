import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import UserLayout from "./layout/UserLayout";
import UserHome from "./pages/user/Home";
import ReportIssue from "./pages/user/ReportIssue";
import Community from "./pages/user/Community";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Analysis from "./pages/admin/Analysis";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="report" element={<ReportIssue />} />
            <Route path="community" element={<Community />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
