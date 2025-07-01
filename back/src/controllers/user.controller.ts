import { Request, Response } from "express";
import User from "../models/user.model";

const createUser = (req: Request, res: Response) => {
  const { username, email, phone, address, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please, check all fields required" });
  }
};

export { createUser };
