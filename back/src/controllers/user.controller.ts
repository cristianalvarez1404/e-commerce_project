import { Request, Response } from "express";
import User from "../models/mongoDB/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/models-intefaces/user.interface";

const createUser = async (req: Request, res: Response) => {
  const { username, email, phone, address, password }: IUser = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please, check all fields required" });
  }

  try {
    const user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists!" });

    const newPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      phone,
      address,
      password: newPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    const token = jwt.sign(
      { userId: userWithoutPassword._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10m",
      }
    );

    const configCookie = {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .cookie("token", token, configCookie)
      .status(201)
      .json(userWithoutPassword);
      
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

export { createUser };
