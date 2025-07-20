import { IProductDAO, newProductData } from "./IProductDAO";
import { IProduct } from "../../interfaces/models-intefaces/product.interface";
import Product from "../../models/mongoDB/product.model";
import mongoose from "mongoose";

export class MongoProductDAO implements IProductDAO {
  constructor() {}
  public async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate({
      path: "inventory_id",
      select: "-__v",
    });
  }

  public async getProducts(): Promise<IProduct[] | null> {
    try {
      return await Product.find()
        .sort({ createdAt: -1 })
        .populate("inventory_id")
        .select("-__v");
    } catch (error) {
      return null;
    }
  }

  public async getProductByReference(
    reference: string
  ): Promise<IProduct | null> {
    try {
      return await Product.findOne({
        reference,
      });
    } catch (error) {
      return null;
    }
  }

  public async createProductId(id: string): Promise<mongoose.Types.ObjectId> {
    return new mongoose.Types.ObjectId(id);
  }

  public async createProduct(
    product: newProductData
  ): Promise<IProduct | null> {
    try {
      return await Product.create(product);
    } catch (error) {
      return null;
    }
  }

  public async updateProductById(): Promise<void> {
    try {
    } catch (error) {}
  }

  public async deleteProduct(): Promise<void> {
    try {
    } catch (error) {}
  }
}
