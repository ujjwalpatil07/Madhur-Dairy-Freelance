import Address from "../models/AddressShema.js";
import User from "../models/UserSchema.js";

export const editProfile = async (req, res) => {
  const { editData, userId } = req.body;

  if (!userId || !editData) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required data" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: editData },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    newUser: updatedUser
  });
};

export const getAddresses = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Missing user id",
    });
  }

  const user = await User.findById(userId).populate("savedAddresses");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }

  const userAddresses = user.savedAddresses;

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    userAddresses,
  });
};

export const getProfileData = async (req, res) => {
  const { profile_id } = req.body;

  if (!profile_id) {
    return res.status(400).json({
      success: false,
      message: "Profile ID is required",
    });
  }

  const user = await User.findById(profile_id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    userData: user,
  });
};

export const saveNewAddress = async (req, res) => {
  let { userId, address } = req.body;

  if (!userId || !address) {
    return res.status(400).json({
      success: false,
      message: "Fields missing",
    });
  }

  const newAddress = new Address({
    owner: userId,
    ...address,
  });

  await newAddress.save();

  await User.findByIdAndUpdate(userId, {
    $push: {
      savedAddresses: newAddress._id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Address saved successfully",
    address: newAddress,
  });
};

export const deleteAddress = async (req, res) => {
  const { addressId, userId } = req.body;

  if (!addressId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Address ID or User ID is missing",
    });
  }

  await Address.findByIdAndDelete(addressId);

  await User.findByIdAndUpdate(userId, {
    $pull: { savedAddresses: addressId },
  });

  return res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};

export const editAddress = async (req, res) => {
  const { addressId, updatedData } = req.body;

  if (!addressId || !updatedData) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  await Address.findByIdAndUpdate(addressId, updatedData, { new: true });
  return res
    .status(200)
    .json({ success: true, message: "Address updated successfully" });
};

export const editProfilePhoto = async (req, res) => {
  const userId = req.body.id;
  const imageUrl = req?.file?.path || req?.file?.url;

  if (!userId || !imageUrl) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { photo: imageUrl },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile photo updated",
    updatedPhoto: updatedUser.photo,
  });
};

export const addToWishlistedProducts = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required." });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const alreadyWishlisted = user.wishlistedProducts.includes(productId);
  if (alreadyWishlisted) {
    return res
      .status(200)
      .json({ success: false, error: "Product is already in wishlist." });
  }

  user.wishlistedProducts.push(productId);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Product added to wishlist.",
  });
};

export const getUserWishlistedProducts = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required.",
    });
  }

  const user = await User.findById(userId).populate({
    path: "wishlistedProducts",
    select: "name category image quantityUnit price discount",
  });

  if (!user) {
    return res.status(404).json({
      error: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    wishlistedProducts: user.wishlistedProducts,
  });
};

export const removeFromWishlistedProducts = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required." });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  user.wishlistedProducts = user.wishlistedProducts.filter(
    (id) => id.toString() !== productId
  );

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Product removed from wishlist.",
  });
};
