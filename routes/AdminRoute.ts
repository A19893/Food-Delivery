import express, {Request, Response, NextFunction} from 'express';
import { CreateVendor, GetVendorByID, GetVendors } from '../controllers';

const router =express.Router();

router.post('/vendor', CreateVendor);

router.get('/vendors', GetVendors);

router.get('/vendor/:id', GetVendorByID);


export {router as AdminRouter};