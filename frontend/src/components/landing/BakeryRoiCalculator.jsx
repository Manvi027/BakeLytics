import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function BakeryRoiCalculator() {
  const [flourWeeklyKg, setFlourWeeklyKg] = useState(450);
  const [avgPrice, setAvgPrice] = useState(6.5);

  const roi = useMemo(() => {
    // Typical unoptimized bakery suffers 6.8% waste in over-proofing, excess trimmings, and stale inventory
    // BakeLytics brings waste down to ~1.2% (saving ~5.6%)
    const monthlyFlourKg = flourWeeklyKg * 4.33;
    const wasteFlourSavedKg = Math.round(monthlyFlourKg * 0.056);

    // Dollar value of ingredient waste + lost pastry sellable opportunity
    const lostSellableUnitsSaved = Math.round(wasteFlourSavedKg / 0.15); // avg 150g flour per finished pastry/bread
    const monthlyDollarsSaved = Math.round(lostSellableUnitsSaved * (avgPrice * 0.52)); // estimated net margin gain
    const annualDollarsSaved = monthlyDollarsSaved * 12;

    // Staff labor hours saved calculating formulas and spreadsheet logs
    const weeklyHoursSaved = Math.round((flourWeeklyKg / 80) + 3.5);
    const monthlyHoursSaved = Math.round(weeklyHoursSaved * 4.33);

    return {
      monthlyFlourSavedKg: wasteFlourSavedKg,
      monthlyDollarsSaved,
      annualDollarsSaved,
      monthlyHoursSaved,
    };
  }, [flourWeeklyKg, avgPrice]);

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-[#faf4ec] py-24 sm:py-32 border-t border-[#ead9c8]"
    >
      {/* Ambient warm gradient orbs */}
      <div className="pointer-events-none absolute top-10 left-1/4 h-80 w-80 rounded-full bg-[#e2872d]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-[#8f5839]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dcc8b3] bg-white px-4 py-1.5 text-xs font-bold text-[var(--brown)] shadow-2xs">
            <Sparkles size={14} className="text-[#e2872d]" />
            <span>INTERACTIVE VALUE CALCULATOR</span>
          </div>

          <h2 className="mt-5 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brown-dark)]">
            How much dough does guesswork
            <span className="block italic font-serif text-[var(--brown)]">
              cost your kitchen each year?
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
            Slide your weekly flour volume to uncover the hidden dollars lost in morning
            mismeasurements, over-proofing, and supplier overcharges.
          </p>
        </div>

        {/* Interactive Calculator Bento Box */}
        <div className="mt-14 overflow-hidden rounded-[36px] border border-[#e4d4c2] bg-[#fffdfa] shadow-[0_20px_70px_rgba(45,24,12,0.1)] lg:grid lg:grid-cols-12">

          {/* Controls Column (7 cols) */}
          <div className="p-7 sm:p-10 lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-[#f0e3d5] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faeedd] text-[var(--brown)] shadow-xs">
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--brown-dark)]">
                    Bakery Scale & Production Inputs
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Customized for artisan micro-bakeries to multi-deck wholesale bakehouses
                  </p>
                </div>
              </div>

              {/* Slider 1: Weekly Flour */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[var(--brown-dark)]">
                    Weekly Flour Consumption:
                  </label>
                  <span className="font-mono text-base font-extrabold text-[var(--brown)] bg-[#faf5ed] px-3 py-1 rounded-xl border border-[#ebdccb]">
                    {flourWeeklyKg.toLocaleString()} kg / week
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="2000"
                  step="20"
                  value={flourWeeklyKg}
                  onChange={(e) => setFlourWeeklyKg(Number(e.target.value))}
                  className="artisan-slider mt-3.5 w-full"
                />
                <div className="mt-2 flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                  <span>80 kg (Micro Bakery)</span>
                  <span>500 kg (Artisan Shop)</span>
                  <span>2,000 kg (Bakehouse)</span>
                </div>
              </div>

              {/* Slider 2: Average Pastry Price */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[var(--brown-dark)]">
                    Average Retail Price per Item:
                  </label>
                  <span className="font-mono text-base font-extrabold text-[var(--brown)] bg-[#faf5ed] px-3 py-1 rounded-xl border border-[#ebdccb]">
                    ${avgPrice.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="14.0"
                  step="0.25"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="artisan-slider mt-3.5 w-full"
                />
                <div className="mt-2 flex justify-between text-[11px] text-[var(--text-secondary)] font-medium">
                  <span>$3.50 (Bread Loaves)</span>
                  <span>$6.50 (Pastries)</span>
                  <span>$14.00 (Specialty Loaf/Cake)</span>
                </div>
              </div>

              {/* Verified Value Checkmarks */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[#f0e3d5] pt-6">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--brown-dark)]">
                  <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                  <span>Eliminates morning spreadsheet math</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--brown-dark)]">
                  <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                  <span>Safeguards against butter spoilage</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--brown-dark)]">
                  <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                  <span>Instant distributor purchase orders</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-[var(--brown-dark)]">
                  <CheckCircle2 size={16} className="text-[#16a34a] shrink-0" />
                  <span>14-day free trial • Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="bg-gradient-to-br from-[#281409] via-[#210f06] to-[#160a04] p-7 sm:p-10 text-white lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#422211]">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#e8c59f] uppercase">
                Projected Kitchen Return
              </span>

              {/* Big Annual Impact */}
              <div className="mt-4">
                <p className="text-xs text-white/70">Estimated Annual Recovered Profit:</p>
                <p className="mt-1 font-serif text-4xl sm:text-5xl font-black text-[#fde047] tracking-tight">
                  ${roi.annualDollarsSaved.toLocaleString()}
                  <span className="text-lg font-sans font-normal text-white/70">/yr</span>
                </p>
                <p className="mt-1 text-[11px] text-[#86efac]">
                  Based on 5.6% average waste reduction & yield optimization
                </p>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16a34a]/20 text-[#86efac]">
                      <TrendingDown size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Monthly Flour Saved</p>
                      <p className="text-[10px] text-white/60">Prevented from stale dough waste</p>
                    </div>
                  </div>
                  <span className="font-mono text-base font-bold text-[#86efac]">
                    {roi.monthlyFlourSavedKg} kg
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f59e0b]/20 text-[#fde047]">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Baker Hours Reclaimed</p>
                      <p className="text-[10px] text-white/60">Zero manual weigh sheet audits</p>
                    </div>
                  </div>
                  <span className="font-mono text-base font-bold text-[#fde047]">
                    {roi.monthlyHoursSaved} hrs/mo
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 space-y-3">
              <Link
                to="/signup"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e2872d] to-[#c46815] py-4 text-sm font-bold text-[#1f0f06] shadow-xl shadow-amber-900/40 transition hover:scale-[1.02] active:scale-[0.99]"
              >
                <span>Unlock Your Bakery's Savings</span>
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/20 transition"
              >
                Already a member? Chef Login
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
