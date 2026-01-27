import { NextFunction, Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;
  if (!file) return next(new BadRequestError('Файл не передан'));
  return res.status(200).send({
    fileName: file.destination + file.filename,
    originalName: file.originalname,
  });
};
