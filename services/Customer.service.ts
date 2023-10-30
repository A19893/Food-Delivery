import { plainToClass } from "class-transformer";
import { Request, Response } from "express";
import {
  CreateCustomerInputs,
  EditCutomerProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto";
import { validate } from "class-validator";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  onRequestOTP,
} from "../utils";
import { Customer, Food, Order } from "../models";

export const CustomerSignUpService = async (req: Request, res: Response) => {
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
    orders: [],
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

export const CustomerLoginService = async (req: Request, res: Response) => {
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

export const CustomerVeirfyService = async (req: Request, res: Response) => {
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

export const RequestOtpService = async (req: Request, res: Response) => {
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

export const GetCustomerProfileService = async (
  req: Request,
  res: Response
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

export const EditCustomerProfileService = async (
  req: Request,
  res: Response
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

export const CreateOrderService = async (req: Request, res: Response) => {
  //grab current login customer
  const customer = req.user;
  if (customer) {
    // create an order ID
    const orderId = Math.floor(Math.random() * 89999) + 1000;

    const profile = await Customer.findById(customer._id);

    const cart = <[OrderInputs]>req.body;

    let carItems = Array();

    let netAmount = 0.0;
    // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();
    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          carItems.push({ food, unit });
        }
      });
    });
    //  Create Order with Item descriptions
    if (carItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        items: carItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentRsponse: "",
        orderStatus: "Waiting",
      });
      // Finally update orders to user accounts
      if (currentOrder) {
        profile?.orders.push(currentOrder);
        await profile?.save();

        return res.status(200).json(currentOrder);
      }
    }
  }
  return res.status(400).json({ message: "Errow with Create Order" });
};

export const GetOrdersService = async (req: Request, res: Response) => {
  const customer = req.user;
  console.log("aaya")
  if (customer) {
    const CustomerOrders = await Customer.findById(customer._id).populate(
      "orders"
    );
    return res.status(200).json(CustomerOrders?.orders);
  }
  return res.status(400).json({ message: "Error getting orders" });
};

export const GetOrderByIdService = async (req: Request, res: Response) => {
  const customer = req.user;
  const orderId = req.params.id;
  if (customer) {
    const specificOrder = await Order.findById(orderId).populate("items.food");
    if (specificOrder) {
      return res.status(200).json(specificOrder);
    }
    return res.status(400).json({ message: "No Orders found by this id" });
  }
};

export const AddToCartService = async(req:Request,res:Response)=>{
const customer = req.user;
if(customer){
  const profile = await Customer.findById(customer._id).populate('cart.food');
  let carItems = Array();

  const {_id, unit} = <OrderInputs>req.body;
  const food = await Food.findById(_id);
  if(profile){
    //Check for Cart items
    carItems = profile.cart;
    if(carItems.length > 0){
      //check and update unit
      let existFoodItem = carItems.filter((item) => item.food._id.toString() === _id);
      console.log(existFoodItem)
      if(existFoodItem.length > 0){
        const index = carItems.indexOf(existFoodItem[0]);
        if(unit > 0){
          carItems[index] = {food, unit};
        }else{
          carItems.splice(index,1)
        }
      }
      else{
        carItems.push({food, unit})
      }
    }
    if(carItems){
      profile.cart = carItems as any;
      const CartResult = await profile.save();
      return res.status(200).json(CartResult)
    }
  }
}
return res.status(400).json({message:"Error while adding to Cart"})
}

export const GetCartItemService = async(req:Request,res:Response)=>{
  const customer = req.user;
  if(customer){
  const profile = await Customer.findById(customer._id).populate("cart.food");
  if(profile){
   return res.status(200).json(profile.cart);
  }
  }
  return res.status(400).json({message:"Error while getting cart item"})
}

export const DeleteCartItemService = async(req:Request,res:Response)=>{
  const customer = req.user;
  if(customer){
  const profile = await Customer.findById(customer._id).populate("cart.food");
  if(profile){
   profile.cart = [] as any;
   const CartResult = await profile.save();
   return res.status(200).json(CartResult)
  }
  }
  return res.status(400).json({message:"Cart is already empty"})
}