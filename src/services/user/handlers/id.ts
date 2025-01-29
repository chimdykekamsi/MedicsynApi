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

export const suspendOrActivateUserHandler = async (req: Request, res: Response)=> {
  try {
    // Fetch users and total count
    const user = await UserRepo.findById(req.params.userId); 

    if (!user) {
      return APIResponse.error("No user matches the Id", 404).send(res);
    }

    const updatedUser = await UserRepo.updateUser({isActive: !user.isActive}, req.params.userId)
    
    if(!updatedUser) return APIResponse.error("Unable to perform this task at this time please try again").send(res);
    
    const status = updatedUser?.isActive ? "activated"  : "suspended";

    // Send response with users and pagination
    return APIResponse.success(
      `${user.name}'s account has been ${status}`,
      {updatedData: updatedUser},
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
}