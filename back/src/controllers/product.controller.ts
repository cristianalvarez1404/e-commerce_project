import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from "../models/mongoDB/product.model";
import { z } from "zod";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("inventory_id")
      .select("-__v");

    return res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json(error);
  }
};

const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate({
      path: "inventory_id",
      select: "-__v",
    });

    if (!product) {
      return res.status(400).json({ message: "Product does not exists!" });
    }

    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json(error);
  }
};

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
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //verify product if exists in db
    const idProduct = req.params.id;
    const productSaved = await Product.findById(idProduct);

    if (!productSaved) {
      return res
        .status(400)
        .json({ message: `Product with id ${idProduct} does not exists!` });
    }

    //validate field append in the body request
    const productSchemaValidation = z.object({
      title: z.string().optional(),
      short_description: z.string().optional(),
      price: z.number().min(1).optional(),
      reference: z.string().optional(),
      inventory_id: z.string().optional(),
    });

    const productDataValidation = productSchemaValidation.safeParse(req.body);

    if (!productDataValidation.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: productDataValidation.error });
    }

    const productData = productDataValidation.data;

    //update product in db
    const newProduct = await Product.findByIdAndUpdate(idProduct, productData, {
      new: true,
    });

    //return new product
    return res.status(200).json(newProduct);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validate if product exists
    const { id } = req.params;
    const isProductExists = await Product.findById(id);

    if (!isProductExists) {
      return res
        .status(400)
        .json({ message: `Product with id ${id} does not exists!` });
    }

    //delete product
    await isProductExists.deleteOne();
    //return message
    return res.status(200).json({ message: "Product deleted sucessfully!" });
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
