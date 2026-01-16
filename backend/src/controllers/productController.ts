import { NextFunction, Request, Response } from 'express';
import Product from '../models/productModel';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.send({
      items: products.map((product) => {
        return {
          title: product.title,
          image: product.image,
          category: product.category,
          description: product.description,
          price: product.price,
          _id: product._id,
        };
      }),
      total: products.length,
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).send({message: 'Нет товара по заданному id'});
      return;
    }
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
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).send({ message: 'Нет товара по заданному id' });
      return;
    }
    res.send(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      res.status(404).send({ message: 'Нет товара по заданному id' });
      return;
    }
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
