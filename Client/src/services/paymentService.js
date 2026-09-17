import api from "./api";

export const razorpayOrderPayment = async (amount) => {
  const res = await api.post("/payments/razorpay", {
    amount,
  });

  return res.data;
};
