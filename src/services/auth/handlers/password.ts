import crypto from "crypto";
import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { resetPasswordInput } from "../../../validationSchema/user";
import sendMail from "../../../utils/sendMail";
import config from "../../../config";

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return APIResponse.error("Email is required", 400).send(res);
    }

    const existingUser = await UserRepo.findByEmail(email);
    if (!existingUser) {
      return APIResponse.error("User not found", 404).send(res);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    existingUser.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    existingUser.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await existingUser.save();

    // implement email
    const resetUrl = `${config.CLIENT_URL}/verify-email?token=${resetToken}`;
    const subject = "Reset Password";
    const message = "Click the link below to reset your password";
    await sendMail(email,subject,message,resetUrl);

    return APIResponse.success("Password reset token sent to your email", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};


export const resetPasswordHandler = async (req: Request< {}, {}, resetPasswordInput>, res: Response) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.body.token).digest("hex");
    const user = await UserRepo.findByResetToken(hashedToken);

    if (!user) {
      return APIResponse.error("Invalid or expired token", 400).send(res);
    }

    const updatedUser = UserRepo.updateUser({password: req.body.newPassword}, user.id);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return APIResponse.success("Password reset successful", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};
