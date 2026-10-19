
import jwt, { SignOptions } from 'jsonwebtoken';

interface AuthPayload {
    userId: number;
    email: string;
}

export class JwtService {
    private readonly secret: string;

    constructor() {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                'La variable JWT_SECRET no está configurada'
            );
        }

        this.secret = secret;
    }

    generateToken(payload: AuthPayload): string {
        const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];

        return jwt.sign(payload, this.secret, {
            expiresIn
        });
    }

    verifyToken(token: string): AuthPayload {
        const decoded = jwt.verify(token, this.secret);

        if (
            typeof decoded === 'string' ||
            typeof decoded.userId !== 'number' ||
            typeof decoded.email !== 'string'
        ) {
            throw new Error('Token inválido');
        }

        return {
            userId: decoded.userId,
            email: decoded.email
        };
    }
}
