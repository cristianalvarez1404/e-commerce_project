import express from "express";
import {
  createUser,
  login,
  logout,
  updateUser,
  updatePassword,
  deleteUser,
} from "../controllers/user.controller";
import validateUserToken from "../middlewars/validateUserToken";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", validateUserToken, logout);
userRouter.put("/update/:id", validateUserToken, updateUser);
userRouter.put("/update-password/:id", validateUserToken, updatePassword);
userRouter.delete("/delete/:id", validateUserToken, deleteUser);

export default userRouter;
