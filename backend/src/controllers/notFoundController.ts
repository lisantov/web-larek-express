import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

export default (_: Request, __: Response, next: NextFunction) => next(new NotFoundError('Страница не найдена'));
