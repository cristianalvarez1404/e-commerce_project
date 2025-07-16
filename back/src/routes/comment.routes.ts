import express from "express"
import { createComment, deleteCommentById, getCommentById, getComments, updateCommentById } from "../controllers/comment.controler"
import validateUserToken from "../middlewars/validateUserToken"

const commentRouter = express.Router()

commentRouter.get("/",getComments)
commentRouter.get("/:id",getCommentById)
commentRouter.post("",validateUserToken,createComment)
commentRouter.put("/:id",validateUserToken,updateCommentById)
commentRouter.delete("/:id",validateUserToken,deleteCommentById)

export default commentRouter