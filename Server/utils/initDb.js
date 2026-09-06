import mongoose from "mongoose";
import Address from "../models/AddressShema.js";
import User from "../models/UserSchema.js";
import Product from "../models/ProductSchema.js";
import Review from "../models/ReviewSchema.js";
import Admin from "../models/AdminSchema.js";

const dbUrl =
  "mongodb+srv://ujjwalAndNitinDb:Tn99S9ZWR6oZjJOE@madhurdairy.5kjnxzp.mongodb.net/?retryWrites=true&w=majority&appName=MadhurDairy";

mongoose
  .connect(dbUrl) 
  .then(() => {
    console.log("Connected to MongoDB");
    initDB(); // only run after successful connection
  })
  .catch((err) => {
    console.error("MongoDB Connection Error: ", err);
  });

const initDB = async () => {
  
};
