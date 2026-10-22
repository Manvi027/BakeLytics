import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Layers,
  Calculator,
  Sparkles,
  ArrowRight,
  Check,
  Package,
  Clock,
  Flame,
  BadgePercent,
} from "lucide-react";

const pipelineStages = [
  {
    step: "01",
    id: "pantry",
    icon: ClipboardList,
    title: "1. Rapid Morning Pantry Ingestion",
    tagline: "WEIGH-IN & RECEPTION",
    description:
      "Log flour sacks, blocks of butter, eggs, and yeast in seconds. Auto-convert supplier packaging (e.g. 25kg sacks, cases) into pure baker's grams.",
    detailBullet: "Instant barcode / fast log entry on tablets",
    visualData: {
      heading: "Morning Delivery Ingested",
      badge: "Verified 8:15 AM",
      items: [
        { label: "All-Purpose Baking Flour", amount: "+250 kg", status: "In Stock" },
        { label: "Fresh Dairy Butter", amount: "+50 kg", status: "Cold Room 4°C" },
        { label: "Baking Chocolate", amount: "+20 kg", status: "Dry Pantry" },
      ],
      footerNote: "3 raw ingredients restocked • Auto-matched to PO #482",
    },
  },
  {
    step: "02",
    id: "formula",
    icon: Layers,
    title: "2. Precision Baker's Ratios",
    tagline: "RECIPE SCALING & MIXING",
    description:
      "Lock your standard formulas using simple baker's percentages. Scale up for busy weekends or dial down for quiet mornings without math errors.",
    detailBullet: "Maintains optimal texture & rise timing",
    visualData: {
      heading: "Formula Scaling Engine",
      badge: "Target: 120 Fresh Bread Loaves",
      items: [
        { label: "Baking Flour (100%)", amount: "36.0 kg", status: "Weighed" },
        { label: "Clean Water (70%)", amount: "25.2 kg", status: "Mix Ready" },
        { label: "Active Dry Yeast (2%)", amount: "720 g", status: "Proofing" },
      ],
      footerNote: "Zero mental math required • Dough Mix Temp: 24°C",
    },
  },
  {
    step: "03",
    id: "production",
    icon: Calculator,
    title: "3. Real-Time Yield & Limiter Calculation",
    tagline: "CAPACITY SOLVER",
    description:
      "BakeLytics cross-examines your inventory against your daily bake sheet. It immediately exposes which single ingredient is your bottleneck before mixing begins.",
    detailBullet: "Never discover you're short on butter during dough preparation",
    visualData: {
      heading: "Limiter Detection Result",
      badge: "Calculated in 0.04s",
      items: [
        { label: "Cookies possible by Flour", amount: "640 pcs", status: "Ample" },
        { label: "Cookies possible by Butter", amount: "320 pcs", status: "Bottleneck!" },
        { label: "Recommended Batch Size", amount: "300 pcs", status: "Safest Yield" },
      ],
      footerNote: "Alert: 20 pcs margin buffer retained for custom cake orders",
    },
  },
  {
    step: "04",
    id: "profits",
    icon: Sparkles,
    title: "4. Zero-Waste Oven & Sales Audit",
    tagline: "EXECUTION & MARGIN RECOVERY",
    description:
      "Track every tray coming out of the deck ovens. Compare morning planned production with evening showcase sales to eliminate stale discards.",
    detailBullet: "Reduces bakery food shrinkage from 7% down to 1.1%",
    visualData: {
      heading: "End-of-Day Production Audit",
      badge: "98.9% Sell-Through",
      items: [
        { label: "Fresh White Bread", amount: "48 / 48 Sold", status: "Sold Out 3:45 PM" },
        { label: "Crispy Butter Cookies", amount: "128 / 130 Sold", status: "2 Staff Samples" },
        { label: "Net Day Ingredient Margin", amount: "81.4%", status: "+$1,840 Profit" },
      ],
      footerNote: "Waste recorded: $8.40 total • Margin captured: Optimal",
    },
  },
];

export default function HowItWorks() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = pipelineStages[activeStageIndex];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#fbf7f0] py-24 sm:py-32 border-t border-[#ebdccb]"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ddcaa8] bg-[#faf3ea] px-4 py-1.5 text-xs font-bold text-[var(--brown)] shadow-2xs">
              <Sparkles size={14} className="text-[#e2872d]" />
              <span>THE CRAFT ENGINE IN ACTION</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brown-dark)]">
              From raw sacks of flour
              <span className="block italic font-serif text-[var(--brown)]">
                to golden pastry profits.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            A seamless four-phase workflow built specifically to mirror the sensory
            realities of daily bakehouse operations.
          </p>
        </div>

        {/* Step Selector Tab Pills */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`relative flex items-center gap-3 rounded-2xl p-4 text-left transition-all duration-300 ${isActive
                    ? "bg-[#2d180c] text-white shadow-lg scale-[1.02]"
                    : "border border-[#e8dacb] bg-white/80 text-[var(--brown-dark)] hover:bg-[#faefe2]"
                  }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${isActive
                      ? "bg-[#8f5839] text-white"
                      : "bg-[#f4ece1] text-[var(--brown)]"
                    }`}
                >
                  {stage.step}
                </div>
                <div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-[#e8c59f]" : "text-[var(--brown)]"
                      }`}
                  >
                    Phase {stage.step}
                  </p>
                  <p className="text-xs sm:text-sm font-bold truncate">
                    {stage.id.toUpperCase()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Active Stage Showcase */}
        <div className="mt-8 rounded-[36px] border border-[#e8dacb] bg-[#fffdfa] p-7 sm:p-12 shadow-[0_20px_70px_rgba(45,24,12,0.08)] lg:grid lg:grid-cols-12 lg:gap-12 items-center">

          {/* Left Explanatory Details (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f6eee5] px-3 py-1 text-xs font-bold text-[var(--brown)] border border-[#ead9c8]">
              <span>{activeStage.tagline}</span>
            </div>

            <h3 className="mt-4 font-serif text-2xl sm:text-4xl font-bold text-[var(--brown-dark)]">
              {activeStage.title}
            </h3>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
              {activeStage.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#16a34a]">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dcfce7]">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>{activeStage.detailBullet}</span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brown-dark)] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1a0e07] transition"
              >
                <span>Try Phase {activeStage.step} Free</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Live Stage Mockup Display (5 cols) */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-[#e4d4c2] bg-[#221209] p-6 text-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8c59f]">
                    Live Kitchen Feed
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {activeStage.visualData.heading}
                  </h4>
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#86efac] border border-white/15">
                  {activeStage.visualData.badge}
                </span>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-2.5">
                {activeStage.visualData.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-xs border border-white/5"
                  >
                    <div>
                      <p className="font-semibold text-[#f5ebd9]">{item.label}</p>
                      <p className="text-[10px] text-white/50">{item.status}</p>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#fde047]">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-4 rounded-xl bg-[#8f5839]/30 p-2.5 text-center text-[11px] text-[#fed7aa] border border-[#8f5839]/40">
                {activeStage.visualData.footerNote}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

