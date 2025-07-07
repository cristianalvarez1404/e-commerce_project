import { NextFunction, Request, Response } from "express";
import { TYPEUSER } from "../enums/shop.enums";

const validateUserIsStaffOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userExists = req.user;

  //Validate if user is login
  if (!userExists) {
    return res.status(401).json({ message: "You have to login first!" });
  }

  //Validate type of user
  if (userExists.typeUser == TYPEUSER.CUSTOMER) {
    return res.status(403).json({ message: "You don't have permission!" });
  }

  next();
};

export { validateUserIsStaffOrAdmin };
