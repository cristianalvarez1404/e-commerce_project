import {
  IUser,
  IUser_,
} from "../../interfaces/models-intefaces/user.interface";
import "../../models/mongoDB/user.model";
import User from "../../models/mongoDB/user.model";
import { IUserDAO, newUserPassword, newUserToUpdate } from "./IUserDAO";

export class MongoUserDAO implements IUserDAO {
  public async getUser(id: string | number): Promise<IUser | null> {
    try {
      return await User.findById(id).select("+password");
    } catch (error) {
      return null;
    }
  }
  public async getUsers(): Promise<IUser[] | null> {
    try {
      return await User.find().sort("-createAt");
    } catch (error) {
      return null;
    }
  }
  public async getUserByName(name: string): Promise<IUser | null> {
    try {
      return await User.findOne({ name }).select("+password");
    } catch (error) {
      return null;
    }
  }
  public async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).select("+password");
    } catch (error) {
      return null;
    }
  }
  public async createUser(user: IUser_): Promise<IUser> {
    return (await User.create(user)).toObject();
  }

  public async updateUser(params: newUserToUpdate): Promise<IUser | null> {
    const { userId, user, params: newUser } = params;

    try {
      return await User.findByIdAndUpdate(userId, user, newUser);
    } catch (error) {
      return null;
    }
  }

  public async updatePassword(params: newUserPassword): Promise<IUser | null> {
    const { userId, password, params: newUser } = params;

    try {
      return await User.findByIdAndUpdate(userId, { password }, newUser);
    } catch (error) {
      return null;
    }
  }

  public async deleteUser(
    userId: string,
    isActive: boolean
  ): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(userId, { isActive });
    } catch (error) {
      return null;
    }
  }
}
