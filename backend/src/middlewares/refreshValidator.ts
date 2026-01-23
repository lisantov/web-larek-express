import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import extractToken from '../utilities/extractToken';
import UnauthorizedError from '../errors/unauthorized-error';
import { refreshTokenSecret } from '../config';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send({ message: 'Токен не передан' });

  try {
    const token = extractToken(authHeader);
    const verified = jwt.verify(token, refreshTokenSecret as jwt.Secret);
    return next(verified);
  } catch (err) {
    return next(new UnauthorizedError('Не валидный токен'));
  }
};
