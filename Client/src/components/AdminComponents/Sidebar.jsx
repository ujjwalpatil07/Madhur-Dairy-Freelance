import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Drawer from '@mui/material/Drawer';
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import StoreIcon from "@mui/icons-material/Store";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from "@mui/icons-material/Logout";

import { ThemeContext } from "../../context/ThemeProvider";
import { AdminAuthContext, UserAuthContext } from "../../context/AuthProvider";

import logoDarkMode from "../../assets/logoDarkMode.png";
import logoLightMode from "../../assets/logoLightMode.png";
import { SidebarContext } from "../../context/SidebarProvider";
import { AdminOrderContext } from "../../context/AdminOrderProvider";
import { User } from "lucide-react";

export default function Sidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const { isSidebarOpen, setIsSidebarOpen } = useContext(SidebarContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { handleAdminLogout } = useContext(AdminAuthContext);
    const { setOpenLoginDialog } = useContext(UserAuthContext);
    const { adminOrders, orderLoading } = useContext(AdminOrderContext);

    const navItems = [
        { label: "Dashboard", icon: <DashboardIcon sx={{ fontSize: "1.2rem" }} />, to: "/admin/dashboard" },
        { label: "Inventory", icon: <InventoryIcon sx={{ fontSize: "1.2rem" }} />, to: "/admin/inventory" },
        { label: "Orders", icon: <ReceiptLongIcon sx={{ fontSize: "1.2rem" }} />, to: "/admin/orders", orderCount: adminOrders?.length || 0 },
        { label: "Manage Customers", icon: <StoreIcon sx={{ fontSize: "1.2rem" }} />, to: "/admin/customers" },
    ];

    const closeSidebar = () => {
        if (isSidebarOpen) setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        handleAdminLogout();
        closeSidebar();
        setOpenLoginDialog(true);
        navigate("/");
    }

    const renderSidebarContent = () => (
        <div className="h-full w-64 flex flex-col justify-between">
            <div className="sticky top-0 left-0 p-3 flex justify-center items-center border-b border-gray-300 dark:border-gray-700 backdrop-blur-md bg-white/60 dark:bg-[#282828]/60 z-10">
                <Link to="/" onClick={closeSidebar}>
                    <img
                        src={theme === "light" ? logoLightMode : logoDarkMode}
                        alt="logo"
                        loading="lazy"
                        className="h-14 object-contain"
                    />
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-4">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.to);
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            onClick={closeSidebar}
                            className={`flex items-center justify-between p-2 rounded-lg transition 
                                ${isActive
                                    ? "bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400 font-semibold"
                                    : "hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                }`}
                        >
                            <div className="space-x-2">
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>

                            {
                                (item?.orderCount > 0) && <div className="text-sm bg-red-500 px-2 rounded-full text-white">
                                    {item?.orderCount}
                                </div>
                            }

                            {orderLoading && item.label === "Orders" && (
                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            )}

                        </Link>
                    );
                })}
            </nav>

            <div className="px-4 py-6 border-t border-gray-300 dark:border-gray-700 space-y-4">
                <Link to={"/admin/profile"} className={`flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition 
                    ${(location.pathname === "/admin/profile") && "bg-blue-100 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400 font-semibold"}
                    `}>
                    <User />
                    <span>Profile</span>
                </Link>
                <button
                    onClick={() => {
                        toggleTheme();
                        closeSidebar();
                    }}
                    className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition"
                >
                    {theme === "dark" ? <LightModeIcon sx={{ fontSize: "1.2rem" }} /> : <DarkModeIcon sx={{ fontSize: "1.2rem" }} />}
                    <span className="text-sm font-medium">Toggle Theme</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition"
                >
                    <LogoutIcon sx={{ fontSize: "1.2rem" }} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div >
    );

    return (
        <>
            <aside className="hidden lg:flex h-screen w-64 bg-white text-black dark:bg-gray-500/20 dark:text-white overflow-auto transition-colors duration-300">
                {renderSidebarContent()}
            </aside>

            <Drawer open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
                <div className="h-screen bg-white text-black dark:bg-black/90 dark:text-white overflow-auto transition-colors duration-300">
                    {renderSidebarContent()}
                </div>
            </Drawer>
        </>
    );
}

