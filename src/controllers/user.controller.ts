import User from "../models/user.model";
import Video from "../models/video.model";
const getUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, email, profilePictureUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePictureUrl },
      { new: true, runValidators: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      user: updatedUser,
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserUploads = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Fetching uploads for userId:", userId);

    const uploads = await Video.find({ uploadedBy: userId });
    res.json(uploads);
  } catch (error) {
    console.error("Error fetching user uploads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUserProfile, updateUserProfile, getUserUploads };
