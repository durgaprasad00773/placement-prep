import express from "express";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.use(authMiddleware);
router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/change-password", changePassword);

export default router;