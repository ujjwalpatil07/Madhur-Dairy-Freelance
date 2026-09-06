import React, { useState, useEffect, useContext } from "react";
import {
    MdOutlineAccountCircle,
    MdLocationOn,
    MdShoppingCart,
    MdFavorite,
    MdPayment,
    MdArrowForward,
} from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserAuthContext } from "../context/AuthProvider";
import { updateUserProfilePhoto } from "../services/userProfileService";
import { enqueueSnackbar } from "notistack";
import { LanguagesIcon } from "lucide-react";

export default function UserProfileSidebar({ userProfileDrawer, setUserProfileDrawer }) {

    const location = useLocation();
    const navigate = useNavigate();

    const { authUser, setAuthUser, handleUserLogout, setOpenLoginDialog } = useContext(UserAuthContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(authUser?.photo || "");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false);

    useEffect(() => {
        if (authUser?.photo) {
            setPhotoUrl(authUser?.photo);
        }
    }, [authUser]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPhotoUrl(URL.createObjectURL(file));
            setShowUpdateButton(true);
        }
    };

    const handleProfileImageChange = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("photo", selectedFile);
        formData.append("id", authUser?._id);

        try {
            const res = await updateUserProfilePhoto(formData, (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
            });

            if (res?.success) {
                enqueueSnackbar("Profile photo updated!", { variant: "success" });
                setAuthUser((prev) => ({ ...prev, photo: res.updatedPhoto }));
            } else {
                enqueueSnackbar("Failed to update photo.", { variant: "error" });
            }
        } catch (err) {
            enqueueSnackbar(err?.response?.data?.message || "Something went wrong.", { variant: "error" });
        } finally {
            setLoading(false);
            setUploadProgress(0);
            setShowUpdateButton(false);
        }
    };

    const handleLogout = () => {
        handleUserLogout();
        enqueueSnackbar("User Logged Out Successfully", { variant: "success" });
        navigate("/");
        setOpenLoginDialog(true);
        setUserProfileDrawer(false);
        
    }

    const navigationLinks = [
        { key: "/user-profile", icon: <MdOutlineAccountCircle />, label: "Account" },
        { key: "/user-profile/addresses", icon: <MdLocationOn />, label: "Addresses" },
        { key: "/user-profile/orders", icon: <MdShoppingCart />, label: "Orders" },
        { key: "/user-profile/wishlist", icon: <MdFavorite />, label: "My Wishlist" },
        { key: "/user-profile/payments", icon: <MdPayment />, label: "Payments" },
    ];

    return (
        <aside className="scrollbar-hide border-y-15 border-white dark:border-transparent w-full h-full min-w-65 md:w-65 bg-white dark:bg-gray-500/20 p-4 shadow-md overflow-y-auto rounded-md scroll-smooth transition-all duration-300">
            <div className="flex flex-col items-center mb-5 relative group">
                <div className="relative w-24 h-24 ">
                    <img
                        src={photoUrl || null}
                        alt={photoUrl}
                        className="rounded-full w-24 h-24 object-cover border"
                    />

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <CircularProgress
                                variant="determinate"
                                value={uploadProgress}
                                size={64}
                                thickness={4}
                                style={{ color: "#fff" }}
                            />
                        </div>
                    )}

                    <label
                        htmlFor="profileImageInput"
                        className={`absolute bottom-0 right-0 bg-[#843E71] text-white dark:bg-gray-800 border p-1 rounded-full transition ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#824572] dark:hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                        title="Edit Photo"
                    >
                        <i className="fa-solid fa-pen-to-square text-sm " />
                    </label>

                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={loading}
                    />
                </div>

                {showUpdateButton && (
                    <button
                        onClick={handleProfileImageChange}
                        disabled={loading}
                        className={`mt-2 px-4 py-1 rounded text-sm transition flex items-center gap-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#414141] hover:bg-[#5a5a5a] text-white"}`}
                    >
                        {loading ? (
                            <>
                                <span>Updating</span>
                                <CircularProgress size={18} color="inherit" />
                            </>
                        ) : (
                            "Update Photo"
                        )}
                    </button>
                )}

                <h2 className="text-xl font-bold mt-2 text-black dark:text-white">
                    {authUser?.firstName} {authUser?.lastName}
                </h2>
            </div>

            <nav className="mt-6 space-y-3">
                {navigationLinks.map((item) => (
                    <Link
                        key={item.key}
                        to={item.key}
                        onClick={userProfileDrawer ? () => setUserProfileDrawer(false) : null}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-left rounded transition duration-300 ${location?.pathname === item.key ? "bg-[#843E71] text-white dark:bg-[#843E71]" : "hover:bg-[#D595C3] dark:hover:bg-[#843E71] text-black dark:text-white"}`}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}

                <button
                    className="w-full flex items-center gap-2 mt-2 px-4 py-2 text-left rounded text-gray-800 dark:text-white transition duration-300 hover:bg-[#D595C3] dark:hover:bg-[#843E71]"
                >
                    <LanguagesIcon /> Language
                </button>

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 mt-2 px-4 py-2 text-left rounded text-red-600 dark:text-red-500 transition duration-300 hover:bg-red-600/30 dark:hover:bg-red-500/30`}
                >
                    Log out <MdArrowForward />
                </button>
            </nav>

        </aside>
    );
};
