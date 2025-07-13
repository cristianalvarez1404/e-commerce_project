import mongoose from "mongoose";
import { ICard } from "../../interfaces/models-intefaces/card.interface";

const CardSchema = new mongoose.Schema<ICard>(
  {
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 0,
          required: true,
        },
        price: {
          type: Number,
          min: 0,
          required: true,
        },
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    state: {
      type: String,
      default: "pending",
    },
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", CardSchema);
