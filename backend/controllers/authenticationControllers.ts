import dotenv from 'dotenv';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Request, Response } from "express";

import User, { IUser } from "../models/users";

dotenv.config();

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, name, password }: { email: string, name: string, password: string } = req.body;

    const checkEmail = await User.findOne({ email });
    if (checkEmail) return res.status(409).json({ msg: 'Email already exists!' });

    const encryptedPassword = await bcrypt.hash(password, 15)

    const newUser = await User.create({
      email,
      name,
      password: encryptedPassword,
    })
    const user = newUser.toObject()

    const token = jwt.sign({ _id: newUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
    res.cookie("text-post-access-token", token, {
      secure: true,
      httpOnly: true
    })
    return res.status(201).json({
      token, user: {
        ...user,
        password: ""
      }
    })
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}

export async function loginUser(req: Request, res: Response) {
  console.log("Here inside login user")
  try {
    const { email, password }: { email: string, password: string } = req.body;
    const checkUser = await User.findOne({ email })

    if (!checkUser) return res.status(404).json({ msg: 'User doesn`t exists!' });
    if (!checkUser.password) return res.status(405).json({ msg: 'Try another method' });
    if (!(await bcrypt.compare(password, checkUser.password))) return res.status(406).json({ msg: 'Wrong password!' });

    const token = jwt.sign({ _id: checkUser._id.toString(), email }, process.env.TOKEN_KEY || 'zhingalala', { expiresIn: '2h' })
    res.cookie("text-post-access-token", token, {
      secure: true,
      httpOnly: true
    })
    return res.status(202).json({ token, user: { ...checkUser.toObject(), password: "" } })
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    res.cookie("text-post-access-token", null)
    return res.status(200).json({ msg: 'Sucessfull!' })
  } catch (err) {
    return res.status(500).json({ msg: 'Some internal error occured', err })
  }
}