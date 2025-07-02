export interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}
