import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Droplets,
  BellRing,
  Flame,
  TrendingUp,
  Check,
  Package,
  Layers,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function Features() {
  // Interactive hydration state for Bento Card 1
  const [hydration, setHydration] = useState(76);

  // Dynamic crumb character
  const getCrumbDescription = (h) => {
    if (h < 68) return { texture: "Tight & Uniform Sandwich Crumb", tack: "Very easy to shape", crust: "Thick & crisp" };
    if (h < 78) return { texture: "Custardy & Wild Open Hole Structure", tack: "Moderate bench rest required", crust: "Blistered & caramelized" };
    return { texture: "Extremely Open Crusty Hearth Bread", tack: "High-hydration folds only", crust: "Glass-like crackle" };
  };

  const crumb = getCrumbDescription(hydration);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#fffdfa] py-24 sm:py-32 border-t border-[#ebdccb]"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/3 -right-24 h-[500px] w-[500px] rounded-full bg-[#f4ece1] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-10 -left-24 h-[500px] w-[500px] rounded-full bg-[#fbf0e2] blur-3xl opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ddcaa8] bg-[#faf3ea] px-4 py-1.5 text-xs font-bold text-[var(--brown)] shadow-2xs">
            <Sparkles size={14} className="text-[#e2872d]" />
            <span>THE ARCHITECTURE OF MODERN CRAFT</span>
          </div>

          <h2 className="mt-5 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brown-dark)]">
            A specialized command center,
            <span className="block italic font-serif text-[var(--brown)]">
              engineered for bakery physics.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
            Generic inventory spreadsheets don't understand fermentation, flour hydration,
            or deck oven cycles. BakeLytics is tuned precisely for bakery production.
          </p>
        </div>

        {/* ASYMMETRICAL BENTO GRID */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* BENTO CARD 1 (Spans 2 columns): Interactive Dough Hydration & Baker's Percentage Lab */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#e8dacb] bg-gradient-to-b from-[#faf5ee] to-[#fffdf9] p-7 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eddccb] text-[var(--brown)] shadow-inner">
                    <Droplets size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brown)]">
                      Bento Lab 01
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--brown-dark)]">
                      Baker's Percentage & Hydration Lab
                    </h3>
                  </div>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--brown)] border border-[#ebdccb] shadow-2xs">
                  Interactive Formula
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Scale recipes automatically while locking your hydration ratios.
                Adjust the slider to simulate dough texture and water absorption per 1,000g of flour.
              </p>

              {/* Interactive Hydration Slider Box */}
              <div className="mt-6 rounded-2xl border border-[#ebdccb] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--brown-dark)] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                    Dough Hydration Target
                  </span>
                  <span className="font-mono text-base font-extrabold text-[var(--brown)] bg-[#faf4ec] px-3 py-1 rounded-lg border border-[#e8d7c4]">
                    {hydration}% ({Math.round(1000 * (hydration / 100))}g Water / 1kg Flour)
                  </span>
                </div>

                <input
                  type="range"
                  min="60"
                  max="88"
                  step="1"
                  value={hydration}
                  onChange={(e) => setHydration(Number(e.target.value))}
                  className="artisan-slider mt-4 w-full"
                />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#f2e7db] pt-3 text-xs">
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      Target Crumb
                    </span>
                    <p className="font-semibold text-[var(--brown-dark)] mt-0.5">
                      {crumb.texture}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      Handling Profile
                    </span>
                    <p className="font-semibold text-[var(--brown-dark)] mt-0.5">
                      {crumb.tack}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#fcf8f3] p-2.5">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      Crust Caramellization
                    </span>
                    <p className="font-semibold text-[var(--brown-dark)] mt-0.5">
                      {crumb.crust}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#efe4d6] pt-4 text-xs">
              <span className="text-[var(--text-secondary)] font-medium">
                Supports active yeast calculations and whole wheat flour blends
              </span>
              <Link
                to="/signup"
                className="font-bold text-[var(--brown)] hover:text-[var(--brown-dark)] inline-flex items-center gap-1 group"
              >
                Build formulas <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* BENTO CARD 2 (Spans 1 column): Live Low-Stock Sentinel */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#e8dacb] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#dc2626] shadow-inner">
                  <BellRing size={20} />
                </div>
                <span className="rounded-full bg-[#fef2f2] px-2.5 py-0.5 text-[10px] font-bold text-[#b91c1c] border border-[#fecaca]">
                  Active Sentinel
                </span>
              </div>

              <span className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-[var(--brown)]">
                Bento Lab 02
              </span>
              <h3 className="font-serif text-xl font-bold text-[var(--brown-dark)]">
                Automated Restock Thresholds
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                Pre-emptive alerts triggered days before critical butter or flour bins run empty.
              </p>

              {/* Simulated Notification Box */}
              <div className="mt-5 space-y-2.5 rounded-2xl bg-[#faf5ed] p-3.5 border border-[#eddccb]">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-bold text-white">
                    !
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--brown-dark)]">
                      Fresh Butter: 3.2 kg remaining
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Sufficient for 1 morning cookie batch only.
                    </p>
                  </div>
                </div>

                {/* Auto Drafted Purchase Order preview */}
                <div className="rounded-xl bg-white p-2.5 border border-[#e8d7c4] text-[11px]">
                  <div className="flex justify-between font-bold text-[var(--brown-dark)]">
                    <span className="flex items-center gap-1">
                      <FileText size={12} className="text-[var(--brown)]" />
                      Auto-Drafted PO #482
                    </span>
                    <span className="text-[#16a34a]">Ready to Send</span>
                  </div>
                  <p className="text-[#78665a] mt-1">
                    25kg Fresh Dairy Butter • City Milk & Dairy Co.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#f0e3d5] pt-4">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f7efe4] py-2.5 text-xs font-bold text-[var(--brown-dark)] hover:bg-[#eddccb] transition"
              >
                <span>Arm Restock Sentinel</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* BENTO CARD 3 (Spans 1 column): Deck Oven Scheduling Matrix */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#e8dacb] bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ffedd5] text-[#ea580c] shadow-inner">
                  <Flame size={20} />
                </div>
                <span className="rounded-full bg-[#fff7ed] px-2.5 py-0.5 text-[10px] font-bold text-[#c2410c] border border-[#ffedd5]">
                  Thermal Matrix
                </span>
              </div>

              <span className="mt-4 block text-[11px] font-bold uppercase tracking-wider text-[var(--brown)]">
                Bento Lab 03
              </span>
              <h3 className="font-serif text-xl font-bold text-[var(--brown-dark)]">
                Deck Oven Thermal Matrix
              </h3>

              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Align deck heats and baking temperatures with proofing readiness.
              </p>

              {/* Animated Oven Decks */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="rounded-xl border border-[#ebdccb] bg-[#faf6f0] p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--brown-dark)]">Deck 1 • Hearth</span>
                    <p className="text-[10px] text-[#b45309]">Fresh White Bread @ 220°C</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#ea580c] bg-white px-2 py-0.5 rounded-md border border-[#fed7aa]">
                    12m left
                  </span>
                </div>

                <div className="rounded-xl border border-[#ebdccb] bg-[#faf6f0] p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--brown-dark)]">Deck 2 • Convection</span>
                    <p className="text-[10px] text-[#15803d]">Crispy Butter Cookies @ 180°C</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#16a34a] bg-white px-2 py-0.5 rounded-md border border-[#bbf7d0]">
                    Ready
                  </span>
                </div>

                <div className="rounded-xl border border-[#ebdccb] bg-[#faf6f0] p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--brown-dark)]">Deck 3 • Gentle</span>
                    <p className="text-[10px] text-[#78665a]">Soft Dinner Rolls @ 190°C</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#78665a] bg-white px-2 py-0.5 rounded-md border border-[#e5d7c8]">
                    Preheating
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#f0e3d5] pt-4">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f7efe4] py-2.5 text-xs font-bold text-[var(--brown-dark)] hover:bg-[#eddccb] transition"
              >
                <span>View Oven Orchestration</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* BENTO CARD 4 (Spans 2 columns): Pastry Profit Margin & Inflation Guard */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-[#e8dacb] bg-gradient-to-b from-[#faf5ee] to-[#fffdf9] p-7 sm:p-9 shadow-sm transition-all duration-300 hover:shadow-xl lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dcfce7] text-[#15803d] shadow-inner">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
                      Bento Lab 04
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--brown-dark)]">
                      Pastry Unit Economics & Margin Guard
                    </h3>
                  </div>
                </div>

                <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-bold text-[#065f46] border border-[#a7f3d0]">
                  Dynamic Margins
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                BakeLytics tracks wholesale supplier price changes and instantly recalculates gross margin per pastry so you never unknowingly bake at a loss.
              </p>

              {/* Pastry Margin Comparison Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#ebdccb] bg-white p-4 shadow-xs">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--brown-dark)]">Rich Chocolate Cake</span>
                    <span>Slice</span>
                  </div>
                  <p className="font-serif text-xl font-bold text-[var(--brown-dark)] mt-1">
                    $4.50
                  </p>
                  <div className="mt-2 text-[11px] space-y-1 border-t border-[#f2e7db] pt-2">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Ingredients:</span>
                      <span className="font-mono font-bold">$0.95</span>
                    </div>
                    <div className="flex justify-between text-[#16a34a] font-bold">
                      <span>Gross Margin:</span>
                      <span>78.9%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebdccb] bg-white p-4 shadow-xs">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--brown-dark)]">Butter Cookies Box</span>
                    <span>Pack</span>
                  </div>
                  <p className="font-serif text-xl font-bold text-[var(--brown-dark)] mt-1">
                    $6.00
                  </p>
                  <div className="mt-2 text-[11px] space-y-1 border-t border-[#f2e7db] pt-2">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Ingredients:</span>
                      <span className="font-mono font-bold">$1.35</span>
                    </div>
                    <div className="flex justify-between text-[#16a34a] font-bold">
                      <span>Gross Margin:</span>
                      <span>77.5%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebdccb] bg-white p-4 shadow-xs">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--brown-dark)]">White Bread Loaf</span>
                    <span>Loaf</span>
                  </div>
                  <p className="font-serif text-xl font-bold text-[var(--brown-dark)] mt-1">
                    $4.50
                  </p>
                  <div className="mt-2 text-[11px] space-y-1 border-t border-[#f2e7db] pt-2">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Ingredients:</span>
                      <span className="font-mono font-bold">$0.85</span>
                    </div>
                    <div className="flex justify-between text-[#16a34a] font-bold">
                      <span>Gross Margin:</span>
                      <span>81.1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#efe4d6] pt-4 text-xs">
              <span className="text-[var(--text-secondary)]">
                Instant alerts when cocoa or butter prices surge beyond tolerance
              </span>
              <Link
                to="/signup"
                className="font-bold text-[var(--brown)] hover:text-[var(--brown-dark)] inline-flex items-center gap-1 group"
              >
                Inspect pastry margins <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

