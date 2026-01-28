import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request, Express } from 'express';
import { tempDirectoryName } from '../config';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${tempDirectoryName}/`);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileMiddleware = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) return cb(null, true);
    return cb(new Error('Ошибка: Разрешены только изображения (jpeg, jpg, png, gif)!'));
  },
});

export default fileMiddleware;
