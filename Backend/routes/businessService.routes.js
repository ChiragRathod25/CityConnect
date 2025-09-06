import { Router } from "express";

import {
  addService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
} from "../controllers/businessService.controller.js";

const router = Router();

router.post("/:businessId", addService);
router.get("/:businessId", getAllServices);
router.get("/service/:serviceId", getServiceById);
router.put("/service/:serviceId", updateServiceById);
router.delete("/service/:serviceId", deleteServiceById);

export default router;
