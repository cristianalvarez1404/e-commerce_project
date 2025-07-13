import express from "express";
import { createCart, getCartById, getCarts } from "../controllers/cart.controller";
import validateUserToken from "../middlewars/validateUserToken";

const cardRouter = express.Router();

cardRouter.get("/",validateUserToken,getCarts);
cardRouter.get("/:id",validateUserToken,getCartById);
cardRouter.post("/", validateUserToken,createCart);

export default cardRouter;
