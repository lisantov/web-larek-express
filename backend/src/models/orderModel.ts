import mongoose from 'mongoose';

export interface IOrder {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: mongoose.Schema.Types.ObjectId[];
}

export const orderSchema = new mongoose.Schema({
  payment: {
    type: String,
    enum: ['card', 'online'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  }],
});

export default mongoose.model<IOrder>('order', orderSchema);
