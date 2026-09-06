import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 5,
      max: 15,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format. Example: user@example.com",
      ],
    },

    isGoogleUser: { type: Boolean, default: false },

    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
      validate: {
        validator: function (value) {
          // Allow null for Google users
          if (this.isGoogleUser && !value) return true;
          return /^(?=.*[A-Za-z])(?=.*[\d\W]).{8,}$/.test(value);
        },
        message:
          "Password must be at least 8 characters long and include at least one letter and one number or symbol.",
      },
    },

    fullName: {
      type: String,
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    address: {
      streetAddress: { type: String },
      city: { type: String },
      pincode: { type: String },
    },

    shopName: {
      type: String,
    },

    mobileNo: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },

    savedAddresses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    wishlistedProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],

    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    notifications: [
      {
        title: { type: String },
        description: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
