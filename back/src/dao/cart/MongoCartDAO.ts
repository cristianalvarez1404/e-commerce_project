import mongoose from "mongoose";
import { ICard } from "../../interfaces/models-intefaces/card.interface";
import Cart from "../../models/mongoDB/cart.model";
import { cartProducts, ICartDAO, ProductSold } from "./ICartDAO";

export class MongoCartDAO implements ICartDAO {
  public async getCarts(): Promise<ICard[] | null> {
    try {
      return await Cart.find().populate("products.product_id");
    } catch (error) {
      return null;
    }
  }
  public async getCartById(id: string): Promise<ICard | null> {
    try {
      return await Cart.findById(id).populate("products.product_id");
    } catch (error) {
      return null;
    }
  }

  public async validateObjectId(productId: string): Promise<boolean> {
    return !mongoose.Types.ObjectId.isValid(productId);
  }

  public async createCart(
    products: cartProducts[],
    user_id: string
  ): Promise<ICard | null> {
    try {
      return await Cart.create({
        products,
        user_id,
      });
    } catch (error) {
      return null;
    }
  }
  public async updateCartById(
    id: string,
    newProducts: ProductSold[],
    params: { new: boolean }
  ): Promise<ICard | null> {
    try {
      return await Cart.findByIdAndUpdate(
        id,
        { products: newProducts },
        params
      );
    } catch (error) {
      return null;
    }
  }
  public async deleteCartById(cart: ICard): Promise<void | null> {
    try {
      await Cart.findOneAndDelete(cart);
    } catch (error) {
      return null;
    }
  }
}
