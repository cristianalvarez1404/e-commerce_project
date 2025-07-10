import { NextFunction, Request, Response } from "express";
import z from "zod";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../enums/shop.enums";
import mongoose from "mongoose";
import Product from "../models/mongoDB/product.model";
import Inventory from "../models/mongoDB/inventory.model";

const getInventories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inventories = await Inventory.find().sort({ createdAt: -1 });
    return res.status(200).json(inventories);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory does not exists!" });
    }

    return res.status(200).json(inventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

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

const updateInventory = async (req: Request, res: Response) => {
  try {
    //validate inventory already exists
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "You have not assigned any fields" });
    }

    const inventoryExists = await Inventory.findById(id);

    if (!inventoryExists) {
      return res
        .status(404)
        .json({ message: `Inventory with id ${id} does not exists!` });
    }

    //validate fields sended with zod
    const types = z.nativeEnum(TYPE_SHOP);
    const categories = z.nativeEnum(CATEGORIES);
    const colors = z.nativeEnum(COLORS);
    const sizes = z.nativeEnum(SIZE);

    const inventorySchemaToValidate = z.object({
      product_id: z.string().optional(),
      type: z.array(types).min(1).optional(),
      categorie: z.array(categories).min(1).optional(),
      color: z.array(colors).min(1).optional(),
      size: z.array(sizes).min(1).optional(),
      units_available: z.number().min(1).optional(),
      cost_per_unit: z.number().min(1).optional(),
      units_sold: z.number().optional(),
    });

    const inventoryValidated = inventorySchemaToValidate.safeParse(req.body);

    if (!inventoryValidated.success) {
      return res.status(400).json({ message: inventoryValidated.error });
    }

    //validate id object product with monoose types
    if (req.body.product_id) {
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

      const productWithOldInventory = await Product.findOne({
        inventory_id: id,
      });

      if (
        productWithOldInventory &&
        productWithOldInventory._id.toString() ===
          inventoryValidated.data.product_id
      ) {
        return res.status(400).json({
          message: "Product shared are the same to previous product!",
        });
      }

      if (productWithOldInventory) {
        productWithOldInventory.inventory_id = undefined;
        await productWithOldInventory.save();
      }

      product.inventory_id = inventoryExists._id;

      await product.save();
    }

    //update inventory and product
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      inventoryValidated.data,
      { new: true }
    );

    //return inventory
    return res.status(201).json(updatedInventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //validate if inventory exists
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid inventory ID" });
  }

  const inventoryExists = await Inventory.findById(id);

  if (!inventoryExists) {
    return res.status(404).json({ message: "Inventory does not exists" });
  }

  //delete product's inventory
  const product = await Product.findOne({ inventory_id: id });

  if (product) {
    product.inventory_id = undefined;
    await product.save();
  }

  //delete inventory
  await inventoryExists.deleteOne();

  //return message
  return res
    .status(200)
    .json({ message: `Inventory with id ${id} has been deleted!` });
};

export {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
