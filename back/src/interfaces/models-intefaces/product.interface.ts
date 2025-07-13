import mongoose, { Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  short_description: string;
  price: number;
  reference: string; //validate product is unique
  inventory_id?: mongoose.Types.ObjectId;
  image_id?: mongoose.Types.ObjectId;
  comments?: mongoose.Types.ObjectId[];
}
