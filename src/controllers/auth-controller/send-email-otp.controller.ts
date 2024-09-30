import nodemailer from 'nodemailer';
import { Request, Response } from "express";
import { responseCodes } from '../../utils/response-codes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(toEmail: string, otp: string): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: "comX <comX@gmail.com>",
      to: toEmail,
      subject: 'Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.`,
    };

    await prisma.user.update({
      where: {
        email: toEmail,
      },
      data: {
        otp: otp,
        isOtpValid: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

export const send_email_otp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const userEmail = email;
    const otp = generateOTP();
    await sendOtpEmail(userEmail, otp).then(() => console.log('OTP sent!'));
    responseCodes.success.ok(res, {}, "otp sent");
  }
  catch (error) {
    console.log(error);
    responseCodes.serverError.internalServerError(res, "internal error");
  }
}



prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
})