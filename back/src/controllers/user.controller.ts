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

    //validate fields that can not be empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please check all fields required to login" });
    }
    //search user in db to verify if exists

    const userExists = await User.findOne({ email }).select("+password");

    if (!userExists) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //compare passwords
    const validatePassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!validatePassword) {
      return res.status(401).json({ message: "Invalid credentialss" });
    }

    //return user without password
    const { password: _, ...userWithoutPassword } = userExists.toObject();

    const token = jwt.sign(
      { userId: userWithoutPassword._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10m",
      }
    );

    const configCookie = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .cookie("token", token, configCookie)
      .status(200)
      .json(userWithoutPassword);
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
    //get info from body request and param request
    const userId = req.params.id;
    const { username, phone, address } = req.body;

    //validate data sending from user - verify empty fields
    if (!userId)
      return res
        .status(400)
        .json({ message: "User ID  is required in params!" });

    if (!req.user) {
      return res
        .status(400)
        .json({ message: "You have to login to update user!" });
    }

    // Get user from DB by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid cretentials !" });
    }

    //compare user from db to user from req.user
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: user mismatch!" });
    }

    //update user info
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        phone,
        address,
      },
      {
        new: true,
      }
    );

    //return user updated
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
    //get id param and validate id is not null
    //get newpassword,repetedPassword,oldpassword from req.body - check there are not empty
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

    //get user from db with id param
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    //compare userid with req.user._id
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: user mismatch!" });
    }

    //validate password with bcrypt and compare oldpassword with password from db
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password!!" });
    }

    if (newPassword === oldPassword) {
      return res
        .status(401)
        .json({ message: "Password are the same, change them!!" });
    }

    //validate newPassword is equal to repetedNewPassword
    if (newPassword !== repetedPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    ("TODO validate new password with regular expression");

    //Encrypty newPassword and save into db
    const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { password: newPasswordEncrypted });

    //return message "password has been updated"
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

    //get user from db and compere to user logged
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized: user mismatch!" });
    }

    //delete from db
    await User.findByIdAndUpdate(userId, { isActive: false });

    //return message "user deleted successfully"

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
