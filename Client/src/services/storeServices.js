import api from "./api";

// ================================
// Stores
// ================================

export const getAllStores = async () => {
  const res = await api.get("/stores");

  return res.data;
};

// ================================
// Store Order History
// ================================

export const getUserOrderHistory = async (userId) => {
  const res = await api.post("/stores/order-history", { userId });

  return res.data;
};
