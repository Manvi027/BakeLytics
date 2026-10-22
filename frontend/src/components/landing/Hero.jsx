import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Sliders,
  AlertCircle,
  TrendingUp,
  Scale,
  Flame,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import bakeryShelfImg from "../../assets/baker_hands.jpg";
import bakeryPastryImg from "../../assets/bakery_pastries.jpg";

export default function Hero() {
  // Interactive stock sliders state
  const [flourKg, setFlourKg] = useState(28); // 28 kg
  const [butterKg, setButterKg] = useState(7.5); // 7.5 kg
  const [eggsCount, setEggsCount] = useState(64); // 64 eggs
  const [selectedProduct, setSelectedProduct] = useState("bread");

  // Real-time calculations based on ingredients
  const recipeCalculations = useMemo(() => {
    // White Bread specs: 0.35kg flour, 0.02kg butter, 0 eggs
    const breadByFlour = Math.floor(flourKg / 0.35);
    const breadByButter = Math.floor(butterKg / 0.02);
    const breadYield = Math.min(breadByFlour, breadByButter);
    const breadLimiting =
      breadByButter < breadByFlour
        ? `Fresh Butter (${butterKg} kg left)`
        : `Baking Flour (${flourKg} kg left)`;

    // Butter Cookies specs: 0.04kg flour, 0.025kg butter, 0 eggs
    const cookiesByFlour = Math.floor(flourKg / 0.04);
    const cookiesByButter = Math.floor(butterKg / 0.025);
    const cookiesYield = Math.min(cookiesByFlour, cookiesByButter);
    const cookiesLimiting =
      cookiesByButter < cookiesByFlour
        ? `Fresh Butter (${butterKg} kg left)`
        : `Baking Flour (${flourKg} kg left)`;

    // Chocolate Cake specs: 0.3kg flour, 0.15kg butter, 3 eggs
    const cakeByFlour = Math.floor(flourKg / 0.3);
    const cakeByButter = Math.floor(butterKg / 0.15);
    const cakeByEggs = Math.floor(eggsCount / 3);
    const cakeYield = Math.min(cakeByFlour, cakeByButter, cakeByEggs);
    let cakeLimiting = "Baking Flour";
    if (cakeByButter <= cakeByFlour && cakeByButter <= cakeByEggs) {
      cakeLimiting = `Fresh Butter (${butterKg} kg)`;
    } else if (cakeByEggs <= cakeByFlour) {
      cakeLimiting = `Fresh Eggs (${eggsCount} pcs)`;
    }

    return {
      bread: {
        name: "Fresh White Bread",
        yield: breadYield,
        unitPrice: 4.5,
        limitingFactor: breadLimiting,
        bakeTemp: "210°C • 30 mins",
        wasteRisk: breadByButter < 20 ? "Low Butter Alert" : "Optimal",
        flourUsage: Math.round(breadYield * 0.35 * 10) / 10,
        butterUsage: Math.round(breadYield * 0.02 * 10) / 10,
      },
      cookies: {
        name: "Crispy Butter Cookies",
        yield: cookiesYield,
        unitPrice: 1.5,
        limitingFactor: cookiesLimiting,
        bakeTemp: "180°C • 15 mins",
        wasteRisk: cookiesByButter < 50 ? "Restock Butter Soon" : "Optimal",
        flourUsage: Math.round(cookiesYield * 0.04 * 10) / 10,
        butterUsage: Math.round(cookiesYield * 0.025 * 10) / 10,
      },
      cake: {
        name: "Rich Chocolate Cake",
        yield: cakeYield,
        unitPrice: 14.0,
        limitingFactor: cakeLimiting,
        bakeTemp: "175°C • 35 mins",
        wasteRisk: cakeByEggs < 10 ? "Egg Shortage Alert" : "Optimal",
        flourUsage: Math.round(cakeYield * 0.3 * 10) / 10,
        butterUsage: Math.round(cakeYield * 0.15 * 10) / 10,
      },
    };
  }, [flourKg, butterKg, eggsCount]);

  const currentRecipe = recipeCalculations[selectedProduct];
  const grossPotential = Math.round(
    currentRecipe.yield * currentRecipe.unitPrice
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-36 bg-[#fbf7f0] baker-grid-pattern"
    >
      {/* Warm ambient blurred glow backdrops */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-[550px] w-[1100px] rounded-full bg-gradient-to-tr from-[#eddccb]/60 via-[#faeedd]/80 to-[#f6e4cc]/40 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#e2872d]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-20 h-96 w-96 rounded-full bg-[#8f5839]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Floating Announcement Pill */}
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e4d4c2] bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[var(--brown-dark)] backdrop-blur-md shadow-xs transition hover:border-[var(--brown)]">
            <span className="flex h-2 w-2 rounded-full bg-[#e2872d] animate-pulse" />
            <span className="text-[#8f5839] font-bold tracking-wide uppercase text-[10px]">
              New: Real-time Batch Limiter Engine
            </span>
            <span className="hidden sm:inline text-[#b09e90]">|</span>
            <span className="hidden sm:inline text-xs text-[var(--text-secondary)]">
              No more morning flour shortages
            </span>
            <ChevronRight size={13} className="text-[#8f5839]" />
          </div>
        </div>

        {/* 2-Column Asymmetrical Grid */}
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.05fr_1.15fr] lg:gap-14">
          {/* LEFT COLUMN: Editorial High-Craft Headline */}
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-[var(--brown-dark)] sm:text-6xl lg:text-[64px] leading-[1.08]">
              Know every gram.{" "}
              <span className="block italic font-serif text-[var(--brown)]">
                Bake every pastry
              </span>
              <span className="bg-gradient-to-r from-[#2d180c] via-[#8f5839] to-[#c77732] bg-clip-text text-transparent">
                with total confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              The smart inventory operating system engineered for craft bakeries,
              pastry shops, and artisan bread kitchens. Connect raw flour sacks
              and butter directly to daily batch yields, prevent waste,
              and protect margins before firing the ovens.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#8f5839] via-[#a26038] to-[#733e21] px-7 py-4 text-base font-bold text-white shadow-xl shadow-[#8f5839]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#8f5839]/35 active:translate-y-0"
              >
                <span>Start Free Kitchen Trial</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white/30">
                  <ArrowRight size={15} />
                </div>
              </Link>
            </div>

            {/* Micro Trust Strip */}
            <div className="mt-11 grid grid-cols-3 gap-4 border-t border-[#e8dacb] pt-8 max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-[var(--brown-dark)]">
                  1,400+
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                  Bakery Kitchens
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#16a34a]">
                  98.4%
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                  Yield Accuracy
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[var(--brown-dark)]">
                  $1,280
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                  Avg. Monthly Waste Saved
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Live Kitchen Workbench */}
          <div className="relative">
            {/* Workbench Frame */}
            <div className="relative overflow-hidden rounded-[32px] border border-[#e5d4c1] bg-[#fffdf9] p-6 sm:p-8 shadow-[0_24px_70px_rgba(45,24,12,0.12)]">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e2d3] pb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faeedd] text-[var(--brown)] shadow-inner">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--brown-dark)]">
                      Bakery Yield Simulator
                    </h2>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Drag pantry sliders to test batch capacity
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#16a34a]/10 px-3 py-1 text-[11px] font-bold text-[#15803d] border border-[#16a34a]/20">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                  <span>Calculated Live</span>
                </div>
              </div>

              {/* Recipe Selector Pills */}
              <div className="mt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Select Baked Good to Simulate:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "bread", label: "🍞 White Bread" },
                    { key: "cookies", label: "🍪 Butter Cookies" },
                    { key: "cake", label: "🎂 Chocolate Cake" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setSelectedProduct(tab.key)}
                      className={`rounded-xl py-2 px-2 text-xs font-semibold transition-all duration-200 ${selectedProduct === tab.key
                          ? "bg-[var(--brown-dark)] text-white shadow-md scale-[1.02]"
                          : "bg-[#f4ece1] text-[var(--brown-dark)] hover:bg-[#ebdccb]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Sliders */}
              <div className="mt-6 space-y-4 rounded-2xl bg-[#faf5ed] p-4 border border-[#ebdccb]">
                {/* Flour Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--brown-dark)]">
                    <span className="flex items-center gap-1.5">
                      <Scale size={14} className="text-[var(--brown)]" />
                      All-Purpose Flour
                    </span>
                    <span className="font-mono font-bold text-sm text-[var(--brown-deep)] bg-white px-2 py-0.5 rounded-md border border-[#e4d4c2]">
                      {flourKg} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={flourKg}
                    onChange={(e) => setFlourKg(Number(e.target.value))}
                    className="artisan-slider mt-2.5 w-full"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                    <span>5 kg</span>
                    <span>50 kg</span>
                    <span>100 kg</span>
                  </div>
                </div>

                {/* Fresh Butter Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--brown-dark)]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm leading-none">🧈</span>
                      Fresh Butter
                    </span>
                    <span className="font-mono font-bold text-sm text-[var(--brown-deep)] bg-white px-2 py-0.5 rounded-md border border-[#e4d4c2]">
                      {butterKg} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="0.5"
                    value={butterKg}
                    onChange={(e) => setButterKg(Number(e.target.value))}
                    className="artisan-slider mt-2.5 w-full"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                    <span>1 kg</span>
                    <span>12.5 kg</span>
                    <span>25 kg</span>
                  </div>
                </div>

                {/* Eggs Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--brown-dark)]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm leading-none">🥚</span>
                      Fresh Eggs
                    </span>
                    <span className="font-mono font-bold text-sm text-[var(--brown-deep)] bg-white px-2 py-0.5 rounded-md border border-[#e4d4c2]">
                      {eggsCount} pcs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="180"
                    step="6"
                    value={eggsCount}
                    onChange={(e) => setEggsCount(Number(e.target.value))}
                    className="artisan-slider mt-2.5 w-full"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mt-1">
                    <span>1 doz</span>
                    <span>7.5 doz</span>
                    <span>15 doz</span>
                  </div>
                </div>
              </div>

              {/* Real-time Dynamic Results Card */}
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#2d180c] to-[#1a0e07] p-5 text-white shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#d8c2ad]">
                      Maximum Production Capacity
                    </span>
                    <h3 className="mt-0.5 font-serif text-2xl font-bold text-white">
                      {currentRecipe.yield}{" "}
                      <span className="text-base font-sans font-normal text-[#e8d5c4]">
                        units
                      </span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#86efac]">
                      Gross Value
                    </span>
                    <p className="font-serif text-2xl font-bold text-[#fde047]">
                      ${grossPotential.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Limiting Ingredient Alert Row */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2 text-xs backdrop-blur-xs border border-white/10">
                  <div className="flex items-center gap-2 text-[#fed7aa]">
                    <AlertCircle size={15} className="text-[#f97316] shrink-0" />
                    <span>Bottleneck: <strong>{currentRecipe.limitingFactor}</strong></span>
                  </div>
                  <span className="hidden sm:inline font-mono text-[11px] text-[#fcd34d]">
                    {currentRecipe.bakeTemp}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Jump Link */}
              <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#16a34a]" />
                  Verified recipe batch formula
                </span>
                <Link
                  to="/signup"
                  className="font-bold text-[var(--brown)] hover:text-[var(--brown-dark)] hover:underline inline-flex items-center gap-1"
                >
                  Manage your recipes <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Subtle decorative artisan floating badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 z-20 items-center gap-3 rounded-2xl border border-[#ecdcc9] bg-[#fffdf9]/95 p-3.5 shadow-xl backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faeedd] text-xl shadow-xs">
                🍞
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--brown-dark)]">
                  Zero Waste Production
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Accurate down to 10g
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

