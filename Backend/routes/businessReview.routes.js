import { Router } from "express";
import {
  addReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} from "../controllers/businessReview.controller.js";
const router = Router();

router.post("/:businessId", addReview);
router.get("/:businessId", getAllReviews);
router.get("/review/:reviewId", getReviewById);
router.put("/review/:reviewId", updateReviewById);
router.delete("/review/:reviewId", deleteReviewById);

export default router;
