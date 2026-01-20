import { Router } from 'express';
import {
  loginDataValidator,
  loginUser,
  registerDataValidator,
  registerUser,
  userValidator,
} from '../controllers/authController';

const router = Router();

router.post('/register', registerDataValidator, registerUser);
router.post('/login', loginDataValidator, userValidator, loginUser);

export default router;
