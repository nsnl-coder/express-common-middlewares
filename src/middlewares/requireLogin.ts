import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

const jwt = require('jsonwebtoken');

interface RequestWithUser extends Request {
  user?: any;
}

const requireLogin = (User: Model<any>) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const jwtToken = req.cookies?.jwt;

    if (!jwtToken) {
      return res.status(401).json({
        status: 'fail',
        message:
          'You are not logged in! Please logged in to perform the action',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.log('add JWT_SECRET to your .env file');
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'Cant find an user belongs to provided token',
      });
    }

    if (user.passwordChangedAt) {
      const duration =
        Number(new Date(decoded.iat * 1000)) -
        Number(new Date(user.passwordChangedAt));

      const isTokenExpired = duration < 0;
      if (isTokenExpired) {
        return res.status(400).json({
          status: 'fail',
          message: 'You recently changed password, please login again!',
        });
      }
    }

    if (!user.isVerified) {
      return res.status(401).json({
        status: 'fail',
        message: 'Please verified your email to complete this action!',
      });
    }

    req.user = user;
    next();
  };
};

export default requireLogin;
