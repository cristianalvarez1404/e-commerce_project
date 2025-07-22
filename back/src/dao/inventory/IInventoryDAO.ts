import { IInventory } from "../../interfaces/models-intefaces/inventory.interface";
import { inventorySchemaToValidate } from "../../services/inventory/IInventoryService";

export type inventorySchemaToUpdate = {
  product_id?: string;
  type?: string[];
  categorie?: string[];
  color?: string[];
  size?: string[];
  units_available?: number;
  cost_per_unit?: number;
  units_sold?: number;
};

export interface IInventoryDAO {
  getInventories(): Promise<IInventory[] | null>;
  getInventoryById(id: string): Promise<IInventory | null>;
  validateObjectId(id: string): Promise<boolean>;
  createInventory(
    inventoryData: inventorySchemaToValidate
  ): Promise<IInventory | null>;
  updateInventoryById(
    id: string,
    inventoryData: inventorySchemaToUpdate | IInventory,
    params: { new: boolean }
  ): Promise<IInventory | null>;
  deleteInventoryById(id: string): Promise<void | null>;
}
