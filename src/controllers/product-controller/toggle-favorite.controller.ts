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

// Toggle favorite status for a product
export const toggle_favorite = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params; // assuming productId is passed as a URL parameter

    if (!userId || !productId) {
      return responseCodes.clientError.badRequest(res, "User ID and Product ID are required.");
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return responseCodes.clientError.notFound(res, "Product not found.");
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true }, // Include favorites to check if the product is already favorited
    });

    if (!user) {
      return responseCodes.clientError.notFound(res, "User not found.");
    }

    // Check if the product is already in the user's favorites
    const isFavorite = user.favorites.some((favProduct) => favProduct.id === product.id);

    let updatedUser;
    if (isFavorite) {
      // If product is already a favorite, remove it
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: product.id }, // Disconnect the product from user's favorites
          },
        },
        include: { favorites: true }, // Optional: Include favorites in the response
      });

      return responseCodes.success.ok(res, updatedUser, "Product removed from favorites.");
    } else {
      // If product is not a favorite, add it
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: product.id }, // Connect the product to user's favorites
          },
        },
        include: { favorites: true }, // Optional: Include favorites in the response
      });

      return responseCodes.success.ok(res, updatedUser, "Product added to favorites.");
    }
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while toggling the favorite status.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
