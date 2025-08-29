import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "../services/cloudinary.service";
import { createVideo, getAllVideos } from "../services/video.service";

const outputDir = path.join(__dirname, "..", "../output_videos");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

export const processVideo = async (req: any, res: any) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No video uploaded" });
  const userId = req.userId;
  if (!file.mimetype.startsWith("video/")) {
    return res.status(400).json({ error: "Invalid file type" });
  }
  console.log("Processing video for user:", userId);
  const outputPath = path.join(outputDir, `${Date.now()}_out.mp4`);

  ffmpeg(file.path)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", async () => {
      try {
        const cloudinaryResult = await uploadToCloudinary(outputPath);

        const saved = await createVideo({
          title: req.body.title || "Untitled",
          description: req.body.description || "",
          videoUrl: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          uploadedBy: userId,
          duration: req.body.duration || 0,
          thumbnailUrl: cloudinaryResult.thumbnail_url || "",
        });

        fs.unlinkSync(file.path);
        fs.unlinkSync(outputPath);

        res.json({ message: "Video uploaded", video: saved });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
      }
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err);
      res.status(500).json({ error: "Processing failed" });
    })
    .save(outputPath);
};

export const listVideos = async (req: any, res: any) => {
  try {
    const videos = await getAllVideos(req);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};
