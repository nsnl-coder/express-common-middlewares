// handle required field missing && handle cast error

import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.status || 400;
  if (process.env.NODE_ENV === 'development') {
    res.status(400).json(error);
    return;
  }

  let formarttedError = 'Something wentwrong';

  if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError' ||
    error.name === 'CastError'
  ) {
    formarttedError = error.message;
  }

  if (formarttedError === 'Something wentwrong') {
    console.log(error);
  }

  res.status(statusCode).json({ status: 'fail', message: formarttedError });
};

export default globalErrorHandler;
