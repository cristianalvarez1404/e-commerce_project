import { IUser, IUser_ } from "../interfaces/models-intefaces/user.interface";

export type newUserToUpdate = {
  userId: string | number;
  user: {
    username?: string;
    address?: string;
    phone?: string;
  };
  params: {
    new?: boolean;
  };
};

export type newUserPassword = {
  userId: string | number;
  password: string;
  params: {
    new?: boolean;
  };
};

export interface IUserDAO {
  getUser: (id: string | number) => Promise<IUser | null>;
  getUsers: () => Promise<IUser[] | null>;
  getUserByName(name: string): Promise<IUser | null>;
  getUserByEmail: (email: string) => Promise<IUser | null>;
  createUser: (user: IUser_) => Promise<IUser>;
  updateUser: (params: newUserToUpdate) => Promise<IUser | null>;
  updatePassword: (params: newUserPassword) => Promise<IUser | null>;
  deleteUser: (userId: string, isActive: boolean) => Promise<IUser | null>;
}
