import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import { formatResponseRecord } from "../../../utils/formatters";
import APIResponse from "../../../utils/api";

export const findUserByIdHandler = async (req: Request, res: Response) => {
  try {
    // Fetch users and total count
    const user = await UserRepo.findById(req.params.userId); 

    if (!user) {
      return APIResponse.error("No user matches the Id", 404).send(res);
    }

    const { password, ...rest } = user?.toObject();
    const response = formatResponseRecord(rest);


    // Send response with users and pagination
    return APIResponse.success(
      "Fetching all users",
      {user: response},
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
