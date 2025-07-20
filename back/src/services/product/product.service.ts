import { IProductDAO } from "../../dao/product/IProductDAO";
import { IProduct } from "../../interfaces/models-intefaces/product.interface";
import { IProductService, ProductData } from "./IProductService";

export class ProductService implements IProductService {
  constructor(private db: IProductDAO) {}

  public async getProducts() {
    const products = await this.db.getProducts();

    if (!products) {
      throw new Error("Products does not exist!");
    }

    return products;
  }
  public async getProductById(id: string) {
    const product = await this.db.getProductById(id);

    if (!product) {
      throw new Error("Product does not exists!");
    }

    return product;
  }
  public async createProduct(productData: ProductData) {
    const productExist = await this.db.getProductByReference(
      productData.reference
    );

    if (productExist) {
      throw new Error("Product already exists with this reference");
    }

    const inventoryId = this.db.getProductById(productData.inventory_id || "");
    const imageId = this.db.getProductById(productData.image_id || "");

    const newProductData = {
      ...productData,
      inventory_id: productData.inventory_id ? inventoryId : undefined,
      image_id: productData.image_id ? imageId : undefined,
      comments: productData.comments?.map(
        async (id) => await this.db.getProductById(id)
      ),
    };

    const productSaved = await this.db.createProduct(newProductData);

    return productSaved;
  }
  public async updateProductById() {}
  public async deleteProduct() {}
}
