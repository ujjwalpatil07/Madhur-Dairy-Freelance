import React, { useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserProfileSidebar from "../components/UserProfileSidebar";
import { UserAuthContext } from "../context/AuthProvider";
import PropTypes from "prop-types"

export default function UserProfileLayout({ children }) {
    const scrollRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate()
    const { authUser, authUserLoading } = useContext(UserAuthContext);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0 });
        }
    }, [location.pathname]);

    const isUserInStorage = localStorage.getItem("User");

    if (authUserLoading) {
        return (
            <div className="h-screen p-4 gap-3 flex justify-center items-center bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
                <p className="text-sm animate-pulse">Loading your profile... Please wait.</p>
            </div>
        );
    }

    if (!isUserInStorage || !authUser) {
        return (
            <div className="h-screen p-4 flex flex-col items-center justify-center text-center space-y-4 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                <span className="text-red-500 font-medium">You must be logged in to access this page.</span>
                <button onClick={() => navigate("/login")} className="px-4 py-2 bg-[#843E71] text-white rounded hover:bg-[#843E7190] transition">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="h-screen scroll-smooth flex  flex-col overflow-y-auto overflow-x-hidden bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300"
        >
            <Navbar />

            <main className="w-full sm:w-auto md:mx-10 lg:mx-52 flex-1 flex flex-col md:flex-row py-5 p-3 gap-5 h-full md:h-[calc(100vh-64px)]">
                <div className="hidden md:block">
                    <UserProfileSidebar />
                </div>

                <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden rounded-lg shadow-md scrollbar-hide bg-white dark:bg-gray-500/20 dark:text-white p-4 transition-all duration-300 border-y-15 border-white dark:border-transparent">
                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

UserProfileLayout.propTypes = {
    children: PropTypes.node
};