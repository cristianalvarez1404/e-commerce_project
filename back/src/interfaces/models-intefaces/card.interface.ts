import mongoose, { Types } from "mongoose";

type ProductSold = {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICard extends Document {
  products: ProductSold[];
  user_id: Types.ObjectId;
  date: Date;
  state:'pending' | 'refunded' | 'completed' | 'cancelled'
}
