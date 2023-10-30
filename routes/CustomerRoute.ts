import express, {Request, Response, NextFunction} from 'express';
import { AddToCart, CreateOrder, CustomerLogin, CustomerSignup, CustomerVerify, DeleteCartItem, EditCustomerProfile, GetCartItem, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp } from '../controllers';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

//** -----------------Signup/Create Account --------------- */
router.post('/signup',CustomerSignup) 

//** -----------------Login Account --------------- */
router.post('/login', CustomerLogin)

//** -----------------Authentication --------------- */
router.use(Authenticate);

//** -----------------Verify Customer Account --------------- */
router.patch('/verify', CustomerVerify)

//** -----------------OTP/Requesting OTP --------------- */
router.get('/otp',RequestOtp)

//** -----------------Profile --------------- */
router.get('/profile',GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)


//Cart
router.post('/cart',AddToCart);
router.get('/cart',GetCartItem);
router.delete('/cart',DeleteCartItem);

//Order
router.post('/create-order', CreateOrder);
router.get('/orders',GetOrders);
router.get('/order/:id',GetOrderById);

//Payment



export {router as UserRouter}