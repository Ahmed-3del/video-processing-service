import express from "express";
import mongoose from "mongoose";
import videoRoutes from "./routes/video.routes";
import authRoutes from "./routes/auth.routes";
import protectedRoute from "./routes/protected.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import verifyToken from "./middleware/auth.middleware";
import userRoutes from "./routes/user.routes";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/dashboard", verifyToken, protectedRoute);
app.use("/api/videos", videoRoutes);
app.use("/api/user", userRoutes);
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the video processing service API");
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

export default app;
