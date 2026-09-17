import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";

import {
  loginUser,
  signUpUser,
  verifyOtp,
  handleInfoInput,
  removeUserNotification,
  getAllCustomers,
  verifyUser,
  resetPassword,
  loginWithGoogle,
  testAuth,
  getCurrentUser,
} from "../../controllers/AuthController/authUser.js";

import { upload } from "../../config/cloudinary.js";
import authUser from "../../middlewares/authUser.js";

const router = express.Router();

// ================================
// Authentication
// ================================

router.post("/signup", wrapAsync(signUpUser));
router.post("/login", wrapAsync(loginUser));
router.post("/google-login", wrapAsync(loginWithGoogle));

// ================================
// Email Verification & Password
// ================================

router.post("/verify-email", wrapAsync(verifyUser));
router.post("/reset-password", wrapAsync(resetPassword));

// ================================
// Signup Flow
// ================================

router.post("/signup/otp-verification", wrapAsync(verifyOtp));

router.post(
  "/signup/info-input",
  authUser,
  upload.single("photo"),
  wrapAsync(handleInfoInput),
);

// ================================
// User
// ================================

router.get("/me", authUser, wrapAsync(getCurrentUser));

router.delete("/delete-notification", wrapAsync(removeUserNotification));

// ================================
// Customers
// ================================

router.get("/customers", wrapAsync(getAllCustomers));

// ================================
// Protected Routes
// ================================

router.get("/test-auth", authUser, wrapAsync(testAuth));

export default router;
