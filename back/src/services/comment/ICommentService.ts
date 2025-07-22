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

export interface ICommentService {
  getComments(): Promise<IComment[] | null>;
  getCommentById(id: string): Promise<IComment | null>;
  createComment(
    comment: schemaCommentToValidate,
    userId: string
  ): Promise<IComment | null>;
  updateCommentById(
    idComment: string,
    userId: string,
    idProduct: string,
    newComment: schemaCommentToUpdate
  ): Promise<IComment | null>;
  deleteCommentById(commentId: string, userId: string): Promise<void | null>;
}
