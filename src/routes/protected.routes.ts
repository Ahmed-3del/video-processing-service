import express from "express";
import multer from "multer";
import { processVideo } from "../controllers/video.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get(
  "/",
  ({ req, res, next }: { req: any; res: any; next: () => void }) => {
    res.status(200).json({ message: "Protected route accessed" });
  }
);
router.post("/videos/upload", upload.single("video"), (req, res, next) => {
  processVideo(req, res).catch(next);
});



export default router;
