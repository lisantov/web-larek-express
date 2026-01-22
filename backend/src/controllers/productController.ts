import { NextFunction, Request, Response } from 'express';
import { celebrate, Segments } from 'celebrate';
import Product, { productCreateValidationSchema, productUpdateValidationSchema } from '../models/productModel';
import ConflictError from '../errors/conflict-error';
import NotFoundError from "../errors/not-found-error";
import mongoose from "mongoose";

export const validateProductCreateBody = celebrate({
  [Segments.BODY]: productCreateValidationSchema,
});

export const validateProductUpdateBody = celebrate({
  [Segments.BODY]: productUpdateValidationSchema,
});

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
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
    res.send({
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
      _id: product._id,
    });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    res.send({
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
      _id: product._id,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('11000')) return next(new ConflictError(err.message));
    return next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new NotFoundError('Нет товара по заданному id'));
    res.send({
      _id: product._id,
      title: product.title,
      image: product.image,
      category: product.category,
      description: product.description,
      price: product.price,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    if (err instanceof Error && err.message.includes('11000')) return next(new ConflictError('Товар с таким заголовком уже существует'));
    return next(err);
  }
};
