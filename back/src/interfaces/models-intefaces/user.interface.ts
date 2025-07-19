export interface IUser extends Document {
  _id?: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  isActive?: boolean;
  typeUser?: string;
}

export interface IUser_ {
  _id?: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  isActive?: boolean;
  typeUser?: string;
}

export interface IUser_reponse {
  _id?: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  typeUser?: string;
}
