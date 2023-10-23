import { Vendor } from "../models";

export const findVendor = async (id?: string | undefined, email?: string) => {
    if (email) return await Vendor.findOne({ email: email });
    else return await Vendor.findById(id);
  };