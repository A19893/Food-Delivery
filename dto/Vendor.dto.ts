import { StringLiteral } from "typescript";

export interface CreateVendorInput{
    name: string;
    ownerName: string;
    foodType: string;
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VendorLoginiNPUTS{
    email: string,
    password: string
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes: string;
    
}