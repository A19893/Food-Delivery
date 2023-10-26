import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInputs,
  EditCutomerProfileInputs,
  UserLoginInputs,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  onRequestOTP,
} from "../utils";
import { Customer } from "../models";
import { resolveTypeReferenceDirective } from "typescript";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();
  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer !== null) {
    return res.json({ message: "An user already exist with this email id" });
  }
  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    firstName: "",
    lastName: "",
    address: "",
    phone: phone,
    verified: true,
    otp: otp,
    otp_expiry: expiry,
    lat: 0,
    lng: 0,
  });
  if (result) {
    //send the otp to customer
    await onRequestOTP(otp, phone);

    //generate the result
    const signature = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    //send the result to client
    return res.status(201).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with signup!!" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);
  const loginErrors = await validate(loginInputs, {
    validationError: { target: true },
  });
  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }
  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(200).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    } else {
      return res.status(200).json({
        message: "Password is not Valid!!",
      });
    }
  }
  return res
    .status(404)
    .json({ message: "No user exists with this credentials!!" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updatedResponse = await profile.save();

        const signature = GenerateSignature({
          _id: updatedResponse._id,
          email: updatedResponse.email,
          verified: updatedResponse.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: updatedResponse.verified,
          email: updatedResponse.email,
        });
      }
    }
    return res
      .status(400)
      .json({ message: "Error with verification of user!!" });
  }
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const existingCustomer = await Customer.findById(customer._id);
    if (existingCustomer) {
      const { otp, expiry } = GenerateOtp();
      existingCustomer.otp_expiry = expiry;
      existingCustomer.otp = otp;
      await existingCustomer.save();
      await onRequestOTP(otp, existingCustomer.phone);
      return res.status(200).json({
        message: "Otp sent to your registered mobile number!!",
      });
    }
  }

  return res.status(400).json("Error while requesting otp!!");
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const userProfile = await Customer.findById(customer._id);
    return res.status(200).json(userProfile);
  }
  return res.status(404).json({
    message: "No User found with this email id!!",
  });
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCutomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: true },
  });
  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  const { firstName, lastName, address } = req.body;
  if (customer) {
    const userProfile = await Customer.findById(customer._id);
    if (userProfile) {
      userProfile.firstName = firstName;
      userProfile.lastName = lastName;
      userProfile.address = address;
      const result = await userProfile.save();
      return res.status(201).json(result);
    }
  }
  return res.status(404).json({
    message: "Error Updating User Profile",
  });
};
