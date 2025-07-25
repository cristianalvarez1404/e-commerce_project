import { Response, Request } from "express";
import { MongoCartDAO } from "../dao/cart/MongoCartDAO";
import { CartService } from "../services/cart/CartService";
import { MongoInventoryDAO } from "../dao/inventory/MongoInventoryDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { ProductToBuy, ProductToUpdate } from "../dao/cart/ICartDAO";
import { CartIDParamDTO } from "../dto/cart/cartIDParamDTO";
import { CreateCartListDTO } from "../dto/cart/createCartDTO";
import { UpdateCartListDTO } from "../dto/cart/updateCartDTO";

const dbCart = new MongoCartDAO();
const dbProduct = new MongoProductDAO();
const dbInventory = new MongoInventoryDAO();
const serviceCart = new CartService(dbCart, dbProduct, dbInventory);

const getCarts = async (req: Request, res: Response) => {
  try {
    const carts = await serviceCart.getCarts();

    return res.status(200).json(carts);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const getCartById = async (req: Request, res: Response) => {
  try {
    const id = CartIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const cart = await serviceCart.getCartById(id.data.id);

    return res.status(200).json(cart);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const createCart = async (req: Request, res: Response) => {
  try {
    const validateProducts = CreateCartListDTO.safeParse(req.body);

    if (!validateProducts.success) {
      return res.status(400).json({ message: validateProducts.error });
    }

    const products: ProductToBuy[] = validateProducts.data;

    const userId = req.user._id.toString();

    const newCart = await serviceCart.createCart(products, userId);

    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Create cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCartById = async (req: Request, res: Response) => {
  try {
    const id = CartIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const validateProducts = UpdateCartListDTO.safeParse(req.body);

    if (!validateProducts.success) {
      return res.status(400).json({ message: validateProducts.error });
    }

    const productsToUpdate: ProductToUpdate[] = validateProducts.data;

    if (
      !productsToUpdate.every(
        (p) => p.idProduct && p.prevUnits && p.unitsToBuy >= 0
      )
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

    const newCartUpdated = await serviceCart.updateCartById(
      id.data.id,
      productsToUpdate
    );

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
    const id = CartIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    await serviceCart.deleteCartById(id.data.id);

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
