import { NextFunction, Request, Response } from "express";
import { Food, FoodDoc, Vendor } from "../models";

export const GetFoodAvailabilityService = async(req:Request, res:Response) =>{
    const pincode = req.params.pincode;
    
    const result= await Vendor.find({pincode:pincode,serviceAvailable: true})
    .sort([['rating','descending']])
    .populate("foods");
     
    if(result.length > 0){
        return res.status(200).json(result)
    }
    
    return res.status(400).json({"message": "Data Not Found"})
}

export const GetTopRestaurantService = async(req:Request, res:Response) => {
    const pincode = req.params.pincode;
    
    const result= await Vendor.find({pincode:pincode,serviceAvailable: true})
    .sort([['rating','descending']])
    .limit(1)
    
    if(result.length > 0){
        return res.status(200).json(result)
    }
    
    return res.status(400).json({"message": "Data Not Found"})
}

export const GetFoodIn30MinService = async(req:Request, res:Response) => {
    const pincode = req.params.pincode;
    
    const result= await Vendor.find({pincode:pincode,serviceAvailable: true})
    .populate("foods")
    
    if(result.length > 0){

        let foodResult: any = [];

        result.map(vendor =>{
            const foods = vendor.foods as [FoodDoc]

            foodResult.push(...foods.filter(food => food.readyTime <= 30))
        })
        return res.status(200).json(foodResult)
    }
    
    return res.status(400).json({"message": "Data Not Found"})
}  

export const SearchFoodService =async (req: Request, res:Response) => {
    const pincode = req.params.pincode;
    
    const result= await Vendor.find({pincode:pincode,serviceAvailable: true})
    .populate("foods")
    
    if(result.length > 0){

        let foodResult: any = [];

        result.map(item =>{
            foodResult.push(...item.foods)
        })
        return res.status(200).json(foodResult)
    }
    return res.status(400).json({"message":"No Food Matched this query!!"})
}

export const RestaurantByIdService = async(req:Request, res:Response) => {
    const id =  req.params.id;

    const result = await Vendor.findById(id).populate("foods");

    if(result){
        return res.status(200).json(result);
    }
    return res.status(401).json({
        "message":"No Restaurant Found By this id"
    })
}