import { NextFunction, Request, Response } from "express";
import { Vendor } from "../models";

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

export const GetTopRestaurantService = async(req:Request, res:Response) =>{
    const pincode = req.params.pincode;
    
    const result= await Vendor.find({pincode:pincode,serviceAvailable: true})
    .sort([['rating','descending']])
    .limit(1)
    
    if(result.length > 0){
        return res.status(200).json(result)
    }
    
    return res.status(400).json({"message": "Data Not Found"})
}