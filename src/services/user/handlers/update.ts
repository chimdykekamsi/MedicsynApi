import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import CloudinaryRepo from "../../../database/repository/cloudinaryRepo";
import APIResponse from "../../../utils/api";
import { UpdateProfileInput, ChangePasswordInput } from "../../../validationSchema/user";

// Update Profile Handler
export const updateProfileHandler = async (
  req: Request<{}, {}, UpdateProfileInput>,
  res: Response
) => {
  try {
    const userId = res.locals.user._id;

    const updatedUser = await UserRepo.updateUser(req.body, userId);

    if (!updatedUser) {
      return APIResponse.error("We couldn't update your profile at this time. Please try again.", 500).send(res);
    }

    return APIResponse.success("Profile updated successfully", { user: updatedUser }).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

// Change Password Handler
export const changePasswordHandler = async (req: Request< {},{}, ChangePasswordInput>, res: Response) => {
  try {
    const userId = res.locals.user._id;

    const user = await UserRepo.findById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    const isMatch = await user.verifyPassword(req.body.oldPassword);
    if (!isMatch) {
      return APIResponse.error("The old password is incorrect", 400).send(res);
    }

    await UserRepo.updateUser({ password: req.body.newPassword }, userId);

    return APIResponse.success("Password updated successfully", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error("Failed to update password. Please try again.", 500).send(res);
  }
};

// Upload Profile Image Handler
export const uploadProfileImageHandler = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.user._id;

    if (!req.file) {
      return APIResponse.error("No file uploaded", 400).send(res);
    }

    const uploadResult = await CloudinaryRepo.uploadImage(req.file.path, 
      "profile_images",
      { width: 300, height: 300, crop: "fill" },
    );

    const updatedUser = await UserRepo.updateUser(
      { profileUrl: uploadResult.secure_url },
      userId
    );

    if (!updatedUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    return APIResponse.success("Profile image updated successfully", { user: updatedUser }).send(res);
  } catch (error) {
    return APIResponse.error("An error occurred while uploading the profile image", 500).send(res);
  }
};
