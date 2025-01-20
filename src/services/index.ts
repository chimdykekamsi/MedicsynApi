import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;