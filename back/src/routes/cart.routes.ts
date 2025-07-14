import express from "express";
import { createCart, deleteCartById, getCartById, getCarts, updateCartById } from "../controllers/cart.controller";
import validateUserToken from "../middlewars/validateUserToken";

const cartRouter = express.Router();

cartRouter.get("/",validateUserToken,getCarts);
cartRouter.get("/:id",validateUserToken,getCartById);
cartRouter.post("/", validateUserToken,createCart);
cartRouter.put("/:id",validateUserToken,updateCartById)
cartRouter.delete("/:id",validateUserToken,deleteCartById)

export default cartRouter;

