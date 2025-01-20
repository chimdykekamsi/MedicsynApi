import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import APIResponse from "../../../utils/api";
import { createUserInput } from "../../../validationSchema/user";

const createUserHandler = async (
  req: Request<{}, {}, createUserInput>,
  res: Response
) => {
  try {
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      return APIResponse.error("User with email already exists!",400).send(res);
    }
    const user = await UserRepo.createUser(req.body);
    return APIResponse.success("registration successful",{user}, 201).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
export default createUserHandler;
