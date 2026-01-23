import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors, isCelebrateError } from 'celebrate';
import winston from 'winston';
import expressWinston from 'express-winston';
import productRouter from './routes/productRouter';
import orderRouter from './routes/orderRouter';
import authRouter from './routes/authRouter';
import BasicError from './errors/error-model';

const port = process.env.PORT || 3000;
const address = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
const app = express();

mongoose.connect(address);

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/request.log') }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') }),
  ],
  format: winston.format.json(),
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(requestLogger);

app.use('/order', orderRouter);
app.use('/product', productRouter);
app.use('/auth', authRouter);

app.use(errorLogger);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) return next(err);

  if (!(err instanceof BasicError)) return res.status(500).send({ message: 'Непредусмотренная ошибка' });

  return res.status(err.statusCode).send({ message: err.message });
});

app.use(errors());

app.listen(port, () => console.log(`Server started on port ${port}`));
