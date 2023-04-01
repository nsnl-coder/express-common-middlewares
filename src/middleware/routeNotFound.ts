import { Request, Response, NextFunction } from 'express';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: 'This route is not defined',
  });
};

export default routeNotFound;
