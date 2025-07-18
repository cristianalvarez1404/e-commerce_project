export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  isActive?: boolean;
  typeUser?: string;
}

export interface IUser_ {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  isActive?: boolean;
  typeUser?: string;
}
