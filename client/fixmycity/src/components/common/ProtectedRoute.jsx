import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const isAllowed =
    userRole === allowedRole ||
    (allowedRole === "ward_officer" && userRole?.startsWith("ward_"));

  if (!token || !isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
