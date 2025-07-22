import { NextFunction, Request, Response } from "express";
import z from "zod";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../enums/shop.enums";
import { InventoryService } from "../services/inventory/InventoryService";
import { MongoInventoryDAO } from "../dao/inventory/MongoInventoryDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";

const dbInventory = new MongoInventoryDAO();
const dbProduct = new MongoProductDAO();

const inventoryService = new InventoryService(dbInventory, dbProduct);

const getInventories = async (req: Request, res: Response) => {
  try {
    const inventories = await inventoryService.getInventories();
    return res.status(200).json(inventories);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const getInventoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inventory = await inventoryService.getInventoryById(id);

    return res.status(200).json(inventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const createInventory = async (req: Request, res: Response) => {
  try {
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

    const productId = req.body.product_id;
    const inventoryData = inventoryValidated.data;

    const inventory = inventoryService.createInventory(
      productId,
      inventoryData
    );

    return res.status(201).json(inventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "You have not assigned any fields" });
    }

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

    const productId = req.body.product_id;
    const inventoryToUpdate = inventoryValidated.data;
    const updatedInventory = inventoryService.updateInventoryById(
      id,
      productId,
      inventoryToUpdate
    );

    return res.status(201).json(updatedInventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const deleteInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await inventoryService.deleteInventoryById(id);
    return res
      .status(200)
      .json({ message: `Inventory with id ${id} has been deleted!` });
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

export {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
