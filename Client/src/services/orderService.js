import api from "./api";

export const getUserOrders = async (userId) => {
  const res = await api.post("/order/get-user-orders", { userId });
  return res.data;
};

export const getAllOrders = async () => {
  const res = await api.post("/order/get-all-orders");
  return res.data;
};

export const getAdminOrders = async () => {
  const res = await api.post("/order/get-admin-orders",)
  return res.data;
}

export const fetchRecentOrders = async () => {
  const res = await api.get("/order/recent-20");
  return res?.data ?? [];
};





export const totalCanceledOrders = (orders) => {
  return orders.filter((order) => order.status === "Cancelled").length;
};

export const totalActiveOrders = (orders) => {
  return orders.filter((order) => (
    order.status === "Pending"
  )).length;
};

export const totalOrdersCount = (orders) => {
  return orders.length;
};
