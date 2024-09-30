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

export const create_product = async (req: Request, res: Response) => {
  try {
    const { userId, name, description, price, quantity } = req.body;

    if (!userId || !name || !price || !quantity) {
      return responseCodes.clientError.badRequest(res, "userId, name, price, and quantity are required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return responseCodes.clientError.notFound(res, "User not found.");
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        user: {
          connect: { id: userId }, 
        },
      },
    });

    return responseCodes.success.created(res, product, "Product created successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while creating the product.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
