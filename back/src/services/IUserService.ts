import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";

export interface IUserService {
  getUser: (id: string | number) => Promise<IUser | null>;
  getUsers: () => Promise<IUser[] | null>;
  createUser: (user: IUser_) => Promise<IUser | null>;
  login: () => IUser;
  logout: () => void;
  updateUser: () => IUser;
  updatePassword: () => IUser;
  deleteUser: () => IUser;
}
