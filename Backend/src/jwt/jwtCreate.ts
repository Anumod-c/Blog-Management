import jwt from 'jsonwebtoken';
import config from '../infrastructure/config/config';
import { userPayload } from '../domain/entities/IUser';

export const generateToken = (user: userPayload) => {

    const payload = {
        id: user.id,
        email: user.email,
    }

    const options = {
        expiresIn: '15min'
    }

    const accessToken = jwt.sign(payload, config.JWT_SECRET as string, options);
    const refreshToken = jwt.sign(payload, config.JWT_SECRET as string, { expiresIn: '7d' });
    return { accessToken, refreshToken}
}