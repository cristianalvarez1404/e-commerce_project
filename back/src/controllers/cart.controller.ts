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

const getCarts = async(req:Request,res:Response,next:NextFunction) => {
  try {
    //Get carts from db and add product's detail
    const carts = await Cart.find().populate('products.product_id')

    if(carts.length === 0) {
      return res.status(400).json({message:"Sorry, you do not have carts created!"})
    }
    //return carts
    return res.status(200).json(carts)

  }catch(error){
    if(error instanceof Error){
      return res.status(400).json({message:error.message})
    }
    return res.status(400).json({message:error})
  }
}

const getCartById= async(req:Request,res:Response,next:NextFunction) => {
  try {
    //Get carts from db and add product's detail
    const {id} = req.params;

    const cart = await Cart.findById(id).populate('products.product_id')

    if(!cart) {
      return res.status(400).json({message:"Sorry, you do not have cart!"})
    }
    //return carts
    return res.status(200).json(cart)

  }catch(error){
    if(error instanceof Error){
      return res.status(400).json({message:error.message})
    }
    return res.status(400).json({message:error})
  }
}


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

export { createCart , getCarts, getCartById};
