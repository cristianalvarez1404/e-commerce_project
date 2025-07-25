import { Request, Response } from "express";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { ProductService } from "../services/product/product.service";
import { ProductIDParamsDTO } from "../dto/product/productIDParamsDTO";
import { CreateProductDTO } from "../dto/product/createProductDTO";
import { UpdateProductDTO } from "../dto/product/updateProductDTO";

const db = new MongoProductDAO();
const productService = new ProductService(db);

const getProducts = async (req: Request, res: Response) => {
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
    const id = ProductIDParamsDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }
    const product = await productService.getProductById(id.data.id);
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
    const productDataValidation = CreateProductDTO.safeParse(req.body);

    if (!productDataValidation.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: productDataValidation.error });
    }

    const productData = productDataValidation.data;

    const productSaved = await productService.createProduct(productData);

    return res.status(201).json(productSaved);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const idProduct = ProductIDParamsDTO.safeParse(req.params);

    if (!idProduct.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const productDataValidation = UpdateProductDTO.safeParse(req.body);

    if (!productDataValidation.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: productDataValidation.error });
    }

    const productData = productDataValidation.data;

    const newProduct = await productService.updateProductById(
      idProduct.data.id,
      productData
    );

    return res.status(200).json(newProduct);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = ProductIDParamsDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    await productService.deleteProduct(id.data.id);

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
