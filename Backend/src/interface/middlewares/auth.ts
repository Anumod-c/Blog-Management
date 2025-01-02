import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../infrastructure/config/config";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ success: false, message: 'Access denied, token not found' });
            return;
        }

        jwt.verify(token,config.JWT_SECRET  as string, (err, decode) => {
            if (err) {
                res.status(401).json({ success: false, message: 'Invalid token' });
                return;
            } else {
                console.log(decode, '-----------jwt decoded data')
                next();
            }
        })
    } catch (error) {
        console.error('Error in authMiddle:', error);
        res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
    }
}

export default authMiddleware