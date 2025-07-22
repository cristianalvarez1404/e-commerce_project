import { IComment } from "../../interfaces/models-intefaces/comment.interface";
import {
  ICommentDAO,
  schemaCommentToUpdate,
  schemaCommentToValidate,
} from "./ICommentDAO";
import Comment from "../../models/mongoDB/comment.model";

export class MongoCommentDAO implements ICommentDAO {
  public async getComments(): Promise<IComment[] | null> {
    try {
      return await Comment.find().sort("-createdAt");
    } catch (error) {
      return null;
    }
  }
  public async getCommentById(id: string): Promise<IComment | null> {
    try {
      return await Comment.findById(id);
    } catch (error) {
      return null;
    }
  }
  public async createComment(
    comment: schemaCommentToValidate,
    userId: string
  ): Promise<IComment | null> {
    try {
      return await Comment.create({
        user_id: userId,
        ...comment,
      });
    } catch (error) {
      return null;
    }
  }
  public async updateCommentById(
    id: string,
    comment: schemaCommentToUpdate,
    params: { new: boolean }
  ): Promise<IComment | null> {
    try {
      const commentUpdated = await Comment.findByIdAndUpdate(
        id,
        { ...comment },
        params
      );
      return commentUpdated;
    } catch (error) {
      return null;
    }
  }
  public async deleteCommentById(id: string): Promise<void | null> {
    try {
      await Comment.findByIdAndDelete(id);
    } catch (error) {
      return null;
    }
  }
}
