import express from "express";
import {
  AddFood,
  GetFoods,
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
  updateVendorCoverImage,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: './uploads/',
    filename: (req,file,cb) =>{
      cb(null, Date.now() + '-' + file.originalname);
    },
});


const upload = multer({storage:imageStorage}).array('images', 10);


router.post("/login", VendorLogin);
router.get("/profile",Authenticate, GetVendorProfile);
router.patch("/profile",Authenticate, UpdateVendorProfile);
router.patch("/service",Authenticate, UpdateVendorService);
router.patch('/coverImage',Authenticate,upload,updateVendorCoverImage);
router.post('/food',Authenticate, upload, AddFood)
router.get('/foods',Authenticate,  GetFoods)
export { router as VendorRouter }; 
