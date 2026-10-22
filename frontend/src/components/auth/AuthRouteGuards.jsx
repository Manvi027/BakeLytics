import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

// Protects dashboard and private routes; redirects unauthenticated visitors to /login
export function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// Prevents authenticated users from seeing /login and /signup when pressing back
export function PublicOnlyRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
