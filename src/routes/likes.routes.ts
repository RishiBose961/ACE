import express from "express";

import { createLikePost, getPostLikeCount, getUserLikePost } from "../controller/likes.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/create-like/:postId",authenticateUser ,createLikePost);
router.get("/get-like",authenticateUser ,getUserLikePost);
router.get("/get-count/:postId" ,getPostLikeCount);
export default router;
