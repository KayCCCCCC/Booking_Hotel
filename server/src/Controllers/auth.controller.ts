import { Request, Response } from 'express';
import User from '../Models/user';
import * as jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import * as bcrypt from "bcryptjs"
export const AuthController = {
    login: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User Not Found" })
            }
            const isMatch = bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Password is incorrect!" })
            }
            const token = await jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN as string)

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000 // 1 day
            });

            res.status(200).json({ userId: user.id })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },

    validateToken: async (req: Request, res: Response) => {
        try {
            res.status(200).send({ userId: req.userId })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    }
}