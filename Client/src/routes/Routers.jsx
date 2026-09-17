import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";

import { AnimatePresence } from "framer-motion";

import UserLogin from "../pages/Auth/User/UserLogin";
import UserSignUp from "../pages/Auth/User/UserSignUp";
import AdminLogin from "../pages/Auth/Admin/AdminLogin";
import OtpVerification from "../pages/Auth/User/OtpVerification";
import ProfileInfoInput from "../pages/Auth/User/ProfileInfoInput";

import HomePage from "../pages/HomePage";
import LandingPage from "../pages/LandingPage";
import AboutPage from "../pages/AboutPage";
import ProductPage from "../pages/ProductPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import ContactPage from "../pages/ContactPage";
import OrderCheckoutPage from "../pages/OrderCheckoutPage";

import Dashboard from "../pages/Admin/Dashboard";
import Inventory from "../pages/Admin/Inventory";
import Orders from "../pages/Admin/Orders";
import Stores from "../pages/Admin/Stores";
import StoreOrdersHistory from "../pages/Admin/StoreOrdersHistory";
import AdminProfile from "../pages/Admin/AdminProfile";

import UserProfileLayout from "../layouts/UserProfileLayout";
import AccountInfo from "../pages/UserProfile/AccountInfo";
import MyAddresses from "../pages/UserProfile/MyAddresses";
import MyOrders from "../pages/UserProfile/MyOrders";
import MyWishlist from "../pages/UserProfile/MyWishlist";
import Payments from "../pages/UserProfile/Payments";

import { useContext, useEffect } from "react";
import { socket } from "../socket/socket";

import {
     AdminAuthContext,
     UserAuthContext,
} from "../context/AuthProvider";

import ForgetPassword from "../pages/Auth/User/ForgetPassword";
import ResetPassword from "../pages/Auth/User/ResetPassword";
import LoginDialog from "../pages/Auth/User/LoginDialog";


/*
 * ============================================================
 * USER PROTECTED ROUTE
 * ============================================================
 *
 * Only authenticated users can access these routes.
 *
 * If an admin is logged in:
 *      → redirect to admin dashboard
 *
 * If nobody is logged in:
 *      → normally redirect to /login
 *
 * IMPORTANT:
 * During user logout, Navbar opens the LoginDialog.
 * In that situation authUser becomes null before/while the
 * navigation happens.
 *
 * We must NOT redirect to /login in that case.
 * Instead we redirect to the public landing page (/).
 */

const ProtectedRoute = ({ children }) => {

     const {
          authUser,
          authUserLoading,
          openLoginDialog,
     } = useContext(UserAuthContext);

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);


     /*
      * Wait until AuthProvider has finished determining
      * who owns the accessToken.
      */
     if (authUserLoading || authAdminLoading) {
          return null;
     }


     /*
      * Admin is logged in.
      *
      * Admin cannot access user-protected pages.
      */
     if (authAdmin?._id) {
          return <Navigate to="/admin/dashboard" replace />;
     }


     /*
      * No user is logged in.
      *
      * If LoginDialog is open, this means the user intentionally
      * logged out and the application wants to show the login
      * dialog on the landing page.
      *
      * Therefore:
      *
      * logout → /
      *
      * instead of:
      *
      * logout → /login
      */
     if (!authUser?._id) {

          if (openLoginDialog) {
               return <Navigate to="/" replace />;
          }

          return <Navigate to="/login" replace />;
     }


     /*
      * Authenticated user.
      */
     return children;
};


/*
 * ============================================================
 * ADMIN PROTECTED ROUTE
 * ============================================================
 *
 * Only authenticated admins can access these routes.
 *
 * If a user is logged in:
 *      → /home
 *
 * If nobody is logged in:
 *      → /admin/login
 */

const AdminRoute = ({ children }) => {
     const {
          authUser,
          authUserLoading,
          openLoginDialog,
     } = useContext(UserAuthContext);

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);

     if (authUserLoading || authAdminLoading) {
          return null;
     }

     // If a user is logged in, don't allow admin pages
     if (authUser?._id) {
          return <Navigate to="/home" replace />;
     }

     // Admin is logged in
     if (authAdmin?._id) {
          return children;
     }

     // Admin logged out intentionally
     // and login dialog should be opened on home page
     if (openLoginDialog) {
          return <Navigate to="/" replace />;
     }

     // Normal unauthenticated admin access
     return <Navigate to="/admin/login" replace />;
};


/*
 * ============================================================
 * GUEST / AUTH ROUTE
 * ============================================================
 *
 * These pages are available ONLY when nobody is logged in:
 *
 * /login
 * /signup
 * /signup/otp-verification
 * /login/forget-password
 * /login/reset-password
 * /admin/login
 *
 * If a user is already logged in:
 *      → /home
 *
 * If an admin is already logged in:
 *      → /admin/dashboard
 */

const GuestRoute = ({ children }) => {

     const {
          authUser,
          authUserLoading,
     } = useContext(UserAuthContext);

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);


     /*
      * Wait for AuthProvider.
      */
     if (authUserLoading || authAdminLoading) {
          return null;
     }


     /*
      * Admin has priority because only one role can be
      * authenticated at a time.
      */
     if (authAdmin?._id) {
          return (
               <Navigate
                    to="/admin/dashboard"
                    replace
               />
          );
     }


     /*
      * User is already logged in.
      */
     if (authUser?._id) {
          return (
               <Navigate
                    to="/home"
                    replace
               />
          );
     }


     /*
      * Nobody is authenticated.
      */
     return children;
};


/*
 * ============================================================
 * SIGNUP PROFILE COMPLETION ROUTE
 * ============================================================
 *
 * This route is special.
 *
 * After signup/login, the backend may return:
 *
 *      filledBasicInfo: false
 *
 * In that case the user is authenticated with a JWT but
 * still needs to complete their profile.
 *
 * Therefore this route requires a USER, but never an ADMIN.
 */

const SignupInfoRoute = ({ children }) => {

     const {
          authUser,
          authUserLoading,
     } = useContext(UserAuthContext);

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);


     /*
      * Wait for authentication.
      */
     if (authUserLoading || authAdminLoading) {
          return null;
     }


     /*
      * Admin cannot access signup profile completion.
      */
     if (authAdmin?._id) {
          return (
               <Navigate
                    to="/admin/dashboard"
                    replace
               />
          );
     }


     /*
      * User must be authenticated to complete profile.
      */
     if (!authUser?._id) {
          return (
               <Navigate
                    to="/login"
                    replace
               />
          );
     }


     return children;
};


/*
 * ============================================================
 * MAIN ROUTER
 * ============================================================
 */

export default function Routers() {

     const {
          authUser,
          authUserLoading,
     } = useContext(UserAuthContext);

     const {
          authAdmin,
          authAdminLoading,
     } = useContext(AdminAuthContext);


     /*
      * ============================================================
      * USER SOCKET REGISTRATION
      * ============================================================
      */

     useEffect(() => {

          if (authUserLoading) return;

          if (!authUser?._id) return;

          socket.emit("user:register", {
               userId: authUser._id,
          });

     }, [authUser, authUserLoading]);


     /*
      * ============================================================
      * ADMIN SOCKET REGISTRATION
      * ============================================================
      */

     useEffect(() => {

          if (authAdminLoading) return;

          if (!authAdmin?._id) return;

          socket.emit("admin:register", {
               adminId: authAdmin._id,
          });

     }, [authAdmin, authAdminLoading]);


     /*
      * ============================================================
      * ROUTES
      * ============================================================
      */

     return (
          <AnimatePresence>

               <Routes>

                    {/* ==================================================
                        LANDING PAGE
                    ================================================== */}

                    <Route
                         path="/"
                         element={
                              <Layout>
                                   <LandingPage />
                              </Layout>
                         }
                    />


                    {/* ==================================================
                        AUTH / GUEST ROUTES

                        These are accessible ONLY when logged out.
                    ================================================== */}

                    <Route
                         path="/login"
                         element={
                              <GuestRoute>
                                   <UserLogin />
                              </GuestRoute>
                         }
                    />


                    <Route
                         path="/login/forget-password"
                         element={
                              <GuestRoute>
                                   <ForgetPassword />
                              </GuestRoute>
                         }
                    />


                    <Route
                         path="/login/reset-password"
                         element={
                              <GuestRoute>
                                   <ResetPassword />
                              </GuestRoute>
                         }
                    />


                    <Route
                         path="/signup"
                         element={
                              <GuestRoute>
                                   <UserSignUp />
                              </GuestRoute>
                         }
                    />


                    <Route
                         path="/admin/login"
                         element={
                              <GuestRoute>
                                   <AdminLogin />
                              </GuestRoute>
                         }
                    />


                    <Route
                         path="/signup/otp-verification"
                         element={
                              <GuestRoute>
                                   <OtpVerification />
                              </GuestRoute>
                         }
                    />


                    {/* ==================================================
                        SIGNUP PROFILE COMPLETION

                        Special case:
                        authenticated user + incomplete profile.
                    ================================================== */}

                    <Route
                         path="/signup/info-input"
                         element={
                              <SignupInfoRoute>
                                   <ProfileInfoInput />
                              </SignupInfoRoute>
                         }
                    />


                    {/* ==================================================
                        PUBLIC PAGES
                    ================================================== */}

                    <Route
                         path="/about"
                         element={
                              <Layout>
                                   <AboutPage />
                              </Layout>
                         }
                    />


                    <Route
                         path="/products/:productId?"
                         element={
                              <Layout>
                                   <ProductPage />
                              </Layout>
                         }
                    />


                    <Route
                         path="/product-details/:productId?"
                         element={
                              <Layout>
                                   <ProductDetailsPage />
                              </Layout>
                         }
                    />


                    <Route
                         path="/cart"
                         element={
                              <Layout>
                                   <CartPage />
                              </Layout>
                         }
                    />


                    <Route
                         path="/contact-us"
                         element={
                              <Layout>
                                   <ContactPage />
                              </Layout>
                         }
                    />


                    {/* ==================================================
                        USER PROTECTED ROUTES
                    ================================================== */}

                    <Route
                         path="/home"
                         element={
                              <Layout>
                                   <HomePage />
                              </Layout>
                         }
                    />


                    <Route
                         path="/order-checkout"
                         element={
                              <ProtectedRoute>
                                   <Layout>
                                        <OrderCheckoutPage />
                                   </Layout>
                              </ProtectedRoute>
                         }
                    />


                    {/* ==================================================
                        USER PROFILE
                    ================================================== */}

                    <Route
                         path="/user-profile"
                         element={
                              <ProtectedRoute>
                                   <UserProfileLayout>
                                        <AccountInfo />
                                   </UserProfileLayout>
                              </ProtectedRoute>
                         }
                    />


                    <Route
                         path="/user-profile/addresses"
                         element={
                              <ProtectedRoute>
                                   <UserProfileLayout>
                                        <MyAddresses />
                                   </UserProfileLayout>
                              </ProtectedRoute>
                         }
                    />


                    <Route
                         path="/user-profile/orders"
                         element={
                              <ProtectedRoute>
                                   <UserProfileLayout>
                                        <MyOrders />
                                   </UserProfileLayout>
                              </ProtectedRoute>
                         }
                    />


                    <Route
                         path="/user-profile/wishlist"
                         element={
                              <ProtectedRoute>
                                   <UserProfileLayout>
                                        <MyWishlist />
                                   </UserProfileLayout>
                              </ProtectedRoute>
                         }
                    />


                    <Route
                         path="/user-profile/payments"
                         element={
                              <ProtectedRoute>
                                   <UserProfileLayout>
                                        <Payments />
                                   </UserProfileLayout>
                              </ProtectedRoute>
                         }
                    />


                    {/* ==================================================
                        ADMIN PROTECTED ROUTES
                    ================================================== */}

                    <Route
                         path="/admin/dashboard"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <Dashboard />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    <Route
                         path="/admin/profile"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <AdminProfile />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    <Route
                         path="/admin/inventory"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <Inventory />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    <Route
                         path="/admin/orders"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <Orders />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    <Route
                         path="/admin/customers"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <Stores />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    <Route
                         path="/admin/customers/:userId/orders-History"
                         element={
                              <AdminRoute>
                                   <AdminLayout>
                                        <StoreOrdersHistory />
                                   </AdminLayout>
                              </AdminRoute>
                         }
                    />


                    {/* ==================================================
                        FALLBACK
                    ================================================== */}

                    <Route
                         path="*"
                         element={
                              authAdminLoading ||
                                   authUserLoading ? (
                                   null
                              ) : authAdmin?._id ? (
                                   <Navigate
                                        to="/admin/dashboard"
                                        replace
                                   />
                              ) : authUser?._id ? (
                                   <Navigate
                                        to="/home"
                                        replace
                                   />
                              ) : (
                                   <Navigate
                                        to="/"
                                        replace
                                   />
                              )
                         }
                    />

               </Routes>


               {/* Global Login Dialog */}
               <LoginDialog />

          </AnimatePresence>
     );
}