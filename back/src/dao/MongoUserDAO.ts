import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";
import "../models/mongoDB/user.model";
import User from "../models/mongoDB/user.model";
import { IUserDAO } from "./IUserDAO";

export class MongoUserDAO implements IUserDAO {
  async getUser(id: string | number): Promise<IUser | null> {
    return await User.findById(id);
  }
  async getUsers(): Promise<IUser[] | null> {
    return await User.find().sort("-createAt");
  }
  async getUserByName(name: string): Promise<IUser | null> {
    return await User.findOne({ name });
  }
  async createUser(user: IUser_): Promise<IUser> {
    return (await User.create(user)).toObject();
  }

  login(): IUser {
    return { message: "" };
  }
  logout(): void {
    return { message: "" };
  }
  updateUser(): IUser {
    return { message: "" };
  }
  updatePassword(): IUser {
    return { message: "" };
  }
  deleteUser(): IUser {
    return { message: "" };
  }
}
