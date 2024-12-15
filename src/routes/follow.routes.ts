import express from "express";

import { createFollow, createUnFollow, getFollowCount, getFollowingByUser } from "../controller/follow.controller.js";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.post("/create-follow/:followingId",authenticateUser ,createFollow);
router.post("/create-unfollow/:followingId",authenticateUser ,createUnFollow);
router.get("/get-followers",authenticateUser ,getFollowCount);
router.get("/get-following",authenticateUser ,getFollowingByUser);
export default router;
