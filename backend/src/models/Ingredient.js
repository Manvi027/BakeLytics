import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Ingredient name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Flours",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      default: "kg",
    },
    threshold: {
      type: Number,
      required: [true, "Threshold is required"],
      default: 5,
      min: 0,
    },
    unitCost: {
      type: Number,
      required: [true, "Unit cost is required"],
      default: 1.0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user doesn't duplicate the same ingredient name accidentally
ingredientSchema.index({ userId: 1, name: 1 });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;
