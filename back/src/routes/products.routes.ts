import express from "express";
import { createProduct } from "../controllers/product.controller";
import validateUserToken from "../middlewars/validateUserToken";
import { validateUserIsStaffOrAdmin } from "../middlewars/validateUserIsStaffOrAdmin";

const productRouter = express.Router();

productRouter.post(
  "/",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  createProduct
);

export default productRouter;
