import { IUserDAO } from "../../dao/user/IUserDAO";
import {
  IUser,
  IUser_,
} from "../../interfaces/models-intefaces/user.interface";
import {
  IUserService,
  userParamsToUpdate,
  userUpdatePassword,
} from "./IUserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService implements IUserService {
  constructor(private db: IUserDAO) {}

  public async getUser(id: string | number): Promise<IUser | null> {
    const user = await this.db.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  public async getUsers(): Promise<IUser[] | null> {
    const users = await this.db.getUsers();
    if (!users) {
      throw new Error("There are not users!");
    } else {
      return users;
    }
  }

  public async createUser(data: IUser_) {
    const { username, email, password, phone, address } = data;

    if (!username || !email || !password) {
      throw new Error("Please, check all fields required");
    }

    const existingUser = await this.db.getUserByName(username);
    if (existingUser) {
      throw new Error("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser: IUser_ = await this.db.createUser({
      username,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = createdUser;

    const token = jwt.sign(
      { userId: userWithoutPassword._id },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    return { user: userWithoutPassword, token };
  }

  public async login(email: string, password: string) {
    const userExists = await this.db.getUserByEmail(email);

    if (!userExists) {
      throw new Error("Invalid credentials");
    }

    const validatePassword = await bcrypt.compare(
      password,
      userExists.password
    );

    if (!validatePassword) {
      throw new Error("Invalid credentialss");
    }

    const { password: _, ...userWithoutPassword } = userExists;

    const token = jwt.sign(
      { userId: userWithoutPassword._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10m",
      }
    );

    return { user: userWithoutPassword, token };
  }

  public async updateUser(userParams: userParamsToUpdate) {
    const { userId, userIdLogged, username, phone, address } = userParams;

    const user = await this.db.getUser(userId);

    if (!user) {
      throw new Error("Invalid cretentials !");
    }

    if (userId !== userIdLogged) {
      throw new Error("Unauthorized: user mismatch!");
    }

    const updatedUser = await this.db.updateUser({
      userId,
      user: {
        username,
        phone,
        address,
      },
      params: {
        new: true,
      },
    });

    return updatedUser;
  }

  public async updatePassword(userParams: userUpdatePassword) {
    const { userId, userIdLogged, oldPassword, repetedPassword, newPassword } =
      userParams;

    const user = await this.db.getUser(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    if (userId !== userIdLogged) {
      throw new Error("Unauthorized: user mismatch!");
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect current password!!");
    }

    if (newPassword === oldPassword) {
      throw new Error("Password are the same, change them!!");
    }

    if (newPassword !== repetedPassword) {
      throw new Error("Passwords do not match!");
    }

    const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);

    const userPasswordUpdated = await this.db.updatePassword({
      userId,
      password: newPasswordEncrypted,
      params: { new: true },
    });

    return userPasswordUpdated;
  }

  public async deleteUser(userId: string, userIdLogged: string) {
    const user = await this.db.getUser(userId);
    const userLogged = await this.db.getUser(userIdLogged);

    if (!user) {
      throw new Error("User not found!");
    }

    if (userLogged.typeUser !== "admin" && user._id !== userIdLogged) {
      throw new Error("Unauthorized: user mismatch!");
    }

    await this.db.deleteUser(userId, false);
  }
}
