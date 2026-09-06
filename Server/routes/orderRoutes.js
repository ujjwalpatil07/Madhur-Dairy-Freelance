import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { getAllOrders, getAllUserOrders, getAdminOrders, getRecentOrders, getOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/get-user-orders", wrapAsync(getAllUserOrders));

router.post("/get-all-orders", wrapAsync(getAllOrders));

router.post("/get-admin-orders", wrapAsync(getAdminOrders));

router.post("/get-order-status", wrapAsync(getOrderStatus));

router.get("/recent-20", wrapAsync(getRecentOrders));


export default router;