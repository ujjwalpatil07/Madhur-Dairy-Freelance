import express from "express";
import wrapAsync from "../../utils/wrapAsync.js";

import { chatWithAI } from "../../controllers/AIController/aiController.js";
import authUser from "../../middlewares/authUser.js";
import authAdmin from "../../middlewares/authAdmin.js";

const router = express.Router();

router.post("/chat",authUser,authAdmin, wrapAsync(chatWithAI));

export default router;
