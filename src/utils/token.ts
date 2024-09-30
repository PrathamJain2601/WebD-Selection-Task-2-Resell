const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { User } from "../types/user";
require("dotenv").config();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

const create_token = async (res: Response, user: User) => {
    const token = await jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "30d"});
    res.cookie("token", token, {maxAge:1000 * 60 * 60 * 24 * 30, httpOnly: true});
}

const verify_token = async (req: Request) => {
    const authenticatedToken = req.cookies.token;
    console.log(authenticatedToken);
    if (authenticatedToken) {
        try {
            const decoded = await jwt.verify(authenticatedToken, process.env.JWT_SECRET);
            console.log(decoded);
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.userId,
                },
            });
            console.log(user);
            if (user) {
                if(user.isVerified){
                    req.body.userId = decoded.userId;
                    return true; 
                }
                else{
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return false; 
        }
    } else {
        return false; 
    }
};


prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`);
});

export {create_token, verify_token};