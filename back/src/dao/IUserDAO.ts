import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";

export interface IUserDAO {
  getUser: (id: string | number) => Promise<IUser | null>;
  getUsers: () => Promise<IUser[] | null>;
  getUserByName(name: string): Promise<IUser | null>;
  createUser: (user: IUser_) => Promise<IUser>;
  login: () => Promise<IUser>;
  logout: () => void;
  updateUser: () => Promise<IUser>;
  updatePassword: () => Promise<IUser>;
  deleteUser: () => Promise<IUser>;
}
