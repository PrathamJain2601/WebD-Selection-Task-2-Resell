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

export const get_product = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
        select: {
          id: true,             
          name: true,
          description: true,
          quantity: true,
          price: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,       
            },
          },
        },
      });

    return responseCodes.success.ok(res, products, "Products retrieved successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while retrieving products.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
