import express from "express";
import { register, login, getMe, socialLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/signup", register); // Alias for convenience
router.post("/login", login);
router.post("/social", socialLogin);
router.post("/oauth", socialLogin);
router.get("/me", protect, getMe);

export default router;
