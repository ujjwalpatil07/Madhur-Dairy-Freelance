import api from "./api"

export const getAllStores = async () => {
    const res = await api.get("/store/get-stores");
    return res.data;
}

export const getUserOrderHistory = async (userId) => {
    const res = await api.post("/store/store-order-history", { userId });
    return res.data;
}