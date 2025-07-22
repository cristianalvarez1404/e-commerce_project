import { IProduct } from "../../interfaces/models-intefaces/product.interface";

export type ProductData = {
  reference: string;
  title: string;
  short_description: string;
  price: number;
  inventory_id?: string | undefined;
  image_id?: string | undefined;
  comments?: string[] | undefined;
};

export type ProductDataToUpdate = {
  title?: string;
  short_description?: string;
  price?: number;
  reference?: string;
  inventory_id?: string;
};

export interface IProductService {
  getProducts(): Promise<IProduct[] | null>;
  getProductById(id: string): Promise<IProduct | null>;
  getProductByParam(param: any): Promise<IProduct | null>;
  createProduct(productData: ProductData): Promise<IProduct | null>;
  updateProductById(
    id: string,
    productData: ProductDataToUpdate
  ): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<void | null>;
  saveProduct(product: IProduct): void;
}
