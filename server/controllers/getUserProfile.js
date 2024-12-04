import User from "../models/userModels.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

const getUserProfile = async (req, res) => {
  
  try {
    const userId = req.id; //user-Id from midleware
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in lodding user", error);
    return res.status(500).json({
      success: false,
      message: "Faild to load User",
    });
  }
};
export default getUserProfile;

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const  profilePhoto  = req.file;
   
    //find user
    const user =await User.findById(userId);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }
     //extract public id of the old image from the url if it exis
     if(user.profileImage){
      const publicId = user.profileImage.split('/').pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
     }

     //upload in photo to cloudinary
     const cloudResponse = await uploadMedia(profilePhoto.path);
     const profileImage = cloudResponse.secure_url;
    //update userData based on id
    const updateData = {name,profileImage};
    const updateUser = await User.findByIdAndUpdate(userId,updateData, {new:true}).select("-password").populate("enrolledCourses");
    return res.status(200).json({
      success:true,
      user:updateUser,
      message:"User profile updated successfully"
    });
    
  } catch (error) {
    console.log("error in update Profile", error);
    return res.status(500).json({
      success: false,
      message: "Faild to update profile",
    });
  }
};
