import { z } from "zod";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../../enums/shop.enums";

const types = z.nativeEnum(TYPE_SHOP);
const categories = z.nativeEnum(CATEGORIES);
const colors = z.nativeEnum(COLORS);
const sizes = z.nativeEnum(SIZE);

export const UpdateInventoryDTO = z.object({
  product_id: z.string().optional(),
  type: z.array(types).min(1).optional(),
  categorie: z.array(categories).min(1).optional(),
  color: z.array(colors).min(1).optional(),
  size: z.array(sizes).min(1).optional(),
  units_available: z.number().min(1).optional(),
  cost_per_unit: z.number().min(1).optional(),
  units_sold: z.number().optional(),
});

export type UpdateInventoryInput = z.infer<typeof UpdateInventoryDTO>;
