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

export interface IProductService {
  getProducts(): Promise<IProduct[] | null>;
  getProductById(id: string): Promise<IProduct | null>;
  createProduct(productData: ProductData): Promise<IProduct | null>;
  updateProductById(): void;
  deleteProduct(): void;
}
