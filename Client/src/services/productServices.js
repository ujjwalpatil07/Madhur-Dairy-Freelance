import api from "./api";

// ================================
// Products
// ================================

export const getProducts = async () => {
  const res = await api.get("/products");

  return res.data;
};

export const productLike = async (productId, userId) => {
  const res = await api.put(`/products/${productId}/like`, { userId });

  return res.data;
};

// ================================
// Reviews
// ================================

export const fetchRecentReviews = async () => {
  const res = await api.get("/products/reviews/recent");

  return res?.data ?? [];
};
