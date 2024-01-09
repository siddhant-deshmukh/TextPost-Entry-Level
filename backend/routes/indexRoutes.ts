import { body } from 'express-validator';
import express, { NextFunction, Request, Response } from 'express'

import auth from '../middleware/auth'
import validate from '../middleware/validate';
import { loginUser, logoutUser, registerUser } from '../controllers/authenticationControllers';


var router = express.Router();

/* GET home page. */
router.get('/', auth, function (req: Request, res: Response, next: NextFunction) {
  return res.status(200).json({ user: res.user });
});
router.post('/', auth, function (req: Request, res: Response, next: NextFunction) {
  res.send({ title: 'This is for GoogleForm' });
});

router.post('/register',
  body('name').exists().isString().isLength({ max: 50, min: 1 }).trim(),
  body('password').exists().isString().isLength({ max: 30, min: 5 }).trim(),
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }).toLowerCase().trim(),
  validate,
  registerUser
);

router.post('/login',
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }),
  body('password').exists().isString().isLength({ max: 30, min: 5 }),
  validate,
  loginUser
);

router.get('/logout', logoutUser)

export default router