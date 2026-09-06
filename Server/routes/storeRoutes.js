import express from "express";
import { getAllStores, getStoreOrderHistory } from "../controllers/storeController.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

router.get("/get-stores", wrapAsync(getAllStores));

router.post("/store-order-history", wrapAsync(getStoreOrderHistory));

export default router;