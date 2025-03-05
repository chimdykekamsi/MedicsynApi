import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import medicationRoutes from "./medication";
import notificationRoutes from "./notification";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/medications", medicationRoutes);
router.use("/notifications", notificationRoutes);

export default router;