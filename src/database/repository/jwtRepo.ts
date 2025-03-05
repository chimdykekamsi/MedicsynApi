import { signjwt } from "../../utils/jwt";
import { User } from "../models/user";

export default class JWTRepo {
  static signAccessToken = (
    user: Omit<User, "__v" | "password" | "verifyPassword">
  ) => {
    const accessToken = signjwt(user, "accessTokenPrivateKey", {
      expiresIn: "1h",
    });
    return accessToken;
  };

  static signRefreshToken = (
    user: Omit<User, "__v" | "password" | "verifyPassword">
  ) => {
    const refreshToken = signjwt(user, "refreshTokenPrivateKey", {
      expiresIn: "7d",
    });
    return refreshToken;
  };
  
}
