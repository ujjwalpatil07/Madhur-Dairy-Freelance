import mongoose from "mongoose";
import User from "../../models/UserSchema.js";
import bcryptjs from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUpUser = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password doesn't match" });
  }

  const isPasswordValidated = /^(?=.*\d).{8,}$/.test(password);

  if (!isPasswordValidated) {
    return res
      .status(400)
      .json({ success: false, message: "Password format doesn't match." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  res.status(201).json({
    success: true,
    message: "User info is Correct",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields." });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email, Please Enter Valid Email.",
    });
  }

  const isMatched = await bcryptjs.compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({
      success: false,
      message: "Wrong Password, Please Enter Correct Password",
    });
  }

  let isfilledBasicInfo;
  if (
    !user.firstName ||
    !user.lastName ||
    !user.gender ||
    !user.mobileNo ||
    !user.address
  ) {
    isfilledBasicInfo = false;
  } else {
    isfilledBasicInfo = true;
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    message: "Login Successful",
    user: {
      _id: user._id,
      email: user.email,
    },
    token,
    filledBasicInfo: isfilledBasicInfo,
  });
};

export const loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google token is required",
    });
  }

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await User.findOne({ email });

  if (user) {
    if (!user?.isGoogleUser) {
      return res.status(400).json({
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

  // Check for basic info filled
  const isfilledBasicInfo = Boolean(
    user.firstName &&
      user.lastName &&
      user.gender &&
      user.mobileNo &&
      user.address,
  );

  const appToken = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.status(200).json({
    success: true,
    message: "Google login successful",
    user,
    token: appToken,
    filledBasicInfo: isfilledBasicInfo,
  });
};

export const verifyUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email not found." });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "User verified", email: user?.email });
};

export const verifyOtp = async (req, res) => {
  const { email, password } = req.body;

  const hashedPass = await bcryptjs.hash(password, 10);

  const newUser = new User({
    email,
    password: hashedPass,
  });

  await newUser.save();

  res.status(201).json({
    message: "Account Created Successfully",
    success: true,
    user: {
      _id: newUser._id,
      email: newUser.email,
    },
  });
};

export const handleInfoInput = async (req, res) => {
  const { id } = req.body;

  const profileInfo = JSON.parse(req?.body?.profileInfo);

  const photoUrl = req?.file?.url || req?.file?.path;

  let photo;
  if (photoUrl) {
    photo = photoUrl;
  } else if (profileInfo?.gender === "Male") {
    photo =
      "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740";
  } else if (profileInfo?.gender === "Female") {
    photo =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcQ6xalcUqiwlcrMkGuc7NJW6txojdE57QMw&s";
  } else {
    photo =
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAgMEAQUH/8QALRABAAICAAMHAwQDAQAAAAAAAAECAxEEITESFUFRU2GRE3GBMjNS0QVCoSL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4gAAAAAAjNojrMAkITlr5ufVr5/8BYIRkrPSYTjmAAAAAAAAAAAAArvlrXpzn2QyZd8q9PNUCdslreOkAAAAdiZjpMw4AtrmncRaPyui0W6MjtbTWdwDWIY7xaPfxTAAAAAAAUZr7nsx08U8tuzXXjLOAAACGfLXDTtW/EeYJuvIy8TlyzO7ajyhCt70ndbWj7SD2Ri4XjJtMUzTuZ6WbQAAdidTuGmlotXfiyp47dm2waQAAAARvOqzIKMk7vKAAAAPN/yF5tnmvhWI09J5nH0mvETaelogGcAB6/DX+pgpaeunkPX4ak04elZ662CwAAAGnFO6c+sJqME6mYXgAAIZp/8SmrzfokGcAAABVxGGM2Psz1jnE+S0mYiNzMa9wePlw5MVtXrP3johETL17cRgjlbJX7RO0a8Tw8dLxH4Bm4XhJm0Xyxqsc4rPi3o1yY7/ovWftKQAAAAJ4v3IaWbF+5DSAAAhljdJTAYx20amY8pcABi/wAhm1H0q9Z52/oHeI43szNcOpn+UsV8l8k7taZn3lEAAA91+HisuPUTPar5WUAPXwZqZqbrPOOsT4LHjYsk4rxanWPB7FLxekWr0mAdABZhjd/s0KsEctrQAAAAUZ684mFTXaO1GmW0dmdSDjyeLmZ4nJ93rMuXgoyZLX7cx2p3rQPOG7u+vqT8Hd9fUn4BhG7u+vqT8Hd9fUn4BhG7u+vqT8Hd9fUn4BhenwE74aPaZVd319SfhpwYvo4+xFt8970Cx2I3OnF2Gn+0/gFtY7NYh0AAAAAEMlItHv5pgMkxMTqXGq9ItHPr5qL0mv8AYIAAAAAADsRvotpi8bfAI48e+c9GgAAAAAAAAAAAQtirPtKucM+ErwGacV/I+nf+LSAzxitPhpOuGPGVoDlaxXpDoAAAAAAAAAAAAAAAAAAAAAAAAAAA/9k=";
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...profileInfo,
      photo: photo,
    },
    { new: true },
  );

  res.status(201).json({
    success: true,
    message: "User updated",
    user: { _id: updatedUser?._id, email: updatedUser?.email },
  });
};

export const getUser = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: "_id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ success: true, user });
};

export const removeUserNotification = async (req, res) => {
  const { userId, mode, index } = req.body;

  if (!userId || !mode) {
    return res
      .status(400)
      .json({ success: false, message: "userId and mode are required." });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  switch (mode) {
    case "index":
      if (
        typeof index !== "number" ||
        index < 0 ||
        index >= user.notifications.length
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid index." });
      }
      user.notifications.splice(index, 1);
      break;

    case "all":
      user.notifications = [];
      break;

    default:
      return res.status(400).json({ success: false, message: "Invalid mode." });
  }

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Notification(s) deleted successfully." });
};

export const getAllCustomers = async (req, res) => {
  const customers = await User.find({})
    .select("firstName lastName email gender mobileNo orders photo")
    .lean();

  res.status(200).json({
    success: true,
    customers,
  });
};

export const resetPassword = async (req, res) => {
  let { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Fields missing" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirmpassword must be same",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const hashedPass = await bcryptjs.hash(password, 10);

  user.password = hashedPass;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
};

export const testAuth = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
};
