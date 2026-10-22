
import { pbkdf2Sync, timingSafeEqual } from 'crypto';

import { UserRepository } from '../ports/UserRepository';
import { JwtService } from '../../infrastructure/security/JwtService';
import { HttpError } from '../errors/HttpError';

export class LoginUser {
    private repository: UserRepository;
    private jwtService: JwtService;

    constructor(
        repository: UserRepository,
        jwtService: JwtService
    ) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    async execute(
        email: string,
        password: string
    ): Promise<{ user: import('../../domain/entities/User').User; token: string }> {
        const user = await this.repository.getByEmail(email);

        if (user === undefined) {
            throw new HttpError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos'
            );
        }

        const parts = user.password.split(':');

        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            throw new HttpError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos'
            );
        }

        const [salt, storedHash] = parts;

        const passwordHash = pbkdf2Sync(
            password,
            salt,
            100000,
            64,
            'sha512'
        );

        const expectedHash = Buffer.from(storedHash, 'hex');

        if (
            expectedHash.length !== passwordHash.length ||
            !timingSafeEqual(passwordHash, expectedHash)
        ) {
            throw new HttpError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos'
            );
        }

        const token = this.jwtService.generateToken({
            userId: user.id,
            email: user.email.getValue()
        });

        return { user, token };
    }
}
