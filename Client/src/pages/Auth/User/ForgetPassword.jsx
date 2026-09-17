import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
     generateOtp,
     verifyUserByEmail,
} from "../../../services/userService";
import { sendOtpEmail } from "../../../services/sentOtp";

export default function ForgetPassword() {
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar();

     const [email, setEmail] = useState("");
     const [disableInput, setDisableInput] = useState(false);
     const [showOtpInput, setShowOtpInput] = useState(false);

     const [otp, setOtp] = useState([
          "",
          "",
          "",
          "",
          "",
     ]);

     const [sentOTP, setSentOTP] = useState("");

     const [loading, setLoading] = useState(false);

     const inputRefs = useRef([]);

     // ============================================================
     // Email validation
     // ============================================================

     const isValidEmail = (emailValue) => {
          const emailRegex =
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          return emailRegex.test(
               emailValue.trim()
          );
     };

     // ============================================================
     // OTP input
     // ============================================================

     const handleChange = (index, value) => {
          if (!/^\d?$/.test(value)) {
               return;
          }

          const newOtp = [...otp];

          newOtp[index] = value;

          setOtp(newOtp);

          if (
               value &&
               index < 4
          ) {
               inputRefs.current[
                    index + 1
               ]?.focus();
          }
     };

     // ============================================================
     // OTP backspace
     // ============================================================

     const handleKeyDown = (
          e,
          index
     ) => {
          if (
               e.key === "Backspace" &&
               !otp[index] &&
               index > 0
          ) {
               inputRefs.current[
                    index - 1
               ]?.focus();
          }
     };

     // ============================================================
     // Send OTP
     // ============================================================

     const verifyEmail = async () => {
          const normalizedEmail =
               email.trim().toLowerCase();

          if (!isValidEmail(normalizedEmail)) {
               enqueueSnackbar(
                    "Invalid email format",
                    {
                         variant: "warning",
                    }
               );

               return;
          }

          setLoading(true);

          try {
               const res =
                    await verifyUserByEmail(
                         normalizedEmail
                    );

               if (!res?.success) {
                    enqueueSnackbar(
                         res?.message ||
                         "Email verification failed",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               // ========================================================
               // Generate OTP only after backend confirms email
               // ========================================================

               const otpGenerated =
                    generateOtp();

               const response =
                    await sendOtpEmail(
                         res?.email ||
                         normalizedEmail,
                         otpGenerated
                    );

               if (!response?.success) {
                    enqueueSnackbar(
                         response?.message ||
                         "Failed to send OTP",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               setEmail(
                    res?.email ||
                    normalizedEmail
               );

               setSentOTP(
                    otpGenerated
               );

               setOtp([
                    "",
                    "",
                    "",
                    "",
                    "",
               ]);

               setDisableInput(true);
               setShowOtpInput(true);

               enqueueSnackbar(
                    "OTP sent successfully",
                    {
                         variant: "success",
                    }
               );

               // Focus first OTP input
               setTimeout(() => {
                    inputRefs.current[0]?.focus();
               }, 100);
          } catch (error) {
               console.error(
                    "Send reset OTP error:",
                    error
               );

               enqueueSnackbar(
                    error?.response?.data
                         ?.message ||
                    "Something went wrong",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setLoading(false);
          }
     };

     // ============================================================
     // Verify OTP
     // ============================================================

     const verifyOtp = () => {
          const enteredOtp =
               otp.join("");

          if (
               enteredOtp.length !== 5
          ) {
               enqueueSnackbar(
                    "Please enter a valid 5-digit OTP",
                    {
                         variant: "error",
                    }
               );

               return;
          }

          if (
               enteredOtp !== sentOTP
          ) {
               enqueueSnackbar(
                    "Please enter a correct OTP.",
                    {
                         variant: "error",
                    }
               );

               return;
          }

          // ========================================================
          // OTP verified.
          //
          // We intentionally do NOT store a User object or JWT here.
          // This is a password-reset flow, not a login flow.
          // ========================================================

          navigate(
               "/login/reset-password",
               {
                    state: {
                         email: email.trim().toLowerCase(),
                         otpVerified: true,
                    },
               }
          );
     };

     // ============================================================
     // Render
     // ============================================================

     return (
          <div
               className="flex flex-col md:flex-row min-h-screen transition bg-[#f5f5f5] dark:bg-[#121212] items-center justify-center px-4 py-10"
          >
               <div
                    className="w-full md:w-[40%] bg-white dark:bg-gray-500/20 rounded-2xl shadow-2xl p-8 max-w-md transition"
               >
                    <button
                         type="button"
                         className="text-sm text-gray-600 dark:text-gray-300 flex items-center cursor-pointer hover:text-[#843E71] transition disabled:opacity-50"
                         onClick={() =>
                              navigate("/login")
                         }
                         disabled={loading}
                    >
                         <i className="fa-solid fa-arrow-left me-3"></i>
                         Back to Login Page
                    </button>

                    <h1
                         className="text-3xl font-semibold mt-6 text-[#843E71] dark:text-white"
                    >
                         Forgot your password?
                    </h1>

                    <p
                         className="text-sm mt-4 mb-4 text-gray-600 dark:text-gray-300"
                    >
                         {showOtpInput
                              ? "An authentication code has been sent to your email. Enter the 5-digit OTP below to verify."
                              : "Don’t worry, happens to all of us. Enter your verified email below to recover your password."}
                    </p>

                    {/* ======================================================
            Email
        ====================================================== */}

                    <input
                         type="email"
                         id="email"
                         name="email"
                         placeholder="Enter your email address"
                         value={email}
                         disabled={
                              disableInput ||
                              loading
                         }
                         onChange={(e) =>
                              setEmail(
                                   e.target.value
                              )
                         }
                         className={`w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 ${showOtpInput
                                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                   : "bg-white text-gray-800 dark:text-gray-200"
                              } dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#843E71]`}
                         required
                    />

                    {/* ======================================================
            OTP
        ====================================================== */}

                    {showOtpInput && (
                         <div
                              id="otp-input"
                              className="flex justify-between mt-8 space-x-2"
                         >
                              {otp.map(
                                   (
                                        digit,
                                        index
                                   ) => (
                                        <input
                                             key={index}
                                             type="text"
                                             inputMode="numeric"
                                             maxLength="1"
                                             value={digit}
                                             disabled={loading}
                                             onChange={(e) =>
                                                  handleChange(
                                                       index,
                                                       e.target.value
                                                  )
                                             }
                                             onKeyDown={(e) =>
                                                  handleKeyDown(
                                                       e,
                                                       index
                                                  )
                                             }
                                             ref={(el) =>
                                             (inputRefs.current[
                                                  index
                                             ] = el)
                                             }
                                             className={`${loading
                                                       ? "cursor-not-allowed"
                                                       : "cursor-text"
                                                  } h-14 w-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#843E71] transition`}
                                        />
                                   )
                              )}
                         </div>
                    )}

                    {/* ======================================================
            Action Button
        ====================================================== */}

                    <Button
                         variant="contained"
                         onClick={
                              showOtpInput
                                   ? verifyOtp
                                   : verifyEmail
                         }
                         disabled={loading}
                         className="w-full !mt-6 font-semibold !bg-[#843E71] hover:!bg-[#6f3260] transition"
                    >
                         {showOtpInput
                              ? loading
                                   ? "Verifying..."
                                   : "Verify OTP"
                              : loading
                                   ? "Sending..."
                                   : "Send OTP"}
                    </Button>
               </div>

               {/* ========================================================
          Illustration
      ======================================================== */}

               <div
                    className="hidden md:flex w-[50%] h-full justify-center items-center"
               >
                    <img
                         src="https://img.freepik.com/free-vector/otp-concept-illustration_114360-7882.jpg"
                         alt="OTP Illustration"
                         className="w-[80%] max-h-[400px] object-contain dark:invert"
                    />
               </div>
          </div>
     );
}