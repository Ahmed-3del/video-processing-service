import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (filePath: string) =>
  cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    folder: "processed-videos",
  });

export const deleteFromCloudinary = (publicId: string) =>
  cloudinary.uploader.destroy(publicId, {
    resource_type: "video",
  });
export const getCloudinaryUrl = (publicId: string) =>
  cloudinary.url(publicId, {
    resource_type: "video",
    secure: true,
  });