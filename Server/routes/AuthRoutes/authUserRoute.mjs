import express from "express"
import wrapAsync from "../../utils/wrapAsync.js"
import { loginUser, signUpUser, verifyOtp, handleInfoInput, getUser, removeUserNotification, getAllCustomers, verifyUser, resetPassword, loginWithGoogle, testAuth } from "../../controllers/AuthController/authUser.js";
import { upload } from "../../config/cloudinary.js"
import authUser from "../../middlewares/authUser.js";


const router = express.Router();

router.post("/signup", wrapAsync(signUpUser));

router.post("/login", wrapAsync(loginUser));

router.post("/google-login", wrapAsync(loginWithGoogle));

router.post ("/verify-email", wrapAsync(verifyUser))

router.post("/reset-password", wrapAsync(resetPassword))

router.post("/signup/otp-verification", wrapAsync(verifyOtp));

router.post("/signup/info-input", upload.single("photo"), wrapAsync(handleInfoInput));

router.post("/get-user", wrapAsync(getUser));

router.delete("/delete-notification", wrapAsync(removeUserNotification));

router.get("/customers", wrapAsync(getAllCustomers));

router.get("/test-auth", authUser, wrapAsync(testAuth));

export default router;