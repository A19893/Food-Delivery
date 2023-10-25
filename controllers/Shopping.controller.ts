import  { NextFunction, Request, Response } from "express";
import { GetFoodAvailabilityService, GetFoodIn30MinService, GetTopRestaurantService, RestaurantByIdService, SearchFoodService } from "../services/Shopping.service";


export const GetFoodsAvailability = async(req:Request, res:Response, next:NextFunction) => {
  
    const response = await GetFoodAvailabilityService(req,res);
    return response;
}

export const GetTopRestaurants = async(req:Request, res:Response, next:NextFunction) => {
    const response = await GetTopRestaurantService(req,res);
    return response;
}

export const GetFoodsin30Min =async(req:Request, res:Response, next:NextFunction) => {
    const response = await GetFoodIn30MinService(req,res);
    return response;
}

export const SearchFoods = async(req:Request, res:Response, next:NextFunction) => {
   const response= await SearchFoodService(req,res);
   return response;
}

export const RestaurantById = async(req:Request, res:Response, next:NextFunction) => {
   const response = await RestaurantByIdService(req,res);
   return response;
}