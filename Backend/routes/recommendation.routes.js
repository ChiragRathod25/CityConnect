// routes/recommendationRoutes.js
import express from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);
router.get("/", getRecommendations);

export default router;
