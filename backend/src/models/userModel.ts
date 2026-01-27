import mongoose from 'mongoose';
import { Joi } from 'celebrate';

export interface IToken {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const tokenScheme = new mongoose.Schema<IToken>({
  token: {
    type: String,
  },
}, { _id: false });

export const userRegisterValidationScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

export const userLoginValidationScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 30,
    default: 'Ё-моё',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 6,
  },
  tokens: [{
    type: tokenScheme,
    select: false,
  }],
});

export default mongoose.model<IUser>('user', userSchema);
