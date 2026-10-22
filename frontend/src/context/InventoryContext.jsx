import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchIngredients,
  addIngredientApi,
  updateIngredientApi,
  deleteIngredientApi,
  bakeDeductApi,
} from "../services/inventoryService";
import { getSocket, joinUserSocketRoom } from "../services/socketService";
import { getCurrentUser } from "../services/authService";


const InventoryContext = createContext(null);

export function InventoryProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadAlertCount, setUnreadAlertCount] = useState(0);

  // Sync current user
  useEffect(() => {
    const handleAuthChange = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // Fetch inventory from Backend / Isolated local user key
  const loadInventory = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      setInventory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchIngredients();
      if (Array.isArray(data)) {
        setInventory(data);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.warn("Could not fetch inventory from backend:", err);
      // Fallback: Check user-scoped local storage
      const userStorageKey = `bakelytics_inventory_${user.id || user.username}`;
      const saved = localStorage.getItem(userStorageKey);
      setInventory(saved ? JSON.parse(saved) : []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On user change or mount, fetch inventory
  useEffect(() => {
    loadInventory();
  }, [loadInventory, currentUser?.id]);

  // Save to user-specific localStorage cache whenever inventory updates
  useEffect(() => {
    if (currentUser?.id || currentUser?.username) {
      const userStorageKey = `bakelytics_inventory_${currentUser.id || currentUser.username}`;
      localStorage.setItem(userStorageKey, JSON.stringify(inventory));
    }
  }, [inventory, currentUser]);

  // WebSockets real-time notification listener
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    const socket = getSocket();
    if (user.id) {
      joinUserSocketRoom(user.id);
    }

    const handleNotification = (notif) => {
      console.log("[WebSocket Event Received]", notif);
      setNotifications((prev) => [
        { id: Date.now() + Math.random(), ...notif, read: false },
        ...prev.slice(0, 20),
      ]);
      setUnreadAlertCount((c) => c + 1);

      // Trigger custom UI toast if needed
      window.dispatchEvent(
        new CustomEvent("bakelyticsToast", {
          detail: {
            message: notif.message,
            type: notif.type,
          },
        })
      );
    };

    const handleInventoryUpdate = () => {
      // Re-fetch to guarantee live consistency across tabs/devices
      loadInventory();
    };

    socket.on("notification", handleNotification);
    socket.on("inventoryUpdate", handleInventoryUpdate);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("inventoryUpdate", handleInventoryUpdate);
    };
  }, [currentUser?.id, loadInventory]);

  // Actions
  const addIngredient = async (ingredientData) => {
    try {
      const created = await addIngredientApi(ingredientData);
      setInventory((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      // Offline fallback
      const user = getCurrentUser();
      const newLocal = {
        _id: "local_" + Date.now(),
        userId: user?.id,
        name: ingredientData.name.trim(),
        category: ingredientData.category || "Flours",
        amount: Number(ingredientData.amount) || 0,
        unit: ingredientData.unit || "kg",
        threshold: Number(ingredientData.threshold) || 5,
        unitCost: Number(ingredientData.unitCost) || 1.0,
      };
      setInventory((prev) => [newLocal, ...prev]);
      return newLocal;
    }
  };

  const updateIngredient = async (id, updatedFields) => {
    try {
      const updated = await updateIngredientApi(id, updatedFields);
      setInventory((prev) =>
        prev.map((item) => ((item._id === id || item.id === id) ? updated : item))
      );
      return updated;
    } catch (error) {
      // Local fallback
      setInventory((prev) =>
        prev.map((item) =>
          (item._id === id || item.id === id) ? { ...item, ...updatedFields } : item
        )
      );
    }
  };

  const deleteIngredient = async (id) => {
    try {
      await deleteIngredientApi(id);
      setInventory((prev) => prev.filter((item) => item._id !== id && item.id !== id));
    } catch (error) {
      setInventory((prev) => prev.filter((item) => item._id !== id && item.id !== id));
    }
  };

  const bakeAndDeduct = async ({ deductions, recipeName, batchCount }) => {
    try {
      await bakeDeductApi({ deductions, recipeName, batchCount });
      await loadInventory();
    } catch (error) {
      // Local deduction fallback
      setInventory((prev) =>
        prev.map((item) => {
          const match = deductions.find(
            (d) => d.name.toLowerCase() === item.name.toLowerCase()
          );
          if (match) {
            return {
              ...item,
              amount: Math.max(0, Math.round((item.amount - match.amount) * 10) / 10),
            };
          }
          return item;
        })
      );
    }
  };

  const clearUnreadAlerts = () => {
    setUnreadAlertCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        isLoading,
        notifications,
        unreadAlertCount,
        loadInventory,
        addIngredient,
        updateIngredient,
        deleteIngredient,
        bakeAndDeduct,
        clearUnreadAlerts,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
