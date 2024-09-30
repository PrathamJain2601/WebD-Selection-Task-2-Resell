import { Response, Request, NextFunction } from "express";
import { verify_token } from "../utils/token";
import { responseCodes } from "../utils/response-codes";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isValid = await verify_token(req);
      if (isValid) {
        next();
      } else {
        return responseCodes.clientError.unauthorized(res, "Unauthorized: Invalid or missing token.");
      }
    } catch (error) {
      return responseCodes.serverError.internalServerError(res, "An error occurred during authentication.");
    }
  };
  
