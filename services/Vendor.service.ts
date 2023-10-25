import { Request, Response } from "express";
import { EditVendorInpts, VendorLoginInputs } from "../dto";
import { findVendor } from "../utils/findVendor";
import { GenerateSignature, ValidatePassword } from "../utils";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models";

export const VendorLoginService =async (req:Request, res:Response) => {
    const {email, password}=<VendorLoginInputs>req.body;

    const existingVendor = await findVendor('',email);
    console.log(existingVendor)
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

export const GetVendorProfileService =async (req: Request, res:Response) => {
    const user = req.user;

  if(user){
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({"message": "Usr Credential not Valid!!"})
}

export const UpdateVendorProfileService = async(req:Request, res:Response) => {
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

export const UpdateVendorServices = async(req:Request, res:Response) =>{
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

export const UpdateCoverImageService = async(req:Request,res:Response)=>{
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

export const AddFoodService =async (req:Request,res:Response) => {
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

export const GetFoodService = async(req:Request, res:Response) =>{
    const user = req.user;
  if(user){
   const Foods = await Food.find({vendorId: user._id});
   if(Foods!==null){
    return res.json(Foods) 
   }
  }
  return res.json({"message": "Something went wrong while getting food"});
}