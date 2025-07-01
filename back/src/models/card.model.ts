import mongoose from "mongoose";

interface ICard extends Document {
  product_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
  date: Date;
}

const CardSchema = new mongoose.Schema<ICard>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Card", CardSchema);
