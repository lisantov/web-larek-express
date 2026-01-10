import { Request, Response } from 'express';
import Product from '../models/productModel';

export const getProducts = (req: Request, res: Response) => Product.find({})
  .then((products) => res.send({
    items: products,
    total: products.length,
  }))
  .catch((err) => res.status(500).send(err));

export const addProduct = (req: Request, res: Response) => Product.create(req.body)
  .then((product) => res.send(product))
  .catch((err) => res.status(400).send(err));
