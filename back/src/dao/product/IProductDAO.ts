import mongoose from "mongoose";
import { IProduct } from "../../interfaces/models-intefaces/product.interface";

export type newProductData = {
  inventory_id: Promise<IProduct | null> | undefined;
  image_id: Promise<IProduct | null> | undefined;
  comments: Promise<IProduct | null>[] | undefined;
  reference: string;
  title: string;
  short_description: string;
  price: number;
};

export type ProductDataToUpdate = {
  title?: string;
  short_description?: string;
  price?: number;
  reference?: string;
  inventory_id?: string;
};

export interface IProductDAO {
  getProducts(): Promise<IProduct[] | null>;
  getProductById(id: string): Promise<IProduct | null>;
  getProductByReference(reference: string): Promise<IProduct | null>;
  getProductByParam(param: any): Promise<IProduct | null>;
  createProductId(id: string): Promise<mongoose.Types.ObjectId | string>;
  createProduct(product: newProductData): Promise<IProduct | null>;
  updateProductById(
    id: string,
    productData: ProductDataToUpdate,
    options: { new: boolean }
  ): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<void | null>;
  saveProduct(product: IProduct): Promise<void | null>;
  validateObjectId(id: string): Promise<boolean>;
}
