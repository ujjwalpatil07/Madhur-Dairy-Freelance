import mongoose from "mongoose";
import Admin from "../../models/AdminSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ADMIN LOGIN
 * POST /auth/admin/login
 */
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  const isMatched = await bcryptjs.compare(password, admin.password);

  if (!isMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const accessToken = jwt.sign(
    {
      adminId: admin._id.toString(),
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
  });
};

/**
 * GET ADMIN
 * POST /auth/admin/get-admin
 *
 * This endpoint is still ID-based for now.
 * We will migrate it to /auth/admin/me in the next step.
 */

export const getCurrentAdmin = async (req, res) => {
  const admin = await Admin.findById(req.admin.adminId).select("-password");

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  return res.status(200).json({
    success: true,
    admin,
  });
};


/**
 * REMOVE ADMIN NOTIFICATION
 * DELETE /auth/admin/delete-notification
 *
 * This will be migrated to JWT-based admin identity
 * in a later step.
 */
export const removeAdminNotification = async (req, res) => {
  const { adminId, mode, index } = req.body;

  if (!adminId || !mode) {
    return res.status(400).json({
      success: false,
      message: "Admin ID and mode are required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid admin ID.",
    });
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found.",
    });
  }

  switch (mode) {
    case "index":
      if (
        typeof index !== "number" ||
        index < 0 ||
        index >= admin.notifications.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid index.",
        });
      }

      admin.notifications.splice(index, 1);
      break;

    case "all":
      admin.notifications = [];
      break;

    default:
      return res.status(400).json({
        success: false,
        message: "Invalid mode.",
      });
  }

  await admin.save();

  return res.status(200).json({
    success: true,
    message: "Notification(s) deleted successfully.",
  });
};

/**
 * UPDATE ADMIN PASSWORD
 * POST /auth/admin/update-password
 *
 * This will be migrated to JWT-based admin identity later.
 */
export const handleAdminUpdatePassword = async (req, res) => {
  const { adminId, newPassword, serverOtp, userOtp } = req.body;

  if (!adminId || !newPassword || !serverOtp || !userOtp) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (serverOtp !== userOtp) {
    return res.status(400).json({
      success: false,
      message: "OTP does not match",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid admin ID",
    });
  }

  const admin = await Admin.findById(adminId);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  admin.password = hashedPassword;

  await admin.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

/**
 * TEST ADMIN AUTHENTICATION
 * GET /auth/admin/test-auth
 */
export const testAdminAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin authentication successful",
    admin: req.admin,
  });
};
