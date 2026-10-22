import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ChefHat,
  Flame,
  Clock,
  CheckCircle2,
} from "lucide-react";
import bakerySignupImg from "../../assets/bakery_signup.jpg";
import bakerHandsImg from "../../assets/baker_hands.jpg";
import bakeryArtisanImg from "../../assets/bakery_artisan.jpg";
import berryCupcakeImg from "../../assets/berry_cupcake.png";
import chocolateSquareImg from "../../assets/chocolate_square.png";
import { getCurrentUser } from "../../services/authService";
import { useInventory } from "../../context/InventoryContext";

export default function DashboardHome() {
  const currentUser = getCurrentUser();
  const { inventory, isLoading } = useInventory();

  const userName = currentUser?.name || currentUser?.username || "Baker";
  const bakeryName = currentUser?.bakeryName || "Fresh Bakery";

  // Compute live overview counts
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((item) => item.amount <= item.threshold);
  const lowStockCount = lowStockItems.length;

  const flourItem = inventory.find((i) => i.name.toLowerCase().includes("flour"));
  const potentialLoaves = flourItem ? Math.floor(flourItem.amount / 0.35) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. HERO BANNER WITH BEAUTIFUL BACKGROUND & ANIMATED INGREDIENTS */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#e2d0bf] bg-gradient-to-br from-[#2d180c] via-[#4f2a15] to-[#713f24] p-8 sm:p-12 text-white shadow-2xl">
        {/* Ambient background image with soft overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay pointer-events-none">
          <img
            src={bakeryArtisanImg}
            alt="Artisan bakery ambient"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Floating animated ambient light orbs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#e2872d]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#f59e0b]/15 blur-3xl pointer-events-none" />

        {/* Floating animated ingredient / pastry illustrations */}
        <div className="pointer-events-none absolute right-8 top-6 hidden xl:block z-10">
          <div className="animate-float-gentle relative">
            <img
              src={berryCupcakeImg}
              alt="Artisan Berry Cupcake"
              className="h-32 w-32 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
            />
            <span className="absolute -bottom-2 -left-3 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md border border-white/20">
              Fresh Daily 🍓
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-44 bottom-6 hidden xl:block z-10">
          <div className="animate-float-reverse relative">
            <img
              src={chocolateSquareImg}
              alt="Chocolate Truffle"
              className="h-28 w-28 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20">
            <Flame size={14} className="text-[#f59e0b] animate-pulse" />
            <span>{bakeryName} • Production Center</span>
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Welcome back to the bakery, {userName}! 🧁
          </h1>

          <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed font-sans">
            Ready to bake fresh artisan batches today? Manage live raw ingredient stock levels,
            monitor low threshold warnings in real-time, or update inventory items seamlessly across your team.
          </p>

          {/* Quick navigation action buttons */}
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              to="/dashboard/stock-management"
              className="group flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#442311] shadow-lg transition hover:bg-[#fff9f3] hover:scale-105 active:scale-95"
            >
              <Package size={16} />
              <span>Inventory Stock Management</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/dashboard/ingredients-update"
              className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md border border-white/25 transition hover:bg-white/30 hover:scale-105 active:scale-95"
            >
              <Layers size={16} />
              <span>Update Ingredients</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATS SUMMARY CARDS */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#e8d9c7] bg-[#fffaf3] p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Raw Ingredients
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faeedd] text-[#8f5839]">
              <Package size={18} />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            {isLoading ? "..." : `${totalItems} Items`}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a]">
            <CheckCircle2 size={12} />
            {totalItems > 0 ? "Saved to your account" : "Clean pantry"}
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8d9c7] bg-[#fffaf3] p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Low Stock Alerts
            </span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                lowStockCount > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
              }`}
            >
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            {isLoading ? "..." : `${lowStockCount} Alerts`}
          </p>
          <span
            className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${
              lowStockCount > 0 ? "text-red-600" : "text-[#16a34a]"
            }`}
          >
            {lowStockCount > 0 ? "Threshold triggered" : "All stocks healthy"}
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8d9c7] bg-[#fffaf3] p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Bread Batch Capacity
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faeedd] text-[#8f5839]">
              <ChefHat size={18} />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            {isLoading ? "..." : `${potentialLoaves} Loaves`}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#8f5839]">
            <Flame size={12} /> Based on flour in stock
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8d9c7] bg-[#fffaf3] p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Live Socket Status
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Sparkles size={18} />
            </div>
          </div>
          <p className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            Active
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Real-time WebSockets
          </span>
        </div>
      </section>

      {/* 3. INTERACTIVE SECTION PREVIEWS */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Navigation Card 1: Stock Management */}
        <div className="group relative overflow-hidden rounded-[28px] border border-[#e8d9c7] bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md hover:border-[#dfc9b5]">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eade] text-2xl group-hover:scale-110 transition-transform">
              📦
            </div>
            <Link
              to="/dashboard/stock-management"
              className="flex items-center gap-1 text-xs font-bold text-[var(--brown)] hover:underline"
            >
              <span>Open View</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-[var(--brown-dark)]">
            Inventory Stock Management
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            Run batch bake simulations, deduct inventory automatically, track production yields, and review live delivery schedules.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              Bake Simulator
            </span>
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              Live Deductions
            </span>
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              Schedule
            </span>
          </div>
        </div>

        {/* Navigation Card 2: Ingredients Update */}
        <div className="group relative overflow-hidden rounded-[28px] border border-[#e8d9c7] bg-white p-6 sm:p-7 shadow-sm transition hover:shadow-md hover:border-[#dfc9b5]">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eade] text-2xl group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <Link
              to="/dashboard/ingredients-update"
              className="flex items-center gap-1 text-xs font-bold text-[var(--brown)] hover:underline"
            >
              <span>Open View</span>
              <ArrowRight size={13} />
            </Link>
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-[var(--brown-dark)]">
            Ingredients Update & Pantry
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            Add new raw ingredients (single + icon), restock quantities, adjust warning alert thresholds, and remove depleted materials.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              + Add Ingredient
            </span>
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              Restock
            </span>
            <span className="rounded-md bg-[#f7eee3] px-2 py-0.5 text-[11px] font-semibold text-[var(--brown-dark)]">
              Threshold Warnings
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
