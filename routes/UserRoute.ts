import express, {Request, Response, NextFunction} from 'express';
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from '../controllers';

const router = express.Router();

//** -----------------Signup/Create Account --------------- */
router.post('/signup',CustomerSignup) 

//** -----------------Login Account --------------- */
router.post('/login', CustomerLogin)

//** -----------------Authentication --------------- */

//** -----------------Verify Customer Account --------------- */
router.patch('/verify', CustomerVerify)
//** -----------------OTP/Requesting OTP --------------- */
router.get('/otp',RequestOtp)

//** -----------------Profile --------------- */
router.get('/profile',GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)


//Cart


//Order


//Payment
export {router as UserRouter}