import bcrypt from 'bcrypt';
import { VendorPayload } from '../dto';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { AuthPayload } from '../dto/Auth.dto';
export const GenerateSalt = async() => {
    return await bcrypt.genSalt();
}

export const GeneratePassword = async(password: string, salt: string) => {
 return await bcrypt.hash(password,salt)
}

export const ValidatePassword =async(enteredPassword: string, savedPassword:string, salt: string) => {
  return await GeneratePassword(enteredPassword,salt) === savedPassword;
}

export const GenerateSignature = (payload: VendorPayload) =>{
  const secret_Key = process.env.APP_SECRET;
 return jwt.sign(payload,secret_Key!,{expiresIn: '1d'});
}

export const ValidateSignature = async(req:Request)=>{
  const signatureKey = req.get('Authorization');
  const secret_Key = process.env.APP_SECRET as string;
  if(signatureKey){
    const payload = jwt.verify(signatureKey.split(' ')[1],secret_Key) as AuthPayload;
    console.log("payload",payload)
    req.user= payload;
    return true;
  }
  return false;
}