import {
  IUser,
  IUser_,
  IUser_reponse,
} from "../../interfaces/models-intefaces/user.interface";

export type userParamsToUpdate = {
  userId: string | number;
  userIdLogged: string | number;
  username?: string;
  phone?: string;
  address?: string;
};

export type userUpdatePassword = {
  userId: string;
  userIdLogged: string;
  oldPassword: string;
  repetedPassword: string;
  newPassword: string;
};

export interface IUserService {
  getUser: (id: string | number) => Promise<IUser | null>;
  getUsers: () => Promise<IUser[] | null>;
  createUser: (
    user: IUser_
  ) => Promise<{ user: IUser_reponse; token: string } | null>;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: IUser_reponse; token: string } | null | string>;
  updateUser: (userParams: userParamsToUpdate) => Promise<IUser | null>;
  updatePassword: (userParams: userUpdatePassword) => Promise<IUser | null>;
  deleteUser: (userId: string, userIdLogged: string) => void;
}
