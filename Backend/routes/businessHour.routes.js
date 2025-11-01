import { Router } from "express";

const router = Router();

import {
  addBusinessHours,
  getBusinessHours,
  updateBusinessHours,
  deleteBusinessHours,
} from "../controllers/businessHour.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.use(verifyJWT);

router.post("/:businessId", addBusinessHours);
router.get("/:businessId", getBusinessHours);
router.put("/:businessId/:hourId", updateBusinessHours);
router.delete("/:businessId/:hourId", deleteBusinessHours);

export default router;
