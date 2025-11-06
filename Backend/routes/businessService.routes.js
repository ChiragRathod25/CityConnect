import { Router } from "express";

import {
  addService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
} from "../controllers/businessService.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

router.use(verifyJWT);
router.post("/:businessId", upload.array("images"), addService);
router.get("/:businessId", getAllServices);
router.get("/service/:serviceId", getServiceById);
router.put("/service/:serviceId",upload.array("images"), updateServiceById);
router.delete("/service/:serviceId", deleteServiceById);

export default router;
