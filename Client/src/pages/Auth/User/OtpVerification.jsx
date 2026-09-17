import React, { useState, useRef, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { generateOtp, verifyUserOTP } from "../../../services/userService";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { sendOtpEmail } from "../../../services/sentOtp";

export default function OtpVerification() {
     const navigate = useNavigate();
     const location = useLocation();
     const { enqueueSnackbar } = useSnackbar();

     const formData = location?.state?.formData;
     const [sentOtp, setSentOtp] = useState(location?.state?.otp || "");

     const [otp, setOtp] = useState(["", "", "", "", ""]);
     const [loading, setLoading] = useState(false);
     const inputRefs = useRef([]);

     const [resendDisabled, setResendDisabled] = useState(true);
     const [timeLeft, setTimeLeft] = useState(120);

     // ============================================================
     // Check existing OTP status
     // ============================================================

     useEffect(() => {
          if (!formData?.email) {
               return;
          }

          const storedOtpStatus = localStorage.getItem("otp-status");

          if (!storedOtpStatus) {
               return;
          }

          try {
               const otpStatus = JSON.parse(storedOtpStatus);

               if (
                    otpStatus?.email === formData.email &&
                    otpStatus?.isOtpEntered &&
                    localStorage.getItem("accessToken")
               ) {
                    enqueueSnackbar(
                         "You already entered OTP! Proceeding to the next page.",
                         { variant: "info" }
                    );

                    navigate("/signup/info-input", {
                         state: {
                              formData,
                         },
                    });
               }
          } catch (error) {
               console.error("Invalid OTP status:", error);
               localStorage.removeItem("otp-status");
          }
     }, [formData, navigate, enqueueSnackbar]);

     // ============================================================
     // Redirect if signup data is missing
     // ============================================================

     useEffect(() => {
          if (!formData) {
               navigate("/signup");
          }
     }, [formData, navigate]);

     // ============================================================
     // OTP resend timer
     // ============================================================

     useEffect(() => {
          let timer;

          if (resendDisabled && timeLeft > 0) {
               timer = setTimeout(() => {
                    setTimeLeft((prev) => prev - 1);
               }, 1000);
          }

          if (timeLeft === 0) {
               setResendDisabled(false);
          }

          return () => clearTimeout(timer);
     }, [resendDisabled, timeLeft]);

     // ============================================================
     // Prevent accidental refresh during signup
     // ============================================================

     useEffect(() => {
          const handleBeforeUnload = (e) => {
               e.preventDefault();
               e.returnValue = "";
          };

          window.addEventListener("beforeunload", handleBeforeUnload);

          return () => {
               window.removeEventListener("beforeunload", handleBeforeUnload);
          };
     }, []);

     // ============================================================
     // Handle OTP input
     // ============================================================

     const handleChange = (index, value) => {
          if (!/^\d?$/.test(value)) {
               return;
          }

          const newOtp = [...otp];
          newOtp[index] = value;

          setOtp(newOtp);

          if (value && index < 4) {
               inputRefs.current[index + 1]?.focus();
          }
     };

     // ============================================================
     // Handle backspace
     // ============================================================

     const handleKeyDown = (e, index) => {
          if (e.key === "Backspace" && !otp[index] && index > 0) {
               inputRefs.current[index - 1]?.focus();
          }
     };

     // ============================================================
     // Resend OTP
     // ============================================================

     const resendOtp = async () => {
          if (!formData?.email) {
               enqueueSnackbar("Email is missing. Please restart signup.", {
                    variant: "error",
               });
               return;
          }

          try {
               const newOtp = generateOtp();

               const res = await sendOtpEmail(formData.email, newOtp);

               if (res?.success) {
                    enqueueSnackbar("OTP resent successfully", {
                         variant: "success",
                    });

                    setSentOtp(res?.otp || newOtp);

                    setOtp(["", "", "", "", ""]);

                    setTimeLeft(120);
                    setResendDisabled(true);

                    inputRefs.current[0]?.focus();
               } else {
                    enqueueSnackbar(
                         res?.message || "Failed to resend OTP",
                         {
                              variant: "error",
                         }
                    );
               }
          } catch (error) {
               console.error("Resend OTP error:", error);

               enqueueSnackbar(
                    error?.response?.data?.message ||
                    "Failed to resend OTP",
                    {
                         variant: "error",
                    }
               );
          }
     };

     // ============================================================
     // Verify OTP
     // ============================================================

     const handleVerify = async () => {
          const enteredOtp = otp.join("");

          if (enteredOtp.length !== 5) {
               enqueueSnackbar(
                    "Please enter a valid 5-digit OTP",
                    {
                         variant: "error",
                    }
               );
               return;
          }

          if (enteredOtp !== sentOtp) {
               enqueueSnackbar(
                    "Please enter a correct OTP.",
                    {
                         variant: "error",
                    }
               );
               return;
          }

          if (!formData) {
               enqueueSnackbar(
                    "Signup information is missing. Please restart signup.",
                    {
                         variant: "error",
                    }
               );

               navigate("/signup");
               return;
          }

          setLoading(true);

          try {
               const data = await verifyUserOTP(formData);

               // ========================================================
               // Backend must return accessToken after OTP verification
               // ========================================================

               if (data?.success) {
                    if (!data?.accessToken) {
                         enqueueSnackbar(
                              "Account created, but authentication could not be established. Please login.",
                              {
                                   variant: "error",
                              }
                         );

                         return;
                    }

                    // ======================================================
                    // Store JWT
                    // ======================================================

                    localStorage.setItem(
                         "accessToken",
                         data.accessToken
                    );

                    // ======================================================
                    // Temporary signup progress only
                    // This is NOT authentication state.
                    // ======================================================

                    localStorage.setItem(
                         "otp-status",
                         JSON.stringify({
                              email: formData.email,
                              isOtpEntered: true,
                         })
                    );

                    enqueueSnackbar(
                         "User signed up successfully. Please fill basic details to proceed!",
                         {
                              variant: "info",
                         }
                    );

                    // ======================================================
                    // Go to profile completion
                    // JWT will automatically be attached by api.js
                    // ======================================================

                    navigate("/signup/info-input", {
                         state: {
                              formData: data?.user || {
                                   email: formData.email,
                              },
                         },
                    });
               } else {
                    enqueueSnackbar(
                         data?.message || "Something went wrong",
                         {
                              variant: "error",
                         }
                    );
               }
          } catch (error) {
               console.error("OTP verification error:", error);

               enqueueSnackbar(
                    error?.response?.data?.message ||
                    "User already exists or server error.",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setLoading(false);
          }
     };

     // ============================================================
     // Render
     // ============================================================

     return (
          <div
               className={`flex flex-col md:flex-row min-h-screen transition bg-[#f5f5f5] dark:bg-[#121212] items-center justify-center px-4 py-10 gap-10`}
          >
               <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                         duration: 0.6,
                         delay: 0.4,
                    }}
                    className="w-full md:w-[40%] bg-white dark:bg-gray-500/20 rounded-2xl shadow-2xl p-8 max-w-md transition"
               >
                    <button
                         type="button"
                         className="text-sm text-gray-600 dark:text-gray-300 flex items-center cursor-pointer hover:text-[#843E71] transition"
                         onClick={() => navigate("/signup")}
                         disabled={loading}
                    >
                         <i className="fa-solid fa-arrow-left me-3"></i>
                         Back to Signup Page
                    </button>

                    <h1 className="text-3xl font-semibold mt-6 text-[#843E71] dark:text-white">
                         Verify OTP
                    </h1>

                    <p className="text-sm mt-4 text-gray-600 dark:text-gray-300">
                         An authentication code has been sent to{" "}
                         {formData?.email} email. Enter the 5-digit OTP below
                         to verify.
                    </p>

                    <div className="mt-4 text-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-300/10 dark:text-yellow-300 px-4 py-2 rounded-md text-sm font-medium">
                         ⚠️ Please do not refresh the page or go back. Your OTP
                         session might get interrupted.
                    </div>

                    <div
                         id="otp-input"
                         className="flex justify-between mt-8 space-x-2"
                    >
                         {otp.map((digit, index) => (
                              <input
                                   key={index}
                                   type="text"
                                   inputMode="numeric"
                                   maxLength="1"
                                   value={digit}
                                   disabled={loading}
                                   onChange={(e) =>
                                        handleChange(index, e.target.value)
                                   }
                                   onKeyDown={(e) =>
                                        handleKeyDown(e, index)
                                   }
                                   ref={(el) =>
                                        (inputRefs.current[index] = el)
                                   }
                                   className={`${loading
                                             ? "cursor-not-allowed"
                                             : "cursor-text"
                                        } h-14 w-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#843E71] transition`}
                              />
                         ))}
                    </div>

                    <div className="mt-5 text-sm flex justify-center text-gray-600 dark:text-gray-400">
                         {resendDisabled ? (
                              <p>
                                   Resend OTP in{" "}
                                   <span className="text-[#843E71] font-semibold">
                                        {String(
                                             Math.floor(timeLeft / 60)
                                        ).padStart(2, "0")}
                                        :
                                        {String(timeLeft % 60).padStart(2, "0")}
                                   </span>
                              </p>
                         ) : (
                              <>
                                   <p>Didn't receive OTP?&nbsp;</p>

                                   <button
                                        type="button"
                                        onClick={resendOtp}
                                        disabled={loading}
                                        className="text-[#FF8682] font-semibold hover:underline hover:text-[#e2595b] disabled:opacity-50"
                                   >
                                        Resend OTP
                                   </button>
                              </>
                         )}
                    </div>

                    <Button
                         variant="contained"
                         onClick={handleVerify}
                         disabled={loading}
                         className="w-full !mt-6 font-semibold !bg-[#843E71] hover:!bg-[#6f3260] transition"
                    >
                         {loading ? (
                              <CircularProgress
                                   size={24}
                                   color="inherit"
                              />
                         ) : (
                              "Verify OTP"
                         )}
                    </Button>
               </motion.div>

               <motion.div
                    className="hidden md:flex w-[40%] h-full justify-center items-center"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                         duration: 0.6,
                         delay: 0.4,
                    }}
               >
                    <img
                         src="https://useme.in/web/assets/images/what-now/your-privacy.png"
                         alt="OTP Illustration"
                         className="w-[80%] max-h-[400px] object-contain"
                    />
               </motion.div>
          </div>
     );
}