import mongoose from 'mongoose';
import ImageSchema, { Image } from './imageModel';

export interface IProduct {
  title: string;
  image: Image;
  category: string;
  description: string;
  price: number;
}

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

export default mongoose.model<IProduct>('product', productSchema);
