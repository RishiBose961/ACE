import prisma from "../config/prisma.js";
import { Request, Response } from "express";

export const createLikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!userId || !postId) {
      return res.status(400).json({ error: "userId and postId are required" });
    }
    const existingLike = await prisma.likesPost.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      await prisma.likesPost.delete({
        where: { id: existingLike.id },
      });
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      const newLike = await prisma.likesPost.create({
        data: { userId, postId },
      });
      return res
        .status(201)
        .json({ message: "Post liked successfully", like: newLike });
    }
  } catch (error: any) {
    console.error("Error fetching:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserLikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const likes = await prisma.likesPost.findMany({
      where: { userId },
    });
    res.status(200).json(likes);
  } catch (error: any) {
    console.error("Error fetching:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPostLikeCount = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const likeCount = await prisma.likesPost.count({
      where: { postId },
    });

    res.status(200).json({ count: likeCount });
  } catch (error) {
    console.error("Error fetching like count:", error);
    res.status(500).json({ error: "Failed to fetch like count for the post" });
  }
};
