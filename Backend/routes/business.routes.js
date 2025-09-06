import { Router } from "express";

import {
  registerBusiness,
  getBusinessProfileById,
  updateBusinessProfileById,
  deleteBusinessProfileById,
  getAllBusinessProfiles,
  searchBusinessProfiles,
  verifyBusinessProfile,
  updateBusinessStatus,
  updateBusinessLogo,
  addBusinessImages,
  removeBusinessImage,
} from "../controllers/business.controller.js";
const router = Router();

router.post("/register", registerBusiness);
router.get("/:id", getBusinessProfileById);
router.put("/:id", updateBusinessProfileById);
router.delete("/:id", deleteBusinessProfileById);
router.get("/", getAllBusinessProfiles);
router.get("/search", searchBusinessProfiles);
router.put("/verify/:id", verifyBusinessProfile);
router.put("/status/:id", updateBusinessStatus);
router.put("/logo/:id", updateBusinessLogo);
router.post("/images/:id", addBusinessImages);
router.delete("/images/:id", removeBusinessImage);

export default router;
