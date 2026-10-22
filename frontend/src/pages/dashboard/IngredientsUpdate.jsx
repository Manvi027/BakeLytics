import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  Trash2,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { useInventory } from "../../context/InventoryContext";

export default function IngredientsUpdate() {
  const {
    inventory,
    isLoading,
    addIngredient,
    updateIngredient,
    deleteIngredient,
  } = useInventory();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "Flours",
    amount: "",
    unit: "kg",
    threshold: "",
    unitCost: "",
  });

  // Calculate percentage and status for each item
  const enrichedInventory = inventory.map((item) => {
    const threshold = item.threshold || 5;
    const isLow = item.amount <= threshold;
    const safeMax = Math.max(threshold * 3, item.amount * 1.2, 20);
    const percentage = Math.min(100, Math.round((item.amount / safeMax) * 100));

    return {
      ...item,
      id: item._id || item.id,
      threshold,
      unitCost: item.unitCost || 1.0,
      isLow,
      percentage,
      status: isLow ? "Low Stock" : "Well Stocked",
    };
  });

  const filteredInventory = enrichedInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    if (activeFilter === "low") return item.isLow;
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newIngredient.name.trim() || newIngredient.amount === "") return;

    setIsSubmitting(true);
    try {
      await addIngredient({
        name: newIngredient.name.trim(),
        category: newIngredient.category,
        amount: Number(newIngredient.amount),
        unit: newIngredient.unit,
        threshold: newIngredient.threshold ? Number(newIngredient.threshold) : 5,
        unitCost: newIngredient.unitCost ? Number(newIngredient.unitCost) : 1.5,
      });

      setNewIngredient({
        name: "",
        category: "Flours",
        amount: "",
        unit: "kg",
        threshold: "",
        unitCost: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add ingredient:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockItem) return;

    setIsSubmitting(true);
    try {
      const newTotal =
        Math.round((restockItem.amount + Number(restockAmount)) * 100) / 100;
      await updateIngredient(restockItem.id, {
        amount: newTotal,
      });
      setRestockItem(null);
    } catch (err) {
      console.error("Failed to restock:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from pantry?`)) {
      await deleteIngredient(id);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* HEADER SECTION WITH SINGLE '+' BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e8d9c7] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--brown-dark)]">
            Ingredients Update & Pantry Stock
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Add new raw ingredients, adjust safety thresholds, and restock warehouse items with live updates.
          </p>
        </div>

        {/* Removed duplicate plus sign: ONLY ONE PLUS SIGN */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#713f24] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Ingredient</span>
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[#e8d9c7] bg-[#fffaf3] p-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, flours, dairy..."
            className="w-full rounded-xl border border-[#e8d9c7] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#8f5839]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Items" },
            { id: "low", label: "Low Stock Alert" },
            { id: "flours", label: "Flours" },
            { id: "dairy", label: "Dairy" },
            { id: "sweeteners", label: "Sweeteners" },
            { id: "specialty", label: "Specialty" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[var(--brown)] text-white shadow-xs"
                  : "bg-[#f4e8dc] text-[var(--brown-dark)] hover:bg-[#ead7c6]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* INGREDIENTS TABLE LIST */}
      <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#ebdccd] pb-3">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#8f5839]" />
            <h2 className="font-serif text-lg font-bold text-[var(--brown-dark)]">
              Pantry Raw Inventory ({filteredInventory.length})
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">
            Real-time Database Synced
          </span>
        </div>

        <div className="mt-4 divide-y divide-[#eee0d3]">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-gray-500">
              Loading pantry ingredients...
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              {inventory.length === 0
                ? "No ingredients found. Click '+ Add Ingredient' above to get started!"
                : "No ingredients match your current search / filter criteria."}
            </div>
          ) : (
            filteredInventory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 transition hover:bg-[#fbf4eb] px-3 rounded-xl gap-3 sm:gap-0"
              >
                {/* Item Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[var(--brown-dark)] truncate">
                      {item.name}
                    </p>
                    <span className="rounded-md bg-[#f3e7dc] px-2 py-0.5 text-[10px] font-semibold text-[var(--brown)]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Unit Cost: ${item.unitCost.toFixed(2)}/{item.unit} • Threshold Alert:{" "}
                    <strong>
                      {item.threshold} {item.unit}
                    </strong>
                  </p>
                </div>

                {/* Stock Level Bar & Actions */}
                <div className="flex items-center gap-4">
                  <div className="w-28 text-right">
                    <span className="text-sm font-bold text-[var(--brown-dark)] font-mono">
                      {item.amount} {item.unit}
                    </span>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#ebdcd0]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.isLow ? "bg-[#ef4444]" : "bg-[#16a34a]"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
                      item.isLow
                        ? "bg-[#fee2e2] text-[#dc2626]"
                        : "bg-[#dcfce7] text-[#15803d]"
                    }`}
                  >
                    {item.status}
                  </span>

                  {/* Restock Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setRestockItem(item);
                      setRestockAmount(10);
                    }}
                    className="rounded-lg bg-[#faeedd] px-2.5 py-1.5 text-xs font-semibold text-[#8f5839] hover:bg-[#ebdccb] transition cursor-pointer"
                    title="Restock this ingredient"
                  >
                    + Restock
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete ingredient"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: ADD INGREDIENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-[440px] rounded-2xl border border-[#ebd8c4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#8f5839]" />
                <h3 className="font-serif text-lg font-bold text-[#2d180c]">
                  Add Raw Ingredient
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                  placeholder="e.g. Cocoa Powder"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839] focus:ring-2 focus:ring-[#8f5839]/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newIngredient.category}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#8f5839]"
                  >
                    <option value="Flours">Flours</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Sweeteners">Sweeteners</option>
                    <option value="Specialty">Specialty</option>
                    <option value="Leaven">Leaven</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, unit: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#8f5839]"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="L">L (Liters)</option>
                    <option value="pcs">pcs (Pieces)</option>
                    <option value="g">g (Grams)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Current Amount *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newIngredient.amount}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, amount: e.target.value })
                    }
                    placeholder="e.g. 15.0"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alert Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newIngredient.threshold}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, threshold: e.target.value })
                    }
                    placeholder="e.g. 5.0"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Unit Cost ($ / unit)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={newIngredient.unitCost}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, unitCost: e.target.value })
                  }
                  placeholder="e.g. 3.50"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839]"
                />
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 rounded-xl border border-gray-300 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#713f24] py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Ingredient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESTOCK INGREDIENT */}
      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-[380px] rounded-2xl border border-[#ebd8c4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2d180c]">
                Restock {restockItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setRestockItem(null)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl bg-[#fbf5ec] p-3 text-xs">
                <p className="text-gray-600">
                  Current In Stock:{" "}
                  <strong className="text-[var(--brown-dark)]">
                    {restockItem.amount} {restockItem.unit}
                  </strong>
                </p>
                <p className="text-gray-600 mt-1">
                  Threshold Alert:{" "}
                  <strong>
                    {restockItem.threshold} {restockItem.unit}
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Add Quantity ({restockItem.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839]"
                />
              </div>

              <div className="flex gap-2">
                {[5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockAmount(amt)}
                    className="flex-1 rounded-lg bg-gray-100 py-1 text-[11px] font-semibold text-gray-700 hover:bg-[#ead9c3] transition"
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="w-1/2 rounded-xl border border-gray-300 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#713f24] py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  {isSubmitting ? "Restocking..." : "Confirm Restock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
