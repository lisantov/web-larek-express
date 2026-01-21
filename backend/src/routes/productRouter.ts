import { Router } from 'express';
import {
  addProduct, deleteProduct, getProducts, updateProduct, getProduct,
} from '../controllers/productController';
import auth from '../middlewares/auth';

const router = Router();

// Общие роуты продуктов
router.get('/', getProducts);
router.post('/', addProduct);

// Роуты конкретного продукта
router.get('/:id', getProduct);
router.delete('/:id', auth, deleteProduct);
router.patch('/:id', auth, updateProduct);

export default router;
