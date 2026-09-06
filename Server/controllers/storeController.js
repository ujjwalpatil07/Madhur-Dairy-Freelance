import mongoose from "mongoose";
import User from "../models/UserSchema.js";

export const getAllStores = async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    message: "All users fetched successfully.",
    stores: users,
  });
};

export const getStoreOrderHistory = async (req, res) => {
  const { userId } = req.body;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing userId." });
  }

  const store = await User.findById(userId).populate({
    path: "orders",
    populate: [
      {
        path: "address",
        model: "Address",
      },
      {
          path: "productsData.productId",
          model: "Product",
          select: "name image", 
        },
    ],
  });

  if (!store) {
    return res
      .status(404)
      .json({ success: false, message: "Store not found." });
  }

  return res.status(200).json({
    success: true,
    message: "Order history fetched successfully.",
    orders: store,
  });
};
