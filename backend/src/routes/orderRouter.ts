import { Router } from 'express';
import { createOrder, validateCreateOrder } from '../controllers/orderController';

const router = Router();

router.post('/', validateCreateOrder, createOrder);

export default router;
