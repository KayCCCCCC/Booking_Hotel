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
            const token = await jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN as string)

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
            const user = await User.findById(req.userId)
            if (user) {
                res.status(200).send({ userId: user._id, isAdmin: user.isAdmin })
            } else {
                res.status(400).send({ message: "User Not Found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    logOut: async (req: Request, res: Response) => {
        try {
            res.cookie("auth_token", "", {
                expires: new Date(0)
            })
            res.send()
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    }
}