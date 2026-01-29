import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BadRequestError from '../errors/bad-request-error';

export default (req: Request, _: Response, next: NextFunction) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(new BadRequestError('Передан не валидный ID товара'));
  return next();
};
