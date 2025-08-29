import Video from "../models/video.model";

export const createVideo = (data: {
  title: string;
  description: string;
  videoUrl: string;
  publicId: string;
  uploadedBy: string;
  duration?: number;
  thumbnailUrl?: string;
}) => Video.create(data);

interface ExtendedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
  };
}

export const getAllVideos = async (req: ExtendedRequest) => {
  const page = parseInt(req.query.page ?? "1");
  const limit = parseInt(req.query.limit ?? "10");
  const startIndex = (page - 1) * limit;
  const total = await Video.countDocuments();

  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);
  return {
    total,
    page,
    limit,
    videos,
  };
};

export const getVideoById = (id: string) => Video.findById(id);
export const updateVideo = (id: string, data: Partial<{
  title: string;
  description: string;
  videoUrl: string;
  publicId: string;
  uploadedBy: string;
  duration?: number;
  thumbnailUrl?: string;
}>) => Video.findByIdAndUpdate(id, data, { new: true });
export const deleteVideo = (id: string) => Video.findByIdAndDelete(id);