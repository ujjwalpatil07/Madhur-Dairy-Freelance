import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import {
  getAllOrders,
  getAllUserOrders,
  getAdminOrders,
  getRecentOrders,
  getOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// ================================
// Orders
// ================================

router.post("/", wrapAsync(getAllOrders));

router.post("/user", wrapAsync(getAllUserOrders));

router.post("/admin", wrapAsync(getAdminOrders));

// ================================
// Order Status
// ================================

router.post("/status", wrapAsync(getOrderStatus));

// ================================
// Recent Orders
// ================================

router.get("/recent", wrapAsync(getRecentOrders));

export default router;
