import { Request, Response } from "express";
import { CommentService } from "../services/comment/CommentService";
import { MongoCommentDAO } from "../dao/comments/MongoCommentDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";
import { CommentIDParamDTO } from "../dto/comment/commetIDParamDTO";
import { CreateCommentDTO } from "../dto/comment/createCommentDTO";
import { UpdateCommentDTO } from "../dto/comment/updateCommentDTO";

const dbComment = new MongoCommentDAO();
const dbProduct = new MongoProductDAO();
const commentService = new CommentService(dbComment, dbProduct);

const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getComments();

    return res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const id = CommentIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const comment = await commentService.getCommentById(id.data.id);

    return res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const validateComment = CreateCommentDTO.safeParse(req.body);

    if (!validateComment.data) {
      return res.status(400).json({ message: validateComment.error });
    }

    const comment = validateComment.data;
    const userId = req.user._id.toString();
    const newComment = await commentService.createComment(comment, userId);

    return res.status(201).json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const updateCommentById = async (req: Request, res: Response) => {
  try {
    const id = CommentIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const validateComment = UpdateCommentDTO.safeParse(req.body);

    if (!validateComment.data) {
      return res.status(400).json({ message: validateComment.error });
    }

    const userId = req.user._id.toString();
    const productId = req.body.product_id.toString();
    const newComment = validateComment.data;

    const commentUpdated = await commentService.updateCommentById(
      id.data.id,
      userId,
      productId,
      newComment
    );

    return res.status(200).json(commentUpdated);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const id = CommentIDParamDTO.safeParse(req.params);

    if (!id.success) {
      return res.status(400).json({ message: "Id does not exist" });
    }

    const userId = req.user._id.toString();

    await commentService.deleteCommentById(id.data.id, userId);

    return res.status(200).json({ message: "Comment has been deleted" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: error });
  }
};

export {
  getComments,
  getCommentById,
  createComment,
  deleteCommentById,
  updateCommentById,
};
