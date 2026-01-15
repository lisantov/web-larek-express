import cors from 'cors';
import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import productRouter from './routes/productRouter';
import orderRouter from './routes/orderRouter';

const port = process.env.PORT || 3000;
const address = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
const app = express();

mongoose.connect(address);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use(errors());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
