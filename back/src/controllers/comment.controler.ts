import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { CommentService } from "../services/comment/CommentService";
import { MongoCommentDAO } from "../dao/comments/MongoCommentDAO";
import { MongoProductDAO } from "../dao/product/MongoProductDAO";

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
    const { id } = req.params;
    const comment = commentService.getCommentById(id);

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
    const schemaCommentToValidate = z.object({
      product_id: z.string(),
      comment: z.string().min(3),
      liked: z.boolean().optional(),
      star: z.number().int().min(0).max(5).optional(),
    });

    const validateComment = schemaCommentToValidate.safeParse(req.body);

    if (!validateComment.data) {
      return res.status(400).json({ message: validateComment.error });
    }

    const comment = validateComment.data;
    const userId = req.user._id.toString();
    const newComment = commentService.createComment(comment, userId);

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
    const { id } = req.params;

    const schemaCommentToValidate = z.object({
      product_id: z.string().optional(),
      comment: z.string().min(3).optional(),
      liked: z.boolean().optional(),
      star: z.number().int().min(0).max(5).optional(),
    });

    const validateComment = schemaCommentToValidate.safeParse(req.body);

    if (!validateComment.data) {
      return res.status(400).json({ message: validateComment.error });
    }

    const userId = req.user._id.toString();
    const productId = req.body.product_id.toString();
    const newComment = validateComment.data;

    const commentUpdated = commentService.updateCommentById(
      id,
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
    const { id } = req.params;

    const userId = req.user._id.toString();

    await commentService.deleteCommentById(id, userId);

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
