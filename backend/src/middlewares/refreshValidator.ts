import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized-error';
import { refreshTokenSecret } from '../config';

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new UnauthorizedError('Необходима авторизация'));

  try {
    const verified = jwt.verify(token, refreshTokenSecret as jwt.Secret);
    return next(verified);
  } catch (err) {
    return next(new UnauthorizedError('Не валидный токен'));
  }
};
