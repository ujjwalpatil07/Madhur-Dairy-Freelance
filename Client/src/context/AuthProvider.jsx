import React, {
     useEffect,
     useMemo,
     useState,
     createContext,
     useCallback,
} from "react";

import { getCurrentUser } from "../services/userService";
import { getCurrentAdmin } from "../services/adminService";
import { socket } from "../socket/socket";
import { getSavedAddresses } from "../services/userProfileService";

export const UserAuthContext = createContext();
export const AdminAuthContext = createContext();


export const AuthProvider = ({ children }) => {

     /*
      * ============================================================
      * AUTH STATE
      * ============================================================
      */

     const [authUser, setAuthUser] = useState(null);
     const [authAdmin, setAuthAdmin] = useState(null);

     const [authUserLoading, setAuthUserLoading] = useState(true);
     const [authAdminLoading, setAuthAdminLoading] = useState(true);

     const [openLoginDialog, setOpenLoginDialog] = useState(false);


     /*
      * ============================================================
      * DELIVERY ADDRESS
      * ============================================================
      */

     const storedAddress = JSON.parse(
          localStorage.getItem("deliveryAddress")
     );

     const [deliveryAddress, setDeliveryAddress] = useState(
          storedAddress || null
     );


     /*
      * ============================================================
      * JWT ROLE HELPER
      * ============================================================
      *
      * accessToken payload:
      *
      * USER:
      * {
      *    userId: "...",
      *    role: "user"
      * }
      *
      * ADMIN:
      * {
      *    adminId: "...",
      *    role: "admin"
      * }
      *
      * The token decides who is logged in.
      */

     const getTokenRole = useCallback(() => {
          const token = localStorage.getItem("accessToken");

          if (!token) {
               return null;
          }

          try {
               const payload = JSON.parse(
                    atob(token.split(".")[1])
               );

               return payload?.role || null;
          } catch (error) {
               console.error("Invalid access token:", error);
               return null;
          }
     }, []);


     /*
      * ============================================================
      * USER DATA
      * ============================================================
      */

     const fetchUserData = useCallback(async () => {
          try {
               setAuthUserLoading(true);

               const token = localStorage.getItem("accessToken");

               if (!token) {
                    setAuthUser(null);
                    setDeliveryAddress(null);
                    return null;
               }

               const role = getTokenRole();

               /*
                * This token belongs to admin.
                * Therefore it must never be used to authenticate
                * the user.
                */
               if (role !== "user") {
                    setAuthUser(null);
                    setDeliveryAddress(null);
                    return null;
               }

               const userData = await getCurrentUser();
               const user = userData?.user;

               if (!user) {
                    setAuthUser(null);
                    setDeliveryAddress(null);
                    return null;
               }

               setAuthUser(user);
               setAuthAdmin(null);


               /*
                * Fetch user's saved delivery address.
                */
               try {
                    const addressData = await getSavedAddresses(user._id);

                    const firstAddress =
                         addressData?.userAddresses?.[0] || null;

                    setDeliveryAddress(firstAddress);

               } catch (error) {
                    console.error(
                         "Failed to fetch saved address:",
                         error
                    );

                    setDeliveryAddress(null);
               }

               return user;

          } catch (error) {
               console.error(
                    "Failed to fetch user authentication:",
                    error
               );

               setAuthUser(null);
               setDeliveryAddress(null);

               return null;

          } finally {
               setAuthUserLoading(false);
          }
     }, [getTokenRole]);


     /*
      * ============================================================
      * ADMIN DATA
      * ============================================================
      */

     const fetchAdminData = useCallback(async () => {
          try {
               setAuthAdminLoading(true);

               const token = localStorage.getItem("accessToken");

               if (!token) {
                    setAuthAdmin(null);
                    return null;
               }

               const role = getTokenRole();

               /*
                * This token belongs to user.
                * Therefore it must never be used to authenticate
                * the admin.
                */
               if (role !== "admin") {
                    setAuthAdmin(null);
                    return null;
               }

               const adminData = await getCurrentAdmin();
               const admin = adminData?.admin;

               if (!admin) {
                    setAuthAdmin(null);
                    return null;
               }

               setAuthAdmin(admin);
               setAuthUser(null);
               setDeliveryAddress(null);

               return admin;

          } catch (error) {
               console.error(
                    "Failed to fetch admin authentication:",
                    error
               );

               setAuthAdmin(null);

               return null;

          } finally {
               setAuthAdminLoading(false);
          }
     }, [getTokenRole]);


     /*
      * ============================================================
      * AUTH BOOTSTRAP
      * ============================================================
      *
      * ONLY accessToken is stored.
      *
      * On application start:
      *
      * accessToken
      *      ↓
      * decode JWT
      *      ↓
      * role
      *   /     \
      * user    admin
      *   ↓       ↓
      * user/me admin/me
      *
      * There is NO user/admin token switching.
      */

     useEffect(() => {

          let isMounted = true;

          const initializeAuth = async () => {

               const token = localStorage.getItem("accessToken");


               /*
                * ====================================================
                * NO TOKEN
                * ====================================================
                */

               if (!token) {

                    if (isMounted) {
                         setAuthUser(null);
                         setAuthAdmin(null);
                         setDeliveryAddress(null);

                         setAuthUserLoading(false);
                         setAuthAdminLoading(false);
                    }

                    return;
               }


               /*
                * ====================================================
                * READ TOKEN ROLE
                * ====================================================
                */

               let role = null;

               try {
                    const payload = JSON.parse(
                         atob(token.split(".")[1])
                    );

                    role = payload?.role;

               } catch (error) {

                    console.error(
                         "Failed to decode access token:",
                         error
                    );

                    if (isMounted) {
                         setAuthUser(null);
                         setAuthAdmin(null);
                         setDeliveryAddress(null);

                         localStorage.removeItem("accessToken");

                         setAuthUserLoading(false);
                         setAuthAdminLoading(false);
                    }

                    return;
               }


               /*
                * ====================================================
                * USER TOKEN
                * ====================================================
                */

               if (role === "user") {

                    setAuthAdmin(null);
                    setAuthAdminLoading(false);

                    try {

                         setAuthUserLoading(true);

                         const userData = await getCurrentUser();
                         const user = userData?.user;


                         if (!user) {
                              throw new Error(
                                   "User authentication failed"
                              );
                         }


                         if (isMounted) {

                              setAuthUser(user);

                              /*
                               * Fetch saved delivery address.
                               */
                              try {

                                   const addressData =
                                        await getSavedAddresses(user._id);

                                   const firstAddress =
                                        addressData?.userAddresses?.[0] ||
                                        null;

                                   setDeliveryAddress(
                                        firstAddress
                                   );

                              } catch (error) {

                                   console.error(
                                        "Failed to fetch saved address:",
                                        error
                                   );

                                   setDeliveryAddress(null);
                              }
                         }

                    } catch (error) {

                         console.error(
                              "User authentication failed:",
                              error
                         );

                         if (isMounted) {

                              setAuthUser(null);
                              setDeliveryAddress(null);

                              /*
                               * Token is invalid/expired.
                               */
                              localStorage.removeItem(
                                   "accessToken"
                              );

                              localStorage.removeItem(
                                   "deliveryAddress"
                              );
                         }

                    } finally {

                         if (isMounted) {
                              setAuthUserLoading(false);
                         }
                    }

                    return;
               }


               /*
                * ====================================================
                * ADMIN TOKEN
                * ====================================================
                */

               if (role === "admin") {

                    setAuthUser(null);
                    setDeliveryAddress(null);
                    setAuthUserLoading(false);

                    try {

                         setAuthAdminLoading(true);

                         const adminData =
                              await getCurrentAdmin();

                         const admin =
                              adminData?.admin;


                         if (!admin) {
                              throw new Error(
                                   "Admin authentication failed"
                              );
                         }


                         if (isMounted) {
                              setAuthAdmin(admin);
                         }

                    } catch (error) {

                         console.error(
                              "Admin authentication failed:",
                              error
                         );

                         if (isMounted) {

                              setAuthAdmin(null);

                              /*
                               * Token is invalid/expired.
                               */
                              localStorage.removeItem(
                                   "accessToken"
                              );
                         }

                    } finally {

                         if (isMounted) {
                              setAuthAdminLoading(false);
                         }
                    }

                    return;
               }


               /*
                * ====================================================
                * INVALID ROLE
                * ====================================================
                */

               console.error(
                    "Invalid role inside access token:",
                    role
               );

               if (isMounted) {

                    setAuthUser(null);
                    setAuthAdmin(null);
                    setDeliveryAddress(null);

                    localStorage.removeItem(
                         "accessToken"
                    );

                    localStorage.removeItem(
                         "deliveryAddress"
                    );

                    setAuthUserLoading(false);
                    setAuthAdminLoading(false);
               }
          };


          initializeAuth();


          return () => {
               isMounted = false;
          };

     }, []);


     /*
      * ============================================================
      * USER LOGOUT
      * ============================================================
      *
      * USER LOGOUT:
      *
      * authUser → null
      * authAdmin → null
      * accessToken → removed
      *
      * No token switching.
      */

     const handleUserLogout = useCallback(() => {

          if (socket && authUser?._id) {
               socket.emit("client:logout", {
                    userId: authUser._id,
               });
          }

          setAuthUser(null);
          setAuthAdmin(null);

          setDeliveryAddress(null);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("deliveryAddress");

     }, [authUser?._id]);


     /*
      * ============================================================
      * ADMIN LOGOUT
      * ============================================================
      *
      * ADMIN LOGOUT:
      *
      * authAdmin → null
      * authUser → null
      * accessToken → removed
      *
      * IMPORTANT:
      * There is NO admin → user token preservation.
      */

     const handleAdminLogout = useCallback(() => {
          if (socket && authAdmin?._id) {
               socket.emit("client:logout", {
                    adminId: authAdmin._id,
               });
          }

          setAuthAdmin(null);
          localStorage.removeItem("accessToken");
     }, [authAdmin?._id]);


     /*
      * ============================================================
      * ADMIN CONTEXT
      * ============================================================
      */

     const value1 = useMemo(
          () => ({
               authAdmin,
               authAdminLoading,

               setAuthAdmin,
               setAuthAdminLoading,

               handleAdminLogout,
               fetchAdminData,
          }),
          [
               authAdmin,
               authAdminLoading,
               handleAdminLogout,
               fetchAdminData,
          ]
     );


     /*
      * ============================================================
      * USER CONTEXT
      * ============================================================
      */

     const value2 = useMemo(
          () => ({
               authUser,
               deliveryAddress,
               authUserLoading,

               openLoginDialog,

               setAuthUser,
               setDeliveryAddress,
               setAuthUserLoading,

               setOpenLoginDialog,

               handleUserLogout,
               fetchUserData,
          }),
          [
               authUser,
               deliveryAddress,
               authUserLoading,
               openLoginDialog,

               handleUserLogout,
               fetchUserData,
          ]
     );


     /*
      * ============================================================
      * PROVIDERS
      * ============================================================
      */

     return (
          <AdminAuthContext.Provider value={value1}>
               <UserAuthContext.Provider value={value2}>
                    {children}
               </UserAuthContext.Provider>
          </AdminAuthContext.Provider>
     );
};