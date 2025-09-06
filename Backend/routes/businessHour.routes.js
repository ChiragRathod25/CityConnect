import { Router } from "express";

const router = Router();

import {
  addBusinessHours,
  getBusinessHours,
  updateBusinessHours,
  deleteBusinessHours,
} from "../controllers/businessHour.controller.js";

router.post("/:businessId", addBusinessHours);
router.get("/:businessId", getBusinessHours);
router.put("/:businessId/:hourId", updateBusinessHours);
router.delete("/:businessId/:hourId", deleteBusinessHours);

export default router;
