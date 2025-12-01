import { Router } from "express";
import {
  getAllUsers,
  getAdminDashboardStats,
allBusinesses,
  updateUserStatus,
  getAllBusinessesWithAllDetails,
  updateBusinessStatus,
} from "../controllers/admin.controller.js";

import { verifyJWT,verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(verifyAdmin);

router.get("/dashboard/stats", getAdminDashboardStats);
router.get("/getAllUsers", getAllUsers);
router.get("/businesses", allBusinesses);
router.get("/businesses/details", getAllBusinessesWithAllDetails);
router.put("/user/:userId/status", updateUserStatus);
router.put("/business/:businessId/status", updateBusinessStatus);

export default router;
