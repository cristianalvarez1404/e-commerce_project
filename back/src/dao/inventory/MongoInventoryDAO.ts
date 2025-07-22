import mongoose from "mongoose";
import { IInventory } from "../../interfaces/models-intefaces/inventory.interface";
import Inventory from "../../models/mongoDB/inventory.model";
import { IInventoryDAO, inventorySchemaToUpdate } from "./IInventoryDAO";
import { inventorySchemaToValidate } from "../../services/inventory/IInventoryService";

export class MongoInventoryDAO implements IInventoryDAO {
  public async getInventories(): Promise<IInventory[] | null> {
    try {
      return await Inventory.find().sort({ createdAt: -1 });
    } catch (error) {
      return null;
    }
  }

  public async getInventoryById(id: any): Promise<IInventory | null> {
    try {
      return await Inventory.findById(id);
    } catch (error) {
      return null;
    }
  }

  public async validateObjectId(productId: string): Promise<boolean> {
    return !mongoose.Types.ObjectId.isValid(productId);
  }

  public async createInventory(
    inventoryData: inventorySchemaToValidate
  ): Promise<IInventory | null> {
    try {
      const newInventory = await Inventory.create(inventoryData);
      return await this.getInventoryById(newInventory._id);
    } catch (error) {
      return null;
    }
  }
  public async updateInventoryById(
    id: string,
    inventoryData: inventorySchemaToUpdate,
    params: { new: boolean }
  ): Promise<IInventory | null> {
    try {
      return await Inventory.findByIdAndUpdate(id, inventoryData, params);
    } catch (error) {
      return null;
    }
  }
  public async deleteInventoryById(id: string): Promise<void | null> {
    try {
      await Inventory.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }
}
