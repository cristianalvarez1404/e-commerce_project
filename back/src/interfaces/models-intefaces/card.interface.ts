import mongoose, { Types } from "mongoose";

export interface ICard extends Document {
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  quantity: number;
  price: number;
  date: Date;
}
