import prisma from "../config/prisma.js";
import { Request, Response } from "express";

export const createFollow = async (req: Request, res: Response) => {
  try {
    const { followingId } = req.params;
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }
    const existingFollow = await prisma.followUser.findFirst({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ error: "You are already following this user." });
    }

    const follow = await prisma.followUser.create({
      data: { followerId, followingId },
    });

    res.status(201).json(follow);
  } catch (error: any) {
    console.error("Error fetching:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUnFollow = async (req: Request, res: Response) => {
  try {
    const { followingId } = req.body;

    const followerId = req.user.id;

    const follow = await prisma.followUser.deleteMany({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    if (follow.count === 0) {
      return res.status(404).json({ error: "Follow relationship not found." });
    }

    return res.status(200).json({ message: "Successfully unfollowed." });
  } catch (error: any) {
    console.error("Error unfollowing:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Count the number of followers
    const followerCount = await prisma.followUser.count({
      where: { followingId: userId },
    });

    // Count the number of users the user is following
    const followingCount = await prisma.followUser.count({
      where: { followerId: userId },
    });

    res.status(200).json({
      userId,
      followers: followerCount,
      following: followingCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowingByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Fetch the list of users the user is following
    const following = await prisma.followUser.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: {
            id: true,
          },
        },
      },
    });

    // Map the result to extract the following user details
    const followingUsers = following?.map((follow) => follow?.following);

    res.status(200).json(followingUsers);
  } catch (error: any) {
    console.error("Error fetching following users:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowingCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Count followers
    const followingCount = await prisma.followUser.count({
      where: { followingId: userId },
    });

    res.status(200).json({
      count: followingCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
