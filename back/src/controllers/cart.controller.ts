import { NextFunction, Response,Request } from "express";
import { IProduct } from "../interfaces/models-intefaces/product.interface";
import Product from "../models/mongoDB/product.model";

type ProductToBuy = {
    idProduct:string;
    unitsToBuy:number
}

const createCart = async(req:Request,res:Response,next:NextFunction) => {
    try{
        //get products from request.
        const products:ProductToBuy[]= req.body

        if(products.length === 0){
            return res.status(400).json({message:"Products does not exist!"})
        }

        //validate products duplicate
        const ids = products.map((p) => p.idProduct)
        const uniqueIds = [...new Set(ids)]

        if(uniqueIds.length !== products.length){
            return res.status(400).json({message:"You have duplicate products, please check it!"})
        }

        //validate products exists in product'db
        const productChecks = products.map((product) => 
            Product.findById(product.idProduct)
        )

        const foundProducts = await Promise.all(productChecks)
        const someNotFound = foundProducts.some((product) => product === null)

        if(someNotFound){
            return res.status(400).json({message:"One or more products does not exist!"})
        }

        //validate there are units in inventory'db
        

        //decrease units in inventory'model
        //increase units sold in inventory'model
        //calculate sale price to product
        //calculate cost of sale to product
        //create cart with state pending
        //return cart with all info - except cost of sale

    }catch(error){

    }
}