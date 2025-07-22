import { IInventory } from "../../interfaces/models-intefaces/inventory.interface";

export type inventorySchemaToValidate = {
  product_id: string;
  type: string[];
  categorie: string[];
  color: string[];
  size: string[];
  units_available: number;
  cost_per_unit: number;
  units_sold?: number;
};

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

export interface IInventoryService {
  getInventoryById(id: string): Promise<IInventory | null>;
  getInventories(): Promise<IInventory[] | null>;
  createInventory(
    productId: string,
    inventoryData: inventorySchemaToValidate
  ): Promise<IInventory | null>;
  updateInventoryById(
    inventoryId: string,
    productId: string,
    inventoryData: inventorySchemaToValidate
  ): Promise<IInventory | null>;
  deleteInventoryById(id: string): Promise<void | null>;
}
