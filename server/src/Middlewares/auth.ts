import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

// config request add userId
declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized!" })
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string)
        req.userId = (decoded as JwtPayload).userId;
        next();
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}
