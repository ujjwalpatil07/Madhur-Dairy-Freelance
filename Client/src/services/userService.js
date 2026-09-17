import api from "./api";
import { sendOtpEmail } from "./sentOtp";

// ================================
// Authentication
// ================================

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/user/login", {
    email,
    password,
  });

  return res?.data;
};

export const loginWithGoogle = async (token) => {
  const res = await api.post("/auth/user/google-login", {
    token,
  });

  return res?.data;
};

// ================================
// Signup
// ================================

export const signupUser = async (formData, otp) => {
  const res = await api.post("/auth/user/signup", formData);

  if (res?.data?.success) {
    const response = await sendOtpEmail(formData?.email, otp);

    if (response?.success) {
      return res.data;
    }

    return response;
  }

  return res?.data;
};

export const verifyUserOTP = async (formData) => {
  const res = await api.post("/auth/user/signup/otp-verification", formData);

  return res?.data;
};

export const verifyUserByEmail = async (email) => {
  const res = await api.post("/auth/user/verify-email", {
    email,
  });

  return res?.data;
};

// ================================
// User
// ================================

export const getCurrentUser = async () => {
  const res = await api.get("/auth/user/me");

  return res?.data;
};

// ================================
// Password
// ================================

export const resetUserPassword = async (email, password, confirmPassword) => {
  const res = await api.post("/auth/user/reset-password", {
    email,
    password,
    confirmPassword,
  });

  return res?.data;
};

// ================================
// OTP
// ================================

export const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
