import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ChefHat,
  LayoutDashboard,
  Package,
  Layers,
  Bell,
  LogOut,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  X,
  Menu,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "../../services/authService";
import { useInventory } from "../../context/InventoryContext";

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();
  const { notifications, unreadAlertCount, clearUnreadAlerts } = useInventory();

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userName = currentUser?.name || currentUser?.username || "Baker";
  const bakeryName = currentUser?.bakeryName || "Fresh Bakery";
  const userInitial = userName.charAt(0).toUpperCase() || "B";

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  const navLinks = [
    {
      to: "/dashboard",
      label: "Main Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/dashboard/stock-management",
      label: "Inventory Stock",
      icon: Package,
      badge: null,
    },
    {
      to: "/dashboard/ingredients-update",
      label: "Ingredients Update",
      icon: Layers,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#e8d9c7] bg-[#fffaf3]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Active Kitchen */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ead9c3] text-lg shadow-sm group-hover:scale-105 transition-transform">
              🧁
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--brown-dark)]">
                BakeLytics
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--brown-light)] hidden sm:block">
                Bakery OS
              </span>
            </div>
          </Link>

          <span className="h-5 w-px bg-[#e0d0bf] hidden sm:block" />

          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#e5d6c4] bg-[#fbf5ec] px-3 py-1 text-xs font-semibold text-[var(--brown-dark)]">
            <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
            <span className="truncate max-w-[140px]">{bakeryName}</span>
            <span className="text-[#a49080] font-normal">• Live Kitchen</span>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-[#e9dcce] bg-[#f7efe4]/80 p-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive: active }) =>
                  `flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#8f5839] to-[#713f24] text-white shadow-md shadow-[#8f5839]/20"
                      : "text-[var(--text-secondary)] hover:bg-[#eddccb]/60 hover:text-[var(--brown-dark)]"
                  }`
                }
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Icons: Notification Center & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real-time Notifications Bell with WebSocket dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotificationPanel(!showNotificationPanel);
                if (!showNotificationPanel && unreadAlertCount > 0) {
                  clearUnreadAlerts();
                }
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8d9c7] bg-[#fffaf3] text-[var(--brown-dark)] transition hover:bg-[#ead9c3] cursor-pointer"
              title="Live Stock Notifications (Socket.IO)"
            >
              <Bell size={17} />
              {unreadAlertCount > 0 && (
                <span className="animate-pulse-ring absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white shadow-sm">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {showNotificationPanel && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#e8d9c7] bg-white p-4 shadow-2xl z-50 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#e2872d]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brown-dark)]">
                      Live Stock Notifications
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-semibold text-green-700">
                      WebSocket Live
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotificationPanel(false)}
                      className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                      No stock alerts yet. Any low ingredients or baking activities will stream here live!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition ${
                          n.type === "LOW_STOCK"
                            ? "bg-red-50/80 border border-red-200 text-red-900"
                            : n.type === "RESTOCKED" || n.type === "BAKE_SUCCESS"
                            ? "bg-green-50/80 border border-green-200 text-green-900"
                            : "bg-[#fbf7f0] border border-[#eee0d3] text-[var(--brown-dark)]"
                        }`}
                      >
                        {n.type === "LOW_STOCK" ? (
                          <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium leading-tight">{n.message}</p>
                          <span className="text-[10px] text-gray-500 mt-1 block">
                            {n.timestamp ? new Date(n.timestamp).toLocaleTimeString() : "Just now"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-[#e8d9c7]">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-tr from-[#8f5839] to-[#b37450] font-serif font-bold text-white text-sm shadow-sm shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-tight text-[var(--brown-dark)] truncate max-w-[100px]">
                {userName}
              </p>
              <p className="text-[10px] text-[#8e7a6d]">Head Baker</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-[#ead9c3]/70 px-3 py-1.5 text-xs font-semibold text-[var(--brown-dark)] transition hover:bg-[#ead9c3]"
            title="Log out of kitchen"
          >
            <LogOut size={13} className="hidden sm:inline" />
            <span>Logout</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8d9c7] text-[var(--brown-dark)]"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e8d9c7] bg-[#fffaf3] px-4 py-3 space-y-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[var(--brown)] text-white"
                      : "text-[var(--brown-dark)] hover:bg-[#f3e7dc]"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
