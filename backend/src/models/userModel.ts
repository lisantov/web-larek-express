import mongoose from 'mongoose';
import {Joi} from "celebrate";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

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
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
