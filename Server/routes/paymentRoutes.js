import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import { createRazorpayOrder } from "../controllers/paymentController.js";

const router = express.Router();

// ================================
// Payments
// ================================

router.post("/razorpay", wrapAsync(createRazorpayOrder));

export default router;
