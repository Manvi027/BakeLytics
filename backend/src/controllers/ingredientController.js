import Ingredient from "../models/Ingredient.js";
import { emitNotification } from "../config/socket.js";

// @desc    Get all ingredients for authenticated user
// @route   GET /api/ingredients
// @access  Private
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients,
    });
  } catch (error) {
    console.error("[Get Ingredients Error]", error);
    return res.status(500).json({ error: "Failed to fetch ingredients" });
  }
};

// @desc    Create a new ingredient
// @route   POST /api/ingredients
// @access  Private
export const createIngredient = async (req, res) => {
  try {
    const { name, category, amount, unit, threshold, unitCost } = req.body;

    if (!name || amount === undefined) {
      return res.status(400).json({ error: "Ingredient name and amount are required" });
    }

    const ingredient = await Ingredient.create({
      userId: req.user._id,
      name: name.trim(),
      category: category || "Flours",
      amount: Number(amount),
      unit: unit || "kg",
      threshold: Number(threshold) || 5,
      unitCost: Number(unitCost) || 1.0,
    });

    const isLow = ingredient.amount <= ingredient.threshold;

    // Emit live websocket notification
    emitNotification(req.user._id.toString(), {
      type: isLow ? "LOW_STOCK" : "INGREDIENT_ADDED",
      message: isLow
        ? `Alert: Added "${ingredient.name}" with low stock (${ingredient.amount} ${ingredient.unit} <= threshold ${ingredient.threshold} ${ingredient.unit})`
        : `Added new ingredient "${ingredient.name}" (${ingredient.amount} ${ingredient.unit})`,
      ingredient,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: "Ingredient added successfully",
      data: ingredient,
    });
  } catch (error) {
    console.error("[Create Ingredient Error]", error);
    return res.status(500).json({ error: "Failed to create ingredient" });
  }
};

// @desc    Update an ingredient (or adjust stock)
// @route   PUT /api/ingredients/:id
// @access  Private
export const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    const { name, category, amount, unit, threshold, unitCost } = req.body;

    const previousAmount = ingredient.amount;
    if (name !== undefined) ingredient.name = name.trim();
    if (category !== undefined) ingredient.category = category;
    if (amount !== undefined) ingredient.amount = Number(amount);
    if (unit !== undefined) ingredient.unit = unit;
    if (threshold !== undefined) ingredient.threshold = Number(threshold);
    if (unitCost !== undefined) ingredient.unitCost = Number(unitCost);

    await ingredient.save();

    const isLow = ingredient.amount <= ingredient.threshold;

    // Check if it triggered low stock warning or restocked
    let notificationType = "INGREDIENT_UPDATED";
    let notificationMsg = `Updated "${ingredient.name}". Current stock: ${ingredient.amount} ${ingredient.unit}`;

    if (isLow) {
      notificationType = "LOW_STOCK";
      notificationMsg = `Low Stock Alert! "${ingredient.name}" has only ${ingredient.amount} ${ingredient.unit} remaining (Threshold: ${ingredient.threshold} ${ingredient.unit})`;
    } else if (previousAmount <= ingredient.threshold && ingredient.amount > ingredient.threshold) {
      notificationType = "RESTOCKED";
      notificationMsg = `Restocked! "${ingredient.name}" is now at ${ingredient.amount} ${ingredient.unit}`;
    }

    emitNotification(req.user._id.toString(), {
      type: notificationType,
      message: notificationMsg,
      ingredient,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Ingredient updated successfully",
      data: ingredient,
    });
  } catch (error) {
    console.error("[Update Ingredient Error]", error);
    return res.status(500).json({ error: "Failed to update ingredient" });
  }
};

// @desc    Delete an ingredient
// @route   DELETE /api/ingredients/:id
// @access  Private
export const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }

    emitNotification(req.user._id.toString(), {
      type: "INGREDIENT_DELETED",
      message: `Deleted "${ingredient.name}" from inventory`,
      deletedId: req.params.id,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Ingredient deleted successfully",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("[Delete Ingredient Error]", error);
    return res.status(500).json({ error: "Failed to delete ingredient" });
  }
};

// @desc    Batch bake deduction
// @route   POST /api/ingredients/bake-deduct
// @access  Private
export const bakeDeduct = async (req, res) => {
  try {
    const { deductions, recipeName, batchCount } = req.body;
    // deductions: [ { name, amount } ]
    if (!Array.isArray(deductions) || deductions.length === 0) {
      return res.status(400).json({ error: "Deductions array required" });
    }

    const updatedItems = [];
    const lowStockAlerts = [];

    for (const item of deductions) {
      const ingredient = await Ingredient.findOne({
        userId: req.user._id,
        name: { $regex: new RegExp(`^${item.name.trim()}$`, "i") },
      });

      if (ingredient) {
        ingredient.amount = Math.max(0, Math.round((ingredient.amount - item.amount) * 100) / 100);
        await ingredient.save();
        updatedItems.push(ingredient);

        if (ingredient.amount <= ingredient.threshold) {
          lowStockAlerts.push(ingredient);
        }
      }
    }

    // Emit live notifications for deductions & low stock alerts
    if (lowStockAlerts.length > 0) {
      emitNotification(req.user._id.toString(), {
        type: "LOW_STOCK",
        message: `Bake complete (${batchCount}x ${recipeName}), but ${lowStockAlerts.length} item(s) are now low in stock!`,
        lowStockItems: lowStockAlerts,
        timestamp: new Date().toISOString(),
      });
    } else {
      emitNotification(req.user._id.toString(), {
        type: "BAKE_SUCCESS",
        message: `Successfully baked ${batchCount}x ${recipeName}! Ingredients deducted.`,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock deducted successfully",
      data: updatedItems,
      lowStockAlerts,
    });
  } catch (error) {
    console.error("[Bake Deduct Error]", error);
    return res.status(500).json({ error: "Failed to deduct stock for bake" });
  }
};
