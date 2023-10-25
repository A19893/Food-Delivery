import express from 'express';
import { GetFoodsAvailability, GetFoodsin30Min, GetTopRestaurants, SearchFoods } from '../controllers';
import { RestaurantByIdService } from '../services/Shopping.service';

const router = express.Router();

/**--------------------------Find Availability---------------**/
router.get('/:pincode', GetFoodsAvailability);

/**--------------------------Top Restaurants------------------- */
router.get('/top-restaurants/:pincode', GetTopRestaurants);

/**------------------------Food Available in 30 Minutes---------------- */
router.get('/foods-in-30-min/:pincode', GetFoodsin30Min);

/**--------------------Search Food-------------- */
router.get('/search/:pincode', SearchFoods);

/**-----------------------------------Find Restaurant by Id-------------- */
router.get('/restaurant/:id', RestaurantByIdService);
 

export { router as ShoppingRouter };
