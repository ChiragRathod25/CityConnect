import { Router } from "express";

import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
  addProductImages,
  removeProductImage,
} from "../controllers/businessProduct.controller.js";

const router = Router();

router.post("/:businessId", addProduct);
router.get("/:businessId", getAllProducts);
router.get("/product/:productId", getProductById);
router.put("/product/:productId", updateProductById);
router.delete("/product/:productId", deleteProductById);
router.delete("/business/:businessId", deleteAllProducts);
router.post("/images/:businessId/:productId", addProductImages);
router.delete("/images/:businessId/:productId", removeProductImage);

export default router;
