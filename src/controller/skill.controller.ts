import prisma from "../config/prisma.js";
import { Request, Response } from "express";

export const createUserInfoSkill = async (req: Request, res: Response) => {
  try {
    const { category, skills } = req.body;
    const userId = req.user.id;

    // Validate the input
    if (!category || !skills || !Array.isArray(skills)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid input. Ensure userId, category, and skills are provided and skills is an array.",
        });
    }

    const userInfoSkill = await prisma.userInfoSkill.create({
      data: {
        userId,
        category,
        skills,
      },
    });

    return res
      .status(201)
      .json({ message: "UserInfoSkill created successfully", userInfoSkill });
  } catch (error) {
    console.error("Error creating UserInfoSkill:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating UserInfoSkill" });
  }
};

export const getUserInfoSkills = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let userInfoSkills: any;

    // Fetch based on userId or fetch all
    if (userId) {
      userInfoSkills = await prisma.userInfoSkill.findMany({
        where: { userId: userId as string },
      });
    }

    return res
      .status(200)
      .json({
        message: "UserInfoSkills retrieved successfully",
        userInfoSkills,
      });
  } catch (error) {
    console.error("Error fetching UserInfoSkills:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching UserInfoSkills" });
  }
};

export const updateUserInfoSkill = async (req: Request, res: Response) => {
  const {id} = req.params // Ensure req.user is populated (e.g., via middleware)
  const { category, skills } = req.body;

  try {
    // Check if the userInfoSkill exists
    const updatedUserInfoSkill = await prisma.userInfoSkill.update({
      where: { id }, // Ensure `userId` is passed correctly
      data: { category, skills },
    });

    res.status(200).json(updatedUserInfoSkill);
  } catch (error: any) {
    console.error("Error updating UserInfoSkill:", error.message);

  

  
  
      res.status(500).json({ error: "Failed to update UserInfoSkill" });
    
  }
};
