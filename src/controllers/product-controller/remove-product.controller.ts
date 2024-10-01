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

export const remove_product = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return responseCodes.clientError.badRequest(res, "productId is required.");
    }

    const userId = req.body.userId; // Extract userId from token or request body

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return responseCodes.clientError.notFound(res, "Product not found.");
    }

    // Check if the authenticated user is the creator of the product
    if (product.userId !== userId) {
      return responseCodes.clientError.forbidden(res, "You are not authorized to remove this product.");
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    return responseCodes.success.ok(res, null, "Product removed successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while removing the product.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
