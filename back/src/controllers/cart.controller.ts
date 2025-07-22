import { NextFunction, Response, Request } from "express";
import { MongoCartDAO } from "../dao/cart/MongoCartDAO";
import { CartService } from "../services/cart/CartService";
import { MongoInventoryDAO } from "../dao/inventory/MongoInventoryDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { ProductToBuy, ProductToUpdate } from "../dao/cart/ICartDAO";

const dbCart = new MongoCartDAO();
const dbProduct = new MongoProductDAO();
const dbInventory = new MongoInventoryDAO();
const serviceCart = new CartService(dbCart, dbProduct, dbInventory);

const getCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const carts = serviceCart.getCarts();

    return res.status(200).json(carts);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const getCartById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const cart = serviceCart.getCartById(id);

    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const createCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products: ProductToBuy[] = req.body;

    const userId = req.user._id.toString();

    const newCart = serviceCart.createCart(products, userId);

    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Create cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productsToUpdate: ProductToUpdate[] = req.body;

    if (
      !productsToUpdate.every((p) => p.idProduct && p.prevUnits && p.unitsToBuy)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid product data in request body" });
    }

    if (!productsToUpdate.every((p) => p.prevUnits >= 0 && p.unitsToBuy >= 0)) {
      return res
        .status(400)
        .json({ message: "Invalid product data in request body" });
    }

    const newCartUpdated = serviceCart.updateCartById(id, productsToUpdate);

    return res.status(200).json(newCartUpdated);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  }
};

const deleteCartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    serviceCart.deleteCartById(id);

    return res.status(200).json({
      message: `Cart has been deleted`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return error;
  }
};

export { createCart, getCarts, getCartById, updateCartById, deleteCartById };
