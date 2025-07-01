import mongoose from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
