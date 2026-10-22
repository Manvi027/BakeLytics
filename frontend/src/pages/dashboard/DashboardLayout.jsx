import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import DashboardNavbar from "../../components/layout/DashboardNavbar";
import { InventoryProvider } from "../../context/InventoryContext";
import { Sparkles, X } from "lucide-react";

export default function DashboardLayout() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    };

    window.addEventListener("bakelyticsToast", handleToast);
    return () => window.removeEventListener("bakelyticsToast", handleToast);
  }, []);

  return (
    <InventoryProvider>
      <div className="min-h-screen bg-[#f8f1e7] text-[var(--text-primary)] flex flex-col">
        {/* Navigation Bar */}
        <DashboardNavbar />

        {/* Live Floating Toast Alert */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#251308] px-5 py-3 text-white shadow-2xl backdrop-blur-md animate-fadeIn">
            <Sparkles size={18} className="text-[#f59e0b] shrink-0 animate-pulse" />
            <div className="text-xs">
              <span className="font-semibold block">{toast.type === "LOW_STOCK" ? "Stock Alert" : "Update"}</span>
              <span className="text-white/80">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </InventoryProvider>
  );
}
