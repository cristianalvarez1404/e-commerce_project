import { IInventoryDAO } from "../../dao/inventory/IInventoryDAO";
import { IProductDAO } from "../../dao/product/IProductDAO";
import { IInventory } from "../../interfaces/models-intefaces/inventory.interface";
import {
  IInventoryService,
  inventorySchemaToUpdate,
  inventorySchemaToValidate,
} from "./IInventoryService";

export class InventoryService implements IInventoryService {
  constructor(
    private dbInventory: IInventoryDAO,
    private dbProduct: IProductDAO
  ) {}
  public async getInventories(): Promise<IInventory[] | null> {
    const inventories = await this.dbInventory.getInventories();
    return inventories;
  }

  public async getInventoryById(id: string): Promise<IInventory | null> {
    const inventory = await this.dbInventory.getInventoryById(id);

    if (!inventory) {
      throw new Error("Inventory does not exists!");
    }

    return inventory;
  }

  public async createInventory(
    productId: string,
    inventoryData: inventorySchemaToValidate
  ): Promise<IInventory | null> {
    if (!this.dbInventory.validateObjectId(productId)) {
      throw new Error(`Product with id ${productId} is not valid!`);
    }

    const product = await this.dbProduct.getProductById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} does not exists!`);
    }

    if (product.inventory_id) {
      throw new Error(
        `Product with id ${productId} already have an inventory!`
      );
    }

    const newInventory = await this.dbInventory.createInventory(inventoryData);

    if (!newInventory) {
      throw new Error("Error creating inventory,check db");
    }

    product.inventory_id = newInventory._id;

    await this.dbProduct.saveProduct(product);

    return newInventory;
  }
  public async updateInventoryById(
    idInventory: string,
    idProduct: string,
    inventoryValidated: inventorySchemaToUpdate
  ): Promise<IInventory | null> {
    const inventoryExists = await this.dbInventory.getInventoryById(
      idInventory
    );

    if (!inventoryExists) {
      throw new Error(`Inventory with id ${idInventory} does not exists!`);
    }

    if (idProduct) {
      if (!this.dbProduct.validateObjectId(idProduct)) {
        throw new Error(`Product with id ${idProduct} is not valid!`);
      }

      const product = await this.dbProduct.getProductById(idProduct);

      if (!product) {
        throw new Error(`Product with id ${idProduct} does not exists!`);
      }

      const productWithOldInventory = await this.dbProduct.getProductByParam({
        inventory_id: idInventory,
      });

      if (
        productWithOldInventory &&
        productWithOldInventory._id.toString() === inventoryValidated.product_id
      ) {
        throw new Error("Product shared are the same to previous product!");
      }

      if (
        productWithOldInventory &&
        productWithOldInventory._id.toString() !== inventoryValidated.product_id
      ) {
        productWithOldInventory.inventory_id = undefined;
        await this.dbProduct.saveProduct(productWithOldInventory);
      }

      product.inventory_id = inventoryExists._id;

      await this.dbProduct.saveProduct(product);
    }

    const updatedInventory = await this.dbInventory.updateInventoryById(
      idInventory,
      inventoryValidated,
      { new: true }
    );

    return updatedInventory;
  }
  public async deleteInventoryById(id: string): Promise<void | null> {
    if (!this.dbInventory.validateObjectId(id)) {
      throw new Error("Invalid inventory ID");
    }

    const inventoryExists = await this.dbInventory.getInventoryById(id);

    if (!inventoryExists) {
      throw new Error("Inventory does not exists");
    }

    const product = await this.dbProduct.getProductByParam({
      inventory_id: id,
    });

    if (product) {
      product.inventory_id = undefined;
      await this.dbProduct.saveProduct(product);
    }

    await this.dbInventory.deleteInventoryById(id);
  }
}
