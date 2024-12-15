import { Request, Response } from "express";

import prisma from "../config/prisma.js";
import { randomBytes } from "crypto";
import { hashPassword } from "../utils/hashpassword.util.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const generateUniqueUsername = (name:any) => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
      const sanitizedName = name.replace(/\s+/g, ""); // Remove spaces from the name
      return `@${sanitizedName}${randomNumber}`;
    };

    const salt = randomBytes(16).toString("hex");

    const hashedPassword = await hashPassword(password, salt);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: generateUniqueUsername(name),
        name,
        avatar: `https://api.dicebear.com/9.x/dylan/svg?seed=${name}`,
        email,
        salt,
        password: hashedPassword,
      },
    });

    // Return success response
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json("User Not Found");
  }

  const hashedPassword = await hashPassword(password, user.salt);

  if (hashedPassword === user.password) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.status(201).json({
      token,

      _id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      message: "Login successful",
    });
  } else {
    res.status(400).json({ error: "Invalid email or password" });
  }
};

export const Profile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    let user: any;

    if (username) {
      // Search by username if provided
      user = await prisma.user.findUnique({
        where: { username: username },
      });
    } else if (req.user?.id) {
      // Fallback to search by user ID if username is not provided
      user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
    } else {
      return res
        .status(401)
        .json({ error: "Unauthorized access - User not found in request" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user's profile data
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    });
  } catch (error: any) {
    console.error("Error in Profile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateProfile = async (req: Request, res: Response) => {
  try {
      const userId = req.user.id;
      const { name, email, avatar } = req.body;

      const updatedUser = await prisma.user.update({
        where: {id:userId},
        data: {
          name,
          email,
          avatar,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
  } catch (error: any) {
    console.error("Error in Profile controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
