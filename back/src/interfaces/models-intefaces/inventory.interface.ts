import mongoose, { Types } from "mongoose";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../../enums/shop.enums";

export interface IInventory extends Document {
  _id: mongoose.Types.ObjectId | string;
  product_id: mongoose.Types.ObjectId;
  type: TYPE_SHOP[];
  categorie: CATEGORIES[];
  color: COLORS[];
  size: SIZE[];
  units_available: number;
  cost_per_unit: number;
  units_sold: number;
}
