import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { celebrate, Segments } from 'celebrate';
import bcrypt from 'bcryptjs';
import User, { userRegisterValidationScheme, userLoginValidationScheme, IUser } from '../models/userModel';

const accessTokenExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m';
const refreshTokenExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d';

const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;

export const registerDataValidator = celebrate({
  [Segments.BODY]: userRegisterValidationScheme,
});

export const loginDataValidator = celebrate({
  [Segments.BODY]: userLoginValidationScheme,
});

export const userValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send({ message: 'Неправильные почта или пароль' });
  return next(user);
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    const accessToken = jwt.sign(
      { _id: user._id },
      accessTokenSecret as jwt.Secret,
      { expiresIn: accessTokenExpiry } as jwt.SignOptions,
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      refreshTokenSecret as jwt.Secret,
      { expiresIn: refreshTokenExpiry } as jwt.SignOptions,
    );
    return res.status(201).send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (
  user: IUser & { _id: string },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Неправильные почта или пароль' });

    const accessToken = jwt.sign(
      { _id: user._id },
      accessTokenSecret as jwt.Secret,
      { expiresIn: accessTokenExpiry } as jwt.SignOptions,
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      refreshTokenSecret as jwt.Secret,
      { expiresIn: refreshTokenExpiry } as jwt.SignOptions,
    );

    return res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.send({ success: true });
};

export const refreshToken = async (
  _id: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ _id });
    if (!user) return res.status(404).send({ message: 'Пользователь не существует' });

    const token = jwt.sign(
      { _id: user._id },
      accessTokenSecret as jwt.Secret,
      { expiresIn: accessTokenExpiry } as jwt.SignOptions,
    );
    return res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      accessToken: token,
    });
  } catch (err) {
    return next(err);
  }
};
