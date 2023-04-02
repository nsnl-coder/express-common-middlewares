import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

/**
 * express middleware to make sure an object id exists in database
 * this middleware accept mongoose model & field name that contain objectid
 */
const checkIdExistence = (One: Model<any>, fieldname: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ids = req.body[fieldname];

    if (!ids) next();
    if (Array.isArray(ids) && ids.length === 0) next();

    if (typeof ids === 'string') {
      const data = await One.findById(ids);

      if (!data) {
        return res.status(404).json({
          status: 'fail',
          message: `Can not find ${fieldname} with provided id`,
        });
      }
      next();
      return;
    }

    if (Array.isArray(ids)) {
      const matchedDocuments = await One.count({
        _id: { $in: ids },
      });

      if (matchedDocuments !== ids.length) {
        return res.status(404).json({
          status: 'fail',
          message: `Can not find ${fieldname} with provided ids`,
        });
      }

      next();
      return;
    }

    res.status(500).json({
      status: 'fail',
      message: 'something went wrong',
    });
  };
};

export default checkIdExistence;
