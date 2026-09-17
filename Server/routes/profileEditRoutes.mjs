import express from "express";
import wrapAsync from "../utils/wrapAsync.js";

import {
  editProfile,
  getProfileData,
  getAddresses,
  saveNewAddress,
  deleteAddress,
  editAddress,
  editProfilePhoto,
  getUserWishlistedProducts,
  removeFromWishlistedProducts,
  addToWishlistedProducts,
} from "../controllers/profileEdit.js";

import { upload } from "../config/cloudinary.js";

const router = express.Router();

// ================================
// Profile
// ================================

router.put("/profile", wrapAsync(editProfile));

router.post("/profile/data", wrapAsync(getProfileData));

router.post(
  "/profile/photo",
  upload.single("photo"),
  wrapAsync(editProfilePhoto),
);

// ================================
// Addresses
// ================================

router.get("/addresses", wrapAsync(getAddresses));

router.post("/addresses", wrapAsync(saveNewAddress));

router.delete("/addresses", wrapAsync(deleteAddress));

router.put("/addresses", wrapAsync(editAddress));

// ================================
// Wishlist
// ================================

router.get("/wishlist", wrapAsync(getUserWishlistedProducts));

router.put("/wishlist", wrapAsync(addToWishlistedProducts));

router.delete("/wishlist", wrapAsync(removeFromWishlistedProducts));

export default router;
