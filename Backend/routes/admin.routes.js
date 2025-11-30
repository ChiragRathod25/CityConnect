import { Router } from "express";
import {
  getAllUsers,
  getAdminDashboardStats,
allBusinesses,
} from "../controllers/admin.controller.js";

import { verifyJWT,verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.get("/dashboard/stats", getAdminDashboardStats);
router.get("/users", getAllUsers);
router.get("/businesses", allBusinesses);

export default router;
