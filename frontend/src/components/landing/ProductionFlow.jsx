import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Scale,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  BadgePercent,
  Layers,
} from "lucide-react";

import artisanBreadsImg from "../../assets/bakery_artisan.jpg";
import pastriesImg from "../../assets/bakery_pastries.jpg";
import cupcakeImg from "../../assets/berry_cupcake.png";
import chocolateImg from "../../assets/chocolate_square.png";

const signatureItems = [
  {
    id: "bread",
    name: "Fresh White Bread Loaf",
    category: "Bread",
    image: artisanBreadsImg,
    isPng: false,
    batchSize: "32 loaves",
    retailPrice: "$4.50",
    costPerUnit: "$0.85",
    grossMargin: "81.1%",
    bakeSpecs: "30 min @ 210°C",
    limitingFactor: "All-Purpose Flour (14 kg remaining)",
    ingredients: [
      { name: "All-Purpose Baking Flour", qty: "12.0 kg", pct: 100 },
      { name: "Fresh Dairy Butter", qty: "1.2 kg", pct: 10 },
      { name: "Fresh Milk & Water", qty: "7.5 kg", pct: 62 },
      { name: "White Sugar & Salt", qty: "450 g", pct: 3.8 },
    ],
  },
  {
    id: "cookies",
    name: "Crispy Butter Cookies",
    category: "Cookies",
    image: pastriesImg,
    isPng: false,
    batchSize: "48 pieces",
    retailPrice: "$1.50",
    costPerUnit: "$0.32",
    grossMargin: "78.7%",
    bakeSpecs: "15 min @ 180°C",
    limitingFactor: "Fresh Dairy Butter (3.2 kg remaining)",
    ingredients: [
      { name: "All-Purpose Baking Flour", qty: "1,900 g", pct: 100 },
      { name: "Fresh Dairy Butter", qty: "1,200 g", pct: 63 },
      { name: "Granulated White Sugar", qty: "800 g", pct: 42 },
      { name: "Fresh Eggs & Vanilla", qty: "250 g", pct: 13 },
    ],
  },
  {
    id: "cupcake",
    name: "Vanilla Cream Cupcake",
    category: "Cakes & Sweets",
    image: cupcakeImg,
    isPng: true,
    batchSize: "36 units",
    retailPrice: "$3.50",
    costPerUnit: "$0.78",
    grossMargin: "77.7%",
    bakeSpecs: "18 min @ 180°C",
    limitingFactor: "Pure Vanilla (200 ml remaining)",
    ingredients: [
      { name: "Baking Flour", qty: "900 g", pct: 100 },
      { name: "Fresh Farm Eggs", qty: "12 pcs", pct: 100 },
      { name: "Fresh Dairy Butter", qty: "650 g", pct: 72 },
      { name: "White Sugar & Milk", qty: "550 g", pct: 61 },
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate Fudge Brownie",
    category: "Chocolates",
    image: chocolateImg,
    isPng: true,
    batchSize: "40 squares",
    retailPrice: "$4.00",
    costPerUnit: "$0.92",
    grossMargin: "77.0%",
    bakeSpecs: "25 min @ 175°C",
    limitingFactor: "Baking Chocolate (2.4 kg remaining)",
    ingredients: [
      { name: "Baking Dark Chocolate", qty: "1,200 g", pct: 100 },
      { name: "Fresh Dairy Butter", qty: "800 g", pct: 67 },
      { name: "Granulated White Sugar", qty: "900 g", pct: 75 },
      { name: "Flour & Fresh Eggs", qty: "650 g", pct: 54 },
    ],
  },
];

export default function ProductionFlow() {
  const [activeItem, setActiveItem] = useState(signatureItems[0]);

  return (
    <section className="relative overflow-hidden bg-[#fffdfa] py-24 sm:py-32 border-t border-[#ebdccb]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ddcaa8] bg-[#faf3ea] px-4 py-1.5 text-xs font-bold text-[var(--brown)] shadow-2xs">
            <Sparkles size={14} className="text-[#e2872d]" />
            <span>RECIPE MATRIX & MARGIN ENGINE</span>
          </div>

          <h2 className="mt-5 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[var(--brown-dark)]">
            Every recipe connected
            <span className="block italic font-serif text-[var(--brown)]">
              to your live walk-in cooler.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
            Explore how BakeLytics instantly calculates exact ingredient requirements,
            bake times, and gross margin per pastry tray.
          </p>
        </div>

        {/* Item Selector Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {signatureItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${activeItem.id === item.id
                  ? "bg-[var(--brown-dark)] text-white shadow-md scale-105"
                  : "bg-[#f4ece1] text-[var(--brown-dark)] hover:bg-[#ebdccb]"
                }`}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Master Recipe Showcase Panel */}
        <div className="mt-10 overflow-hidden rounded-[36px] border border-[#e8dacb] bg-[#fcf8f3] shadow-[0_24px_80px_rgba(45,24,12,0.1)] lg:grid lg:grid-cols-12">

          {/* Visual Photography Column (5 cols) */}
          <div className="relative overflow-hidden bg-[#180d07] lg:col-span-5 min-h-[380px] lg:min-h-[500px] flex items-center justify-center p-8">
            <img
              src={activeItem.image}
              alt={activeItem.name}
              className={`h-full w-full object-cover transition-all duration-700 ${activeItem.isPng
                  ? "max-h-[340px] max-w-[340px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] hover:scale-105"
                  : "object-center opacity-85 hover:scale-105"
                }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Bottom Overlay Badges on Image */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {activeItem.category}
                </span>
                <h4 className="mt-2 font-serif text-xl sm:text-2xl font-bold">
                  {activeItem.name}
                </h4>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#86efac] font-semibold uppercase">
                  Gross Margin
                </span>
                <p className="font-serif text-2xl font-bold text-[#fde047]">
                  {activeItem.grossMargin}
                </p>
              </div>
            </div>
          </div>

          {/* Recipe Breakdown & Economics Column (7 cols) */}
          <div className="p-7 sm:p-10 lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Top Quick Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdccb] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brown-dark)]">
                    <Clock size={14} className="text-[#e2872d]" />
                    <span>{activeItem.bakeSpecs}</span>
                  </div>
                  <span className="text-[#d0bfad]">•</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brown-dark)]">
                    <Scale size={14} className="text-[var(--brown)]" />
                    <span>Batch: {activeItem.batchSize}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">Price:</span>
                  <span className="font-mono text-base font-extrabold text-[var(--brown-dark)]">
                    {activeItem.retailPrice}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">(Cost: {activeItem.costPerUnit})</span>
                </div>
              </div>

              {/* Limiting Alert Pill */}
              <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-[#fee2e2]/60 p-3 text-xs border border-[#fecaca] text-[#991b1b]">
                <AlertTriangle size={16} className="shrink-0 text-[#dc2626]" />
                <span>
                  <strong>Limiting Factor:</strong> {activeItem.limitingFactor}
                </span>
              </div>

              {/* Ingredients Breakdown Table */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                  Ingredient Requirements per Batch:
                </p>
                <div className="space-y-2.5">
                  {activeItem.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white p-3 text-xs border border-[#ede0d2] shadow-2xs"
                    >
                      <span className="font-semibold text-[var(--brown-dark)]">
                        {ing.name}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[var(--text-secondary)]">
                          {ing.pct}% ratio
                        </span>
                        <span className="font-mono font-bold text-[var(--brown-deep)] bg-[#faf4ec] px-2 py-0.5 rounded-md border border-[#ebdccb]">
                          {ing.qty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#ebdccb] pt-6">
              <div className="flex items-center gap-2 text-xs text-[#15803d] font-semibold">
                <CheckCircle2 size={16} />
                <span>Inventory automatically deducted upon bake approval</span>
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8f5839] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#784528] transition"
              >
                <span>Add Your Custom Recipes</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
