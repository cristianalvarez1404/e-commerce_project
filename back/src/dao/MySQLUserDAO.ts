import { IUser } from "../interfaces/models-intefaces/user.interface";
import { IUserDAO } from "./IUserDAO";

class MySQLUserDAO implements IUserDAO {
  getUser(id: string | number): IUser | null | { message: string } {
    return { message: "" };
  }
  getUsers(): IUser[] | null | { message: string } {
    return { message: "" };
  }
  createUser(): IUser | { message: string } {
    return { message: "" };
  }
  login(): IUser | { message: string } {
    return { message: "" };
  }
  logout(): void | { message: string } {
    return { message: "" };
  }
  updateUser(): IUser | { message: string } {
    return { message: "" };
  }
  updatePassword(): IUser | { message: string } {
    return { message: "" };
  }
  deleteUser(): IUser | { message: string } {
    return { message: "" };
  }
}
