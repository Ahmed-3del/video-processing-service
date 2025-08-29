import express from "express";
import multer from "multer";
import { listVideos, processVideo } from "../controllers/video.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("video"), (req, res, next) => {
  processVideo(req, res).catch(next);
});
router.get("/", listVideos);
router.get("/:id", (req, res, next) => {
  const videoId = req.params.id;
  // Fetch video details by ID
});
export default router;
