import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import StockManagement from "./pages/dashboard/StockManagement";
import IngredientsUpdate from "./pages/dashboard/IngredientsUpdate";
import { ProtectedRoute, PublicOnlyRoute } from "./components/auth/AuthRouteGuards";
import { isAuthenticated } from "./services/authService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest & Landing Routes (redirect to /dashboard if already logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Dashboard Routes (redirect to /login if not authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="stock-management" element={<StockManagement />} />
            <Route path="ingredients-update" element={<IngredientsUpdate />} />
          </Route>
        </Route>

        {/* Fallback Catch-all Route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;