import mongoose from "mongoose";

type UserMessage = {
  id: number;
  comment: string;
};

interface IProduct extends Document {
  id: string | number;
  name: string;
  description: string;
  quantity: number;
  starts: number;
  comments?: UserMessage[];
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  starts: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
