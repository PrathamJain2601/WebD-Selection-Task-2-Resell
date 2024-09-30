const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { User } from "../types/user";
require("dotenv").config();

const create_token = async (res: Response, user: User) => {
    const token = await jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "30d"});
    res.cookie("token", token, {maxAge:1000 * 60 * 60 * 24 * 30, httpOnly: true});
}

const verify_token = async (req: Request, prisma: any) => {
    const authenticatedToken = req.cookies.token;
    if (authenticatedToken) {
        try {
            const decoded: any = await jwt.verify(authenticatedToken, process.env.JWT_SECRET);
            
            // Fetch the user from the database using Prisma
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId
                }
            });

            if (user) {
                return true;  // User exists and token is valid
            } else {
                return false; // User not found
            }
        } catch (error) {
            return false; // Token verification failed
        }
    } else {
        return false; // No token found
    }
};


export {create_token, verify_token};