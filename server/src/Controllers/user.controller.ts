import { Request, Response } from 'express';
import User from '../Models/user';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const userController = {
    register: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ message: "User already exists!" });
            }

            user = new User({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                isAdmin: false
            });

            await user.save();

            const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN as string, {
                expiresIn: "1d"
            });

            res.cookie("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 86400000 // 1 day
            });

            // Send a success response
            return res.status(201).json({ message: "Register User Success!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    getInfo: async (req: Request, res: Response) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId).select("-password")
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                })
            }
            res.json(user)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    }
}
