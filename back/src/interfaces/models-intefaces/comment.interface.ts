import mongoose, { Types } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
  comment: string;
  liked: boolean;
  star: number;
  date: Date;
}
