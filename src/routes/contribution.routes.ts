import express from "express";

import { authenticateUser } from "../middleware/authenticateUser.js";
import { getContributions } from "../controller/contribution.controller.js";

const router = express.Router();

router.get("/get-contribution/:userId", getContributions);
export default router;
