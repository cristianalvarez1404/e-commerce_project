import { ICommentDAO } from "../../dao/comments/ICommentDAO";
import { IProductDAO } from "../../dao/product/IProductDAO";
import { IUserDAO } from "../../dao/user/IUserDAO";
import { IComment } from "../../interfaces/models-intefaces/comment.interface";
import {
  ICommentService,
  schemaCommentToUpdate,
  schemaCommentToValidate,
} from "./ICommentService";

export class CommentService implements ICommentService {
  constructor(
    private dbComment: ICommentDAO,
    private dbProduct: IProductDAO,
    private dbUser: IUserDAO
  ) {}

  public async getComments(): Promise<IComment[] | null> {
    const comments = await this.dbComment.getComments();

    if (!comments || comments.length === 0) {
      throw new Error("Comment does not exist");
    }
    return comments;
  }

  public async getCommentById(id: string): Promise<IComment | null> {
    const comment = await this.dbComment.getCommentById(id);

    if (!comment) {
      throw new Error("Comment does not exist");
    }

    return comment;
  }
  public async createComment(
    comment: schemaCommentToValidate,
    userId: string
  ): Promise<IComment | null> {
    const productExists = await this.dbProduct.getProductById(
      comment.product_id
    );

    if (!productExists) {
      throw new Error("Product not exist");
    }

    const newComment = await this.dbComment.createComment(comment, userId);
    if (!newComment || !newComment._id) {
      throw new Error("Error creating comment");
    }

    await this.dbProduct.uploadCommentById(
      comment.product_id,
      newComment._id.toString(),
      { new: true }
    );

    return newComment;
  }

  public async updateCommentById(
    idComment: string,
    userId: string,
    idProduct: string,
    newComment: schemaCommentToUpdate
  ): Promise<IComment | null> {
    const comment = await this.dbComment.getCommentById(idComment);
    const user = await this.dbUser.getUser(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (!comment) throw new Error("Comment not exist");

    if (comment.user_id.toString() !== userId && user.typeUser !== "admin") {
      throw new Error("Unauthorized user");
    }

    const productIsValid = await this.dbProduct.getProductById(idProduct);

    if (!productIsValid) {
      throw new Error("Product does not exist");
    }

    const commentUpdated = await this.dbComment.updateCommentById(
      idComment,
      newComment,
      { new: true }
    );

    return commentUpdated;
  }

  public async deleteCommentById(
    commentId: string,
    userId: string
  ): Promise<void | null> {
    const comment = await this.dbComment.getCommentById(commentId);

    if (!comment) {
      throw new Error("Comment does not exist");
    }

    if (comment.user_id.toString() !== userId) {
      throw new Error("Unauthorized to this operation");
    }

    await this.dbComment.deleteCommentById(commentId);

    const product = await this.dbProduct.getProductById(
      comment.product_id.toString()
    );

    if (!product) {
      throw new Error("Product does not exist!");
    }

    await this.dbProduct.deleteCommentProductById(
      product._id.toString(),
      comment._id.toString(),
      { new: true }
    );
  }
}
