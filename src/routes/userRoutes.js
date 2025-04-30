import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateProfile, 
  updatePassword, 
  getCurrentUser
} from '../controllers/userController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();





// Protected routes (require authentication)
router.use(protect);
router.get("/me", getCurrentUser);
router.patch('/update', updateProfile);
router.patch('/updatePassword', updatePassword);



// Admin routes (require admin role)
router.use(restrictTo('admin'));
router.route('/')
  .get(getAllUsers)

router.route('/:id')
  .get(getUserById);

export default router; 