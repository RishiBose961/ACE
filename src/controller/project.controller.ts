import prisma from "../config/prisma.js";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";

export const createProjectPost = async (req: Request, res: Response) => {
  try {
    const { title, description, pcategory, plink, prepository } = req.body;

    let { projectImage } = req.body;
    // Validate the input
    if (!title || !description || !pcategory) {
      return res.status(400).json({ error: "Invalid input." });
    }

    if (projectImage) {
      const uploadedResponse = await cloudinary.uploader.upload(projectImage);
      projectImage = uploadedResponse.secure_url;
    }

    const ProjectUser = await prisma.projectPost.create({
      data: {
        title,
        description,
        pcategory,
        projectImage,
        plink,
        prepository,
        userId: req.user.id,
      },
    });

    const projectContributed = await prisma.contributions.create({
      data: {
        userId: req.user.id,
        projectId: ProjectUser.id,
        count: 1,
      },
    });

    const project = await Promise.all([ProjectUser, projectContributed]);

    return res
      .status(201)
      .json({ message: "Project created successfully", project });
  } catch (error) {
    console.error("Error creating ProjectUser:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating ProjectUser" });
  }
};

export const getProjectPost = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const limit = parseInt(req.query.limit as string) || 3;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    let posts: any;
    let totalDocs: number;

    if (userId) {
      totalDocs = await prisma.projectPost.count({
        where: { userId: userId as string },
      });

      posts = await prisma.projectPost.findMany({
        where: { userId: userId as string },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Sort by createdAt in descending order
      });
    } else {
      totalDocs = await prisma.projectPost.count();

      posts = await prisma.projectPost.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Sort by createdAt in descending order
      });
    }

    return res.status(200).json({
      posts,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching ProjectPosts:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching ProjectPosts" });
  }
};

export const getAllProjectPost = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 3;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    const projectPosts = await prisma.projectPost.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const totalCount = await prisma.projectPost.count();
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: projectPosts,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching project posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project posts.",
    });
  }
};

export const getByIdProjectPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const specificPost = await prisma.projectPost.findUnique({
      where: { id: postId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      specificPost,
    });
  } catch (error) {
    console.error("Error fetching project bY iD posts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project posts.",
    });
  }
};
