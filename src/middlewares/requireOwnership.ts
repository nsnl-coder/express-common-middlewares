import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

/**
 * allow to check if document with id = req.params.id actually owned by logged in user
 */
declare module 'express' {
  interface Request {
    document?: any;
  }
}

const requireOwnership = (Model: Model<any>, res?: any) => {
  if (res) {
    res.status(500).json({
      status: 'fail',
      message: 'Dont forget to call requireLogin with user model',
    });
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      console.log(':id does not exist! You should only use this in /:id route');
    }

    if (!req.user) {
      console.log('you need to use requireLogin first');
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const document = await Model.findById(id).select('createdBy');

    if (!document) {
      return res.status(404).json({
        status: 'fail',
        message: 'Can not find document with provided id params',
      });
    }

    if (!document.createdBy) {
      return res.status(400).json({
        status: 'fail',
        message:
          'Can not read createdBy field in the document! Did you pass in wrong model?',
      });
    }

    if (!document.createdBy.equals(req.user.id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

export default requireOwnership;
