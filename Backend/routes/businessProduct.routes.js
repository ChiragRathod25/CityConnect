import { Router } from "express";

import {
  addProduct,
  getAllProductsByBusinessId,
  getProductById,
  updateProductById,
  deleteProductById,
  deleteAllProducts,
  addProductImages,
  removeProductImage,
  getAllProducts,
} from "../controllers/businessProduct.controller.js";

const router = Router();

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.use(verifyJWT);

router.post("/:businessId",upload.array("images"), addProduct);
router.get("/:businessId", getAllProductsByBusinessId);
router.get("/product/:productId", getProductById);
router.put("/product/:productId",upload.array("images"), updateProductById);
router.delete("/product/:productId", deleteProductById);
router.delete("/business/:businessId", deleteAllProducts);
router.post("/images/:businessId/:productId", addProductImages);
router.delete("/images/:businessId/:productId", removeProductImage);
router.get("/products/all", getAllProducts);


export default router;
