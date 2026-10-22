import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChefHat,
  Clock,
  Filter,
  Flame,
  Layers,
  Package,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Check,
  Trash2,
  Scale,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import bakeryImg from "../../assets/bakery_signup.jpg";
import { getCurrentUser, logoutUser, isAuthenticated } from "../../services/authService";

// Clean, simple English default inventory (stored in localStorage)
const DEFAULT_INVENTORY = [
  {
    id: 1,
    name: "All-Purpose Baking Flour",
    category: "Flours",
    amount: 45.0,
    unit: "kg",
    threshold: 15.0,
    unitCost: 1.4,
  },
  {
    id: 2,
    name: "Fresh Dairy Butter",
    category: "Dairy",
    amount: 12.0,
    unit: "kg",
    threshold: 5.0,
    unitCost: 6.5,
  },
  {
    id: 3,
    name: "Baking Chocolate Chips",
    category: "Specialty",
    amount: 8.5,
    unit: "kg",
    threshold: 4.0,
    unitCost: 8.5,
  },
  {
    id: 4,
    name: "Fresh Cow Milk",
    category: "Dairy",
    amount: 24.0,
    unit: "L",
    threshold: 8.0,
    unitCost: 1.2,
  },
  {
    id: 5,
    name: "Granulated White Sugar",
    category: "Sweeteners",
    amount: 18.0,
    unit: "kg",
    threshold: 6.0,
    unitCost: 1.8,
  },
  {
    id: 6,
    name: "Active Dry Yeast",
    category: "Leaven",
    amount: 4.5,
    unit: "kg",
    threshold: 1.5,
    unitCost: 4.0,
  },
  {
    id: 7,
    name: "Farm Fresh Eggs",
    category: "Dairy",
    amount: 120,
    unit: "pcs",
    threshold: 30,
    unitCost: 0.25,
  },
  {
    id: 8,
    name: "Pure Vanilla Extract",
    category: "Specialty",
    amount: 2.5,
    unit: "L",
    threshold: 1.0,
    unitCost: 15.0,
  },
];

// Simple, common English recipes with exact ingredient deduction rules
const RECIPE_DATABASE = {
  bread: {
    id: "bread",
    name: "Fresh White Bread",
    label: "Fresh White Bread 🍞",
    yieldPerBatch: 16, // 16 loaves
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
    yieldPerBatch: 48, // 48 cookies
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
    yieldPerBatch: 8, // 8 cakes
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
    yieldPerBatch: 32, // 32 rolls
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

const DEFAULT_BAKE_SCHEDULE = [
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Prevent leaving dashboard via browser back button while authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (isAuthenticated()) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const updateUserData = () => {
      const user = getCurrentUser();
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        setCurrentUser(user);
      }
    };
    window.addEventListener("authChange", updateUserData);
    window.addEventListener("storage", updateUserData);
    return () => {
      window.removeEventListener("authChange", updateUserData);
      window.removeEventListener("storage", updateUserData);
    };
  }, [navigate]);

  const userName = currentUser?.name || currentUser?.username || "Baker";
  const bakeryName = currentUser?.bakeryName || "Fresh Bakery";
  const userInitial = userName.charAt(0).toUpperCase() || "B";

  // Persistent Live Inventory State
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem("bakelytics_inventory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_INVENTORY;
  });

  // Sync inventory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bakelytics_inventory", JSON.stringify(inventory));
    } catch (e) {
      console.error("Failed to save inventory:", e);
    }
  }, [inventory]);

  // Persistent Today's Bake Schedule
  const [bakeSchedule, setBakeSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem("bakelytics_bake_schedule");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_BAKE_SCHEDULE;
  });

  useEffect(() => {
    try {
      localStorage.setItem("bakelytics_bake_schedule", JSON.stringify(bakeSchedule));
    } catch (e) {
      console.error("Failed to save bake schedule:", e);
    }
  }, [bakeSchedule]);

  // Batch Baking Simulator State
  const [selectedRecipeKey, setSelectedRecipeKey] = useState("bread");
  const [batchCount, setBatchCount] = useState(2);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modals & Feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockModalItem, setRestockModalItem] = useState(null); // item object or null
  const [restockAmountInput, setRestockAmountInput] = useState(10);
  const [deliveryReceived, setDeliveryReceived] = useState(false);

  // New Ingredient Form State
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "Flours",
    amount: "",
    unit: "kg",
    threshold: "",
    unitCost: "",
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  // Recipe calculation & inventory check
  const activeRecipe = RECIPE_DATABASE[selectedRecipeKey];
  const totalBakeUnits = activeRecipe.yieldPerBatch * batchCount;
  const totalGrossRevenue = (totalBakeUnits * activeRecipe.pricePerUnit).toFixed(2);

  // Analyze whether current inventory has enough stock for the selected batch count
  const stockCheck = useMemo(() => {
    const missing = [];
    let isSufficient = true;

    for (const req of activeRecipe.requiredIngredients) {
      const totalRequired = Math.round(req.amountPerBatch * batchCount * 10) / 10;
      const invItem = inventory.find(
        (i) => i.name.toLowerCase() === req.name.toLowerCase()
      );
      const currentAvailable = invItem ? invItem.amount : 0;

      if (currentAvailable < totalRequired) {
        isSufficient = false;
        missing.push({
          name: req.name,
          required: totalRequired,
          available: currentAvailable,
          unit: req.unit,
          shortage: Math.round((totalRequired - currentAvailable) * 10) / 10,
        });
      }
    }

    return { isSufficient, missing };
  }, [activeRecipe, batchCount, inventory]);

  // Core Functional Action: BAKE & DEDUCT STOCK
  const handleBakeAndDeductStock = () => {
    if (!stockCheck.isSufficient) {
      triggerToast(`Cannot bake: Short on ${stockCheck.missing[0].name}!`);
      return;
    }

    // Deduct stock for each required ingredient
    setInventory((prevInventory) => {
      return prevInventory.map((item) => {
        const req = activeRecipe.requiredIngredients.find(
          (r) => r.name.toLowerCase() === item.name.toLowerCase()
        );
        if (req) {
          const deduction = req.amountPerBatch * batchCount;
          const newAmount = Math.max(0, Math.round((item.amount - deduction) * 10) / 10);
          return { ...item, amount: newAmount };
        }
        return item;
      });
    });

    // Add entry to today's bake schedule
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newScheduleEntry = {
      id: `sch_${Date.now()}`,
      time: timeString,
      name: `${activeRecipe.name} (Deck ${Math.floor(Math.random() * 3) + 1})`,
      yields: `${totalBakeUnits} ${activeRecipe.unitName}`,
      status: "In Oven (Freshly Mixed)",
    };

    setBakeSchedule((prev) => [newScheduleEntry, ...prev]);

    triggerToast(
      `Baking ${batchCount}x ${activeRecipe.name}! Deducted ingredients from stock.`
    );
  };

  // Add new ingredient submit handler
  const handleAddIngredientSubmit = (e) => {
    e.preventDefault();
    if (!newIngredient.name.trim() || !newIngredient.amount) {
      triggerToast("Please provide ingredient name and amount.");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newIngredient.name.trim(),
      category: newIngredient.category,
      amount: parseFloat(newIngredient.amount) || 0,
      unit: newIngredient.unit,
      threshold: parseFloat(newIngredient.threshold) || 5.0,
      unitCost: parseFloat(newIngredient.unitCost) || 2.0,
    };

    setInventory((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    setNewIngredient({
      name: "",
      category: "Flours",
      amount: "",
      unit: "kg",
      threshold: "",
      unitCost: "",
    });
    triggerToast(`Added ${newItem.name} to raw materials inventory!`);
  };

  // Restock existing item handler
  const handleApplyRestock = (amountToAdd) => {
    if (!restockModalItem) return;
    const qty = parseFloat(amountToAdd);
    if (isNaN(qty) || qty <= 0) return;

    setInventory((prev) =>
      prev.map((item) =>
        item.id === restockModalItem.id
          ? { ...item, amount: Math.round((item.amount + qty) * 10) / 10 }
          : item
      )
    );

    triggerToast(`Restocked +${qty} ${restockModalItem.unit} of ${restockModalItem.name}!`);
    setRestockModalItem(null);
  };

  // Delete ingredient handler
  const handleDeleteItem = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}" from inventory?`)) {
      setInventory((prev) => prev.filter((i) => i.id !== itemId));
      triggerToast(`Removed ${itemName} from inventory.`);
    }
  };

  // 1-Click wholesale delivery check-in
  const handleReceiveDelivery = () => {
    if (deliveryReceived) {
      triggerToast("Delivery was already checked in!");
      return;
    }

    setInventory((prev) =>
      prev.map((item) => {
        if (item.name.toLowerCase().includes("butter")) {
          return { ...item, amount: Math.round((item.amount + 25.0) * 10) / 10 };
        }
        if (item.name.toLowerCase().includes("milk")) {
          return { ...item, amount: Math.round((item.amount + 20.0) * 10) / 10 };
        }
        return item;
      })
    );

    setDeliveryReceived(true);
    triggerToast("Received +25kg Butter & +20L Milk from City Dairy Co.!");
  };

  // Mark bake task as completed
  const handleToggleScheduleStatus = (taskId) => {
    setBakeSchedule((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "Completed" ? "In Oven" : "Completed",
            }
          : task
      )
    );
  };

  // Reset inventory to default
  const handleResetDefaults = () => {
    if (window.confirm("Reset inventory to factory defaults?")) {
      setInventory(DEFAULT_INVENTORY);
      setBakeSchedule(DEFAULT_BAKE_SCHEDULE);
      setDeliveryReceived(false);
      triggerToast("Reset inventory to standard defaults.");
    }
  };

  // Dynamic calculations for table & metrics
  const enrichedInventory = useMemo(() => {
    return inventory.map((item) => {
      const percentage = Math.min(
        100,
        Math.round((item.amount / (item.threshold * 2.5 || 10)) * 100)
      );
      const isLow = item.amount <= item.threshold;
      return {
        ...item,
        percentage,
        isLow,
        status: isLow ? "Low Stock" : "Optimal",
      };
    });
  }, [inventory]);

  // Real-time Search & Filter
  const filteredInventory = useMemo(() => {
    return enrichedInventory.filter((item) => {
      // Query filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filter
      if (activeFilter === "all") return true;
      if (activeFilter === "low") return item.isLow;
      if (activeFilter === "flours") return item.category.toLowerCase() === "flours";
      if (activeFilter === "dairy") return item.category.toLowerCase() === "dairy";
      if (activeFilter === "sweeteners") return item.category.toLowerCase() === "sweeteners";
      return true;
    });
  }, [enrichedInventory, searchQuery, activeFilter]);

  // Dynamic KPI Metrics
  const totalRawItems = inventory.length;
  const lowStockCount = enrichedInventory.filter((i) => i.isLow).length;
  const totalBakesPossible = useMemo(() => {
    // Check maximum loaves of bread possible with current flour
    const flourItem = inventory.find((i) => i.name.toLowerCase().includes("flour"));
    return flourItem ? Math.floor(flourItem.amount / 0.35) : 0;
  }, [inventory]);

  return (
    <div className="relative min-h-screen bg-[#f8f1e7] text-[var(--text-primary)]">
      {/* Toast Notification */}
      {showToast && (
        <div className="auth-check-pop fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#251308] px-5 py-3 text-white shadow-2xl backdrop-blur-md">
          <Sparkles size={18} className="text-[#f59e0b] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#e8d9c7] bg-[#fffaf3]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand & Active Kitchen */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ead9c3] text-lg shadow-sm">
                🧁
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[var(--brown-dark)]">
                BakeLytics
              </span>
            </Link>

            <span className="h-5 w-px bg-[#e0d0bf]" />

            <div className="flex items-center gap-2 rounded-full border border-[#e5d6c4] bg-[#fbf5ec] px-3 py-1 text-xs font-semibold text-[var(--brown-dark)]">
              <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span>{bakeryName}</span>
              <span className="hidden sm:inline text-[#a49080] font-normal">• Active</span>
            </div>
          </div>

          {/* Search, Notifications & Profile */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a8907e]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search raw ingredients, flours..."
                className="h-9 w-64 rounded-xl border border-[#e8d9c7] bg-[#fdfbf8] pl-9 pr-3 text-xs outline-none transition focus:border-[var(--brown)] focus:bg-white focus:ring-2 focus:ring-[#8f5839]/10"
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

            <button
              type="button"
              onClick={() =>
                triggerToast(
                  lowStockCount > 0
                    ? `${lowStockCount} low-stock alerts detected!`
                    : "All inventory items are well-stocked!"
                )
              }
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8d9c7] bg-[#fffaf3] text-[var(--brown-dark)] transition hover:bg-[#ead9c3]"
              title="Notifications"
            >
              <Bell size={17} />
              {lowStockCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">
                  {lowStockCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#e8d9c7]">
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
                <p className="text-xs font-bold leading-tight text-[var(--brown-dark)]">
                  {userName}
                </p>
                <p className="text-[10px] text-[#8e7a6d]">
                  Head Baker
                  {currentUser?.authProvider && currentUser.authProvider !== "local" && (
                    <span className="capitalize font-medium text-[#8f5839]">
                      {" "}
                      • {currentUser.authProvider}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 cursor-pointer rounded-xl bg-[#ead9c3]/70 px-3 py-1.5 text-xs font-semibold text-[var(--brown-dark)] transition hover:bg-[#ead9c3]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome & Shift Overview Banner */}
        <div className="auth-modal-card relative overflow-hidden rounded-[28px] border border-[#e8d9c7] bg-gradient-to-r from-[#59341f] via-[#754429] to-[#8f5839] p-7 text-white shadow-xl lg:p-9">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Flame size={13} className="text-[#f59e0b] animate-pulse" />
                <span>{bakeryName} • Morning Production Shift</span>
              </div>

              <h1 className="mt-3 font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome to the kitchen, {userName}! 🧁
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-white/80 leading-relaxed">
                Your current pantry flour & butter has sufficient capacity for{" "}
                <span className="font-bold text-[#fde047]">{totalBakesPossible} loaves of bread</span>.
                {lowStockCount > 0 ? (
                  <span className="text-[#fca5a5] font-semibold">
                    {" "}
                    Attention: {lowStockCount} items need restocking.
                  </span>
                ) : (
                  " All stocks are in optimal condition."
                )}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#623a23] shadow-md transition hover:bg-[#fff7ee] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>+ Add Ingredient</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="flex items-center gap-2 rounded-xl bg-white/20 px-3.5 py-2.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20 transition hover:bg-white/30 cursor-pointer"
                title="Reset to default items"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 DYNAMIC SUMMARY KPI CARDS */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            icon={<Package size={20} />}
            value={`${totalRawItems} Items`}
            label="Raw Materials in Stock"
            trend={lowStockCount === 0 ? "All Stocked" : `${lowStockCount} Low`}
            status={lowStockCount === 0 ? "healthy" : "warning"}
          />
          <MetricCard
            icon={<ChefHat size={20} />}
            value={`${totalBakesPossible} Units`}
            label="Can Bake Today"
            trend="Live Capacity"
            status="healthy"
          />
          <MetricCard
            icon={<AlertTriangle size={20} />}
            value={`${lowStockCount} Alerts`}
            label="Low Stock Items"
            trend={lowStockCount > 0 ? "Needs Restock" : "Optimal"}
            status={lowStockCount > 0 ? "warning" : "healthy"}
          />
          <MetricCard
            icon={<BarChart3 size={20} />}
            value={`$${(totalBakesPossible * 4.5).toLocaleString()}`}
            label="Potential Day Revenue"
            trend="At full yield"
            status="healthy"
          />
        </div>

        {/* TWO-COLUMN PRODUCTION & INVENTORY WORKSPACE */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT: Dynamic Production Yield Simulator & Inventory Table */}
          <div className="space-y-6">
            {/* 1. INTERACTIVE PRODUCTION CALCULATOR & LIVE BAKE BUTTON */}
            <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-[#ebdccd] pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[var(--brown-dark)]">
                    Interactive Production Calculator
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Select a recipe, choose batch count, and bake to automatically deduct stock.
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
                      <span>All ingredients are available in stock • Ready to bake!</span>
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

            {/* 2. RAW MATERIAL INVENTORY TABLE WITH SEARCH & REAL-TIME FILTERS */}
            <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm sm:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-[#ebdccd] pb-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-serif text-xl font-bold text-[var(--brown-dark)]">
                    Raw Material Inventory
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Live pantry weights, threshold monitors, and quick restock actions.
                  </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: "All" },
                    { id: "low", label: "Low Stock" },
                    { id: "flours", label: "Flours" },
                    { id: "dairy", label: "Dairy" },
                    { id: "sweeteners", label: "Sweeteners" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition cursor-pointer ${
                        activeFilter === tab.id
                          ? "bg-[var(--brown)] text-white shadow-xs"
                          : "bg-[#f3e7dc] text-[var(--brown-dark)] hover:bg-[#ebd8c8]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar Mobile / Secondary */}
              <div className="mt-4 md:hidden">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ingredients..."
                    className="w-full rounded-xl border border-[#e8d9c7] bg-white py-2 pl-9 pr-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Table List */}
              <div className="mt-4 divide-y divide-[#eee0d3]">
                {filteredInventory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No ingredients match the search or filter.
                  </div>
                ) : (
                  filteredInventory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 transition hover:bg-[#fbf4eb] px-2 rounded-xl"
                    >
                      {/* Name & Category */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[var(--brown-dark)] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)]">
                          {item.category} • Cost: ${item.unitCost.toFixed(2)}/{item.unit} • Alert at{" "}
                          {item.threshold} {item.unit}
                        </p>
                      </div>

                      {/* Stock Level Progress */}
                      <div className="flex items-center gap-4 ml-3">
                        <div className="w-24 text-right">
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
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            item.isLow
                              ? "bg-[#fee2e2] text-[#dc2626]"
                              : "bg-[#dcfce7] text-[#15803d]"
                          }`}
                        >
                          {item.status}
                        </span>

                        {/* Fast Restock Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setRestockModalItem(item);
                            setRestockAmountInput(10);
                          }}
                          className="rounded-lg bg-[#faeedd] px-2 py-1 text-xs font-semibold text-[#8f5839] hover:bg-[#ebdccb] transition cursor-pointer"
                          title="Restock this ingredient"
                        >
                          + Restock
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete ingredient"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Photography, Baking Schedule & Deliveries */}
          <div className="space-y-6">
            {/* Visual Photography Card */}
            <div className="relative overflow-hidden rounded-[28px] border border-[#e8d9c7] bg-[#1a0e07] shadow-lg">
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={bakeryImg}
                  alt="Freshly baked artisan goods"
                  className="auth-kenburns h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold backdrop-blur-md border border-white/20">
                    🍞 Fresh Daily Oven Production
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-bold">
                    "Know every gram. Bake with certainty."
                  </h3>
                  <p className="mt-1 text-xs text-white/75">
                    Zero flour wastage. Guaranteed batch cost profitability.
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Bake Schedule with Interactive Complete Checkmark */}
            <div className="rounded-[28px] border border-[#e8d9c7] bg-[#fffaf3] p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-[#ebdccd] pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--brown-dark)]">
                    Today's Bake Schedule
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Click checkmark to mark bakes as completed.
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#16a34a]">
                  <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
                  Decks Fired
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {bakeSchedule.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between rounded-xl bg-[#fffdfa] p-3 border border-[#f0e4d7] text-xs transition hover:bg-[#fff9f2]"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleScheduleStatus(row.id)}
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

            {/* Scheduled Restock Deliveries Card with 1-Click Receive Action */}
            <div className="rounded-[28px] border border-[#e8d9c7] bg-gradient-to-br from-[#fdf8f2] to-[#f4e9dd] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ead9c3] text-[var(--brown)] text-xl">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--brown-dark)]">
                      Scheduled Restock Deliveries
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)]">
                      City Dairy Co. • Fresh Morning Drop
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReceiveDelivery}
                  disabled={deliveryReceived}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                    deliveryReceived
                      ? "bg-green-100 text-green-800 cursor-default"
                      : "bg-[#8f5839] text-white hover:bg-[#724024] shadow-xs active:scale-95"
                  }`}
                >
                  {deliveryReceived ? "✓ Stocked" : "Receive Stock"}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-3 border border-[#e6d8c8] text-xs">
                <span className="font-semibold text-[var(--brown-dark)]">
                  Order #BL-8924: 25 kg Butter & 20 L Fresh Milk
                </span>
                <span
                  className={`font-bold ${
                    deliveryReceived ? "text-[#16a34a]" : "text-[#b45309]"
                  }`}
                >
                  {deliveryReceived ? "Received & Added" : "Awaiting Check-in"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: + ADD INGREDIENT */}
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

            <form onSubmit={handleAddIngredientSubmit} className="mt-4 space-y-3.5">
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
                  className="w-1/2 rounded-xl bg-gradient-to-r from-[#8f5839] to-[#713f24] py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: + RESTOCK INGREDIENT */}
      {restockModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-[380px] rounded-2xl border border-[#ebd8c4] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2d180c]">
                Restock {restockModalItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setRestockModalItem(null)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-600">
                Current Stock:{" "}
                <strong className="text-black">
                  {restockModalItem.amount} {restockModalItem.unit}
                </strong>
              </p>

              {/* Quick Presets */}
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Quick Presets:
              </p>
              <div className="mt-1.5 grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleApplyRestock(preset)}
                    className="rounded-xl border border-gray-200 bg-[#faf6f0] py-2 text-xs font-bold text-[#8f5839] hover:bg-[#8f5839] hover:text-white transition cursor-pointer"
                  >
                    +{preset} {restockModalItem.unit}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Or Custom Restock Amount ({restockModalItem.unit}):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={restockAmountInput}
                    onChange={(e) => setRestockAmountInput(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs outline-none focus:border-[#8f5839]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyRestock(restockAmountInput)}
                    className="rounded-xl bg-[#8f5839] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#724024] cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, value, label, trend, status }) {
  return (
    <div className="group rounded-[24px] border border-[#e8d9c7] bg-[#fffaf3] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ead9c3] text-[var(--brown)] transition duration-300 group-hover:scale-110">
          {icon}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            status === "warning"
              ? "bg-[#fee2e2] text-[#dc2626]"
              : "bg-[#dcfce7] text-[#15803d]"
          }`}
        >
          {trend}
        </span>
      </div>

      <p className="mt-4 font-serif text-2xl font-bold tracking-tight text-[var(--brown-dark)]">
        {value}
      </p>
      <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">{label}</p>
    </div>
  );
}