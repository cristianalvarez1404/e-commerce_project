import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from "../models/mongoDB/product.model";
import { z } from "zod";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //set middleware to verify only admin or staff can create product
    //recibe info from front and validate type of data with zod and product inteface
    const productSchemaValidation = z.object({
      title: z.string(),
      short_description: z.string(),
      price: z.number().min(1),
      reference: z.string(),
      inventory_id: z.string().optional(),
      image_id: z.string().optional(),
      comments: z.array(z.string()).optional(),
    });

    const productDataValidation = productSchemaValidation.safeParse(req.body);

    if (!productDataValidation.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: productDataValidation.error });
    }

    const productData = productDataValidation.data;

    //validate product reference does not exist
    const productExist = await Product.findOne({
      reference: productData.reference,
    });

    if (productExist) {
      return res
        .status(400)
        .json({ message: "Product already exists with this reference" });
    }

    const newProductData = {
      ...productData,
      inventory_id: productData.inventory_id
        ? new mongoose.Types.ObjectId(productData.inventory_id)
        : undefined,
      image_id: productData.image_id
        ? new mongoose.Types.ObjectId(productData.image_id)
        : undefined,
      comments: productData.comments?.map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    };

    const productSaved = await Product.create(newProductData);
    return res.status(201).json(productSaved);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json(error.message)
      : res.status(400).json(error);
  }
};

export { createProduct };
