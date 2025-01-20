import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { signjwt, verifyjwt } from "../../../utils/jwt";
import sendMail from "../../../utils/sendMail";
import config from "../../../config";


// Request Email Verification Handler
export const requestEmailVerificationHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return APIResponse.error("Email is required", 400).send(res);
    }

    const user = await UserRepo.findByEmail(email);
    if (!user) {
      return APIResponse.error("User with this email does not exist", 404).send(res);
    }
    
    if (user.emailVerified) {
      return APIResponse.success("Email already verified", undefined, 200).send(res);
    }

    // Generate verification token
    const token = signjwt(
      { email },
      "accessTokenPrivateKey", // Or a dedicated key for email verification
      { expiresIn: "5m" }
    );

    // Send email
    const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${token}`;
    const subject = "Verify Your Email";
    const message = "Please verify your email by clicking the link below:";
    await sendMail(email,subject,message,verificationUrl);
    return APIResponse.success("Verification email sent successfully", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

// Verify Email Handler
export const verifyEmailHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return APIResponse.error("Verification token is required", 400).send(res);
    }

    // Verify the token
    const decoded = verifyjwt<{ email: string }>(token, "accessTokenPrivateKey");
    if (!decoded || !decoded.email) {
      return APIResponse.error("Invalid or expired token", 401).send(res);
    }

    // Find user and update their email verification status
    const user = await UserRepo.findByEmail(decoded.email);
    if (!user) {
      return APIResponse.error("User with this email does not exist", 404).send(res);
    }

    if (user.emailVerified) {
      return APIResponse.success("Email already verified", undefined, 200).send(res);
    }

    user.emailVerified = true;
    await user.save();

    return APIResponse.success("Email verified successfully", undefined, 200).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
