import { NextFunction, Request, Response } from 'express';

const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.log('Please user requireLogin before requireRole!');
    }

    if (roles.length === 0) {
      console.log('Please call requireRole with defined roles!');
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

export default requireRole;
