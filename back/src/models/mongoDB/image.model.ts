import mongoose from "mongoose";
import { IImage } from "../../interfaces/models-intefaces/image.interface.model";

const ImageSchema = new mongoose.Schema<IImage>(
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
