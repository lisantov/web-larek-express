import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import extractToken from '../utilities/extractToken';

const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send({ message: 'Необходима авторизация' });

  try {
    const token = extractToken(authHeader);
    jwt.verify(token, accessSecret as jwt.Secret);

    return next();
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
};
