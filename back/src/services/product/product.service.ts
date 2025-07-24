import { IProductDAO } from "../../dao/product/IProductDAO";
import { IProduct } from "../../interfaces/models-intefaces/product.interface";
import {
  IProductService,
  ProductData,
  ProductDataToUpdate,
} from "./IProductService";

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
  public async getProductByParam(param: any) {
    return await this.db.getProductByParam(param);
  }
  public async createProduct(productData: ProductData) {
    const productExist = await this.db.getProductByReference(
      productData.reference
    );

    if (productExist) {
      throw new Error("Product already exists with this reference");
    }

    let inventoryId = undefined;

    if (productData.inventory_id) {
      inventoryId = this.db.getProductById(productData.inventory_id);
    }

    let imageId = undefined;

    if (productData.image_id) {
      imageId = this.db.getProductById(productData.image_id);
    }

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
  public async updateProductById(id: string, productData: ProductDataToUpdate) {
    const productSaved = await this.db.getProductById(id);

    if (!productSaved) {
      throw new Error(`Product with id ${id} does not exists!`);
    }
    const newProduct = await this.db.updateProductById(id, productData, {
      new: true,
    });

    return newProduct;
  }
  public async deleteProduct(id: string) {
    const isProductExists = await this.db.getProductById(id);

    if (!isProductExists) {
      throw new Error(`Product with id ${id} does not exists!`);
    }

    await this.db.deleteProduct(id);
  }
  public async saveProduct(product: IProduct) {
    await this.db.saveProduct(product);
  }
}
