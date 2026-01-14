import { Request, Response } from 'express';
import Product from '../models/productModel';

export const getProducts = (req: Request, res: Response) => Product.find({})
  .then((products) => res.send({
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
  }))
  .catch((err) => res.status(500).send(err));

export const getProduct = (req: Request, res: Response) => Product.findById(req.params.id)
  .then((product) => {
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
  })
  .catch((err) => res.status(400).send(err));

export const addProduct = (req: Request, res: Response) => Product.create(req.body)
  .then((product) => res.send({
    title: product.title,
    image: product.image,
    category: product.category,
    description: product.description,
    price: product.price,
    _id: product._id,
  }))
  .catch((err) => res.status(400).send(err));

export const deleteProduct = (req: Request, res: Response) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (!product) {
        res.status(404).send({ message: 'Нет товара по заданному id' });
        return;
      }

      res.send(product);
    })
    .catch((err) => res.status(400).send(err));
};

export const updateProduct = (req: Request, res: Response) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((product) => {
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
    })
    .catch((err) => res.status(400).send(err));
};
