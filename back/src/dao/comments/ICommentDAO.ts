import { IComment } from "../../interfaces/models-intefaces/comment.interface";

export type schemaCommentToValidate = {
  product_id: string;
  comment: string;
  liked?: boolean;
  star?: number;
};

export type schemaCommentToUpdate = {
  product_id?: string;
  comment?: string;
  liked?: boolean;
  star?: number;
};

export interface ICommentDAO {
  getComments(): Promise<IComment[] | null>;
  getCommentById(id: string): Promise<IComment | null>;
  createComment(
    comment: schemaCommentToValidate,
    userId: string
  ): Promise<IComment | null>;
  updateCommentById(
    id: string,
    comment: schemaCommentToUpdate,
    params: { new: boolean }
  ): Promise<IComment | null>;
  deleteCommentById(id: string): Promise<void | null>;
}
