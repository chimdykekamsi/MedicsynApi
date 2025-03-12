import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { formatResponseRecord } from "../../../utils/formatters";
import JWTRepo from "../../../database/repository/jwtRepo";
import { loginInput } from "../../../validationSchema/user";

export const loginHandler = async (req: Request<{}, {}, loginInput>, res: Response) => {
  const { password } = req.body;
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (!existingUser) {
      return APIResponse.error("User with email does not exist!", 404).send(res);
    }
    const isUserPassword = await existingUser?.verifyPassword(password);
    if (!isUserPassword) {
      return APIResponse.error("Incorrect password!", 400).send(res);
    }
    if (existingUser) {
      const { password, ...rest } = existingUser?.toObject();

      const accessToken = JWTRepo.signAccessToken(rest);
      const refreshToken = JWTRepo.signRefreshToken(rest);

      return APIResponse.success(
        "Login successful",
        // { accessToken, refreshToken, ...formatResponseRecord(...rest) },
        { accessToken, refreshToken }, //This code returns only the accessToken and refreshToken when a user logs in 
        200
      ).send(res);
    }
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
