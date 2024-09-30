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

export const edit_product = async (req: Request, res: Response) => {
  try {
    const { productId, name, description, quantity, price, userId } = req.body;

    if (!productId) {
      return responseCodes.clientError.badRequest(res, "productId is required.");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    
    if (!product) {
        return responseCodes.clientError.notFound(res, "Product not found.");
    }
    
    if(product.userId != userId){
        return responseCodes.clientError.unauthorized(res, "You can't edit this product");
    }
    const updatedData: any = {}; 

    if (name) updatedData.name = name;
    if (description) updatedData.description = description;
    if (quantity !== undefined) updatedData.quantity = parseInt(quantity); 
    if (price !== undefined) updatedData.price = parseFloat(price);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedData,
    });

    return responseCodes.success.ok(res, updatedProduct, "Product updated successfully.");
  } catch (error) {
    console.error(error);
    return responseCodes.serverError.internalServerError(res, "An error occurred while updating the product.");
  }
};

prisma.$on("query", async (e) => {
  console.log(`${e.query} ${e.params}`);
});
