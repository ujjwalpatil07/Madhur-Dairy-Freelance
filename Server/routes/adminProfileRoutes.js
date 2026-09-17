import express from "express";
import { upload } from "../config/cloudinary.js";
import wrapAsync from "../utils/wrapAsync.js";

import { updateAdminProfile } from "../controllers/adminProfileController.js";

const router = express.Router();

// ================================
// Admin Profile
// ================================

router.put("/profile", upload.single("image"), wrapAsync(updateAdminProfile));

export default router;
