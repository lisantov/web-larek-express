import { celebrate, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import { orderSchema } from '../models/orderModel';
import Product from '../models/productModel';
import { isValidObjectId, type ObjectId } from "mongoose";
import BadRequestError from "../errors/bad-request-error";

export const validateCreateOrder = celebrate({
  [Segments.BODY]: orderSchema,
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total, items } = req.body;
  const areItemsObjectId = items.every((item: ObjectId) => isValidObjectId(item));

  if (!areItemsObjectId) return next(new BadRequestError('Не все переданные id товаров валидны'));

  try {
    const products = await Product.find({ _id: { $in: items } });

    if (products.length < items.length) {
      const foundIds = products.map((p) => p._id.toString());
      const notFoundIds = items.filter((id: string) => !foundIds.includes(id));
      return res.status(404).send({ message: `Товар с id ${notFoundIds[0]} не найден` });
    }

    let productSum = 0;
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      if (product.price === null) return res.status(400).send({ message: `Товар с id ${product._id} не продается` });
      productSum += product.price;
    }

    if (productSum !== total) return res.status(400).send({ message: 'Неверная сумма заказа' });

    return res.status(200).send({
      _id: faker.string.uuid(),
      total,
    });
  } catch (error) {
    return next(error);
  }
};
