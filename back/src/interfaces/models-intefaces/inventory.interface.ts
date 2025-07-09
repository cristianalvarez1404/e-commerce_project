import mongoose, { Types } from "mongoose";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../../enums/shop.enums";

export interface IInventory extends Document {
  product_id: Types.ObjectId;
  type: TYPE_SHOP[];
  categorie: CATEGORIES[];
  color: COLORS[];
  size: SIZE[];
  units_available: number;
  cost_per_unit: number;
  units_sold: number;
}
