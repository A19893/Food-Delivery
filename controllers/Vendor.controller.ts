import { NextFunction, Request, Response } from "express";
import { AddFoodService, GetFoodService, GetVendorProfileService, UpdateCoverImageService, UpdateVendorProfileService, UpdateVendorServices, VendorLoginService } from "../services/Vendor.service";

export const VendorLogin= async(req:Request,res:Response, next:NextFunction)=>{
    const response = await VendorLoginService(req,res);
    return response;
}

export const GetVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
  const response = await GetVendorProfileService(req,res);
  return response;
}

export const UpdateVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
  const response = await UpdateVendorProfileService(req,res);
  return response;
}

export const UpdateVendorService = async(req:Request,res:Response,next:NextFunction)=>{
  const response = await UpdateVendorServices(req,res);
  return response;
} 

export const updateVendorCoverImage = async(req:Request, res:Response, next:NextFunction)=>{
  const response = await UpdateCoverImageService(req,res);
  return response;
}
export const AddFood = async(req:Request,res:Response,next:NextFunction)=>{
  const response = await AddFoodService(req,res);
  return response; 
}

export const GetFoods = async(req:Request,res:Response,next:NextFunction)=>{
  const response = await GetFoodService(req,res);
  return response;
} 
 