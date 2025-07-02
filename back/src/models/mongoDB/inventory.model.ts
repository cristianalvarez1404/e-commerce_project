import mongoose from "mongoose";
import { TYPE_SHOP, CATEGORIES, COLORS, SIZE } from "../../enums/shop.enums";
import { IInventory } from "../../interfaces/models-intefaces/inventory.interface";

const InventorySchema = new mongoose.Schema<IInventory>(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: [String],
      enum: TYPE_SHOP,
      required: true,
    },
    categorie: {
      type: [String],
      enum: CATEGORIES,
      required: true,
    },
    color: {
      type: [String],
      enum: COLORS,
      required: true,
    },
    size: {
      type: [String],
      enum: SIZE,
      required: true,
    },
    units_available: {
      type: Number,
      required: true,
    },
    cost_per_unit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", InventorySchema);
