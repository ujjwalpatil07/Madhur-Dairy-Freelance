import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { Dialog, DialogContent } from "@mui/material";
import Slide from "@mui/material/Slide";
import {
     AdminAuthContext,
     UserAuthContext,
} from "../../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../../../services/userService";
import { loginAdmin, getCurrentAdmin } from "../../../services/adminService";
import company from "../../../data/company.json";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginComponent from "./GoogleLogin";

const Transition = React.forwardRef(function Transition(props, ref) {
     return <Slide direction="up" ref={ref} {...props} />;
});

const GoogleLoadingOverlay = () => {
     return (
          <div className="absolute inset-0 z-20 bg-white/30 dark:bg-black/30 backdrop-blur-xs flex items-center justify-center pointer-events-none">
               <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12">
                         <div className="absolute w-full h-full border-4 border-t-blue-500 border-r-red-500 border-b-yellow-400 border-l-green-500 rounded-full animate-spin" />
                    </div>

                    <p className="mt-3 text-gray-800 dark:text-white font-semibold text-lg">
                         Logging in with Google...
                    </p>
               </div>
          </div>
     );
};

export default function LoginDialog() {
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar();

     const {
          openLoginDialog,
          setOpenLoginDialog,
          setAuthUser,
          setAuthUserLoading,
     } = useContext(UserAuthContext);

     const {
          setAuthAdmin,
          setAuthAdminLoading,
     } = useContext(AdminAuthContext);

     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [loading, setLoading] = useState(false);
     const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
     const [loginType, setLoginType] = useState("user");
     const [showPassword, setShowPassword] = useState(false);

     /*
      * ============================================================
      * USER LOGIN
      * ============================================================
      */

     const handleUserLogin = async () => {
          try {
               const res = await loginUser(email, password);

               /*
                * Backend must return accessToken.
                */
               if (!res?.success || !res?.accessToken) {
                    enqueueSnackbar(
                         res?.message || "Login failed, please try again.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               /*
                * Store ONLY ONE token.
                *
                * No User object.
                * No Admin object.
                * No token switching.
                */
               localStorage.setItem("accessToken", res.accessToken);

               /*
                * User token is now the active authentication state.
                */
               setAuthAdmin(null);

               /*
                * If profile information is incomplete,
                * continue the signup/profile completion flow.
                */
               if (!res?.filledBasicInfo) {
                    setAuthUser(res?.user || null);

                    setOpenLoginDialog(false);

                    enqueueSnackbar(
                         "Please complete your profile information.",
                         {
                              variant: "info",
                         }
                    );

                    navigate("/signup/info-input", {
                         state: {
                              viaLogin: true,
                         },
                    });

                    return;
               }

               /*
                * Fetch the authenticated user using the JWT.
                *
                * No user ID is required from localStorage.
                */
               setAuthUserLoading(true);

               const currentUserResponse = await getCurrentUser();

               if (
                    !currentUserResponse?.success ||
                    !currentUserResponse?.user
               ) {
                    localStorage.removeItem("accessToken");

                    setAuthUser(null);

                    enqueueSnackbar(
                         currentUserResponse?.message ||
                         "Unable to load user profile.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               /*
                * Update React authentication state.
                */
               setAuthUser(currentUserResponse.user);
               setAuthAdmin(null);

               enqueueSnackbar("Login Successful!", {
                    variant: "success",
               });

               /*
                * Close dialog.
                */
               setOpenLoginDialog(false);

               /*
                * Go to user application.
                */
               navigate("/home");

               /*
                * Clear form.
                */
               setEmail("");
               setPassword("");
          } catch (error) {
               /*
                * If anything goes wrong after token creation,
                * don't leave an invalid token behind.
                */
               localStorage.removeItem("accessToken");

               setAuthUser(null);

               enqueueSnackbar(
                    error?.response?.data?.message ||
                    "Server error or invalid credentials.",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setAuthUserLoading(false);
          }
     };


     /*
      * ============================================================
      * ADMIN LOGIN
      * ============================================================
      */

     const handleAdminLogin = async () => {
          try {
               const res = await loginAdmin(email, password);

               /*
                * Backend must return:
                *
                * {
                *    success: true,
                *    accessToken: "...",
                *    admin: {...}
                * }
                */
               if (!res?.success || !res?.accessToken) {
                    enqueueSnackbar(
                         res?.message || "Admin login failed.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               /*
                * Store ONLY ONE token.
                */
               localStorage.setItem("accessToken", res.accessToken);

               /*
                * User state must be empty because only one
                * account type can be authenticated at a time.
                */
               setAuthUser(null);

               /*
                * Fetch admin using the JWT.
                */
               setAuthAdminLoading(true);

               const currentAdminResponse = await getCurrentAdmin();

               if (
                    !currentAdminResponse?.success ||
                    !currentAdminResponse?.admin
               ) {
                    localStorage.removeItem("accessToken");

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
                * Update React authentication state.
                */
               setAuthAdmin(currentAdminResponse.admin);
               setAuthUser(null);

               enqueueSnackbar("Logged in successfully as Admin", {
                    variant: "success",
               });

               /*
                * Close dialog.
                */
               setOpenLoginDialog(false);

               /*
                * Clear form.
                */
               setEmail("");
               setPassword("");

               /*
                * Admin always goes to dashboard.
                */
               navigate("/admin/dashboard");
          } catch (error) {
               /*
                * Never leave a bad token behind.
                */
               localStorage.removeItem("accessToken");

               setAuthAdmin(null);

               enqueueSnackbar(
                    error?.response?.data?.message ||
                    "Server error or invalid credentials.",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setAuthAdminLoading(false);
          }
     };


     /*
      * ============================================================
      * LOGIN SUBMIT
      * ============================================================
      */

     const handleLoginSubmit = async (e) => {
          e.preventDefault();

          if (loading) return;

          setLoading(true);

          try {
               if (loginType === "user") {
                    await handleUserLogin();
               } else {
                    await handleAdminLogin();
               }
          } finally {
               setLoading(false);
          }
     };


     /*
      * ============================================================
      * CLOSE DIALOG
      * ============================================================
      */

     const handleClose = () => {
          if (loading || googleLoginLoading) return;

          setOpenLoginDialog(false);
          setEmail("");
          setPassword("");
          setShowPassword(false);
     };


     return (
          <Dialog
               open={openLoginDialog}
               onClose={handleClose}
               maxWidth="xs"
               fullWidth
               slots={{
                    transition: Transition,
               }}
               slotProps={{
                    paper: {
                         sx: {
                              backgroundColor: "transparent",
                              boxShadow: 24,
                              borderRadius: 1,
                         },
                    },
               }}
          >
               <DialogContent className="relative p-6 bg-white/20 dark:bg-black/50 rounded-md backdrop-blur-sm">
                    {googleLoginLoading && <GoogleLoadingOverlay />}

                    <div
                         className={
                              googleLoginLoading
                                   ? "pointer-events-none select-none"
                                   : ""
                         }
                    >
                         <h2 className="text-lg font-semibold text-center text-gray-300 dark:text-gray-200">
                              Welcome to
                         </h2>

                         <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
                              {company?.name}
                         </h1>


                         {/* ==================================================
                        LOGIN TYPE
                    ================================================== */}

                         <div className="mb-4 flex justify-center">
                              <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">

                                   <button
                                        type="button"
                                        onClick={() => {
                                             setLoginType("user");
                                             setShowPassword(false);
                                        }}
                                        className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "user"
                                                  ? "bg-[#843E71] text-white"
                                                  : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                             }`}
                                   >
                                        User
                                   </button>


                                   <button
                                        type="button"
                                        onClick={() => {
                                             setLoginType("admin");
                                             setShowPassword(false);
                                        }}
                                        className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "admin"
                                                  ? "bg-[#843E71] text-white"
                                                  : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                             }`}
                                   >
                                        Admin
                                   </button>

                              </div>
                         </div>


                         {/* ==================================================
                        LOGIN FORM
                    ================================================== */}

                         <form
                              onSubmit={handleLoginSubmit}
                              className="space-y-3"
                         >

                              <input
                                   type="email"
                                   placeholder="Email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] placeholder-gray-600 dark:placeholder-gray-400"
                                   required
                              />


                              <div className="relative w-full">

                                   <input
                                        type={
                                             showPassword
                                                  ? "text"
                                                  : "password"
                                        }
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) =>
                                             setPassword(e.target.value)
                                        }
                                        className="w-full pr-10 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] placeholder-gray-600 dark:placeholder-gray-400"
                                        required
                                   />


                                   <button
                                        type="button"
                                        onClick={() =>
                                             setShowPassword(
                                                  (prev) => !prev
                                             )
                                        }
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
                                        tabIndex={-1}
                                   >
                                        {showPassword ? (
                                             <Eye />
                                        ) : (
                                             <EyeOff />
                                        )}
                                   </button>

                              </div>


                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >

                                   {loading && (
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                   )}

                                   {loading
                                        ? "Logging in..."
                                        : "Login"}

                              </button>

                         </form>


                         {/* ==================================================
                        SIGNUP LINK
                    ================================================== */}

                         {loginType === "user" && (
                              <div className="mt-4 text-center">

                                   <p className="text-sm text-gray-300 dark:text-gray-300">
                                        Don't have an account?{" "}

                                        <Link
                                             to="/signup"
                                             onClick={() => {
                                                  setOpenLoginDialog(false);
                                             }}
                                             className="text-[#a82d87] hover:underline cursor-pointer"
                                        >
                                             Sign Up
                                        </Link>

                                   </p>

                              </div>
                         )}


                         {/* ==================================================
                        GOOGLE LOGIN
                    ================================================== */}

                         {loginType === "user" ? (
                              <>
                                   <div className="flex items-center w-full mt-3">

                                        <div className="border-t border-gray-400 dark:border-gray-600 flex-grow mr-3" />

                                        <span className="text-gray-300 dark:text-gray-300 text-sm">
                                             or login with
                                        </span>

                                        <div className="border-t border-gray-400 dark:border-gray-600 flex-grow ml-3" />

                                   </div>


                                   <div className="w-full flex justify-center pt-3">

                                        <GoogleLoginComponent
                                             openLoginDialog={openLoginDialog}
                                             setOpenLoginDialog={
                                                  setOpenLoginDialog
                                             }
                                             setGoogleLoginLoading={
                                                  setGoogleLoginLoading
                                             }
                                        />

                                   </div>
                              </>
                         ) : null}

                    </div>
               </DialogContent>
          </Dialog>
     )
}