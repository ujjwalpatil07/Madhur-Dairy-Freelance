import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID, 
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
};
