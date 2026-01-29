import { Router } from 'express';
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  getProduct,
  validateProductCreateBody,
  validateProductUpdateBody,
} from '../controllers/productController';
import auth from '../middlewares/auth';
import validateObjId from '../middlewares/validateObjId';

const router = Router();

// Общие роуты продуктов
router.get('/', getProducts);
router.post('/', auth, validateProductCreateBody, addProduct);

// Роуты конкретного продукта
router.get('/:id', validateObjId, getProduct);
router.delete('/:id', auth, validateObjId, deleteProduct);
router.patch('/:id', auth, validateObjId, validateProductUpdateBody, updateProduct);

export default router;
