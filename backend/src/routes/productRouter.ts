import { Router } from 'express';
import {
  addProduct, deleteProduct, getProducts, updateProduct, getProduct,
} from '../controllers/productController';

const router = Router();

// Общие роуты продуктов
router.get('/', getProducts);
router.post('/', addProduct);

// Роуты конкретного продукта
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id', updateProduct);

export default router;
