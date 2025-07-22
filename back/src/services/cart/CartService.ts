import { ICartDAO, ProductToUpdate } from "../../dao/cart/ICartDAO";
import { IInventoryDAO } from "../../dao/inventory/IInventoryDAO";
import { IProductDAO } from "../../dao/product/IProductDAO";
import { ICard } from "../../interfaces/models-intefaces/card.interface";
import {
  cartProducts,
  ICartService,
  ProductSold,
  ProductToBuy,
} from "./ICartService";

export class CartService implements ICartService {
  constructor(
    private dbCart: ICartDAO,
    private dbProduct: IProductDAO,
    private dbInventory: IInventoryDAO
  ) {}

  public async getCarts(): Promise<ICard[] | null> {
    const carts = await this.dbCart.getCarts();

    if (!carts || carts.length === 0) {
      throw new Error("Sorry, you do not have carts created!");
    }

    return carts;
  }
  public async getCartById(id: string): Promise<ICard | null> {
    const cart = await this.dbCart.getCartById(id);

    if (!cart) {
      throw new Error("Sorry, you do not have cart!");
    }
    return cart;
  }
  public async createCart(
    products: ProductToBuy[],
    userId: string
  ): Promise<ICard | null> {
    const cartProducts: cartProducts[] = [];

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("Products do not exist!");
    }

    for (const p of products) {
      if (!this.dbCart.validateObjectId(p.idProduct)) {
        throw new Error(`Invalid product_id: ${p.idProduct}`);
      }
    }

    const ids = products.map((p) => p.idProduct);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== products.length) {
      throw new Error("You have duplicate products, please check it!");
    }

    const foundProducts = await Promise.all(
      products.map((p) => this.dbProduct.getProductById(p.idProduct))
    );

    if (foundProducts.includes(null)) {
      throw new Error("One or more products do not exist!");
    }

    for (const product of foundProducts) {
      const matched = products.find(
        (p) => p.idProduct === product?._id.toString()
      );

      if (!matched) {
        throw new Error(
          `Product ${product?._id} does not match with request body`
        );
      }

      const inventory = await this.dbInventory.getInventoryById(
        product?.inventory_id as string
      );

      if (!inventory) {
        throw new Error(`Inventory not found for product ${product?._id}`);
      }

      if (
        inventory.units_available < matched.unitsToBuy ||
        inventory.units_available === 0
      ) {
        throw new Error(`Not enough units for product with id ${product?._id}`);
      }

      inventory.units_available -= matched.unitsToBuy;
      inventory.units_sold += matched.unitsToBuy;

      await this.dbInventory.updateInventoryById(
        inventory._id.toString(),
        inventory,
        { new: true }
      );

      if (!product || !product._id) {
        throw new Error("Product not exists");
      }

      cartProducts.push({
        product_id: product?._id.toString(),
        quantity: matched.unitsToBuy,
        price: product?.price,
      });
    }

    const newCart = await this.dbCart.createCart(cartProducts, userId);

    return newCart;
  }

  public async updateCartById(
    id: string,
    productsToUpdate: ProductToUpdate[]
  ): Promise<ICard | null> {
    const cartExists = await this.dbCart.getCartById(id);

    if (!cartExists) {
      throw new Error("Cart does not exist");
    }

    const rawProducts = await Promise.all(
      productsToUpdate.map((p) => this.dbProduct.getProductById(p.idProduct))
    );

    if (rawProducts.some((p) => p === null)) {
      throw new Error("One or more products do not exist in the database");
    }

    const foundProducts = rawProducts;

    const updatedCartProducts: ProductSold[] = [];

    for (const product of foundProducts) {
      if (!product || !product._id.toString()) {
        throw new Error("Product does not exist");
      }

      const productId = product._id.toString();

      const productToUpdate = productsToUpdate.find(
        (p) => p.idProduct === productId
      );
      if (!productToUpdate) continue;

      let inventoryId = product.inventory_id?.toString();

      if (!inventoryId) {
        throw new Error(`Inventory not found for product ${productId}`);
      }

      const inventory = await this.dbInventory.getInventoryById(inventoryId);

      if (!inventory) {
        throw new Error("Inventory does not exists!");
      }

      const diff = productToUpdate.unitsToBuy - productToUpdate.prevUnits;

      if (diff > 0) {
        if (inventory.units_available < diff) {
          throw new Error(`Not enough inventory for product ${productId}`);
        }
        inventory.units_sold += diff;
        inventory.units_available -= diff;
      } else if (diff < 0) {
        inventory.units_sold += diff;
        inventory.units_available -= diff;
      }

      await this.dbInventory.updateInventoryById(inventoryId, inventory, {
        new: true,
      });

      updatedCartProducts.push({
        product_id: product._id.toString(),
        quantity: productToUpdate.unitsToBuy,
        price: product.price,
      });
    }

    const newCartUpdated = await this.dbCart.updateCartById(
      id,
      updatedCartProducts,
      { new: true }
    );

    return newCartUpdated;
  }
  public async deleteCartById(id: string): Promise<void | null> {
    const cartExists = await this.dbCart.getCartById(id);

    if (!cartExists) {
      throw new Error("Cart does not exist");
    }

    for (const product of cartExists.products) {
      const productToUpdate = await this.dbProduct.getProductById(
        product.product_id.toString()
      );

      if (!productToUpdate)
        throw new Error(
          `Product with id ${product.product_id} does not exists`
        );

      if (!productToUpdate.inventory_id) {
        throw new Error("Inventory does not exists!");
      }
      const inventoryToUpdate = await this.dbInventory.getInventoryById(
        productToUpdate.inventory_id?.toString()
      );

      if (!inventoryToUpdate)
        throw new Error(
          "Inventory does not exist for the product" +
            productToUpdate._id.toString()
        );

      inventoryToUpdate.units_available += product.quantity;
      inventoryToUpdate.units_sold -= product.quantity;

      await this.dbInventory.updateInventoryById(
        productToUpdate.inventory_id.toString(),
        inventoryToUpdate,
        { new: true }
      );
    }

    await this.dbCart.deleteCartById(cartExists);
  }
}
