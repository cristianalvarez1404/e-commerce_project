import {
  IProductDAO,
  newProductData,
  ProductDataToUpdate,
} from "./IProductDAO";
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
        .populate("comments")
        .select("-__v");
    } catch (error) {
      return null;
    }
  }

  public async getProductByReference(
    reference: string
  ): Promise<IProduct | null> {
    try {
      const product = await Product.findOne({
        reference,
      });

      return product;
    } catch (error) {
      return null;
    }
  }

  public async getProductByParam(param: any): Promise<IProduct | null> {
    try {
      return await Product.findOne(param);
    } catch (erro) {
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

  public async updateProductById(
    id: string,
    productData: ProductDataToUpdate,
    options: { new: boolean }
  ): Promise<IProduct | null> {
    try {
      return await Product.findByIdAndUpdate(id, productData, options);
    } catch (error) {
      return null;
    }
  }

  public async uploadCommentById(
    id: string,
    comment_id: string,
    options: { new: boolean }
  ) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $push: { comments: new mongoose.Types.ObjectId(comment_id) } },
        options
      );
    } catch (error) {
      return null;
    }
  }

  public async deleteCommentProductById(
    id: string,
    comment_id: string,
    options: { new: boolean }
  ) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        { $pull: { comments: new mongoose.Types.ObjectId(comment_id) } },
        options
      );
    } catch (error) {
      return null;
    }
  }

  public async deleteProduct(id: string): Promise<void | null> {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }

  public async saveProduct(product: IProduct): Promise<void | null> {
    try {
      const { _id, inventory_id, ...data } = product;

      const update: Record<string, any> = {};

      update.$set = { ...data };

      if (inventory_id === undefined || inventory_id === "") {
        update.$unset = { inventory_id: "" };
      } else {
        update.$set.inventory_id = inventory_id;
      }

      await Product.findByIdAndUpdate(_id, update, { new: true });
    } catch (error) {
      return null;
    }
  }

  public async validateObjectId(productId: string): Promise<boolean> {
    return !mongoose.Types.ObjectId.isValid(productId);
  }
}
