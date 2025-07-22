import { ICard } from "../../interfaces/models-intefaces/card.interface";

export type ProductToBuy = {
  idProduct: string;
  unitsToBuy: number;
};

export type cartProducts = {
  product_id: string;
  quantity: number;
  price: number;
};

export type updatedCartProducts = {
  product_id: string;
  quantity: number;
  price: number;
};

export type ProductSold = {
  product_id: string;
  quantity: number;
  price: number;
};

export type ProductToUpdate = ProductToBuy & { prevUnits: number };

export interface ICartService {
  getCarts(): Promise<ICard[] | null>;
  getCartById(id: string): Promise<ICard | null>;
  createCart(products: ProductToBuy[], userId: string): Promise<ICard | null>;
  updateCartById(
    id: string,
    productsToUpdate: ProductToUpdate[]
  ): Promise<ICard | null>;
  deleteCartById(id: string): Promise<void | null>;
}
