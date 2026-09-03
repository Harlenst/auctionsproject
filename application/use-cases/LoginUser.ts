import {
    pbkdf2Sync
} from 'crypto';

import { UserRepository } from '../ports/UserRepository';

export class LoginUser {

    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    execute(
        email: string,
        password: string
    ) {

        const user = this.repository.getByEmail(email);

        if (user === undefined) {
            throw new Error(
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
            throw new Error(
                'Correo electrónico o contraseña incorrectos'
            );
        }

        return user;
    }
}