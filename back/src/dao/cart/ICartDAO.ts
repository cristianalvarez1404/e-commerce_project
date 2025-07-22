import { ICard } from "../../interfaces/models-intefaces/card.interface";

export type cartProducts = {
  product_id: string;
  quantity: number;
  price: number;
};

export type ProductToBuy = {
  idProduct: string;
  unitsToBuy: number;
};

export type ProductToUpdate = ProductToBuy & { prevUnits: number };

export type ProductSold = {
  product_id: string;
  quantity: number;
  price: number;
};

export interface ICartDAO {
  getCarts(): Promise<ICard[] | null>;
  getCartById(id: string): Promise<ICard | null>;
  createCart(products: cartProducts[], user_id: string): Promise<ICard | null>;
  updateCartById(
    id: string,
    newProducts: ProductSold[],
    params: { new: boolean }
  ): Promise<ICard | null>;
  deleteCartById(cart: ICard): Promise<void | null>;
  validateObjectId(id: string): Promise<boolean>;
}
