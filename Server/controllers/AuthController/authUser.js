import mongoose from "mongoose";
import User from "../../models/UserSchema.js";
import bcryptjs from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * USER SIGNUP
 * POST /auth/user/signup
 */
export const signUpUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password doesn't match",
    });
  }

  const isPasswordValidated = /^(?=.*\d).{8,}$/.test(password);

  if (!isPasswordValidated) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one number.",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  return res.status(201).json({
    success: true,
    message: "User information is correct",
  });
};

/**
 * USER LOGIN
 * POST /auth/user/login
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not registered. Please signup first.",
    });
  }

  const isMatched = await bcryptjs.compare(password, user.password);

  if (!isMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const isfilledBasicInfo = Boolean(
    user.firstName &&
      user.lastName &&
      user.gender &&
      user.mobileNo &&
      user.address,
  );

const accessToken = jwt.sign(
  {
    userId: user._id.toString(),
    role: "user",
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
  filledBasicInfo: isfilledBasicInfo,
});
};

/**
 * GOOGLE LOGIN
 * POST /auth/user/google-login
 */
export const loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google token is required",
    });
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    return res.status(401).json({
      success: false,
      message: "Invalid Google authentication token.",
    });
  }

  const { email, name } = payload;

  let user = await User.findOne({ email });

  if (user) {
    if (!user.isGoogleUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in manually.",
      });
    }
  } else {
    const nameParts = name?.split(" ") || [];

    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    user = new User({
      email,
      firstName,
      lastName,
      isGoogleUser: true,
      password: null,
    });

    await user.save();
  }

  const isfilledBasicInfo = Boolean(
    user.firstName &&
      user.lastName &&
      user.gender &&
      user.mobileNo &&
      user.address,
  );

const accessToken = jwt.sign(
  {
    userId: user._id.toString(),
    role: "user",
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  },
);

return res.status(200).json({
  success: true,
  message: "Google login successful",
  accessToken,
  filledBasicInfo: isfilledBasicInfo,
});
};

/**
 * VERIFY USER EMAIL
 * POST /auth/user/verify-email
 */
export const verifyUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User verified",
    email: user.email,
  });
};

/**
 * VERIFY OTP / CREATE USER
 * POST /auth/user/signup/otp-verification
 */
export const verifyOtp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists.",
    });
  }

  const hashedPass = await bcryptjs.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPass,
  });

  await newUser.save();

  /*
   * Create JWT immediately after successful
   * account creation.
   *
   * The user is now authenticated, even though
   * their basic profile information is incomplete.
   */
  const accessToken = jwt.sign(
    {
      userId: newUser._id.toString(),
      role: "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return res.status(201).json({
    success: true,
    message: "Account created successfully",

    /*
     * JWT becomes the authentication source.
     */
    accessToken,

    /*
     * User information is returned only as temporary
     * signup data. It must NOT be stored as the
     * authentication source in localStorage.
     */
    user: {
      _id: newUser._id,
      email: newUser.email,
    },

    filledBasicInfo: false,
  });
};

/**
 * COMPLETE USER PROFILE
 * POST /auth/user/signup/info-input
 */
/**
 * COMPLETE USER PROFILE
 * POST /auth/user/signup/info-input
 */
export const handleInfoInput = async (req, res) => {
  /*
   * IMPORTANT:
   *
   * Do NOT take the user ID from req.body.
   *
   * authUser middleware has already verified the JWT
   * and placed the authenticated user's ID here:
   *
   * req.user.userId
   */
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid authenticated user ID.",
    });
  }

  let profileInfo;

  try {
    profileInfo = JSON.parse(
      req?.body?.profileInfo
    );
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid profile information.",
    });
  }

  const photoUrl =
    req?.file?.url ||
    req?.file?.path;

  let photo;

  if (photoUrl) {
    photo = photoUrl;
  } else if (
    profileInfo?.gender === "Male"
  ) {
    photo =
      "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg";
  } else if (
    profileInfo?.gender === "Female"
  ) {
    photo =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcQ6xalcUqiwlcrMkGuc7NJW6txojdE57QMw&s";
  } else {
    photo = null;
  }

  const updatedUser =
    await User.findByIdAndUpdate(
      userId,
      {
        ...profileInfo,
        photo,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message:
      "User profile updated successfully",

    /*
     * Return the updated user for immediate
     * frontend use if needed.
     *
     * This is NOT authentication state.
     */
    user: {
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      gender: updatedUser.gender,
      mobileNo: updatedUser.mobileNo,
      username: updatedUser.username,
      shopName: updatedUser.shopName,
      address: updatedUser.address,
      photo: updatedUser.photo,
    },
  });
};


export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

/**
 * REMOVE USER NOTIFICATION
 * DELETE /auth/user/delete-notification
 */
export const removeUserNotification = async (req, res) => {
  const { userId, mode, index } = req.body;

  if (!userId || !mode) {
    return res.status(400).json({
      success: false,
      message: "userId and mode are required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID.",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  switch (mode) {
    case "index":
      if (
        typeof index !== "number" ||
        index < 0 ||
        index >= user.notifications.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification index.",
        });
      }

      user.notifications.splice(index, 1);
      break;

    case "all":
      user.notifications = [];
      break;

    default:
      return res.status(400).json({
        success: false,
        message: "Invalid mode. Use 'index' or 'all'.",
      });
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Notification(s) deleted successfully.",
  });
};

/**
 * GET ALL CUSTOMERS
 * GET /auth/user/customers
 */
export const getAllCustomers = async (req, res) => {
  const customers = await User.find({})
    .select("firstName lastName email gender mobileNo orders photo")
    .lean();

  return res.status(200).json({
    success: true,
    customers,
  });
};

/**
 * RESET PASSWORD
 * POST /auth/user/reset-password
 */
export const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, password and confirmPassword are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirmPassword must be the same.",
    });
  }

  const isPasswordValidated = /^(?=.*\d).{8,}$/.test(password);

  if (!isPasswordValidated) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and contain at least one number.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const hashedPass = await bcryptjs.hash(password, 10);

  user.password = hashedPass;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
};

/**
 * TEST AUTHENTICATION
 * GET /auth/user/test-auth
 */
export const testAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
};
