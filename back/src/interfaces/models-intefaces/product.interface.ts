import mongoose, { Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  short_description: string;
  price: number;
  reference: string; //validate product is unique
  inventory_id?: Types.ObjectId;
  image_id?: Types.ObjectId;
  comments?: Types.ObjectId[];
}
