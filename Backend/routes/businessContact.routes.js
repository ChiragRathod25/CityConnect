import { Router } from "express";

const router = Router();

import {
  addBusinessContact,
  getBusinessContact,
  updateBusinessContact,
  deleteBusinessContact,
  getBusinessSocialLinks,
} from "../controllers/businessContact.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

router.use(verifyJWT);

router.post("/:businessId", addBusinessContact);
router.get("/:businessId", getBusinessContact);
router.put("/:businessId", updateBusinessContact);
router.delete("/:businessId", deleteBusinessContact);
router.get("/social-links/:businessId", getBusinessSocialLinks);

export default router;
