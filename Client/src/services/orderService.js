import api from "./api";

// ================================
// User Orders
// ================================

export const getUserOrders = async (userId) => {
  const res = await api.post("/orders/user", {
    userId,
  });

  return res.data;
};

// ================================
// All Orders
// ================================

export const getAllOrders = async () => {
  const res = await api.post("/orders");

  return res.data;
};

// ================================
// Admin Orders
// ================================

export const getAdminOrders = async () => {
  const res = await api.post("/orders/admin");

  return res.data;
};

// ================================
// Recent Orders
// ================================

export const fetchRecentOrders = async () => {
  const res = await api.get("/orders/recent");

  return res?.data ?? [];
};

// ================================
// Order Statistics
// ================================

export const totalCanceledOrders = (orders) => {
  return orders.filter((order) => order.status === "Cancelled").length;
};

export const totalActiveOrders = (orders) => {
  return orders.filter((order) => order.status === "Pending").length;
};

export const totalOrdersCount = (orders) => {
  return orders.length;
};
