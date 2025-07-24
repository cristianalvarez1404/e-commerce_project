import { Request, Response } from "express";
import { UserService } from "../services/user/user.service";
import { MongoUserDAO } from "../dao/user/MongoUserDAO";
import { UserIdParamsDTO } from "../dto/user/userIDParamsDTO";
import { CreateUserDto } from "../dto/user/createUserDTO";
import { LoginUserDTO } from "../dto/user/LoginUserDTO";
import { UpdateUserDTO } from "../dto/user/updateUserDTO";
import { UpdatePasswordUserDTO } from "../dto/user/updatePasswordUserDTO";

const db = new MongoUserDAO();
const userService = new UserService(db);

const getUsers = async (req: Request, res: Response) => {
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

const getUser = async (req: Request, res: Response) => {
  try {
    const idExists = UserIdParamsDTO.safeParse(req.params);

    if (!idExists.success) {
      return res
        .status(400)
        .json({ message: "Invalid ID " + idExists.error.flatten() });
    }

    const idUser = idExists.data.id;

    if (req.user._id.toString() !== idUser && req.user.typeUser !== "admin") {
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
    const checkUserDataInDTO = CreateUserDto.safeParse(req.body);

    if (!checkUserDataInDTO.success) {
      return res.status(400).json({
        message: "Please check your data sended : " + checkUserDataInDTO.error,
      });
    }

    const userData = checkUserDataInDTO.data;

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

const login = async (req: Request, res: Response) => {
  try {
    const validateData = LoginUserDTO.safeParse(req.body);

    if (!validateData.success) {
      return res
        .status(400)
        .json({ message: "Please check all fields required to login" });
    }

    const { email, password } = validateData.data;

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

const logout = (req: Request, res: Response) => {
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const validateUserId = UserIdParamsDTO.safeParse(req.params);

    if (!validateUserId.success) {
      return res
        .status(400)
        .json({ message: "Invalid ID " + validateUserId.error.flatten() });
    }

    const validateBodyUserToUpdate = UpdateUserDTO.safeParse(req.body);

    if (!validateBodyUserToUpdate.success) {
      return res.status(400).json({
        message:
          "Check your body fields " + validateBodyUserToUpdate.error.flatten(),
      });
    }

    const userId = validateUserId.data;
    const { username, phone, address } = validateBodyUserToUpdate.data;

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
      userId: userId.id,
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
    const validateUserId = UserIdParamsDTO.safeParse(req.params);

    if (!validateUserId.success) {
      return res
        .status(400)
        .json({ message: "Invalid ID " + validateUserId.error.flatten() });
    }

    const validateUserPasswords = UpdatePasswordUserDTO.safeParse(req.body);

    if (!validateUserPasswords.success) {
      return res.status(400).json({ message: "Field are incompleted!" });
    }

    const userId = validateUserId.data;
    const { newPassword, repetedPassword, oldPassword } =
      validateUserPasswords.data;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You have to login to update password!" });
    }

    const userParams = {
      userId: userId.id,
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const validateUserId = UserIdParamsDTO.safeParse(req.params);

    if (!validateUserId.success) {
      return res
        .status(400)
        .json({ message: "Invalid ID " + validateUserId.error.flatten() });
    }

    if (!req.user) {
      return res.status(401).json({ message: "You have to login!" });
    }

    const userId = validateUserId.data.id;

    await userService.deleteUser(userId, req.user);

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
