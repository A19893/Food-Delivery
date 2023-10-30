import { Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { findVendor } from "../utils/findVendor";
import { GeneratePassword, GenerateSalt } from "../utils";
import { Vendor } from "../models";

export const CreateVendorService = async (req: Request, res: Response) => {
  const {
    name,
    ownerName,
    foodType,
    email,
    password,
    pincode,
    address,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await findVendor("", email);
  if (existingVendor !== null) {
    return res.json("Vendor Already Exists with this email ID!!");
  }
  //generate a salt
  const Salt = await GenerateSalt();
  //encrypt the password using the salt
  const Userpassword = await GeneratePassword(password, Salt);

  const createVendor = await Vendor.create({
    name: name,
    ownerName: ownerName,
    foodType: foodType,
    pincode: pincode,
    address: address,
    phone: phone,
    email: email,
    password: Userpassword,
    salt: Salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createVendor);
};

export const GetVendorService = async (req: Request, res: Response) => {
  const vendors = await Vendor.find();

  if (vendors === null) {
    return res.json({ message: "No Vendors Registered Till Now!!" });
  }

  return res.json(vendors);
};

export const GetVendorByIdService = async (req: Request, res: Response) => {
  const id = req.params.id;
  const SpecificVendor = await findVendor(id);
  if (SpecificVendor === null) {
    return res.json({ message: "No Vendors Found By this id" });
  }
  return res.json(SpecificVendor);
};
