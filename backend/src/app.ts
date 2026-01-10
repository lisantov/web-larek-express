import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter';

const port = process.env.PORT || 3000;
const address = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
const app = express();

mongoose.connect(address);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/product', productRouter);

app.use((err: any, req: Request, res: Response) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
