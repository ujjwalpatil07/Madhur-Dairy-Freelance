import React, { useContext } from "react";
import PropTypes from "prop-types";
import { GoogleLogin } from "@react-oauth/google";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

import {
     loginWithGoogle,
     getCurrentUser,
} from "../../../services/userService";

import {
     AdminAuthContext,
     UserAuthContext,
} from "../../../context/AuthProvider";

export default function GoogleLoginComponent({
     setOpenLoginDialog,
     setGoogleLoginLoading,
}) {
     const navigate = useNavigate();
     const { enqueueSnackbar } = useSnackbar();

     const { handleAdminLogout } = useContext(AdminAuthContext);

     const {
          setAuthUser,
          setAuthUserLoading,
     } = useContext(UserAuthContext);

     const handleGoogleLoginSuccess = async (credentialResponse) => {
          try {
               setGoogleLoginLoading(true);

               const res = await loginWithGoogle(
                    credentialResponse.credential
               );

               if (!res?.success || !res?.accessToken) {
                    enqueueSnackbar(
                         res?.message || "Google login failed.",
                         {
                              variant: "error",
                         }
                    );

                    return;
               }

               handleAdminLogout();

               localStorage.setItem(
                    "accessToken",
                    res.accessToken
               );

               if (!res?.filledBasicInfo) {
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

               setAuthUserLoading(true);

               const currentUserResponse =
                    await getCurrentUser();

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

               setAuthUser(
                    currentUserResponse.user
               );

               enqueueSnackbar(
                    "Login Successful!",
                    {
                         variant: "success",
                    }
               );

               navigate("/home");
          } catch (err) {

               localStorage.removeItem("accessToken");
               setAuthUser(null);

               const message =
                    err?.response?.data?.message ||
                    "Error logging in with Google.";

               enqueueSnackbar(message, {
                    variant: "error",
               });
          } finally {
               setAuthUserLoading(false);

               if (setOpenLoginDialog) {
                    setOpenLoginDialog(false);
               }

               setGoogleLoginLoading(false);
          }
     };

     const handleGoogleLoginError = () => {
          setGoogleLoginLoading(false);

          if (setOpenLoginDialog) {
               setOpenLoginDialog(false);
          }

          enqueueSnackbar(
               "Google Login Failed",
               {
                    variant: "error",
               }
          );
     };

     return (
          <GoogleLogin
               onSuccess={handleGoogleLoginSuccess}
               onError={handleGoogleLoginError}
          />
     );
}

GoogleLoginComponent.propTypes = {
     setOpenLoginDialog: PropTypes.func,
     setGoogleLoginLoading: PropTypes.func.isRequired,
};