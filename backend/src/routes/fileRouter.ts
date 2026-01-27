import { Router } from 'express';
import fileMiddleware from '../middlewares/fileMiddleware';
import { uploadFile } from '../controllers/fileController';
import auth from '../middlewares/auth';

const router = Router();

router.post('/', auth, fileMiddleware.single('file'), uploadFile);

export default router;
