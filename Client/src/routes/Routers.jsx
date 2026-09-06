import { Route, Routes, Navigate } from "react-router-dom"
import Layout from "../layouts/Layout";
import AdminLayout from "../layouts/AdminLayout";

import { AnimatePresence } from "framer-motion";


import UserLogin from "../pages/Auth/User/UserLogin";
import UserSignUp from "../pages/Auth/User/UserSignUp";
import AdminLogin from "../pages/Auth/Admin/AdminLogin";
import OtpVerification from "../pages/Auth/User/OtpVerification";
import ProfileInfoInput from "../pages/Auth/User/ProfileInfoInput";

import HomePage from "../pages/HomePage"
import LandingPage from "../pages/LandingPage"
import AboutPage from "../pages/AboutPage"
import ProductPage from "../pages/ProductPage"
import ProductDetailsPage from "../pages/ProductDetailsPage"
import CartPage from "../pages/CartPage"
import ContactPage from "../pages/ContactPage"
import OrderCheckoutPage from "../pages/OrderCheckoutPage"
import Dashboard from "../pages/Admin/Dashboard";
import Inventory from "../pages/Admin/Inventory";
import Orders from "../pages/Admin/Orders";
import UserProfileLayout from "../layouts/UserProfileLayout";
import AccountInfo from "../pages/UserProfile/AccountInfo";
import MyAddresses from "../pages/UserProfile/MyAddresses";
import MyOrders from "../pages/UserProfile/MyOrders";
import MyWishlist from "../pages/UserProfile/MyWishlist";
import Payments from "../pages/UserProfile/Payments";
import Stores from "../pages/Admin/Stores";
import StoreOrdersHistory from "../pages/Admin/StoreOrdersHistory";
import { useContext, useEffect } from "react";
import { socket } from "../socket/socket";
import AdminProfile from "../pages/Admin/AdminProfile";
import { AdminAuthContext, UserAuthContext } from "../context/AuthProvider";
import ForgetPassword from "../pages/Auth/User/ForgetPassword";
import ResetPassword from "../pages/Auth/User/ResetPassword";
import LoginDialog from "../pages/Auth/User/LoginDialog"

export default function Routers() {

    const localUser = localStorage.getItem("User");
    const { authUser } = useContext(UserAuthContext);
    const { authAdmin } = useContext(AdminAuthContext);

    useEffect(() => {
        if (!authUser?._id) return;

        socket.emit("user:register", { userId: authUser?._id });
    }, [authUser]);

    useEffect(() => {
        if (!authAdmin?._id) return;

        socket.emit("admin:register", { adminId: authAdmin?._id });
    }, [authAdmin]);

    return (
        <AnimatePresence>
            <Routes>
                <Route path="/" element={<Layout><LandingPage /></Layout>} />
                <Route path="/home" element={<Layout><HomePage /></Layout>} />

                <Route path="/login" element={<UserLogin />} />
                <Route path="/login/forget-password" element={<ForgetPassword />} />
                <Route path="/login/reset-password" element={<ResetPassword/>} />
                <Route path="/signup" element={<UserSignUp />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/signup/otp-verification" element={<OtpVerification />} />
                <Route path="/signup/info-input" element={<ProfileInfoInput />} />
                <Route path="/user-profile" element={<UserProfileLayout><AccountInfo /></UserProfileLayout>} />
                <Route path="/user-profile/addresses" element={<UserProfileLayout><MyAddresses /></UserProfileLayout>} />
                <Route path="/user-profile/orders" element={<UserProfileLayout><MyOrders /></UserProfileLayout>} />
                <Route path="/user-profile/wishlist" element={<UserProfileLayout><MyWishlist /></UserProfileLayout>} />
                <Route path="/user-profile/payments" element={<UserProfileLayout><Payments /></UserProfileLayout>} />

                <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
                <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
                <Route path="/admin/customers" element={<AdminLayout><Stores /></AdminLayout>} />
                <Route path="/admin/customers/:userId/orders-History" element={<AdminLayout><StoreOrdersHistory /></AdminLayout>} />

                <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                <Route path="/products/:productId?" element={<Layout><ProductPage /></Layout>} />
                <Route path="/product-details/:productId?" element={<Layout><ProductDetailsPage /></Layout>} />

                <Route path="/cart" element={<Layout><CartPage /></Layout>} />
                <Route path="/order-checkout" element={<Layout><OrderCheckoutPage /></Layout>} />

                <Route path="/contact-us" element={<Layout><ContactPage /></Layout>} />

                <Route path="*" element={<Navigate to={localUser ? "/home" : "/login"} replace />} />
            </Routes>

            <LoginDialog />
        </AnimatePresence>

    )
}