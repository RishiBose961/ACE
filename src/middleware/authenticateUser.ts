import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define JwtPayload interface to match the decoded JWT structure
interface JwtPayload {
  id: any;
  userId: string; 
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; 
    }
  }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; 

    next();
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
