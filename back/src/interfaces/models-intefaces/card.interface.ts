import mongoose from "mongoose";

export interface ICard extends Document {
  product_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
  date: Date;
}
