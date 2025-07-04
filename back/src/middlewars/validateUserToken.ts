import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/mongoDB/user.model";

interface JwtPayload {
  userId: string;
}

const validateUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!payload) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default validateUserToken;
