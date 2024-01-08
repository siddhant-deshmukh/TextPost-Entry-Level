import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator';
import express, { NextFunction, Request, Response } from 'express'

import auth from '../middleware/auth'
import User, { IUser } from '../models/users';
import validate from '../middleware/validate';

dotenv.config();

var router = express.Router();

/* GET home page. */
router.get('/', auth, function (req: Request, res: Response, next: NextFunction) {
  return res.status(201).json({ user: res.user });
});
router.post('/', auth, function (req: Request, res: Response, next: NextFunction) {
  res.send({ title: 'This is for GoogleForm' });
});

router.post('/register',
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }).toLowerCase().trim(),
  body('name').exists().isString().isLength({ max: 50, min: 1 }).toLowerCase().trim(),
  body('password').exists().isString().isLength({ max: 30, min: 5 }).trim(),
  validate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password }: { email: string, name: string, password: string } = req.body;
      
      const checkEmail = await User.findOne({ email });
      if (checkEmail) return res.status(409).json({ msg: 'Email already exists!' });
      
      const encryptedPassword = await bcrypt.hash(password, 15)

      const newUser: IUser = await User.create({
        email,
        name,
        password: encryptedPassword,
      })

      const token = jwt.sign({ _id: newUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
      res.cookie("GoogleFormClone_acesstoken", token)
      return res.status(201).json({ token })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  }
);

router.post('/login-password',
  body('email').exists().isEmail().isLength({ max: 50, min: 3 }),
  body('password').exists().isString().isLength({ max: 30, min: 5 }),
  validate,
  async function (req: Request, res: Response, next: NextFunction) {
    const { email, password }: { email: string, password: string } = req.body;
    const checkUser = await User.findOne({ email });

    if (!checkUser) return res.status(404).json({ msg: 'User doesn`t exists!' });
    if (!checkUser.password) return res.status(405).json({ msg: 'Try another method' });
    if (!(await bcrypt.compare(password, checkUser.password))) return res.status(406).json({ msg: 'Wrong password!' });

    const token = jwt.sign({ _id: checkUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
    res.cookie("GoogleFormClone_acesstoken", token)
    return res.status(201).json({ token })
  }
);

router.get('/logout', async function (req: Request, res: Response, next: NextFunction) {
  try {
    res.cookie("GoogleFormClone_acesstoken", null)
    return res.status(201).json({ msg: 'Sucessfull!' })
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
})

export default router