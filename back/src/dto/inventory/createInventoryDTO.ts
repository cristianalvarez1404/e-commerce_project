import { z } from "zod";
import { CATEGORIES, COLORS, SIZE, TYPE_SHOP } from "../../enums/shop.enums";

const types = z.nativeEnum(TYPE_SHOP);
const categories = z.nativeEnum(CATEGORIES);
const colors = z.nativeEnum(COLORS);
const sizes = z.nativeEnum(SIZE);

export const CreateInventoryDTO = z.object({
  product_id: z.string(),
  type: z.array(types).min(1),
  categorie: z.array(categories).min(1),
  color: z.array(colors).min(1),
  size: z.array(sizes).min(1),
  units_available: z.number().min(1),
  cost_per_unit: z.number().min(1),
  units_sold: z.number().optional(),
});

export type CreateInventoryInput = z.infer<typeof CreateInventoryDTO>;
