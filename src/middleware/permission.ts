import { NextFunction, Request, Response } from "express";
import APIResponse from "../utils/api";

export const hasPerm = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!allowedRoles.includes(res.locals.user.role)) {
       return APIResponse.error("You dont have the permission to perform this task", 403).send(res);
      }
      next();
    } catch (error) {
      return APIResponse.error((error as Error).message, 500).send(res);
    }
  };
};
