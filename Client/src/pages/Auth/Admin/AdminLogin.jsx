import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

import {
     loginAdmin,
     getCurrentAdmin,
} from "../../../services/adminService";

import {
     AdminAuthContext,
     UserAuthContext,
} from "../../../context/AuthProvider";

import company from "../../../data/company.json";

export default function AdminLogin() {
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar();

     const { handleUserLogout } =
          useContext(UserAuthContext);

     const {
          setAuthAdmin,
          setAuthAdminLoading,
     } = useContext(AdminAuthContext);

     const [showPassword, setShowPassword] =
          useState(false);

     const [isLoading, setIsLoading] =
          useState(false);

     const [formData, setFormData] = useState({
          email: "",
          password: "",
     });

     const handleInputChange = (e) => {
          const { name, value } = e.target;

          setFormData((prevData) => ({
               ...prevData,
               [name]: value,
          }));
     };

     const handleFormSubmit = async (e) => {
          e.preventDefault();

          if (isLoading) return;

          setIsLoading(true);

          try {
               const { email, password } = formData;

               /*
                * Keep the existing authentication logic unchanged.
                *
                * We intentionally logout the user only when the
                * admin login request is going to proceed.
                */
               handleUserLogout();

               const data = await loginAdmin(
                    email,
                    password
               );

               if (!data?.success || !data?.accessToken) {
                    enqueueSnackbar(
                         data?.message ||
                         "Admin login failed.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               /*
                * Store JWT access token.
                */
               localStorage.setItem(
                    "accessToken",
                    data.accessToken
               );

               setAuthAdminLoading(true);

               /*
                * Fetch current admin using JWT.
                */
               const currentAdminResponse =
                    await getCurrentAdmin();

               if (
                    !currentAdminResponse?.success ||
                    !currentAdminResponse?.admin
               ) {
                    localStorage.removeItem(
                         "accessToken"
                    );

                    setAuthAdmin(null);

                    enqueueSnackbar(
                         currentAdminResponse?.message ||
                         "Unable to load admin profile.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               /*
                * Store admin in React context only.
                *
                * We do NOT store Admin in localStorage.
                */
               setAuthAdmin(
                    currentAdminResponse.admin
               );

               enqueueSnackbar(
                    "Logged in successfully as Admin",
                    {
                         variant: "success",
                    }
               );

               navigate("/admin/dashboard");

          } catch (err) {

               /*
                * If authentication succeeds but something
                * fails afterward, remove the token so we
                * don't keep an invalid authentication state.
                */
               localStorage.removeItem(
                    "accessToken"
               );

               setAuthAdmin(null);

               enqueueSnackbar(
                    err?.response?.data?.message ||
                    "Login failed, try again",
                    {
                         variant: "error",
                    }
               );

          } finally {

               setAuthAdminLoading(false);
               setIsLoading(false);

               setFormData({
                    email: "",
                    password: "",
               });
          }
     };

     const loginType = "admin";

     return (
          <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">

               <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{
                         duration: 0.8,
                         ease: "easeOut",
                    }}
                    className="p-6 bg-white dark:bg-gray-900 rounded-md w-lg"
               >

                    {/* =====================================================
            HEADING
        ====================================================== */}

                    <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
                         Welcome to
                    </h2>

                    <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
                         {company?.name}
                    </h1>


                    {/* =====================================================
            USER / ADMIN TOGGLE
        ====================================================== */}

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


                    {/* =====================================================
            LOGIN FORM
        ====================================================== */}

                    <form
                         onSubmit={handleFormSubmit}
                         className="space-y-5"
                    >

                         <div className="w-full flex flex-col gap-5">

                              {/* Email */}

                              <input
                                   type="email"
                                   id="email"
                                   name="email"
                                   placeholder="Enter your email address"
                                   value={formData?.email}
                                   onChange={handleInputChange}
                                   className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71]"
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
                                        className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71]"
                                        required
                                   />

                                   <button
                                        type="button"
                                        aria-label={
                                             showPassword
                                                  ? "Hide password"
                                                  : "Show password"
                                        }
                                        className={`fa-solid ${showPassword
                                                  ? "fa-eye"
                                                  : "fa-eye-slash"
                                             } absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300`}
                                        onClick={() =>
                                             setShowPassword(
                                                  (prev) => !prev
                                             )
                                        }
                                   />

                              </div>


                              {/* Remember / Forgot */}

                              <div className="text-sm flex justify-between font-semibold text-right mb-3 text-[#843E71]">

                                   <div className="flex justify-center text-black dark:text-gray-300 hover:underline">

                                        <input
                                             type="checkbox"
                                             id="remember"
                                             className="me-2"
                                        />

                                        <label htmlFor="remember">
                                             Remember me
                                        </label>

                                   </div>

                                   <Link
                                        to="/login/forget-password"
                                        className="hover:underline"
                                   >
                                        Forgot password?
                                   </Link>

                              </div>

                         </div>


                         {/* Login Button */}

                         <button
                              type="submit"
                              disabled={isLoading}
                              className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
                         >
                              {isLoading
                                   ? "Logging in..."
                                   : "Login"}
                         </button>

                    </form>


                    {/* =====================================================
            SIGN UP
        ====================================================== */}

                    <div className="mt-4 text-center">

                         <p className="text-sm text-gray-700 dark:text-gray-300">

                              Don't have an account?{" "}

                              <Link
                                   to="/signup"
                                   className="text-[#843E71] hover:underline cursor-pointer"
                              >
                                   Sign Up
                              </Link>

                         </p>

                    </div>

               </motion.div>

          </div>
     );
}