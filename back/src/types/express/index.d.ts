import { UserDocument } from "../../models/mongoDB/user.model";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
