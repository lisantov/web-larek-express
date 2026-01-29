import { NextFunction, Request, Response } from 'express';
import { celebrate, Segments } from 'celebrate';
import * as fs from 'fs/promises';
import path from 'path';
import Product, { productCreateValidationSchema, productUpdateValidationSchema } from '../models/productModel';
import ConflictError from '../errors/conflict-error';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import { mainDirectoryName, tempDirectoryName } from '../config';

export const validateProductCreateBody = celebrate({
  [Segments.BODY]: productCreateValidationSchema,
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: productUpdateValidationSchema,
});

export const getProducts = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.send({
      items: products.map((product) => ({
        title: product.title,
        image: product.image,
        category: product.category,
        description: product.description,
        price: product.price,
        _id: product._id,
      })),
      total: products.length,
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new NotFoundError('Нет товара по заданному id'));
    return res.send({
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
      _id: product._id,
    });
  } catch (err) {
    return next(err);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await fs.stat(path.join(__dirname, '..', '..', req.body.image.fileName));
    const split = req.body.image.fileName.split('/');
    const filename = split[split.length - 1];

    if (!file.isFile()) return next(new NotFoundError('Переданное изображение не найдено'));
    if (req.body.image.fileName.startsWith('/uploads') || req.body.image.fileName.startsWith('uploads')) {
      await fs.rename(
        path.join(__dirname, '..', '..', tempDirectoryName, filename),
        path.join(__dirname, '..', '..', 'public', mainDirectoryName, filename),
      );
    }

    const product = await Product.create({
      ...req.body,
      image: {
        fileName: `/${mainDirectoryName}/${filename}`,
      },
    });
    return res.send({
      title: product.title,
      image: {
        fileName: `/images/${filename}`,
        originalName: req.body.image.originalName,
      },
      category: product.category,
      description: product.description,
      price: product.price,
      _id: product._id,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('11000')) return next(new ConflictError(err.message));
    if (err instanceof Error && err.message.includes('ENOENT')) return next(new BadRequestError('Такого файла не существует'));
    return next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new NotFoundError('Нет товара по заданному id'));
    return res.send({
      _id: product._id,
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return next(new NotFoundError('Нет товара по заданному id'));
    let filename = product.image.fileName;
    let originalname = product.image.originalName;
    if (req.body.image && req.body.image.originalName) originalname = req.body.image.originalName;
    if (req.body.image && req.body.image.fileName) {
      const file = await fs.stat(path.join(__dirname, '..', '..', req.body.image.fileName));
      const split = filename.split('/');
      filename = split[split.length - 1];

      if (!file.isFile()) return next(new NotFoundError('Переданное изображение не найдено'));
      if (req.body.image.fileName.startsWith('/uploads') || req.body.image.fileName.startsWith('uploads')) {
        await fs.rename(
          path.join(__dirname, '..', '..', tempDirectoryName, filename),
          path.join(__dirname, '..', '..', 'public', mainDirectoryName, filename),
        );
      }
    }
    return res.send({
      title: product.title,
      image: {
        fileName: `/${mainDirectoryName}/${filename}`,
        originalName: originalname,
      },
      category: product.category,
      description: product.description,
      price: product.price,
      _id: product._id,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('11000')) return next(new ConflictError('Товар с таким заголовком уже существует'));
    return next(err);
  }
};
