import express, {Request, Response, NextFunction} from 'express';
import { CreateOrder, CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp } from '../controllers';
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


//Order
router.post('/create-order', CreateOrder);
router.get('/orders',GetOrders);
router.get('/order/:id',GetOrderById);

//Payment
export {router as UserRouter}