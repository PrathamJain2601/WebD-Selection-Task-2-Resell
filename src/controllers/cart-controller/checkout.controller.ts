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

export const checkout = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Extract userId from token or request body

    // Fetch the user's cart items with product details
    const cartItems = await prisma.cartProduct.findMany({
      where: { userId: userId },
      include: {
        product: true, // Include product details
      },
    });

    if (cartItems.length === 0) {
      return responseCodes.clientError.badRequest(res, "Your cart is empty.");
    }

    // Check product availability and calculate total price
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return responseCodes.clientError.notFound(res, `Product with ID ${item.productId} not found.`);
      }

      if (item.quantity > product.quantity) {
        return responseCodes.clientError.badRequest(res, `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}.`);
      }

      totalAmount += product.price * item.quantity;
    }

    // Create a transaction history entry
    const transaction = await prisma.transactionHistory.create({
      data: {
        amount: totalAmount,
        userId: userId,
        description: "Checkout transaction",
      },
    });

    // Create transaction items for each product in the cart
    const transactionItems = cartItems.map(item => ({
      transactionId: transaction.id,
      productId: item.productId,
      quantity: item.quantity,
    }));

    await prisma.transactionItem.createMany({
      data: transactionItems,
    });

    // Update product quantities and clear the cart
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } }, // Reduce the stock quantity
      });
    }

    await prisma.cartProduct.deleteMany({
      where: { userId: userId },
    });

    return responseCodes.success.ok(res, { totalAmount, data: cartItems }, "Checkout successful.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred during checkout.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
