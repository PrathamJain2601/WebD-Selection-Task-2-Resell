import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { responseCodes } from "../../utils/response-codes";

const prisma = new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
    ],
  });

export const verify_email_otp = async(req: Request, res: Response) => {
    const {email, otp} = req.body;
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    });
    if(!user){
        return responseCodes.clientError.notFound(res, "user not found with this email");
    }
    const currentTime = new Date();
    if (user.otp !== otp || user.isOtpValid === null || currentTime > user.isOtpValid) {
        
        return responseCodes.clientError.badRequest(res, "Invalid or expired OTP");
    }

    await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          isVerified: true,
          otp: null,             
          isOtpValid: null,       
        },
      });
  
      return responseCodes.success.ok(res, "Email verified successfully");
}

prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`);
  })