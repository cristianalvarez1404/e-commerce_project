import { IUserDAO } from "../dao/IUserDAO";
import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";
import { IUserService } from "./IUserService";
import bcrypt from "bcrypt";
import jwt, { Jwt } from "jsonwebtoken";

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
      throw new Error("Therea are not users!");
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

    const createdUser = await this.db.createUser({
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

  public login() {}

  public logout() {}

  public updateUser() {}

  public updatePassword() {}

  public deleteUser() {}
}
