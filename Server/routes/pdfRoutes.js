import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import { generateOrderBillPDF } from "../controllers/pdfController.js";

const router = express.Router();

// ================================
// Order Bill PDF
// ================================

router.get("/orders/:orderId/bill", wrapAsync(generateOrderBillPDF));

export default router;
