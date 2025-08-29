import { Request, Response, NextFunction } from "express";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const jwt = require("jsonwebtoken");
export default function verifyToken(req: Request, res: any, next: NextFunction) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  console.log("Token:", token);
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token", details: error });
  }
}
