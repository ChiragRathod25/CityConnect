import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  reorder,
  downloadInvoice,
  getOrderStats,
} from "../controllers/orderHistory.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { Router } from "express";
const router = Router();

router.use(verifyJWT);

router.get("/", getAllOrders);
router.get("/:orderId", getOrderById);
router.post("/", createOrder);
router.put("/:orderId/status", updateOrderStatus);
router.post("/:orderId/cancel", cancelOrder);
router.post("/:orderId/reorder", reorder);
router.get("/:orderId/invoice", downloadInvoice);
router.get("/stats/summary", getOrderStats);

export default router;
