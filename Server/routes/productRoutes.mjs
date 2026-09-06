import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { getProducts, getRecentReview, likeProduct, searchProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/get-products", wrapAsync(getProducts))

router.get("/search/:productName", wrapAsync(searchProducts));

router.put("/like/:productId", wrapAsync(likeProduct));

router.get("/recent-reviews", wrapAsync(getRecentReview));

export default router;
