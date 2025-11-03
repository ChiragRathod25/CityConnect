import { Router } from "express";

const router = Router();

import {
  addLocation,
  getAllLocationsByBusinessId,
  getLocationById,
  updateLocationById,
  deleteLocationById,
  findNearbyBusinesses,
} from "../controllers/businessLocation.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

router.use(verifyJWT);
router.post("/:businessId", addLocation);
router.get("/:businessId", getAllLocationsByBusinessId);
router.get("/get/:locationId", getLocationById);
router.put("/update/:locationId", updateLocationById);
router.delete("/delete/:locationId", deleteLocationById);
router.get("/nearby", findNearbyBusinesses);

export default router;