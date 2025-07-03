import express from "express";
import { createUser, login, logout } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
