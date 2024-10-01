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

export const get_products_with_pagination = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and 10 products per page

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    if (pageNumber < 1 || pageSize < 1) {
      return responseCodes.clientError.badRequest(res, "Page and limit must be positive integers.");
    }

    const products = await prisma.product.findMany({
      skip: (pageNumber - 1) * pageSize, // Calculate how many products to skip
      take: pageSize, // How many products to fetch
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true, // Only include name, email, and phone number of the user
          },
        },
      },
    });

    const totalProducts = await prisma.product.count(); // Count total products in the database
    const totalPages = Math.ceil(totalProducts / pageSize); // Calculate the total number of pages

    return responseCodes.success.ok(res, {
      products,
      currentPage: pageNumber,
      totalPages,
      totalProducts,
    }, "Products fetched successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while fetching products.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
