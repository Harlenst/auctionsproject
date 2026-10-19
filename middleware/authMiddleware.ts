
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../infrastructure/security/JwtService';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

const jwtService = new JwtService();

export const authMiddleware = (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
): void => {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        response.status(401).json({
            ok: false,
            code: 'UNAUTHORIZED',
            message: 'Debes iniciar sesión para realizar esta operación'
        });
        return;
    }

    const token = authorization.slice(7);

    try {
        request.user = jwtService.verifyToken(token);
        next();
    } catch {
        response.status(401).json({
            ok: false,
            code: 'INVALID_TOKEN',
            message: 'El token es inválido o ha expirado'
        });
    }
};
