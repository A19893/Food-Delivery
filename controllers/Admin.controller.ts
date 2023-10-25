import { Request, Response, NextFunction } from "express";
import { CreateVendorService, GetVendorByIdService, GetVendorService } from "../services/Admin.service";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   const response = await CreateVendorService(req,res);
   return response;
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await GetVendorService(req,res);
  return response;
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await GetVendorByIdService(req,res);
  return response;
};
