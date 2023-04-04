import express from 'express';
import requireLogin from '../middlewares/requireLogin';
import requireRole from '../middlewares/requireRole';
import checkIdExistence from '../middlewares/checkIdExistence';
import requireOwnership from '../middlewares/requireOwnership';
import { User } from '../models/userModel';
import { Post } from '../models/postModel';

const router = express.Router();

// add friend
router.use(
  '/check-id-existence',
  checkIdExistence('friends', User),
  (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'pass the test' });
  },
);

// require login
router.use('/require-login', requireLogin(User), (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'pass the test' });
});

// require role
router.use(
  '/require-role',
  requireLogin(User),
  requireRole('admin'),
  (req, res, next) => {
    res.status(200).json({ status: 'success', message: 'pass the test' });
  },
);

// require role
router.use('/global-error-handler', (req, res, next) => {
  throw new Error('just a normal error message');
});

// require owner ship
router.delete(
  '/posts/:id',
  requireLogin(User),
  requireOwnership(Post),
  (req, res, next) => {
    res.status(200).json({
      status: 'success',
    });
  },
);

export default router;
