import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Product from "../models/mongoDB/product.model";
import { z } from "zod";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { ProductService } from "../services/product/product.service";

const db = new MongoProductDAO();
const productService = new ProductService(db);

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProducts();

    return res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json(error);
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json(error);
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
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

    const productSaved = productService.createProduct(productData);

    return res.status(201).json(productSaved);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const idProduct = req.params.id;
    const productSaved = await Product.findById(idProduct);

    if (!productSaved) {
      return res
        .status(400)
        .json({ message: `Product with id ${idProduct} does not exists!` });
    }

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

    const newProduct = productService.updateProductById(idProduct, productData);

    return res.status(200).json(newProduct);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    productService.deleteProduct(id);

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
