import Order from "../models/OrderSchema.js";
import Admin from "../models/AdminSchema.js";
import User from "../models/UserSchema.js";

export const getAllUserOrders = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId).populate({
    path: "orders",
    populate: [
      { path: "address" },
      {
        path: "productsData.productId",
        model: "Product",
        select: "name quantityUnit image",
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User orders retrieved",
    orders: user.orders,
  });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate({
      path: "address",
      model: "Address",
      populate: {
        path: "owner",
        model: "User",
      },
    })
    .populate({
      path: "productsData.productId",
      model: "Product",
    });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  });
};

export const getAdminOrders = async (req, res) => {
  const admin = await Admin.findOne().populate({
    path: "pendingOrders",
    model: "Order",
    populate: [
      {
        path: "address",
        model: "Address",
        populate: {
          path: "owner",
          model: "User",
        },
      },
      {
        path: "productsData.productId",
        model: "Product",
      },
    ],
  });

  if (!admin) {
    return res
      .status(404)
      .json({ success: false, message: "Admin not found." });
  }

  res.status(200).json({
    success: true,
    orders: admin.pendingOrders,
  });
};

export const getRecentOrders = async (req, res) => {
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .populate({
      path: "address",
      select: "name streetAddress city state pincode",
    })
    .select("address productsData totalAmount status createdAt paymentMode");
  res.status(200).json({
    success: true,
    orders: recentOrders,
  });
};

export const getOrderStatus = async (req, res) => {
  const { userId, orderId } = req.body;

  if (!userId || !orderId) {
    return res.status(400).json({
      success: false,
      message: "userId and orderId are required",
    });
  }

  // Check whether this order belongs to the user
  const user = await User.findOne({
    _id: userId,
    orders: orderId,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Order not found for this user",
    });
  }

  const order = await Order.findById(orderId).select(
    "_id status createdAt updatedAt totalAmount paymentMode",
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Order status fetched successfully",
    order: {
      id: order._id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      totalAmount: order.totalAmount,
      paymentMode: order.paymentMode,
    },
  });
};
