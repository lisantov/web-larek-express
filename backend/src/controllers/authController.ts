import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { celebrate, Segments } from 'celebrate';
import bcrypt from 'bcryptjs';
import type { Document, Types } from 'mongoose';
import User, { userRegisterValidationScheme, userLoginValidationScheme, IUser } from '../models/userModel';
import NotFoundError from '../errors/not-found-error';
import UnauthorizedError from '../errors/unauthorized-error';
import ConflictError from '../errors/conflict-error';
import {
  accessTokenExpiry,
  refreshTokenExpiry,
  accessTokenSecret,
  refreshTokenSecret,
} from '../config';
import extractToken from '../utilities/extractToken';

export const registerDataValidator = celebrate({
  [Segments.BODY]: userRegisterValidationScheme,
});

export const loginDataValidator = celebrate({
  [Segments.BODY]: userLoginValidationScheme,
});

export const userValidator = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new UnauthorizedError('Неправильные почта или пароль'));
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

    user.tokens.push(refreshToken);
    await user.save();

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    // });

    return res.status(201).send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      accessToken,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes('11000')) return next(new ConflictError(err.message));
    return next(err);
  }
};

export const loginUser = async (
  user: Document<unknown, {}, IUser> & IUser & {
    _id: Types.ObjectId
  },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return next(new UnauthorizedError('Неправильные почта или пароль'));

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

    user.tokens.push(refreshToken);
    await user.save();

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

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  const _id = jwt.verify(
    extractToken(req.get('Authorization')!),
    accessTokenSecret as jwt.Secret,
  );

  const user = await User.findOne({ _id });
  if (!user) return next(new NotFoundError('Пользователь не найден'));

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
    if (!user) return next(new NotFoundError('Пользователь не существует'));

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
