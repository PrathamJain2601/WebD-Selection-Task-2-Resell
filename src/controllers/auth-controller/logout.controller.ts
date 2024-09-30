import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";
export const logout = async(req: Request, res: Response) => {
    res.clearCookie("token");
    return responseCodes.success.ok(res, {}, "logged out");
}