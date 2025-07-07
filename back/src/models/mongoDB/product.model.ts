import mongoose from "mongoose";
import { IProduct } from "../../interfaces/models-intefaces/product.interface";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      unique: true,
      required: true,
    },
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
    },
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
