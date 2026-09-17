import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
     generateOtp,
     signupUser,
} from "../../../services/userService";
import { useSnackbar } from "notistack";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import company from "../../../data/company.json";
import GoogleLoginComponent from "./GoogleLogin";

const GoogleLoadingOverlay = () => (
     <div className="absolute inset-0 z-50 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center">
               <div className="relative w-12 h-12">
                    <div className="absolute w-full h-full border-4 border-t-blue-500 border-r-red-500 border-b-yellow-400 border-l-green-500 rounded-full animate-spin" />
               </div>

               <p className="mt-3 text-gray-800 dark:text-white font-medium text-sm">
                    Logging in with Google...
               </p>
          </div>
     </div>
);

export default function UserSignUp() {
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar();

     const [showPassword, setShowPassword] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

     const [formData, setFormData] = useState({
          email: "",
          password: "",
          confirmPassword: "",
     });

     const handleInputChange = (e) => {
          const { name, value } = e.target;

          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const isValidPassword = (password) => {
          return /^(?=.*\d).{8,}$/.test(password);
     };

     const handleFormSubmit = async (e) => {
          e.preventDefault();

          if (isLoading || googleLoginLoading) return;

          /*
           * Validate password before making the API request.
           */
          if (!isValidPassword(formData?.password)) {
               enqueueSnackbar(
                    "Password must be at least 8 characters and contain a number.",
                    {
                         variant: "error",
                    }
               );

               return;
          }

          /*
           * Validate password confirmation.
           */
          if (
               formData?.password !==
               formData?.confirmPassword
          ) {
               enqueueSnackbar(
                    "Passwords do not match",
                    {
                         variant: "error",
                    }
               );

               return;
          }

          try {
               setIsLoading(true);

               /*
                * Generate OTP locally for the signup verification flow.
                */
               const otp = generateOtp();

               /*
                * Signup API:
                *
                * This step creates/registers the account and
                * sends the OTP.
                *
                * It does NOT create an authentication session.
                *
                * Therefore, there is no accessToken to store here.
                */
               const res = await signupUser(
                    formData,
                    otp
               );

               if (!res?.success) {
                    enqueueSnackbar(
                         res?.message || "Signup failed.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               enqueueSnackbar(
                    "OTP sent successfully",
                    {
                         variant: "success",
                    }
               );

               /*
                * Pass only the temporary signup information
                * required by the OTP verification page.
                *
                * This is NOT authentication state.
                */
               navigate(
                    "/signup/otp-verification",
                    {
                         state: {
                              formData,
                              otp,
                         },
                    }
               );

               /*
                * Clear the form after navigation.
                */
               setFormData({
                    email: "",
                    password: "",
                    confirmPassword: "",
               });
          } catch (error) {
               enqueueSnackbar(
                    error?.response?.data?.message ||
                    "Signup failed.",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setIsLoading(false);
          }
     };

     const loginType = "user";

     return (
          <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">

               {googleLoginLoading && (
                    <GoogleLoadingOverlay />
               )}

               <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{
                         duration: 0.8,
                         ease: "easeOut",
                    }}
                    className={`p-6 bg-white ${googleLoginLoading
                              ? "opacity-50 blur-sm pointer-events-none select-none"
                              : ""
                         } dark:bg-gray-900 rounded-md w-lg`}
               >
                    <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
                         Welcome to
                    </h2>

                    <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
                         {company?.name}
                    </h1>

                    <div className="mb-4 mt-3 flex justify-center">
                         <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">

                              <button
                                   type="button"
                                   onClick={() =>
                                        navigate("/login")
                                   }
                                   className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "user"
                                             ? "bg-[#843E71] text-white"
                                             : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                              >
                                   User
                              </button>

                              <button
                                   type="button"
                                   onClick={() =>
                                        navigate("/admin/login")
                                   }
                                   className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "admin"
                                             ? "bg-[#843E71] text-white"
                                             : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                              >
                                   Admin
                              </button>

                         </div>
                    </div>

                    <form
                         onSubmit={handleFormSubmit}
                         className="space-y-4"
                    >
                         {/* Email */}
                         <input
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Enter your email address"
                              value={formData?.email}
                              onChange={handleInputChange}
                              disabled={isLoading}
                              className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] disabled:cursor-not-allowed disabled:opacity-70"
                              required
                         />

                         {/* Password */}
                         <div className="relative w-full">
                              <input
                                   id="password"
                                   name="password"
                                   placeholder="Enter your password"
                                   type={
                                        showPassword
                                             ? "text"
                                             : "password"
                                   }
                                   value={formData?.password}
                                   onChange={handleInputChange}
                                   disabled={isLoading}
                                   className={`${isLoading
                                             ? "cursor-not-allowed"
                                             : "cursor-text"
                                        } w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] disabled:opacity-70`}
                                   required
                              />

                              <button
                                   type="button"
                                   className={`fa-solid ${showPassword
                                             ? "fa-eye"
                                             : "fa-eye-slash"
                                        } absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500`}
                                   onClick={() =>
                                        setShowPassword(
                                             (prev) => !prev
                                        )
                                   }
                                   disabled={isLoading}
                              />
                         </div>

                         {/* Confirm Password */}
                         <div className="relative w-full">
                              <input
                                   id="confirmPassword"
                                   name="confirmPassword"
                                   type={
                                        showPassword
                                             ? "text"
                                             : "password"
                                   }
                                   placeholder="Enter your password"
                                   value={formData?.confirmPassword}
                                   onChange={handleInputChange}
                                   disabled={isLoading}
                                   className={`${isLoading
                                             ? "cursor-not-allowed"
                                             : "cursor-text"
                                        } w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] disabled:opacity-70`}
                                   required
                              />

                              <button
                                   type="button"
                                   className={`fa-solid ${showPassword
                                             ? "fa-eye"
                                             : "fa-eye-slash"
                                        } absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500`}
                                   onClick={() =>
                                        setShowPassword(
                                             (prev) => !prev
                                        )
                                   }
                                   disabled={isLoading}
                              />
                         </div>

                         {/* Terms */}
                         <div>
                              <input
                                   id="terms"
                                   type="checkbox"
                                   required
                                   className="mr-2 accent-[#843E71]"
                                   disabled={isLoading}
                              />

                              <label
                                   htmlFor="terms"
                                   className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                   I agree to the{" "}
                                   <span className="text-[#FF8682]">
                                        Terms
                                   </span>{" "}
                                   and{" "}
                                   <span className="text-[#FF8682]">
                                        Privacy Policy
                                   </span>
                              </label>
                         </div>

                         {/* Submit Button */}
                         <button
                              type="submit"
                              disabled={
                                   isLoading ||
                                   googleLoginLoading
                              }
                              className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
                         >
                              {isLoading
                                   ? "Signing up..."
                                   : "Sign Up"}
                         </button>
                    </form>

                    {/* Already have account */}
                    <div className="mt-4 text-center">
                         <p className="text-sm text-gray-700 dark:text-gray-300">
                              Already have an account?{" "}

                              <Link
                                   to="/login"
                                   className="text-[#843E71] hover:underline cursor-pointer"
                              >
                                   Login
                              </Link>
                         </p>
                    </div>

                    {/* OR */}
                    <div className="flex items-center w-full mt-3">
                         <div className="border-t border-gray-400 dark:border-gray-600 flex-grow mr-3" />

                         <span className="text-gray-600 dark:text-gray-300 text-sm">
                              or login with
                         </span>

                         <div className="border-t border-gray-400 dark:border-gray-600 flex-grow ml-3" />
                    </div>

                    {/* Social login */}
                    <div className="w-full flex justify-center pt-2">
                         <GoogleLoginComponent
                              setGoogleLoginLoading={
                                   setGoogleLoginLoading
                              }
                         />
                    </div>
               </motion.div>
          </div>
     );
}