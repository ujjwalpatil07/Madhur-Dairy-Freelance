import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import {
  getAllStores,
  getStoreOrderHistory,
} from "../controllers/storeController.js";

const router = express.Router();

// ================================
// Stores
// ================================

router.get("/", wrapAsync(getAllStores));

// ================================
// Store Order History
// ================================

router.post("/order-history", wrapAsync(getStoreOrderHistory));

export default router;
