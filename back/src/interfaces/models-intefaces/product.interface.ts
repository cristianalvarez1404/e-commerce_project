import mongoose from "mongoose";

export interface IProduct extends Document {
  title: string;
  short_description: string;
  price: number;
  inventory_id?: mongoose.Schema.Types.ObjectId;
  image_id: mongoose.Schema.Types.ObjectId;
  comments?: mongoose.Schema.Types.ObjectId[];
}
