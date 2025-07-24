import { Request, Response } from "express";
import { InventoryService } from "../services/inventory/InventoryService";
import { MongoInventoryDAO } from "../dao/inventory/MongoInventoryDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { InventoryIdParamsDTO } from "../dto/inventory/inventoryIDParamDTO";
import { CreateInventoryDTO } from "../dto/inventory/createInventoryDTO";
import { UpdateInventoryDTO } from "../dto/inventory/updateInventoryDTO";

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
    const id = InventoryIdParamsDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const inventory = await inventoryService.getInventoryById(id.data.id);

    return res.status(200).json(inventory);
  } catch (error) {
    error instanceof Error
      ? res.status(500).json({ message: error.message })
      : res.status(400).json({ message: error });
  }
};

const createInventory = async (req: Request, res: Response) => {
  try {
    const inventoryValidated = CreateInventoryDTO.safeParse(req.body);

    if (!inventoryValidated.success) {
      return res.status(400).json({ message: inventoryValidated.error });
    }

    const productId = req.body.product_id;
    const inventoryData = inventoryValidated.data;

    const inventory = await inventoryService.createInventory(
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
    const id = InventoryIdParamsDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "You have not assigned any fields" });
    }

    const inventoryValidated = UpdateInventoryDTO.safeParse(req.body);

    if (!inventoryValidated.success) {
      return res.status(400).json({ message: inventoryValidated.error });
    }

    const productId = req.body.product_id;
    const inventoryToUpdate = inventoryValidated.data;
    const updatedInventory = await inventoryService.updateInventoryById(
      id.data.id,
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
    const id = InventoryIdParamsDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    await inventoryService.deleteInventoryById(id.data.id);
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
