import { Router } from "express";

import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from "../controllers/businessProduct.controller.js";

const router = Router();

router.post("/:businessId", addProduct);
router.get("/:businessId", getAllProducts);
router.get("/product/:productId", getProductById);
router.put("/product/:productId", updateProductById);
router.delete("/product/:productId", deleteProductById);

export default router;
