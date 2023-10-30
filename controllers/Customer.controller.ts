import { Request, Response, NextFunction } from "express";
import {
  CreateOrderService,
  CustomerLoginService,
  CustomerSignUpService,
  CustomerVeirfyService,
  EditCstomerProfileService,
  GetCustomerProfileService,
  GetOrderByIdService,
  RequestOtpService,
} from "../services/Customer.service";
import { Order } from "../models";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await CustomerSignUpService(req, res);
  return response;
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await CustomerLoginService(req, res);
  return response;
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await CustomerVeirfyService(req, res);
  return response;
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await RequestOtpService(req, res);
  return response;
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await GetCustomerProfileService(req, res);
  return response;
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await EditCstomerProfileService(req, res);
  return response;
};

export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await CreateOrderService(req, res);
  return response;
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await CreateOrderService(req, res);
  return response;
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = await GetOrderByIdService(req, res);
  return response;
};
