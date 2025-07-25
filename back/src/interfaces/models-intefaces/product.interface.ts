import mongoose, { Types } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  short_description: string;
  price: number;
  reference: string;
  inventory_id?: mongoose.Types.ObjectId | string;
  image_id?: mongoose.Types.ObjectId;
  comments?: mongoose.Types.ObjectId[];
}
