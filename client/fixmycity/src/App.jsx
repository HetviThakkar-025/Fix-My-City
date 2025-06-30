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
import TrackProgress from "./pages/user/TrackProgress";

import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AllReports from "./pages/admin/AllReports";
import WardZones from "./pages/admin/WardZones";
import AdminCommunityPage from "./pages/admin/AdminCommunityPage";

import WardDashboard from "./pages/wards/WardOfficerDashboard";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="community" element={<Community />} />
          <Route path="trackprogress" element={<TrackProgress />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="allreports" element={<AllReports />} />
          <Route path="zones" element={<WardZones />} />
          <Route path="community_admin" element={<AdminCommunityPage />} />
        </Route>

        {/* Protected Ward Officer Route */}
        <Route
          path="/ward"
          element={
            <ProtectedRoute allowedRole="ward_officer">
              <WardDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
