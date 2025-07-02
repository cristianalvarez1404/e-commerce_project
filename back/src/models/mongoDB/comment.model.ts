import mongoose from "mongoose";
import { IComment } from "../../interfaces/models-intefaces/comment.interface";

const CommentSchema = new mongoose.Schema<IComment>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    liked: {
      type: Boolean,
      default: false,
    },
    star: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentSchema);
