import mongoose from "mongoose";

export interface IComment extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  product_id: mongoose.Schema.Types.ObjectId;
  comment: string;
  liked: boolean;
  star: number;
  date: Date;
}
