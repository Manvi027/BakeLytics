import express from "express";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  bakeDeduct,
} from "../controllers/ingredientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All inventory routes require auth

router.route("/")
  .get(getIngredients)
  .post(createIngredient);

router.post("/bake-deduct", bakeDeduct);

router.route("/:id")
  .put(updateIngredient)
  .delete(deleteIngredient);

export default router;
