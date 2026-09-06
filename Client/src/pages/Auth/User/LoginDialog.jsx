import React, { useContext, useState } from "react";
import { useSnackbar } from "notistack";
import { Dialog, DialogContent } from "@mui/material";
import Slide from '@mui/material/Slide';
import { AdminAuthContext, UserAuthContext } from "../../../context/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/userService";
import { loginAdmin } from "../../../services/adminService";
import company from "../../../data/company.json";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginComponent from "./GoogleLogin";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GoogleLoadingOverlay = () => {
    return (
        <div className="absolute inset-0 z-20 bg-white/30 dark:bg-black/30 backdrop-blur-xs flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center">
                <div className="relative w-12 h-12">
                    <div className="absolute w-full h-full border-4 border-t-blue-500 border-r-red-500 border-b-yellow-400 border-l-green-500 rounded-full animate-spin" />
                </div>
                <p className="mt-3  text-gray-800 dark:text-white font-semibold text-lg">Logging in with Google...</p>
            </div>
        </div>
    );
};

export default function LoginDialog() {

    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const { openLoginDialog, setOpenLoginDialog, handleUserLogout, fetchUserData } = useContext(UserAuthContext);
    const { handleAdminLogout, fetchAdminData } = useContext(AdminAuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
    const [loginType, setLoginType] = useState("user");
    const [showPassword, setShowPassword] = useState(false);

     const handleUserLogin = async () => {
          const res = await loginUser(email, password);

          if (res?.success) {
               localStorage.setItem("accessToken", res?.token);

               if (!res?.filledBasicInfo) {
                    setOpenLoginDialog(false);

                    navigate("/signup/info-input", {
                         state: {
                              user: res?.user,
                              viaLogin: true,
                         },
                    });
               } else {
                    localStorage.setItem(
                         "User",
                         JSON.stringify(res?.user)
                    );

                    await fetchUserData(res?.user?._id);

                    handleAdminLogout();

                    enqueueSnackbar("Login Successful!", {
                         variant: "success",
                    });

                    setOpenLoginDialog(false);
                    navigate("/home");

                    setEmail("");
                    setPassword("");
               }
          } else {
               enqueueSnackbar(
                    "Login failed, please try again.",
                    { variant: "error" }
               );
          }
     };

    const handleAdminLogin = async () => {
        const res = await loginAdmin(email, password);
        if (res?.admin) {

            localStorage.setItem("Admin", JSON.stringify(res.admin));
            await fetchAdminData(res.admin?._id);

            handleUserLogout();
            enqueueSnackbar("Logged in successfully as Admin", { variant: "success" });
            setEmail("");
            setPassword("");
            setOpenLoginDialog(false);

            if (!location.pathname.startsWith("/admin")) {
                navigate("/admin/dashboard");
            }
        } else {
            enqueueSnackbar("Admin login failed.", { variant: "error" });
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (loginType === "user") {
                await handleUserLogin();
            } else {
                await handleAdminLogin();
            }
        } catch (error) {
            enqueueSnackbar(error?.response?.data?.message || "Server error or invalid credentials.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }


    return (
        <Dialog
            open={openLoginDialog}
            onClose={() => setOpenLoginDialog(false)}
            maxWidth="xs"
            fullWidth
            slots={{
                transition: Transition,
            }}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "transparent",
                        boxShadow: 24,
                        borderRadius: 1,
                    },
                },
            }}
        >
            <DialogContent className="relative p-6 bg-white/20 dark:bg-black/50 rounded-md backdrop-blur-sm">
                {googleLoginLoading && <GoogleLoadingOverlay />}

                <div className={googleLoginLoading ? "pointer-events-none select-none" : ""}>
                    <h2 className="text-lg font-semibold text-center text-gray-300 dark:text-gray-200">
                        Welcome to
                    </h2>
                    <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
                        {company?.name}
                    </h1>

                    <div className="mb-4 flex justify-center">
                        <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
                            <button
                                type="button"
                                onClick={() => setLoginType("user")}
                                className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "user"
                                    ? "bg-[#843E71] text-white"
                                    : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginType("admin")}
                                className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "admin"
                                    ? "bg-[#843E71] text-white"
                                    : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>


                    <form onSubmit={handleLoginSubmit} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] placeholder-gray-600 dark:placeholder-gray-400"
                            required
                        />

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pr-10 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71] placeholder-gray-600 dark:placeholder-gray-400"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
                                tabIndex={-1}
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-300 dark:text-gray-300">
                            Don't have an account?{" "}
                            <Link
                                to={"/signup"}
                                onClick={() => setOpenLoginDialog(false)}
                                className="text-[#a82d87] hover:underline cursor-pointer"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>



                    {/* Social login */}
                    {loginType === "user" ? (
                        <>
                            {/* OR */}
                            <div className="flex items-center w-full mt-3">
                                <div className="border-t border-gray-400 dark:border-gray-600 flex-grow mr-3" />
                                <span className="text-gray-300 dark:text-gray-300 text-sm">or login with</span>
                                <div className="border-t border-gray-400 dark:border-gray-600 flex-grow ml-3" />
                            </div>

                            <div className=" w-full flex justify-center pt-3">
                                <GoogleLoginComponent openLoginDialog={openLoginDialog} setOpenLoginDialog={setOpenLoginDialog} setGoogleLoginLoading={setGoogleLoginLoading} />
                            </div>
                        </>

                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
