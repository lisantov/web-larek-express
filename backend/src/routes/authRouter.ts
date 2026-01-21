import { Router } from 'express';
import {
  loginDataValidator,
  loginUser, logoutUser, refreshToken,
  registerDataValidator,
  registerUser,
  userValidator,
} from '../controllers/authController';
import auth from '../middlewares/auth';
import refreshValidator from '../middlewares/refreshValidator';

const router = Router();

router.post('/register', registerDataValidator, registerUser);
router.post('/login', loginDataValidator, userValidator, loginUser);
router.get('/logout', auth, logoutUser);
router.get('/token', refreshValidator, refreshToken);

export default router;
