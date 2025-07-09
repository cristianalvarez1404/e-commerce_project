import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import validateUserToken from "../middlewars/validateUserToken";
import { validateUserIsStaffOrAdmin } from "../middlewars/validateUserIsStaffOrAdmin";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post(
  "/",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  createProduct
);
productRouter.put(
  "/:id",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  updateProduct
);

productRouter.delete(
  "/:id",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  deleteProduct
);

export default productRouter;
