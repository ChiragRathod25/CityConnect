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
router.get("/location/:locationId", getLocationById);
router.put("/location/:locationId", updateLocationById);
router.delete("/location/:locationId", deleteLocationById);
router.get("/nearby", findNearbyBusinesses);

export default router;