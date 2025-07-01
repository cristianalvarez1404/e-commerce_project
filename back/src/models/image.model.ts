import mongoose from "mongoose";

interface Image extends Document {
  product_id: mongoose.Schema.Types.ObjectId;
  urls: string[];
}

const ImageSchema = new mongoose.Schema<Image>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    urls: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Image", ImageSchema);
