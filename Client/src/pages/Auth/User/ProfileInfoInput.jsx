// ProfileInfoInput.jsx

import React, {
     useContext,
     useEffect,
     useRef,
     useState,
} from "react";
import { TextField, Button } from "@mui/material";
import {
     useLocation,
     useNavigate,
} from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeProvider";
import { maharashtraCities } from "../../../data/cities";
import {
     AdminAuthContext,
     UserAuthContext,
} from "../../../context/AuthProvider";
import { useSnackbar } from "notistack";
import {
     submitSignupForm,
} from "../../../services/userProfileService";
import {
     getCurrentUser,
} from "../../../services/userService";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// ============================================================
// Profile Photo Upload
// ============================================================

function ProfilePhotoUpload({
     photo,
     isLoading,
     handlePhotoChange,
}) {
     return (
          <div className="relative w-24 h-24 rounded-full mx-auto mb-8">
               <img
                    src={
                         photo ||
                         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJu-PalNLype77rVV-6AeFIeoDPm22_ruvpA&s"
                    }
                    alt="Profile Preview"
                    className={`w-24 h-24 rounded-full object-cover border border-gray-300 transition-opacity duration-300 ${isLoading
                              ? "opacity-50"
                              : "opacity-100"
                         }`}
               />

               <label
                    htmlFor="photoInput"
                    className={`absolute bottom-0 right-0 bg-white dark:bg-gray-200 rounded-full p-1 cursor-pointer border transition-opacity duration-300 ${isLoading
                              ? "cursor-not-allowed opacity-50"
                              : ""
                         }`}
               >
                    <i className="fas fa-edit text-[#843E71]" />
               </label>

               <input
                    type="file"
                    accept="image/*"
                    id="photoInput"
                    onChange={handlePhotoChange}
                    disabled={isLoading}
                    className="hidden"
               />
          </div>
     );
}

// ============================================================
// Profile Form Fields
// ============================================================

function ProfileFormFields({
     profileInfo,
     isLoading,
     theme,
     handleInputChange,
     getTextFieldStyles,
     maharashtraCities,
}) {
     return (
          <>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                         label="First Name"
                         name="firstName"
                         value={profileInfo?.firstName}
                         onChange={handleInputChange}
                         fullWidth
                         required
                         disabled={isLoading}
                         sx={{
                              ...getTextFieldStyles(theme),
                              ...(isLoading && {
                                   pointerEvents: "none",
                                   opacity: 0.7,
                              }),
                         }}
                    />

                    <TextField
                         label="Last Name"
                         name="lastName"
                         value={profileInfo?.lastName}
                         onChange={handleInputChange}
                         fullWidth
                         required
                         disabled={isLoading}
                         sx={{
                              ...getTextFieldStyles(theme),
                              ...(isLoading && {
                                   pointerEvents: "none",
                                   opacity: 0.7,
                              }),
                         }}
                    />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <TextField
                         label="Phone Number"
                         name="mobileNo"
                         value={profileInfo.mobileNo}
                         onChange={handleInputChange}
                         fullWidth
                         required
                         disabled={isLoading}
                         sx={{
                              ...getTextFieldStyles(theme),
                              ...(isLoading && {
                                   pointerEvents: "none",
                                   opacity: 0.7,
                              }),
                         }}
                    />

                    <select
                         name="gender"
                         required
                         value={profileInfo.gender}
                         onChange={handleInputChange}
                         disabled={isLoading}
                         className={`border border-gray-300 rounded-md p-3 w-full text-[#555] dark:text-[#ccc] focus:border-[#843E71] hover:border-[#843E71] transition duration-200 ease-in-out ${isLoading
                                   ? "cursor-not-allowed opacity-70"
                                   : ""
                              }`}
                    >
                         <option
                              value=""
                              className="text-black dark:text-white bg-white dark:bg-gray-500"
                         >
                              Select Gender
                         </option>

                         <option
                              value="Female"
                              className="text-black dark:text-white bg-white dark:bg-gray-500"
                         >
                              Female
                         </option>

                         <option
                              value="Male"
                              className="text-black dark:text-white bg-white dark:bg-gray-500"
                         >
                              Male
                         </option>

                         <option
                              value="Other"
                              className="text-black dark:text-white bg-white dark:bg-gray-500"
                         >
                              Other
                         </option>
                    </select>
               </div>

               <TextField
                    label="Username"
                    name="username"
                    value={profileInfo?.username}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    disabled={isLoading}
                    sx={{
                         ...getTextFieldStyles(theme),
                         ...(isLoading && {
                              pointerEvents: "none",
                              opacity: 0.7,
                         }),
                    }}
                    className="!mb-5"
               />

               <TextField
                    label="Shop Name"
                    name="shopName"
                    value={profileInfo?.shopName}
                    onChange={handleInputChange}
                    fullWidth
                    disabled={isLoading}
                    sx={{
                         ...getTextFieldStyles(theme),
                         ...(isLoading && {
                              pointerEvents: "none",
                              opacity: 0.7,
                         }),
                    }}
                    className="!mb-5"
               />

               <TextField
                    label="Address"
                    name="streetAddress"
                    value={profileInfo?.address?.streetAddress}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    disabled={isLoading}
                    sx={{
                         ...getTextFieldStyles(theme),
                         ...(isLoading && {
                              pointerEvents: "none",
                              opacity: 0.7,
                         }),
                    }}
                    className="!mb-5"
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <select
                         name="city"
                         required
                         value={profileInfo?.address?.city}
                         onChange={handleInputChange}
                         disabled={isLoading}
                         className={`border border-gray-300 rounded-md p-3 w-full text-[#555] dark:text-[#ccc] focus:border-[#843E71] hover:border-[#843E71] transition duration-200 ease-in-out ${isLoading
                                   ? "cursor-not-allowed opacity-70"
                                   : ""
                              }`}
                    >
                         <option
                              value=""
                              className="text-black dark:text-white bg-white dark:bg-gray-500"
                         >
                              Select City
                         </option>

                         {maharashtraCities.map((city, idx) => (
                              <option
                                   key={idx}
                                   value={city}
                                   className="text-black dark:text-white bg-white dark:bg-gray-500"
                              >
                                   {city}
                              </option>
                         ))}
                    </select>

                    <TextField
                         label="Pincode"
                         name="pincode"
                         value={profileInfo?.address?.pincode}
                         onChange={handleInputChange}
                         fullWidth
                         required
                         disabled={isLoading}
                         sx={{
                              ...getTextFieldStyles(theme),
                              ...(isLoading && {
                                   pointerEvents: "none",
                                   opacity: 0.7,
                              }),
                         }}
                    />
               </div>
          </>
     );
}

// ============================================================
// Main Component
// ============================================================

export default function ProfileInfoInput() {
     const navigate = useNavigate();
     const location = useLocation();

     const userData = location?.state?.formData;
     const loginUser = location?.state?.user;

     const {
          enqueueSnackbar,
     } = useSnackbar();

     const {
          setAuthUser,
          setAuthUserLoading,
     } = useContext(UserAuthContext);

     const {
          handleAdminLogout,
     } = useContext(AdminAuthContext);

     const {
          theme,
     } = useContext(ThemeContext);

     const viaLogin = location?.state?.viaLogin;

     const hasShownSnackbar = useRef(false);

     // ============================================================
     // Check authentication / signup state
     // ============================================================

     useEffect(() => {
          const accessToken =
               localStorage.getItem("accessToken");

          if (!accessToken) {
               enqueueSnackbar(
                    "Your session has expired. Please login again.",
                    {
                         variant: "error",
                    }
               );

               navigate("/login");
               return;
          }

          if (!viaLogin && !userData) {
               enqueueSnackbar(
                    "Signup information is missing. Please restart signup.",
                    {
                         variant: "error",
                    }
               );

               navigate("/signup");
          }
     }, [
          viaLogin,
          userData,
          enqueueSnackbar,
          navigate,
     ]);

     // ============================================================
     // Login flow message
     // ============================================================

     useEffect(() => {
          if (
               viaLogin &&
               !hasShownSnackbar.current
          ) {
               enqueueSnackbar(
                    "Fill the basic info before proceeding",
                    {
                         variant: "info",
                    }
               );

               hasShownSnackbar.current = true;
          }
     }, [enqueueSnackbar, viaLogin]);

     // ============================================================
     // Temporary data for UI only
     //
     // IMPORTANT:
     // This data is NOT used as authentication identity.
     // Backend gets user ID from JWT.
     // ============================================================

     const [authenticatedUser, setAuthenticatedUser] =
          useState(
               loginUser ||
               userData ||
               JSON.parse(
                    localStorage.getItem(
                         "tempUserData"
                    ) || "null"
               )
          );

     // ============================================================
     // For login flow, get actual authenticated user
     // from JWT /me endpoint
     // ============================================================

     useEffect(() => {
          const loadAuthenticatedUser = async () => {
               const accessToken =
                    localStorage.getItem("accessToken");

               if (!accessToken) {
                    return;
               }

               try {
                    const response =
                         await getCurrentUser();

                    if (
                         response?.success &&
                         response?.user
                    ) {
                         setAuthenticatedUser(
                              response.user
                         );
                    } else {
                         throw new Error(
                              "Unable to fetch authenticated user."
                         );
                    }
               } catch (error) {
                    console.error(
                         "Failed to load authenticated user:",
                         error
                    );

                    localStorage.removeItem(
                         "accessToken"
                    );

                    setAuthUser(null);

                    enqueueSnackbar(
                         "Your login session is invalid. Please login again.",
                         {
                              variant: "error",
                         }
                    );

                    navigate("/login");
               }
          };

          loadAuthenticatedUser();
     }, [
          enqueueSnackbar,
          navigate,
     ]);

     // ============================================================
     // Keep temporary signup information
     // only for prefilling UI
     // ============================================================

     useEffect(() => {
          if (!viaLogin && userData) {
               localStorage.setItem(
                    "tempUserData",
                    JSON.stringify(userData)
               );

               setAuthenticatedUser(userData);
          }
     }, [viaLogin, userData]);

     // ============================================================
     // Prevent accidental refresh
     // ============================================================

     useEffect(() => {
          const handleBeforeUnload = (e) => {
               e.preventDefault();
               e.returnValue = "";
          };

          window.addEventListener(
               "beforeunload",
               handleBeforeUnload
          );

          return () => {
               window.removeEventListener(
                    "beforeunload",
                    handleBeforeUnload
               );
          };
     }, []);

     // ============================================================
     // Text field styles
     // ============================================================

     const getTextFieldStyles = (theme) => ({
          input: {
               color:
                    theme === "dark"
                         ? "#fff"
                         : "#000",
          },

          "& label": {
               color:
                    theme === "dark"
                         ? "#ccc"
                         : "#555",

               "&.Mui-focused": {
                    color: "#843E71",
               },
          },

          "& .MuiOutlinedInput-root": {
               "& fieldset": {
                    borderColor:
                         theme === "dark"
                              ? "#999"
                              : "#ccc",
               },

               "&:hover fieldset": {
                    borderColor: "#843E71",
               },

               "&.Mui-focused fieldset": {
                    borderColor: "#843E71",
               },
          },
     });

     // ============================================================
     // Initial profile information
     // ============================================================

     const userInfo = authenticatedUser;

     const [profileInfo, setProfileInfo] =
          useState({
               firstName:
                    userInfo?.firstName || "",

               lastName:
                    userInfo?.lastName || "",

               mobileNo: "",

               gender: "",

               photo: "",

               username: "",

               address: {
                    streetAddress: "",
                    city: "",
                    pincode: "",
               },

               shopName: "",
          });

     // ============================================================
     // Update first/last name when authenticated user loads
     // ============================================================

     useEffect(() => {
          if (!authenticatedUser) {
               return;
          }

          setProfileInfo((prev) => ({
               ...prev,

               firstName:
                    authenticatedUser?.firstName ||
                    prev.firstName ||
                    "",

               lastName:
                    authenticatedUser?.lastName ||
                    prev.lastName ||
                    "",
          }));
     }, [authenticatedUser]);

     const [selectedFile, setSelectedFile] =
          useState(null);

     const [isLoading, setIsLoading] =
          useState(false);

     // ============================================================
     // Photo change
     // ============================================================

     const handlePhotoChange = (e) => {
          const file = e.target.files?.[0];

          if (!file) {
               return;
          }

          setSelectedFile(file);

          const imageUrl =
               URL.createObjectURL(file);

          setProfileInfo((prev) => ({
               ...prev,
               photo: imageUrl,
          }));
     };

     // ============================================================
     // Input change
     // ============================================================

     const handleInputChange = (e) => {
          const {
               name,
               value,
          } = e.target;

          if (
               [
                    "streetAddress",
                    "city",
                    "pincode",
               ].includes(name)
          ) {
               setProfileInfo(
                    (prevData) => ({
                         ...prevData,

                         address: {
                              ...prevData.address,
                              [name]: value,
                         },
                    })
               );
          } else {
               setProfileInfo(
                    (prevData) => ({
                         ...prevData,
                         [name]: value,
                    })
               );
          }
     };

     // ============================================================
     // Submit profile
     // ============================================================

     const handleFormSubmit = async (e) => {
          e.preventDefault();

          const accessToken =
               localStorage.getItem(
                    "accessToken"
               );

          if (!accessToken) {
               enqueueSnackbar(
                    "Your session has expired. Please login again.",
                    {
                         variant: "error",
                    }
               );

               navigate("/login");
               return;
          }

          setIsLoading(true);

          try {
               // ========================================================
               // IMPORTANT:
               // Do NOT append user ID.
               //
               // Backend gets:
               // req.user.userId
               //
               // from JWT middleware.
               // ========================================================

               const formData =
                    new FormData();

               formData.append(
                    "profileInfo",
                    JSON.stringify(profileInfo)
               );

               if (selectedFile) {
                    formData.append(
                         "photo",
                         selectedFile
                    );
               }

               const data =
                    await submitSignupForm(
                         formData
                    );

               if (!data?.success) {
                    enqueueSnackbar(
                         data?.message ||
                         "Something went wrong!",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               // ========================================================
               // Fetch the latest user from /me
               // using the JWT.
               // ========================================================

               setAuthUserLoading(true);

               const currentUserResponse =
                    await getCurrentUser();

               if (
                    !currentUserResponse?.success ||
                    !currentUserResponse?.user
               ) {
                    localStorage.removeItem(
                         "accessToken"
                    );

                    setAuthUser(null);

                    enqueueSnackbar(
                         "Profile updated, but your session could not be restored. Please login again.",
                         {
                              variant: "error",
                         }
                    );

                    navigate("/login");

                    return;
               }

               // ========================================================
               // Update React authentication context
               // ========================================================

               setAuthUser(
                    currentUserResponse.user
               );

               // ========================================================
               // Cleanup temporary signup data
               // ========================================================

               localStorage.removeItem(
                    "otp-status"
               );

               localStorage.removeItem(
                    "tempUserData"
               );

               // ========================================================
               // If an admin token was previously active,
               // logout admin context after successful user auth.
               // ========================================================

               handleAdminLogout();

               enqueueSnackbar(
                    viaLogin
                         ? "Basic details submitted!"
                         : "Profile created successfully!",
                    {
                         variant: "success",
                    }
               );

               navigate("/home");
          } catch (err) {
               console.error(
                    "Profile submission error:",
                    err
               );

               // If JWT expired/invalid, remove it.
               if (
                    err?.response?.status === 401
               ) {
                    localStorage.removeItem(
                         "accessToken"
                    );

                    setAuthUser(null);

                    enqueueSnackbar(
                         "Your session has expired. Please login again.",
                         {
                              variant: "error",
                         }
                    );

                    navigate("/login");

                    return;
               }

               enqueueSnackbar(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Server error occurred!",
                    {
                         variant: "error",
                    }
               );
          } finally {
               setAuthUserLoading(false);
               setIsLoading(false);
          }
     };

     // ============================================================
     // Render
     // ============================================================

     return (
          <motion.div
               initial={{
                    opacity: 0,
                    y: 30,
               }}
               animate={{
                    opacity: 1,
                    y: 0,
               }}
               transition={{
                    duration: 0.5,
               }}
               className="flex items-center justify-center px-4 py-10 overflow-auto min-h-screen bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300"
          >
               <motion.div
                    initial={{
                         scale: 0.95,
                         opacity: 0,
                    }}
                    animate={{
                         scale: 1,
                         opacity: 1,
                    }}
                    transition={{
                         duration: 0.5,
                         delay: 0.2,
                    }}
                    className="bg-white dark:bg-gray-500/20 rounded-2xl shadow-2xl px-4 md:px-6 py-8 w-full max-w-3xl"
               >
                    <motion.h1
                         initial={{
                              opacity: 0,
                              y: -10,
                         }}
                         animate={{
                              opacity: 1,
                              y: 0,
                         }}
                         transition={{
                              duration: 0.5,
                              delay: 0.3,
                         }}
                         className="text-3xl font-bold text-center text-[#843E71] mb-6 dark:text-[#e0b3d9]"
                    >
                         Complete Your Profile
                    </motion.h1>

                    <motion.form
                         className="space-y-5"
                         onSubmit={
                              handleFormSubmit
                         }
                         initial={{
                              opacity: 0,
                         }}
                         animate={{
                              opacity: 1,
                         }}
                         transition={{
                              duration: 0.5,
                              delay: 0.4,
                         }}
                    >
                         <ProfilePhotoUpload
                              photo={
                                   profileInfo.photo
                              }
                              isLoading={
                                   isLoading
                              }
                              handlePhotoChange={
                                   handlePhotoChange
                              }
                         />

                         <ProfileFormFields
                              profileInfo={
                                   profileInfo
                              }
                              isLoading={
                                   isLoading
                              }
                              theme={theme}
                              handleInputChange={
                                   handleInputChange
                              }
                              getTextFieldStyles={
                                   getTextFieldStyles
                              }
                              maharashtraCities={
                                   maharashtraCities
                              }
                         />

                         <motion.div
                              initial={{
                                   opacity: 0,
                                   y: 10,
                              }}
                              animate={{
                                   opacity: 1,
                                   y: 0,
                              }}
                              transition={{
                                   delay: 0.5,
                              }}
                              className="flex flex-col gap-2 mt-4 text-sm font-medium whitespace-break-spaces"
                         >
                              <label
                                   className={`flex items-center gap-2 ${isLoading
                                             ? "cursor-not-allowed opacity-70"
                                             : ""
                                        }`}
                              >
                                   <input
                                        type="checkbox"
                                        className="accent-[#843E71]"
                                        required
                                        disabled={
                                             isLoading
                                        }
                                   />

                                   I agree to all

                                   <span className="text-[#FF8682] whitespace-nowrap">
                                        Terms
                                   </span>

                                   and

                                   <span className="text-[#FF8682] whitespace-break-spaces">
                                        Privacy Policies
                                   </span>
                              </label>

                              <label
                                   className={`flex items-center gap-2 ${isLoading
                                             ? "cursor-not-allowed opacity-70"
                                             : ""
                                        }`}
                              >
                                   <input
                                        type="checkbox"
                                        className="accent-[#843E71]"
                                        disabled={
                                             isLoading
                                        }
                                   />

                                   Subscribe to all offers
                                   and updates
                              </label>
                         </motion.div>

                         <motion.div
                              initial={{
                                   opacity: 0,
                                   scale: 0.95,
                              }}
                              animate={{
                                   opacity: 1,
                                   scale: 1,
                              }}
                              transition={{
                                   delay: 0.6,
                              }}
                         >
                              <Button
                                   type="submit"
                                   variant="contained"
                                   fullWidth
                                   disabled={
                                        isLoading
                                   }
                                   className="!mt-6 !py-3 !text-lg !bg-[#843E71] hover:!bg-[#6f3260]"
                              >
                                   {isLoading
                                        ? "Submitting..."
                                        : "Submit"}
                              </Button>
                         </motion.div>
                    </motion.form>
               </motion.div>
          </motion.div>
     );
}

// ============================================================
// PropTypes
// ============================================================

ProfilePhotoUpload.propTypes = {
     photo: PropTypes.string,
     isLoading: PropTypes.bool,
     handlePhotoChange:
          PropTypes.func.isRequired,
};

ProfileFormFields.propTypes = {
     profileInfo:
          PropTypes.shape({
               firstName:
                    PropTypes.string,
               lastName:
                    PropTypes.string,
               mobileNo:
                    PropTypes.string,
               gender:
                    PropTypes.string,
               photo:
                    PropTypes.string,
               username:
                    PropTypes.string,
               address:
                    PropTypes.shape({
                         streetAddress:
                              PropTypes.string,
                         city:
                              PropTypes.string,
                         pincode:
                              PropTypes.string,
                    }),
               shopName:
                    PropTypes.string,
          }).isRequired,

     isLoading:
          PropTypes.bool,

     theme:
          PropTypes.string,

     handleInputChange:
          PropTypes.func.isRequired,

     getTextFieldStyles:
          PropTypes.func.isRequired,

     maharashtraCities:
          PropTypes.arrayOf(
               PropTypes.string
          ).isRequired,
};