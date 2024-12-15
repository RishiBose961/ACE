import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express, { Application } from "express";
import prisma from "./config/prisma.js";

import contributionRoutes from "./routes/contribution.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillsRoutes from "./routes/skill.routes.js";
import userRoutes from "./routes/user.routes.js";
import likesRoutes from "./routes/likes.routes.js"
import followRoutes from "./routes/follow.routes.js"

const app: Application = express();
const PORT = process.env.PORT || 5000;

// * Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Example route to test the database
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("An error occurred");
  }
});

app.use("/api", userRoutes);
app.use("/api", skillsRoutes);
app.use("/api", projectRoutes);
app.use("/api", contributionRoutes);
app.use("/api",likesRoutes)
app.use("/api",followRoutes)


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
