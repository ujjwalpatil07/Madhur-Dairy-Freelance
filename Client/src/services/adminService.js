import api from "./api";

// ================================
// Admin Authentication
// ================================

export const loginAdmin = async (email, password) => {
  const res = await api.post("/auth/admin/login", {
    email,
    password,
  });

  return res?.data;
};

// ================================
// Admin Account
// ================================

export const getCurrentAdmin = async () => {
  const res = await api.get("/auth/admin/me");

  return res?.data;
};

export const handleUpdateAdminPassword = async (
  adminId,
  newPassword,
  serverOtp,
  userOtp,
) => {
  const res = await api.post("/auth/admin/update-password", {
    adminId,
    newPassword,
    serverOtp,
    userOtp,
  });

  return res?.data;
};

// ================================
// Admin Notifications
// ================================

export const removeAdminNotification = async (adminId, mode, index) => {
  const res = await api.delete("/auth/admin/delete-notification", {
    data: {
      adminId,
      mode,
      index,
    },
  });

  return res?.data;
};

// ================================
// Admin Profile
// ================================

export const handleAdminProfileEdit = async (formData) => {
  const res = await api.put("/admin/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ================================
// Customers
// ================================

export const fetchCustomers = async () => {
  const res = await api.get("/auth/user/customers");

  return res?.data ?? [];
};
