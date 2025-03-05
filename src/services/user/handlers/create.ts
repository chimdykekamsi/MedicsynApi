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
    
    const validTimeZones = await fetchValidTimeZones();
    if (!validTimeZones.includes(req.body.timeZone)) {
        return APIResponse.error("Not a valid timeZone!", 400).send(res);
    }
    
    const user = await UserRepo.createUser(req.body);
    return APIResponse.success("registration successful",{user}, 201).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

const fetchValidTimeZones = async (): Promise<string[]> => {
  try {
    const response = await fetch("https://timeapi.io/api/timezone/availabletimezones");
    if (!response.ok) {
      throw new Error(`Failed to fetch time zones: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching time zones:", error);
    return [];
  }
};

export default createUserHandler;
