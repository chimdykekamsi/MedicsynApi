import { NextFunction, Request, Response } from "express";
import { verifyjwt } from "../utils/jwt";
import APIResponse from "../utils/api";

const deserialize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // console.log(req.headers.authorization);
    const accessToken = (req.headers.authorization || "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken) return next();
    const decodedToken = await verifyjwt(accessToken, "accessTokenPrivateKey");
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default deserialize;
