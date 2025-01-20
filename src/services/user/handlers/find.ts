import { Request, Response } from "express";
import UserRepo from "../../../database/repository/userRepo";
import { formatResponseRecord } from "../../../utils/formatters";
import APIResponse from "../../../utils/api";

const findAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Convert query params to numbers
    const limitNum = Math.max(1, Number(limit)); // Ensure limit is at least 1
    const pageNum = Math.max(1, Number(page)); // Ensure page is at least 1

    // Fetch users and total count
    const users = await UserRepo.findAll(limitNum, pageNum); // Assumes this returns paginated results
    const totalUsers = await UserRepo.countUsers(); // Fetch total number of users

    if (!users || users.length === 0) {
      return APIResponse.error("No users found", 404).send(res);
    }

    // Format the response records
    const response = users.map((user) => {
      const { password, ...rest } = user?.toObject();
      return formatResponseRecord(rest);
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limitNum);

    // Construct pagination object
    const pagination = {
      totalUsers,
      currentPage: pageNum,
      totalPages,
      limit: limitNum,
    };

    // Send response with users and pagination
    return APIResponse.success(
      "Fetching all users",
      { users: response, ...pagination },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default findAllUsersHandler;
