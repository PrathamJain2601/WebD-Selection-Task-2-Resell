import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { responseCodes } from "../../utils/response-codes";

const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

export const add_to_cart = async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return responseCodes.clientError.badRequest(res, "userId, productId, and quantity are required.");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return responseCodes.clientError.notFound(res, "Product not found.");
    }

    if (quantity > product.quantity) {
      return responseCodes.clientError.badRequest(res, "Quantity requested exceeds available stock.");
    }

    let cartProduct = await prisma.cartProduct.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (cartProduct) {
      const newQuantity = cartProduct.quantity + quantity;

      if (newQuantity > product.quantity) {
        return responseCodes.clientError.badRequest(res, "Updated cart quantity exceeds available stock.");
      }

      const updatedCartProduct = await prisma.cartProduct.update({
        where: { id: cartProduct.id },
        data: { quantity: newQuantity },
      });

      return responseCodes.success.ok(res, updatedCartProduct, "Cart updated successfully.");
    } else {
      const addedCartProduct = await prisma.cartProduct.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
          quantity,
        },
      });

      return responseCodes.success.created(res, addedCartProduct, "Product added to cart successfully.");
    }
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while adding to the cart.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
