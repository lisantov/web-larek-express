import { NextFunction, Request, Response } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { celebrate, Segments } from 'celebrate';
import bcrypt from 'bcryptjs';
import {
  type Document, type ObjectId, Types, isValidObjectId,
} from 'mongoose';
import ms, { StringValue } from 'ms';
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
  const user = await User.findOne({ email: req.body.email }).select('+password');
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

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshTokenExpiry as StringValue),
      path: '/',
    });

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
  if (!user.password) return next(user);
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

    user.tokens.push({ token: refreshToken });
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms(refreshTokenExpiry as StringValue),
      path: '/',
    });

    return res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      accessToken,
    });
  } catch (err) {
    return next(err);
  }
};

export const logoutUser = async (
  _id: ObjectId,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refresh = req.cookies.refreshToken;
    if (!refresh) return next(new UnauthorizedError('Необходима авторизация'));

    const user = await User.findOne({ _id });
    if (!user) return next(new NotFoundError('Пользователь не найден'));

    if (!user.tokens.some((t) => t.token === refresh)) return next(new UnauthorizedError('Необходима авторизация'));

    user.tokens = user.tokens.filter((t) => t.token !== refresh);
    await user.save();

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: ms('-1s'),
      path: '/',
    });
    return res.send({ success: true });
  } catch (err) {
    return next(err);
  }
};

export const refreshToken = async (
  _id: JwtPayload,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(_id );
    console.log(isValidObjectId(_id));
    if (!isValidObjectId(_id)) return next(new UnauthorizedError('Необходима авторизация'));
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

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.get('Authorization')!);
    const _id = jwt.decode(token);

    const user = await User.findOne({ _id });
    if (!user) return next(new NotFoundError('Пользователь по заданному id отсутствует в базе'));

    return res.send({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (err) {
    return next(err);
  }
};
