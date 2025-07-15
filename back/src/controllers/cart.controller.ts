import { NextFunction, Response, Request } from "express";
import { IProduct } from "../interfaces/models-intefaces/product.interface";
import Product from "../models/mongoDB/product.model";
import mongoose, { ObjectId } from "mongoose";
import Inventory from "../models/mongoDB/inventory.model";
import { IInventory } from "../interfaces/models-intefaces/inventory.interface";
import Cart from "../models/mongoDB/cart.model";

type ProductToBuy = {
  idProduct: string;
  unitsToBuy: number;
};

type ProductToUpdate = ProductToBuy & { prevUnits: number };

type ProductSold = {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
};

const getCarts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Get carts from db and add product's detail
    const carts = await Cart.find().populate("products.product_id");

    if (carts.length === 0) {
      return res
        .status(400)
        .json({ message: "Sorry, you do not have carts created!" });
    }
    //return carts
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
    //Get carts from db and add product's detail
    const { id } = req.params;

    const cart = await Cart.findById(id).populate("products.product_id");

    if (!cart) {
      return res.status(400).json({ message: "Sorry, you do not have cart!" });
    }
    //return carts
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
    const cartProducts = [];

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products do not exist!" });
    }

    for (const p of products) {
      if (!mongoose.isValidObjectId(p.idProduct)) {
        return res
          .status(400)
          .json({ message: `Invalid product_id: ${p.idProduct}` });
      }
    }

    // validate duplicate products
    const ids = products.map((p) => p.idProduct);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== products.length) {
      return res
        .status(400)
        .json({ message: "You have duplicate products, please check it!" });
    }

    // search products with property invetory_id
    const foundProducts = await Promise.all(
      products.map((p) =>
        Product.findById(p.idProduct).populate("inventory_id")
      )
    );

    // verify products not founded
    if (foundProducts.includes(null)) {
      return res
        .status(400)
        .json({ message: "One or more products do not exist!" });
    }

    // validate inventory available in each product
    for (const product of foundProducts) {
      const matched = products.find(
        (p) => p.idProduct === product?._id.toString()
      );

      if (!matched) {
        return res.status(400).json({
          message: `Product ${product?._id} does not match with request body`,
        });
      }

      const inventory = await Inventory.findById(product?.inventory_id);

      if (!inventory) {
        return res.status(400).json({
          message: `Inventory not found for product ${product?._id}`,
        });
      }

      if (
        inventory.units_available < matched.unitsToBuy ||
        inventory.units_available === 0
      ) {
        return res.status(400).json({
          message: `Not enough units for product with id ${product?._id}`,
        });
      }

      // update inventory
      inventory.units_available -= matched.unitsToBuy;
      inventory.units_sold += matched.unitsToBuy;
      await inventory.save();

      cartProducts.push({
        product_id: product?._id,
        quantity: matched.unitsToBuy,
        price: product?.price,
      });
    }
    //console.log(req.user)
    //Create new cart
    const newCart = await Cart.create({
      products: cartProducts,
      user_id: req.user._id,
    });

    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Create cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const productsToUpdate: ProductToUpdate[] = req.body;

    // Check all params was passed
    if(!productsToUpdate.every(p => p.idProduct && p.prevUnits && p.unitsToBuy)){
      return res.status(400).json({message:"Invalid product data in request body"})
    }

    // Check positive values
    if(!productsToUpdate.every(p => p.prevUnits >= 0 && p.unitsToBuy >= 0)){
      return res.status(400).json({message:"Invalid product data in request body"})
    }

    // Check if the cart exists
    const cartExists = await Cart.findById(id);
    if (!cartExists) {
      return res.status(400).json({ message: "Cart does not exist" });
    }

    // Find and populate each product's inventory
    const rawProducts = await Promise.all(
      productsToUpdate.map((p) =>
        Product.findById(p.idProduct).populate<{ inventory_id: IInventory }>("inventory_id")
      )
    );

    // Validate if any product was not found (null)
    if (rawProducts.some((p) => p === null)) {
      return res
        .status(400)
        .json({ message: "One or more products do not exist in the database" });
    }

    const foundProducts = rawProducts as unknown as (IProduct & { _id: mongoose.Types.ObjectId; inventory_id: IInventory })[];

    // Prepare the new products array for the cart
    const updatedCartProducts: ProductSold[] = [];

    for (const product of foundProducts) {
      const productId = product._id.toString();

      const productToUpdate = productsToUpdate.find(
        (p) => p.idProduct === productId
      );
      if (!productToUpdate) continue;

      let inventoryId = product.inventory_id;

      if (!inventoryId) {
        return res
          .status(400)
          .json({ message: `Inventory not found for product ${productId}` });
      }

      const inventory = await Inventory.findById(inventoryId)

      if(!inventory){
        return res.status(400).json({message:"Inventory does not exists!"})
      }

      // Calculate the difference in quantity
      const diff = productToUpdate.unitsToBuy - productToUpdate.prevUnits;

      if (diff > 0) {
        // Buying more units
        if (inventory.units_available < diff) {
          return res.status(400).json({
            message: `Not enough inventory for product ${productId}`,
          });
        }
        inventory.units_sold += diff;
        inventory.units_available -= diff;
      } else if (diff < 0) {
        // Buying fewer units (returning to inventory)
        inventory.units_sold += diff; // diff is negative
        inventory.units_available -= diff;
      }

      await inventory.save();

      // Build the product object for the cart
      updatedCartProducts.push({
        product_id: product._id,
        quantity: productToUpdate.unitsToBuy,
        price: product.price, 
      });
    }

    // Update and save the cart
    cartExists.products = updatedCartProducts;
    await cartExists.save();

    return res.status(200).json(cartExists);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unexpected error" });
  }
};


const deleteCartById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //search cart by id and validate if exist
    const {id} = req.params

    const cartExists = await Cart.findById(id).populate("products.product_id")

    if(!cartExists){
      return res.status(400).json({message:"Cart does not exist"})
    }

    //update inventory - increse exists and decrease units sold in inventory'model
    for(const product of cartExists.products){
      const productToUpdate = await Product.findById(product.product_id).populate("inventory_id")

      if(!productToUpdate) return res.status(400).json({message:`Product with id ${product.product_id} does not exists`})

      const inventoryToUpdate = await Inventory.findById(productToUpdate.inventory_id)

      if(!inventoryToUpdate) return res.status(400).json({message:"Inventory does not exist for the product" + productToUpdate._id.toString()})

      inventoryToUpdate.units_available += product.quantity
      inventoryToUpdate.units_sold -= product.quantity
      
      await inventoryToUpdate.save()
    }

    //delete cart
    await cartExists.deleteOne()

    //return message
    return res.status(200).json({message:`Cart with id ${cartExists._id.toString()} has been deleted`})
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return error;
  }
};

export { createCart, getCarts, getCartById, updateCartById, deleteCartById };
