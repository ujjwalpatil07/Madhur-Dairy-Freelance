import React, { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../context/SidebarProvider";
import { AdminAuthContext } from "../../context/AuthProvider";
import { formatDistanceToNow } from "date-fns";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Dialog, Slide } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { removeAdminNotification } from "../../services/adminService";
import { ThemeContext } from "../../context/ThemeProvider";
import { AdminOrderContext } from "../../context/AdminOrderProvider";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AdminNavbar() {

    const location = useLocation();
    const { theme } = useContext(ThemeContext);

    const { authAdmin, authAdminLoading } = useContext(AdminAuthContext);
    const { setIsSidebarOpen, navbarInput, setNavbarInput } = useContext(SidebarContext);
    const { notification, setNotification } = useContext(AdminOrderContext)
    const [notificationDialog, setNotificationDialog] = useState(false);
    const [notificationLoadingIndex, setNotificationLoadingIndex] = useState(null);
    const [animate, setAnimate] = useState(false);

    const prevCountRef = useRef(notification.length);

    const loginAdmin = localStorage.getItem("Admin");

    useEffect(() => {
        if (notification.length > prevCountRef.current) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 2600);
        }
        prevCountRef.current = notification.length;
    }, [notification.length]);


    useEffect(() => {
        setNavbarInput("");
    }, [location.pathname, setNavbarInput]);

    const handleRemoveNotification = async (index, mode) => {

        if (!authAdmin?._id) {
            enqueueSnackbar("Please login to manage notifications.", { variant: "warning" });
            return;
        }

        if (mode === "all") {
            setNotificationLoadingIndex("all");
        } else {
            setNotificationLoadingIndex(index);
        }

        try {
            const res = await removeAdminNotification(authAdmin?._id, mode, index);
            if (res?.success) {
                if (mode === "all") {
                    setNotification([]);
                } else if (mode === "index") {
                    setNotification((prev) => prev.filter((_, i) => i !== index));
                }
            } else {
                enqueueSnackbar(res?.message || "Failed to remove notification.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Server error while removing notification.", { variant: "error" });
        } finally {
            setNotificationLoadingIndex(null);
        }
    };

    return (
        <nav className="sticky top-0 left-0 z-50 flex items-center justify-between px-4 py-5 bg-white/60 dark:bg-gray-500/20 border-b border-gray-300 dark:border-gray-700 backdrop-blur-md">
            <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsSidebarOpen(true)}
            >
                <MenuIcon className="text-gray-700 dark:text-white" />
            </button>

            <div className="relative flex-1 max-w-xl mx-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={navbarInput}
                    onChange={(e) => setNavbarInput(e.target.value)}
                    className="w-full ps-3 pe-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#2c2c2c] text-sm text-black dark:text-white focus:outline-none"
                />
                <button
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
                    type="button"
                >
                    <SearchIcon fontSize="small" />
                </button>
            </div>

            <div className="flex items-center gap-5">
                <div className="relative inline-block">
                    <button
                        onClick={() => setNotificationDialog(true)}
                        className="p-2.5 rounded-full hover:bg-gray-500/20 dark:hover:bg-[#00000090] transition relative"
                    >
                        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        {(notification?.length > 0 && loginAdmin) && (
                            <span
                                className={`absolute top-0 right-0 font-bold px-1.5 h-fit bg-red-500 text-white rounded-md text-[12px] transition-all duration-300 ${animate ? "animate-bounce" : ""}`}
                            >
                                {notification?.length}
                            </span>
                        )}
                    </button>
                </div>
                <Link to={"/admin/profile"}>
                    {authAdminLoading ? (
                        <div className="h-10 w-10 rounded-full bg-gray-300/70 dark:bg-gray-500/30 shadow animate-pulse"></div>
                    ) : (
                        <Avatar src={authAdmin?.image} alt={authAdmin?.name} />
                    )}
                </Link>

            </div>


            <Dialog
                open={notificationDialog}
                onClose={() => setNotificationDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                slots={{
                    transition: Transition,
                }}
                PaperProps={{
                    sx: {
                        position: 'absolute',
                        top: 75,
                        right: 10,
                        m: 0,
                        width: '350px',
                        maxHeight: "300px",
                        backgroundColor: theme === "dark" ? "#0f0f0f" : "#ffffff",
                    },
                }}
                fullWidth
            >
                <div className="text-black dark:text-white">
                    <div className="sticky top-0 z-10 backdrop-blur bg-white/30 dark:bg-[#2f2f2f]/30 px-3 py-2 flex items-center justify-between rounded-t">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        {notification.length > 0 && (
                            <button
                                disabled={notificationLoadingIndex}
                                onClick={() => handleRemoveNotification(-1, "all")}
                                className="text-xs text-red-500 hover:underline disabled:cursor-not-allowed"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {notification.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6 px-3">
                            🎉 You're all caught up! No new notifications.
                        </div>
                    ) : (
                        <ul className="space-y-3 px-3 py-3">
                            {notification.map((item, idx) => (
                                <li
                                    key={idx + item.title}
                                    className="bg-gray-100 dark:bg-gray-500/20 p-3 rounded-md shadow-sm relative"
                                >

                                    <div className='flex justify-between items-center'>
                                        <p className="font-medium text-sm pr-5">{item?.title}</p>

                                        <button
                                            disabled={notificationLoadingIndex !== null}
                                            onClick={() => handleRemoveNotification(idx, "index")}
                                            className="text-gray-400 hover:text-red-500 text-sm disabled:cursor-not-allowed"
                                            title="Clear"
                                        >
                                            {notificationLoadingIndex === idx ? (
                                                <div className="w-3 h-3 border-[2px] border-t-transparent border-gray-500 rounded-full animate-spin" />
                                            ) : (
                                                <X size={14} />
                                            )}
                                        </button>

                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {item?.description}
                                    </p>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-right">
                                        {formatDistanceToNow(new Date(item?.date), { addSuffix: true })}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Dialog>
        </nav>
    );
}
