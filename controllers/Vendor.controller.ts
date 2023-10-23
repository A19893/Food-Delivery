import { NextFunction, Request, Response } from "express";
import { findVendor } from "./Admin.controller";
import { GenerateSignature, ValidatePassword } from "../utils";
import { EditVendorInpts, VendorLoginInputs } from "../dto";
import { Food } from "../models";
import { CreateFoodInputs } from "../dto/Food.dto";

export const VendorLogin= async(req:Request,res:Response, next:NextFunction)=>{
    const {email, password}=<VendorLoginInputs>req.body;

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

  const user = req.user;

  if(user){
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({"message": "Usr Credential not Valid!!"})
}

export const UpdateVendorProfile = async(req:Request,res:Response,next:NextFunction)=>{
  
  const {foodType, name, address, phone}= <EditVendorInpts>req.body;
  const user = req.user;
  if(user){
    const existingVendor = await findVendor(user._id);
    if(existingVendor!== null){
      existingVendor.name = name;
      existingVendor.address= address;
      existingVendor.foodType= foodType;
      existingVendor.phone = phone;

      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
     console.log("vendor",existingVendor)
    return res.json(existingVendor);
  }

  return res.json({"message": "Vendor Information not Valid!!"})
}

export const UpdateVendorService = async(req:Request,res:Response,next:NextFunction)=>{
  const user = req.user;

  if(user){
    const existingVendor = await findVendor(user._id);
    if(existingVendor!== null){
      existingVendor.serviceAvailable=! existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }

    return res.json(existingVendor);
  }

  return res.json({"message": "Vendor Information not Valid!!"})
} 

export const updateVendorCoverImage = async(req:Request, res:Response, next:NextFunction)=>{
  const user = req.user;

  if(user){
  
    const Vendor= await findVendor(user._id);

    if(Vendor!==null){
    const files = req.files as [Express.Multer.File]; 
    const images = files.map((file:Express.Multer.File) => file.filename);
      

      Vendor.coverImages.push(...images);
      const result = await Vendor.save();
      return res.json(result);
    }
  }

  return res.json({"message": "Something went wrong while adding cover Images!!"})
}
export const AddFood = async(req:Request,res:Response,next:NextFunction)=>{
  const user = req.user;

  if(user){
  
    const Vendor= await findVendor(user._id);

    const {name, description, category, price, foodType, readyTime}= <CreateFoodInputs> req.body;
    
    if(Vendor!==null){
    const files = req.files as [Express.Multer.File];
    const images = files.map((file:Express.Multer.File) => file.filename);
      const createFood = await Food.create({
        vendorId: Vendor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        foodType: foodType, 
        readyTime: readyTime,
        images: images,
        rating: 0,
      });

      Vendor.foods.push(createFood);
      const result = await Vendor.save();
      return res.json(result);
    }
  }

  return res.json({"message": "Something went wrong while adding food!!"})
}

export const GetFoods = async(req:Request,res:Response,next:NextFunction)=>{
  const user = req.user;

  if(user){
   const Foods = await Food.find({vendorId: user._id});

   if(Foods!==null){
    return res.json(Foods) 
   }
  }
  return res.json({"message": "Something went wrong while getting food"});
} 
 