import mongoose from "mongoose";

const dbUrl = process.env.DB_URL;

export const connectDB = async () => {

  try {
    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Not Connected, Error: ${error.message}`);
  }
};