import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import { verifyjwt } from "../../../utils/jwt";
import UserRepo from "../../../database/repository/userRepo";
import JWTRepo from "../../../database/repository/jwtRepo";

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return APIResponse.error("Refresh token is required", 400).send(res);
    }

    // Verify the refresh token
    const decoded = verifyjwt<{ email: string }>(refreshToken, "refreshTokenPrivateKey");
    
    if (!decoded || !decoded.email) {
      return APIResponse.error("Invalid refresh token", 401).send(res);
    }

    // Find the user by email
    const existingUser = await UserRepo.findByEmail(decoded.email);
    if (!existingUser) {
      return APIResponse.error("User with email does not exist!", 404).send(res);
    }

    const { password, ...rest } = existingUser.toObject();

    // Generate a new access token
    const newAccessToken = JWTRepo.signAccessToken(rest);

    return APIResponse.success(
      "Token refreshed",
      { accessToken: newAccessToken },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Invalid refresh token", 401).send(res);
  }
};
