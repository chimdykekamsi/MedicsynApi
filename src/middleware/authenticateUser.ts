import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    if (!user) return APIResponse.error("Access token is required", 401).send(res);
    // if (!user.emailVerified) return APIResponse.error("Email needs to be verified", 401).send(res);
    next();
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default authenticateUser;
