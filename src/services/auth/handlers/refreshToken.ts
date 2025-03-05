import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import { verifyjwt } from "../../../utils/jwt";
import UserRepo from "../../../database/repository/userRepo";
import JWTRepo from "../../../database/repository/jwtRepo";



export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
   
    const { refreshToken } = req.body;                                   

    if (!refreshToken) {
      return APIResponse.error("Refresh token is required", 400).send(res); 
    } 


      // The commented code above required that a user must include the refreshToken in the requestBody
      // Which is not what we intend to implement.


      // This one refreshe's the resfreshToken by allowing users to input their email address.
      // Then if the email exist, the refreshToken will be refreshed.


      // const {email} = req.body;

      // if(!email){
      //   return APIResponse.error("Email is required for refreshToken", 400).send(res);
      // }



    // Verify the refresh token
    const decoded = verifyjwt<{ email: string }>(refreshToken, "refreshTokenPrivateKey");
    
    if (!decoded || !decoded.email) {
      return APIResponse.error("Invalid refresh token", 401).send(res);
    }     //THIS IS THE INTIAL CODE

    // Find the user by email
    const existingUser = await UserRepo.findByEmail(decoded.email);
    if (!existingUser) {
      return APIResponse.error("User with email does not exist!", 404).send(res);
    }

    // verify the refresh token
    //THIS IS THE UPDATED CODE 

    // const {refreshToken} = existingUser;

    // const decoded = verifyjwt<{email: string}>(refreshToken, "refreshTokenPrivateKey");

    // if(!decoded || !decoded.email){
    //   return APIResponse.error("Invalid refresh token", 401).send(res)
    // }

    const { password, ...rest } = existingUser.toObject();

    // Generate a new access token
    const newAccessToken = JWTRepo.signAccessToken(rest);

    return APIResponse.success(
      "Token refreshed",
      { accessToken: newAccessToken },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Invalid refresh token", 401).send(res);
  }
};
