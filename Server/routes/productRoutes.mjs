import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import {
  getProducts,
  getRecentReview,
  likeProduct,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// ================================
// Products
// ================================

router.get("/", wrapAsync(getProducts));

router.get("/search/:productName", wrapAsync(searchProducts));

// ================================
// Product Like
// ================================

router.put("/:productId/like", wrapAsync(likeProduct));

// ================================
// Reviews
// ================================

router.get("/reviews/recent", wrapAsync(getRecentReview));

export default router;
