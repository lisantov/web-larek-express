import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import extractToken from '../utilities/extractToken';
import UnauthorizedError from '../errors/unauthorized-error';
import { accessTokenSecret } from '../config';

export default async (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');

  if (!authHeader
    || !authHeader.startsWith('Bearer ')
    || !authHeader.split(' ')[1] === undefined) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  try {
    const token = extractToken(authHeader);
    jwt.verify(token, accessTokenSecret as jwt.Secret);

    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};
