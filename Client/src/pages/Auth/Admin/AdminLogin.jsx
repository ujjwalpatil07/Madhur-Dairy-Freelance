import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { loginAdmin } from "../../../services/adminService";
import { AdminAuthContext, UserAuthContext } from "../../../context/AuthProvider";
import company from "../../../data/company.json";

export default function AdminLogin() {

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { handleUserLogout } = useContext(UserAuthContext);
  const { fetchAdminData } = useContext(AdminAuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const { email, password } = formData;
      const data = await loginAdmin(email, password);

      if (data) {
        localStorage.setItem("Admin", JSON.stringify(data.admin));
        await fetchAdminData(data?.admin?._id);
        handleUserLogout();
        enqueueSnackbar("Logged in successfully as Admin", { variant: "success" });
        navigate("/admin/dashboard");
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Login failed, try again", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const loginType = "admin";

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8 bg-[#F0F1F3] dark:bg-[#121212] text-black dark:text-white transition-colors duration-300">

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="p-6 bg-white dark:bg-gray-900 rounded-md w-lg">
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
          Welcome to
        </h2>
        <h1 className="text-lg mb-1 font-bold text-center bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 dark:from-yellow-300 dark:via-red-300 dark:to-pink-400 bg-clip-text text-transparent">
          { company?.name }
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
        <form onSubmit={handleFormSubmit} className="space-y-3">

          <div className="w-full flex flex-col gap-5">

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
                className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300`}
                onClick={() => setShowPassword(!showPassword)}
              ></button>
            </div>


            <div className="text-sm flex justify-between font-semibold text-right mb-3 text-[#FF8682]">
              <div className="flex justify-center text-black dark:text-gray-300  hover:underline">
                <input type="checkbox" className="me-2" /> Remember me
              </div>
              <Link to="/forget" className=" hover:underline">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="mt-1 w-full bg-[#843E71] text-white py-2 rounded hover:bg-[#6f3360] transition text-sm font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          
        </form>

      </motion.div>
    </div>
  );
}
