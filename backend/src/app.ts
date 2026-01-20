import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors, isCelebrateError } from 'celebrate';
import productRouter from './routes/productRouter';
import orderRouter from './routes/orderRouter';
import authRouter from './routes/authRouter';

const port = process.env.PORT || 3000;
const address = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
const app = express();

mongoose.connect(address);

app.use(cors());
/*
app.use(cors({
  origin: 'http://localhost:5173',
}));
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/order', orderRouter);
app.use('/product', productRouter);
app.use('/auth', authRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) return next(err);
  console.error(err.stack);
  if (err.name === 'CastError') return res.status(400).send({ message: `Ошибка при преобразовании ${err.value} к ${err.kind}` });
  if (err.code === 11000) return res.status(409).send({ message: err.errorResponse.errmsg });
  return res.status(500).send(err);
});

app.use(errors());

app.listen(port, () => console.log(`Server started on port ${port}`));
