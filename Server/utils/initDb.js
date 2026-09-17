import mongoose from "mongoose";

const dbUrl = `${process.env.DB_URL}`;

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
