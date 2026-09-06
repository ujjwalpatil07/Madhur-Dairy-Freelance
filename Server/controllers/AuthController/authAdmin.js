import mongoose from "mongoose";
import Admin from "../../models/AdminSchema.js";
import bcryptjs from "bcryptjs";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).json({ message: "Invalid Email Address." });
  }

  const isMatched = await bcryptjs.compare(password, admin.password);
  if (!isMatched) {
    return res.status(400).json({ message: "Wrong Password" });
  }

  res.status(200).json({
    message: "Login Successful",
    admin: { _id: admin?._id, email },
  });
};

export const getAdmin = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "_id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid admin ID" });
  }

  const admin = await Admin.findById(_id);
  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  return res.status(200).json({ success: true, admin });
};

export const removeAdminNotification = async (req, res) => {
  const { adminId, mode, index } = req.body;

  if (!adminId || !mode) {
    return res
      .status(400)
      .json({ success: false, message: "Admin ID and mode are required." });
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    return res
      .status(404)
      .json({ success: false, message: "Admin not found." });
  }

  switch (mode) {
    case "index":
      if (
        typeof index !== "number" ||
        index < 0 ||
        index >= admin.notifications.length
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid index." });
      }
      admin.notifications.splice(index, 1);
      break;

    case "all":
      admin.notifications = [];
      break;

    default:
      return res.status(400).json({ success: false, message: "Invalid mode." });
  }

  await admin.save();
  return res
    .status(200)
    .json({ success: true, message: "Notification(s) deleted successfully." });
};

export const handleAdminUpdatePassword = async (req, res) => {
  const { adminId, newPassword, serverOtp, userOtp } = req.body;

  if (!adminId || !newPassword || !serverOtp || !userOtp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (serverOtp !== userOtp) {
    return res.status(400).json({ success: false, message: "OTP does not match" });
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json({ success: false, message: "Admin not found" });
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  admin.password = hashedPassword;

  await admin.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
};
