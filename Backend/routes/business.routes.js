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
  getBusinessByCategory
} from "../controllers/business.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT)
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
router.get("/category/:category", getBusinessByCategory);

export default router;
