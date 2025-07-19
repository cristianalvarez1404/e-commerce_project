import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";
import "../models/mongoDB/user.model";
import User from "../models/mongoDB/user.model";
import { IUserDAO, newUserPassword, newUserToUpdate } from "./IUserDAO";

export class MongoUserDAO implements IUserDAO {
  public async getUser(id: string | number): Promise<IUser | null> {
    return await User.findById(id).select("+password");
  }
  public async getUsers(): Promise<IUser[] | null> {
    return await User.find().sort("-createAt");
  }
  public async getUserByName(name: string): Promise<IUser | null> {
    return await User.findOne({ name }).select("+password");
  }
  public async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select("+password");
  }
  public async createUser(user: IUser_): Promise<IUser> {
    return (await User.create(user)).toObject();
  }

  public async updateUser(params: newUserToUpdate): Promise<IUser | null> {
    const { userId, user, params: newUser } = params;

    return await User.findByIdAndUpdate(userId, user, newUser);
  }

  public async updatePassword(params: newUserPassword): Promise<IUser | null> {
    const { userId, password, params: newUser } = params;

    return await User.findByIdAndUpdate(userId, { password }, newUser);
  }

  public async deleteUser(
    userId: string,
    isActive: boolean
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { isActive });
  }
}
