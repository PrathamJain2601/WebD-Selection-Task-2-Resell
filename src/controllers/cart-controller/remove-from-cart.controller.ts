import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { responseCodes } from "../../utils/response-codes";

const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

export const remove_from_cart = async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return responseCodes.clientError.badRequest(res, "userId and productId are required.");
    }

    const cartProduct = await prisma.cartProduct.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!cartProduct) {
      return responseCodes.clientError.notFound(res, "Product not found in cart.");
    }

    await prisma.cartProduct.delete({
      where: { id: cartProduct.id },
    });

    return responseCodes.success.ok(res, null, "Product removed from cart successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while removing the product from the cart.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
