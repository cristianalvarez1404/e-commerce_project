import { NextFunction, Request, Response } from "express";
import {boolean, number, z} from 'zod'
import Product from "../models/mongoDB/product.model";
import Comment from "../models/mongoDB/comment.model";

const getComments = async (req:Request,res:Response,next:NextFunction) => {
    try{

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const getCommentById = async (req:Request,res:Response,next:NextFunction) => {
    try{

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

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

const deleteCommentById = async (req:Request,res:Response,next:NextFunction) => {
    try{

    }catch(error){
        if(error instanceof Error) {
            return res.status(400).json({message:error.message})
        }
        return res.status(400).json({message:error})
    }
}

export {getComments,getCommentById,createComment,deleteCommentById,updateCommentById}