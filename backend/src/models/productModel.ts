import mongoose from 'mongoose';
import { Joi } from 'celebrate';
import * as fs from 'fs/promises';
import path from 'path';
import ImageSchema, { Image } from './imageModel';

export interface IProduct {
  title: string;
  image: Image;
  category: string;
  description: string;
  price: number;
}

export const productCreateValidationSchema = Joi.object<IProduct>({
  title: Joi.string().required().min(2).max(30),
  image: Joi.object<Image>({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().allow(null),
});

export const productUpdateValidationSchema = Joi.object<IProduct>({
  title: Joi.string().min(2).max(30),
  image: Joi.object<Image>({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }),
  category: Joi.string(),
  description: Joi.string(),
  price: Joi.number().allow(null),
});

export const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: ImageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

productSchema.post('findOneAndDelete', async (product) => {
  console.log('START');
  await fs.rm(path.join(__dirname, '..', '..', 'public', product.image.fileName));
  console.log('END');
});

export default mongoose.model<IProduct>('product', productSchema);
