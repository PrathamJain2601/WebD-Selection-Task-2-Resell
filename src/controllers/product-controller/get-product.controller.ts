import { Request, Response } from "express";
export const get_product = async (req: Request, res: Response) => {
    res.send("get_product");
}