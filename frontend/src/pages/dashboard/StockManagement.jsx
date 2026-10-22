import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Check,
  Truck,
  Sparkles,
} from "lucide-react";
import bakerySignupImg from "../../assets/bakery_signup.jpg";
import { useInventory } from "../../context/InventoryContext";

const RECIPE_DATABASE = {
  bread: {
    id: "bread",
    name: "Fresh White Bread",
    label: "Fresh White Bread 🍞",
    yieldPerBatch: 16,
    unitName: "loaves",
    pricePerUnit: 4.5,
    bakingTime: "30 min @ 210°C",
    margin: "81%",
    requiredIngredients: [
      { name: "All-Purpose Baking Flour", amountPerBatch: 4.0, unit: "kg" },
      { name: "Fresh Dairy Butter", amountPerBatch: 0.5, unit: "kg" },
      { name: "Fresh Cow Milk", amountPerBatch: 2.0, unit: "L" },
      { name: "Active Dry Yeast", amountPerBatch: 0.1, unit: "kg" },
      { name: "Granulated White Sugar", amountPerBatch: 0.2, unit: "kg" },
    ],
  },
  cookies: {
    id: "cookies",
    name: "Crispy Butter Cookies",
    label: "Butter Cookies 🍪",
    yieldPerBatch: 48,
    unitName: "cookies",
    pricePerUnit: 1.5,
    bakingTime: "15 min @ 180°C",
    margin: "79%",
    requiredIngredients: [
      { name: "All-Purpose Baking Flour", amountPerBatch: 2.0, unit: "kg" },
      { name: "Fresh Dairy Butter", amountPerBatch: 1.5, unit: "kg" },
      { name: "Granulated White Sugar", amountPerBatch: 1.0, unit: "kg" },
      { name: "Farm Fresh Eggs", amountPerBatch: 4, unit: "pcs" },
    ],
  },
  cake: {
    id: "cake",
    name: "Rich Chocolate Cake",
    label: "Chocolate Cake 🎂",
    yieldPerBatch: 8,
    unitName: "cakes",
    pricePerUnit: 15.0,
    bakingTime: "35 min @ 175°C",
    margin: "77%",
    requiredIngredients: [
      { name: "All-Purpose Baking Flour", amountPerBatch: 2.5, unit: "kg" },
      { name: "Fresh Dairy Butter", amountPerBatch: 1.0, unit: "kg" },
      { name: "Baking Chocolate Chips", amountPerBatch: 1.2, unit: "kg" },
      { name: "Granulated White Sugar", amountPerBatch: 1.5, unit: "kg" },
      { name: "Farm Fresh Eggs", amountPerBatch: 12, unit: "pcs" },
    ],
  },
  rolls: {
    id: "rolls",
    name: "Soft Dinner Rolls",
    label: "Dinner Rolls 🥖",
    yieldPerBatch: 32,
    unitName: "rolls",
    pricePerUnit: 1.0,
    bakingTime: "20 min @ 190°C",
    margin: "84%",
    requiredIngredients: [
      { name: "All-Purpose Baking Flour", amountPerBatch: 3.0, unit: "kg" },
      { name: "Fresh Dairy Butter", amountPerBatch: 0.8, unit: "kg" },
      { name: "Fresh Cow Milk", amountPerBatch: 1.5, unit: "L" },
      { name: "Active Dry Yeast", amountPerBatch: 0.1, unit: "kg" },
    ],
  },
};

const INITIAL_SCHEDULE = [
  {
    id: "sch_1",
    time: "06:30 AM",
    name: "Fresh White Bread (Deck 1)",
    yields: "32 loaves",
    status: "Completed",
  },
  {
    id: "sch_2",
    time: "08:15 AM",
    name: "Crispy Butter Cookies",
    yields: "96 cookies",
    status: "In Oven (12 min left)",
  },
  {
    id: "sch_3",
    time: "11:30 AM",
    name: "Soft Dinner Rolls",
    yields: "64 rolls",
    status: "Proofing",
  },
  {
    id: "sch_4",
    time: "02:00 PM",
    name: "Rich Chocolate Cakes",
    yields: "16 cakes",
    status: "Scheduled",
  },
];

export default function StockManagement() {
  const { inventory, bakeAndDeduct, isLoading } = useInventory();

  // Batch Baking Simulator State
  const [selectedRecipeKey, setSelectedRecipeKey] = useState("bread");
  const [batchCount, setBatchCount] = useState(2);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [deliveryReceived, setDeliveryReceived] = useState(false);

  const activeRecipe = RECIPE_DATABASE[selectedRecipeKey];
  const totalBakeUnits = activeRecipe.yieldPerBatch * batchCount;
  const totalGrossRevenue = (totalBakeUnits * activeRecipe.pricePerUnit).toFixed(2);

  // Check whether current user inventory has enough stock for the selected recipe
  const stockCheck = useMemo(() => {
    const missing = [];
    let isSufficient = true;

    for (const req of activeRecipe.requiredIngredients) {
      const totalRequired = Math.round(req.amountPerBatch * batchCount * 10) / 10;
      const invItem = inventory.find(
        (i) => i.name.toLowerCase() === req.name.toLowerCase()
      );

      if (!invItem || invItem.amount < totalRequired) {
        isSufficient = false;
        const currentHave = invItem ? invItem.amount : 0;
        const shortage = Math.round((totalRequired - currentHave) * 10) / 10;
        missing.push({
          name: req.name,
          unit: req.unit,
          required: totalRequired,
          current: currentHave,
          shortage,
        });
      }
    }

    return { isSufficient, missing };
  }, [activeRecipe, batchCount, inventory]);

  const handleBakeAndDeductStock = async () => {
    if (!stockCheck.isSufficient) return;

    const deductions = activeRecipe.requiredIngredients.map((req) => ({
      name: req.name,
      amount: Math.round(req.amountPerBatch * batchCount * 10) / 10,
    }));

    await bakeAndDeduct({
      deductions,
      recipeName: activeRecipe.name,
      batchCount,
    });
  };

  const handleToggleSchedule = (id) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Completed" ? "In Oven" : "Completed",
            }
          : item
      )
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8d9c7] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            Inventory Stock Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Simulate production batches, trigger automated stock deductions, and track daily oven schedules.
          </p>
        </div>

        <Link
          to="/dashboard/ingredients-update"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#713f24] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add / Update Ingredients</span>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT COLUMN: Production Simulator */}
        <div className="space-y-6">
          <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between border-b border-[#ebdccd] pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[var(--brown-dark)]">
                  Interactive Production Calculator
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Select a recipe, choose batch count, and bake to deduct live inventory stock.
                </p>
              </div>
              <span className="rounded-full bg-[#ead9c3] px-3 py-1 text-[11px] font-bold text-[var(--brown)]">
                Live Stock Engine
              </span>
            </div>

            {/* Recipe Selector Pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.values(RECIPE_DATABASE).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRecipeKey(item.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    selectedRecipeKey === item.id
                      ? "bg-[var(--brown)] text-white shadow-md scale-105"
                      : "bg-[#f4e8dc] text-[var(--brown-dark)] hover:bg-[#ead8c7]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Simulation Result Box */}
            <div className="mt-5 rounded-2xl border border-[#dfcfbe] bg-[#fbf5ec] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9f775d]">
                    Planned Production
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[var(--brown-dark)]">
                    {totalBakeUnits} {activeRecipe.unitName} of {activeRecipe.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Baking profile: {activeRecipe.bakingTime} • Yield per batch:{" "}
                    {activeRecipe.yieldPerBatch} {activeRecipe.unitName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--text-secondary)]">Projected Revenue</p>
                  <p className="font-serif text-2xl font-bold text-[#16a34a]">
                    ${totalGrossRevenue}
                  </p>
                  <span className="text-[10px] font-semibold text-[var(--brown-light)]">
                    Gross Margin: {activeRecipe.margin}
                  </span>
                </div>
              </div>

              {/* Batch Slider */}
              <div className="mt-5 border-t border-[#ead9c7] pt-4">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--brown-dark)]">
                  <span className="font-bold">Target Batches: {batchCount}x</span>
                  <span className="text-gray-500">Scale: 1x to 6x batches</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={batchCount}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer accent-[var(--brown)]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  <span>1 batch</span>
                  <span>2 batches</span>
                  <span>3 batches</span>
                  <span>4 batches</span>
                  <span>5 batches</span>
                  <span>6 batches</span>
                </div>
              </div>

              {/* Ingredients Required Breakdown */}
              <div className="mt-4 rounded-xl bg-white p-3.5 border border-[#e8d7c4]">
                <p className="text-[11px] font-bold text-[var(--brown-dark)] uppercase tracking-wider mb-2">
                  Ingredients Required for {batchCount}x Batches:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {activeRecipe.requiredIngredients.map((req, idx) => {
                    const totalNeeded = Math.round(req.amountPerBatch * batchCount * 10) / 10;
                    const invItem = inventory.find(
                      (i) => i.name.toLowerCase() === req.name.toLowerCase()
                    );
                    const hasEnough = invItem && invItem.amount >= totalNeeded;
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg p-2 border ${
                          hasEnough
                            ? "bg-[#faf7f2] border-gray-200"
                            : "bg-red-50 border-red-200 text-red-900"
                        }`}
                      >
                        <span className="font-semibold block truncate">{req.name}</span>
                        <span className="text-[11px] text-gray-600">
                          Need: <strong>{totalNeeded} {req.unit}</strong>
                        </span>
                        <span
                          className={`block text-[10px] font-semibold mt-0.5 ${
                            hasEnough ? "text-green-700" : "text-red-600"
                          }`}
                        >
                          In Stock: {invItem ? invItem.amount : 0} {req.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stock Check Status & Deduct Button */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {stockCheck.isSufficient ? (
                  <div className="flex items-center gap-2 text-xs text-green-700 font-semibold">
                    <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                    <span>All ingredients available • Ready to bake!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
                    <AlertTriangle size={18} className="text-red-600 shrink-0" />
                    <span>
                      Shortage: Need +{stockCheck.missing[0].shortage}{" "}
                      {stockCheck.missing[0].unit} of {stockCheck.missing[0].name}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBakeAndDeductStock}
                  disabled={!stockCheck.isSufficient}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer ${
                    stockCheck.isSufficient
                      ? "bg-gradient-to-r from-[#8f5839] to-[#713f24] hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <Flame size={15} />
                  <span>Bake & Deduct Stock</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Oven schedule & daily operations */}
        <div className="space-y-6">
          {/* Visual Photography Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#e8d9c7] bg-[#1a0e07] shadow-lg">
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={bakerySignupImg}
                alt="Fresh artisan bread deck"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold backdrop-blur-md border border-white/20">
                  🍞 Deck Production
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold">
                  Live Stock Sync & Zero Waste
                </h3>
                <p className="mt-1 text-xs text-white/75">
                  Ingredients are calculated in real time against every baked batch.
                </p>
              </div>
            </div>
          </div>

          {/* Today's Bake Schedule */}
          <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ebdccd] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--brown-dark)]">
                  Today's Bake Schedule
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Click checkmark to toggle batch completion status.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                Active
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {schedule.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded-xl bg-[#fffdfa] p-3 border border-[#f0e4d7] text-xs transition hover:bg-[#fff9f2]"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleSchedule(row.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-lg border transition cursor-pointer ${
                        row.status === "Completed"
                          ? "bg-[#16a34a] border-[#16a34a] text-white"
                          : "border-gray-300 hover:border-[#8f5839] text-transparent hover:text-gray-400"
                      }`}
                      title="Toggle status"
                    >
                      <Check size={14} />
                    </button>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[var(--brown-light)]">
                        {row.time}
                      </span>
                      <p className="font-semibold text-[var(--brown-dark)]">{row.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--text-secondary)]">
                      {row.yields}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        row.status === "Completed"
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : row.status.includes("In Oven")
                          ? "bg-[#fef3c7] text-[#b45309]"
                          : "bg-[#f3e7dc] text-[var(--brown)]"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
