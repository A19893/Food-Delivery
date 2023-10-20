import { NextFunction, Request, Response } from "express";
import { VendorLoginiNPUTS } from "../dto";
import { findVendor } from "./Admin.controller";
import { GenerateSignature, ValidatePassword } from "../utils";
import { sign } from "jsonwebtoken";

export const VendorLogin= async(req:Request,res:Response, next:NextFunction)=>{
    const {email, password}=<VendorLoginiNPUTS>req.body;

    const existingVendor = await findVendor('',email);
    if(existingVendor!==null){
        const Validation = await ValidatePassword(password,existingVendor.password,existingVendor.salt);
        if(Validation){
          const signature = GenerateSignature({
            _id: existingVendor._id,
            email:existingVendor.email,
            foodTypes:existingVendor.foodType,
            name:existingVendor.name
          })
          
          return res.json(signature);
        }else{
            return res.json({"Password":"Password is not Valid!!"})
        }
    }
    return res.json({"message":"Login Credentials not Valid"})
}

export const GetVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{

}

export const UpdateVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{

}

export const UpdateVendorService = async(req:Request,res:Response,next:NextFunction)=>{
    
}