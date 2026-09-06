import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { loginUser } from "../../../services/userService";
import { AdminAuthContext, UserAuthContext } from "../../../context/AuthProvider";
import company from "../../../data/company.json";
import GoogleLoginComponent from "./GoogleLogin";

const GoogleLoadingOverlay = () => (
  <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12">
        <div className="absolute w-full h-full border-4 border-t-blue-500 border-r-red-500 border-b-yellow-400 border-l-green-500 rounded-full animate-spin" />
      </div>
      <p className="mt-3 text-gray-800 dark:text-white font-medium text-sm">Logging in with Google...</p>
    </div>
  </div>
);


export default function UserLogin() {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { fetchUserData } = useContext(UserAuthContext);
  const { handleAdminLogout } = useContext(AdminAuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password } = formData;
      const res = await loginUser(email, password);

         if (res?.success) {
              handleAdminLogout();

              localStorage.setItem("accessToken", res?.token);

              if (!res?.filledBasicInfo) {
                   navigate("/signup/info-input", {
                        state: {
                             user: res?.user,
                             viaLogin: true,
                        },
                   });
              } else {
                   localStorage.setItem("User", JSON.stringify(res?.user));

                   await fetchUserData(res?.user?._id);

                   enqueueSnackbar("Login Successful!", {
                        variant: "success",
                   });

                   navigate("/home");
              }
         }
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message || "Server error or invalid credentials.", { variant: "error" });
    } finally {
      setIsLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  const loginType = "user"

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">

      {googleLoginLoading && <GoogleLoadingOverlay />}

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`p-6 bg-white dark:bg-gray-900 rounded-md w-lg transition duration-200 ease-in-out ${googleLoginLoading ? "opacity-50 blur-sm pointer-events-none select-none" : ""
          }`}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
          Welcome to
        </h2>
        <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
          {company?.name}
        </h1>

        <div className="mb-4 mt-3 flex justify-center">
          <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "user"
                ? "bg-[#843E71] text-white"
                : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className={`px-4 py-1 text-sm font-semibold transition-colors duration-300 ${loginType === "admin"
                ? "bg-[#843E71] text-white"
                : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              Admin
            </button>
          </div>
        </div>


        <form onSubmit={handleFormSubmit} className="space-y-5">

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData?.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71]"
            required
          />


          <div className="relative w-full">
            <input
              id="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={formData?.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#843E71]"
              required
            />

            <button
              type="button"
              className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300`}
              onClick={() => setShowPassword(!showPassword)}
            ></button>
          </div>


          <div className="text-sm flex justify-between font-semibold text-right mb-3 text-[#843E71]">
            <div className="flex justify-center text-black dark:text-gray-300 hover:underline">
              <input type="checkbox" id="remember" className="me-2" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/login/forget-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>



        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-[#843E71] hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <div className="flex items-center my-4 w-full">
          <div className="border-t border-gray-400 dark:border-gray-600 flex-grow mr-3" />
          <span className="text-gray-600 dark:text-gray-300 text-sm">or login with</span>
          <div className="border-t border-gray-400 dark:border-gray-600 flex-grow ml-3" />
        </div>

        <div className=" w-full flex justify-center pt-2">
          <GoogleLoginComponent setGoogleLoginLoading={setGoogleLoginLoading} />
        </div>
      </motion.div>
    </div>
  );
}