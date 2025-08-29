// models/video.model.ts
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    duration: Number,
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publicId: String,
    createdAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", videoSchema);
