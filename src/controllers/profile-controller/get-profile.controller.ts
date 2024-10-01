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

export const get_profile = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Extract userId from token or request body

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        isVerified: true,
        products: {  // Include the products the user has posted
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    if (!user) {
      return responseCodes.clientError.notFound(res, "User profile not found.");
    }

    return responseCodes.success.ok(res, user, "Profile and products fetched successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while fetching the profile.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
