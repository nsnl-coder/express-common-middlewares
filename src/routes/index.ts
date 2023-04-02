import express from 'express';
import requireLogin from '../middlewares/requireLogin';
import requireRole from '../middlewares/requireRole';
import checkIdExistence from '../middlewares/checkIdExistence';
import { User } from '../models/userModel';

const router = express.Router();

// add friend
router.use(
  '/check-id-existence',
  checkIdExistence(User, 'friends'),
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

export default router;
