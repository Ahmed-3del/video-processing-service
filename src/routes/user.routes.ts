import express from "express";
import multer from "multer";
import {
  getUserProfile,
  getUserUploads,
  updateUserProfile,
} from "../controllers/user.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/profile", verifyToken, getUserProfile);
router.get("/uploads", verifyToken, getUserUploads);
router.patch(
  "/profile",
  verifyToken,
  upload.single("profilePicture"),
  updateUserProfile
);

export default router;