import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

import AuthAdminRoute from "./routes/AuthRoutes/authAdminRoute.mjs";
import AuthUserRoute from "./routes/AuthRoutes/authUserRoute.mjs";
import ProfileEditRoute from "./routes/profileEditRoutes.mjs";
import AdminProfileRoute from "./routes/adminProfileRoutes.js";
import ProductsRoutes from "./routes/productRoutes.mjs"
import OrderRoute from "./routes/orderRoutes.js";
import PaymentRoute from "./routes/paymentRoutes.js";
import StoreRoute from "./routes/storeRoutes.js";
import PDFRoute from "./routes/pdfRoutes.js";
import AIRoute from "./routes/AIRoutes/aiRoute.js"
import { connectToSocket } from "./socket/socket.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://madhur-dairy-and-daily-needs.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

connectDB();
const server = http.createServer(app);
connectToSocket(server);


app.use("/admin", AuthAdminRoute);

app.use("/u", AuthUserRoute);

app.use("/user-profile", ProfileEditRoute);

app.use("/admin-profile", AdminProfileRoute);

app.use("/products", ProductsRoutes);

app.use("/order", OrderRoute);

app.use("/payment", PaymentRoute);

app.use("/store", StoreRoute);

app.use("/pdf", PDFRoute);

app.use("/ai", AIRoute);

app.get("*", (req, res) => {
  res.send({ result: "Hey, you are looking for a page that doesn't exist!" });
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
