import express from 'express';
import requireLogin from '../middlewares/requireLogin';
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

router.use('/require-login', requireLogin(User), (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'pass the test' });
});

export default router;
