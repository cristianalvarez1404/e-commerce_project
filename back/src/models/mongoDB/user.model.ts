import mongoose from "mongoose";
import { IUser } from "../../interfaces/models-intefaces/user.interface";
import { TYPEUSER } from "../../enums/shop.enums";

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
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    typeUser: {
      type: String,
      enum: TYPEUSER,
      default: TYPEUSER.CUSTOMER,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
