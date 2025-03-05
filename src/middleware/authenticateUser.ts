import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";
import UserRepo from "../database/repository/userRepo";

const authenticateUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.user) return APIResponse.error("Access token is required", 401).send(res);
    const userId = res.locals.user._id;
    const user = await UserRepo.findById(userId);
    if (!user) return APIResponse.error("No user found for the specified Id", 401).send(res);
    // if (user.emailVerified === false) return APIResponse.error("Email needs to be verified", 401).send(res);
    if (user.isActive === false) return APIResponse.error("This Account is not active", 401).send(res);
    next();
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default authenticateUser;
