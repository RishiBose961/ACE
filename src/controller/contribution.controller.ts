import prisma from "../config/prisma.js";
import {Request,Response} from 'express'


export const getContributions = async (req: Request, res: Response) => {
  try {
    const {userId} = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "userId is required to fetch contributions" });
    }

    // Fetch all contributions for the user
    const contributions = await prisma.contributions.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });


    // Aggregate contributions by date
    const dateWiseCounts: { [key: string]: number } = {};

    contributions.forEach(contribution => {
      const date = contribution.createdAt.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD
      dateWiseCounts[date] = (dateWiseCounts[date] || 0) + contribution.count;
    });

    // Convert the result into an array format
    const aggregatedContributions = Object.entries(dateWiseCounts).map(
      ([date, count]) => ({ date, count })
    );

    return res.status(200).json(aggregatedContributions);
  } catch (error: any) {
    console.error("Error fetching contributions:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};