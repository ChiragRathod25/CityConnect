import express from "express";
import {
  getAllOrdersByUserId,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  reorder,
  downloadInvoice,
  getOrderStats,
  getAdminOrderStats,
  getOrderByBusinessId,
} from "../controllers/orderHistory.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { Router } from "express";
const router = Router();

router.use(verifyJWT);

router.get("/", getAllOrdersByUserId);
router.get("/:orderId", getOrderById);
router.post("/", createOrder);
router.put("/:orderId/status", updateOrderStatus);
router.post("/:orderId/cancel", cancelOrder);
router.post("/:orderId/reorder", reorder);
router.get("/:orderId/invoice", downloadInvoice);
router.get("/stats/summary", getOrderStats);
router.get("/admin/stats", getAdminOrderStats);
router.get("/business/:businessId", getOrderByBusinessId);

export default router;
