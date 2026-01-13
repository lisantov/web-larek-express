import { Router } from 'express';
import { addProduct, deleteProduct, getProducts, updateProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.patch('/:id', updateProduct);

export default router;
