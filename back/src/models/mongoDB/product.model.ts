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
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
