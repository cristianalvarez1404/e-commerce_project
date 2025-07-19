import { NextFunction, Request, Response } from "express";
import User from "../models/mongoDB/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/models-intefaces/user.interface";
import { UserService } from "../services/user.service";
import { MongoUserDAO } from "../dao/MongoUserDAO";

const db = new MongoUserDAO();
const userService = new UserService(db);

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getUsers();

    if (!users) {
      return res.status(400).json({ message: "Users does not exists" });
    }

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idUser = req.params.id;

    if (req.user._id.toString() !== idUser) {
      return res.status(403).json({ message: "You don't have permission!" });
    }

    const user = await userService.getUser(idUser);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const { user, token } = await userService.createUser(userData);

    const cookieConfig = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res.cookie("token", token, cookieConfig).status(201).json(user);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please check all fields required to login" });
    }

    const { user, token } = await userService.login(email, password);

    const configCookie = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res.cookie("token", token, configCookie).status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { username, phone, address } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ message: "User ID  is required in params!" });

    if (!req.user) {
      return res
        .status(400)
        .json({ message: "You have to login to update user!" });
    }

    const userParams = {
      userId,
      userIdLogged: req.user._id.toString(),
      username,
      phone,
      address,
    };

    const updatedUser = await userService.updateUser(userParams);

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { newPassword, repetedPassword, oldPassword } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ message: "User ID  is required in params!" });

    if (!newPassword || !repetedPassword || !oldPassword)
      return res.status(400).json({ message: "Field are incompleted!" });

    //validate user is login
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You have to login to update password!" });
    }

    const userParams = {
      userId,
      userIdLogged: req.user._id.toString(),
      oldPassword,
      repetedPassword,
      newPassword,
    };

    await userService.updatePassword(userParams);

    return res
      .status(200)
      .json({ message: "Password has been updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //get id by params and validate that it's not empty
    const userId = req.params.id;

    if (!userId)
      return res
        .status(400)
        .json({ message: "User ID  is required in params!" });
    //validate user has been update
    if (!req.user) {
      return res.status(401).json({ message: "You have to login!" });
    }

    return res
      .status(200)
      .json({ message: "User has been deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

export {
  getUsers,
  getUser,
  createUser,
  login,
  logout,
  updateUser,
  updatePassword,
  deleteUser,
};
