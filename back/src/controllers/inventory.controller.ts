import { NextFunction, Request, Response } from "express";
import z from "zod";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../enums/shop.enums";
import mongoose from "mongoose";
import Product from "../models/mongoDB/product.model";
import Inventory from "../models/mongoDB/inventory.model";

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //validate field with zod
    const types = z.nativeEnum(TYPE_SHOP);
    const categories = z.nativeEnum(CATEGORIES);
    const colors = z.nativeEnum(COLORS);
    const sizes = z.nativeEnum(SIZE);

    const inventorySchemaToValidate = z.object({
      product_id: z.string(),
      type: z.array(types).min(1),
      categorie: z.array(categories).min(1),
      color: z.array(colors).min(1),
      size: z.array(sizes).min(1),
      units_available: z.number().min(1),
      cost_per_unit: z.number().min(1),
      units_sold: z.number().optional(),
    });

    const inventoryValidated = inventorySchemaToValidate.safeParse(req.body);

    if (!inventoryValidated.success) {
      return res.status(400).json({ message: inventoryValidated.error });
    }

    //validate id object product with monoose types
    if (!mongoose.Types.ObjectId.isValid(req.body.product_id)) {
      return res.status(400).json({
        message: `Product with id ${req.body.product_id} is not valid!`,
      });
    }

    const product = await Product.findById(req.body.product_id);

    if (!product) {
      return res.status(404).json({
        message: `Product with id ${req.body.product_id} does not exists!`,
      });
    }

    //validate that product not contains inventory already created
    if (product.inventory_id) {
      return res.status(404).json({
        message: `Product with id ${req.body.product_id} already have an inventory!`,
      });
    }

    //create inventory
    const newInventory = await Inventory.create(inventoryValidated.data);

    //update product with inventory id
    product.inventory_id = newInventory._id;
    await product.save();

    //return inventory
    return res.status(201).json(newInventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

export { createInventory };
