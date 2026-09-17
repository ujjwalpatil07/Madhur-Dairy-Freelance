import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";

import {
  getCurrentAdmin,
  handleAdminUpdatePassword,
  loginAdmin,
  removeAdminNotification,
  testAdminAuth,
} from "../../controllers/AuthController/authAdmin.js";
import authAdmin from "../../middlewares/authAdmin.js";

const router = express.Router();

// Admin Authentication
router.post("/login", wrapAsync(loginAdmin));

// Admin Profile / Account
router.get("/me", authAdmin, wrapAsync(getCurrentAdmin));
router.post("/update-password", wrapAsync(handleAdminUpdatePassword));

// Admin Notifications
router.delete("/delete-notification", wrapAsync(removeAdminNotification));

router.get("/test-auth", authAdmin, wrapAsync(testAdminAuth));

export default router;
