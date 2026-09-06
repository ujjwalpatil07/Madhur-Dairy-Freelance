import { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Sidebar from "../components/AdminComponents/Sidebar";
import { useLocation, Link } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarProvider";
import AdminNavbar from "../components/AdminComponents/AdminNavbar";
import { AdminAuthContext } from "../context/AuthProvider";
import AdminOrderProvider from "../context/AdminOrderProvider";

export default function AdminLayout({ children }) {

    const scrollRef = useRef(null);
    const location = useLocation();

    const { authAdmin, authAdminLoading } = useContext(AdminAuthContext);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0 });
        }
    }, [location.pathname]);

    const isAdminInStorage = localStorage.getItem("Admin");

    if (authAdminLoading) {
        return (
            <div className="h-screen p-4 gap-3 flex justify-center items-center bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-[#843E71]"></div>
                <p className="text-sm animate-pulse">Loading admin details...</p>
            </div>
        );
    }

    if (!isAdminInStorage && !authAdmin) {
        return (
            <div className="h-screen p-4 flex flex-col items-center justify-center text-center space-y-4 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                <span className="text-red-500 font-medium">
                    Unauthorized access. Please login as admin.
                </span>
                <Link
                    to="/admin/login"
                    className="px-4 py-2 bg-[#843E71] text-white rounded hover:bg-[#843E7190] transition"
                >
                    Go to Admin Login
                </Link>
            </div>
        );
    }

    return (
        <AdminOrderProvider>
            <SidebarProvider>
                <div ref={scrollRef} className="h-screen scroll-smooth flex overflow-hidden bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">
                    <Sidebar />
                    <main className="flex-1 h-full overflow-y-auto overflow-x-hidden">
                        <AdminNavbar />
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </AdminOrderProvider>
    )
}

AdminLayout.propTypes = {
    children: PropTypes.node
};