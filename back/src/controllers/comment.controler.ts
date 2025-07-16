import { NextFunction, Request, Response } from "express";
import {boolean, number, z} from 'zod'
import Product from "../models/mongoDB/product.model";
import Comment from "../models/mongoDB/comment.model";

const getComments = async (req:Request,res:Response,next:NextFunction) => {
    try{
        //Search comments
        const comments = await Comment.find().sort("-createdAt")

        //Manage comments that does not exist
        if(comments.length === 0){
            return res.status(404).json({message:"Comment does not exist"})
        }

        //return comments
        return res.status(200).json(comments)

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const getCommentById = async (req:Request,res:Response,next:NextFunction) => {
    try{
        //search comment by id
        const {id} = req.params
        const comment = await Comment.findById(id)

        //validate commet exists
        if(!comment){
            return res.status(200).json({message:"Comment does not exist"})
        }

        //return comment
        return res.status(200).json(comment)

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const createComment = async (req:Request,res:Response,next:NextFunction) => {
    try{
        //validate field req body and create validation with zod
        const schemaCommentToValidate = z.object({
          product_id: z.string(),
          comment: z.string().min(3),
          liked: z.boolean().optional(),
          star: z.number().int().min(0).max(5).optional()
        })

        const validateComment = schemaCommentToValidate.safeParse(req.body)

        if(!validateComment.data){
            return res.status(400).json({message:validateComment.error})
        }

        //validate if product exist in the db
        const productExists = await Product.findById(validateComment.data.product_id)

        if(!productExists){
            return res.status(400).json({message:"Product not exist"})
        }

        //create comment
        const newComment = await Comment.create({
            user_id:req.user._id.toString(),
            ...validateComment.data
        })
        
        //return comment
        return res.status(201).json(newComment)

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const updateCommentById = async (req:Request,res:Response,next:NextFunction) => {
    try{
        //get fields and search comment
        const { id } = req.params

        const comment = await Comment.findById(id)

        if(!comment) return res.status(404).json({message:"Comment not exist"})
        
        //validate if user logged in if the same that the comment has
        if(comment.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Unauthorized user"})
        }

        //validate fields with zod passed in body'request
        const schemaCommentToValidate = z.object({
          product_id: z.string().optional(),
          comment: z.string().min(3).optional(),
          liked: z.boolean().optional(),
          star: z.number().int().min(0).max(5).optional()
        })

        const validateComment = schemaCommentToValidate.safeParse(req.body)

        if(!validateComment.data){
            return res.status(400).json({message:validateComment.error})
        }

        const productIsValid = await Product.findById(req.body.product_id)

        if(!productIsValid){
            return res.status(400).json({message:"Product does not exist"})
        }

        //update comment
        const commentUpdated = await Comment.findByIdAndUpdate(id,validateComment.data,{new:true})
        
        //return comment
        return res.status(200).json(commentUpdated)

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const deleteCommentById = async (req:Request,res:Response,next:NextFunction) => {
    try{
        //search comment and validat if exist
        const { id } = req.params

        const comment = await Comment.findById(id)

        if(!comment){
            return res.status(404).json({message:"Comment does not exist"})
        }

        //validate if user is the same that was logged
        if(comment.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Unauthorized to this operation"})
        }

        //delete comment and return message
        await comment.deleteOne()

        return res.status(200).json({message:"Comment has been deleted"})

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

export {getComments,getCommentById,createComment,deleteCommentById,updateCommentById}