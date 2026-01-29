import mongoose from 'mongoose';
import { Joi } from 'celebrate';

export interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: mongoose.Schema.Types.ObjectId[];
}

export const orderSchema = Joi.object({
  payment: Joi.string().required().valid('card', 'online'),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/\d+/, 'numbers'),
  address: Joi.string().required(),
  total: Joi.number().required(),
  items: Joi.array().items(Joi.string().required()).required(),
});
