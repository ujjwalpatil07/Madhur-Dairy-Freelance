import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";
import { chatWithAI } from "../../controllers/AIController/aiController.js";
import authUser from "../../middlewares/authUser.js";

const router = express.Router();

router.post("/chat", authUser, wrapAsync(chatWithAI));

export default router;
