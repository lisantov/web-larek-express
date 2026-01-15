import { Router } from 'express';
import { createOrder, orderValidator } from '../controllers/orderController';

const router = Router();

router.post('/', orderValidator, createOrder);

export default router;
