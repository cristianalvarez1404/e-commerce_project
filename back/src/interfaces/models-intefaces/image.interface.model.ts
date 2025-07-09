import mongoose, { Types } from "mongoose";

export interface IImage extends Document {
  product_id: Types.ObjectId;
  urls: string[];
}
