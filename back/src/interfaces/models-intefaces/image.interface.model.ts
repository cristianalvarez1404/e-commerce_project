import mongoose from "mongoose";

export interface IImage extends Document {
  product_id: mongoose.Schema.Types.ObjectId;
  urls: string[];
}
