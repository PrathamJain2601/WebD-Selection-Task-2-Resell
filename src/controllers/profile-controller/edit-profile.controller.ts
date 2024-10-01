import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { responseCodes } from "../../utils/response-codes";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

export const edit_profile = async (req: Request, res: Response) => {
  try {

    const userId = req.body.userId;
    const { name, location, phone, username, email } = req.body;

    if (!name && !location && !phone && !username && !email) {
      return responseCodes.clientError.badRequest(res, "Please provide at least one field to update.");
    }

    // Check if email or username is already taken by another user
    if (email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (emailExists && emailExists.id !== userId) {
        return responseCodes.clientError.badRequest(res, "Email is already in use.");
      }
    }

    if (username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (usernameExists && usernameExists.id !== userId) {
        return responseCodes.clientError.badRequest(res, "Username is already in use.");
      }
    }

    // Update profile with the provided fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name || undefined,
        location: location || undefined,
        phone: phone || undefined,
        username: username || undefined,
        email: email || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        phone: true,
        location: true,
      },
    });

    return responseCodes.success.ok(res, updatedUser, "Profile updated successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while updating the profile.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
