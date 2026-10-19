
import { pbkdf2Sync } from 'crypto';

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

    execute(email: string, password: string) {
        const user = this.repository.getByEmail(email);

        if (user === undefined) {
            throw new HttpError(
                401,
                'INVALID_CREDENTIALS',
                'Correo electrónico o contraseña incorrectos'
            );
        }

        const parts = user.password.split(':');
        const salt = parts[0];
        const storedHash = parts[1];

        const passwordHash = pbkdf2Sync(
            password,
            salt,
            100000,
            64,
            'sha512'
        ).toString('hex');

        if (passwordHash !== storedHash) {
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

        return {
            user,
            token
        };
    }
}
