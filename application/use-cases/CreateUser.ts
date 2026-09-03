import {
    randomBytes,
    pbkdf2Sync
} from 'crypto';

import { User } from '../../domain/entities/User';
import { UserRepository } from '../ports/UserRepository';

export class CreateUser {

    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    execute(
        id: number,
        name: string,
        email: string,
        password: string
    ): User {

        const existingUser = this.repository.getByEmail(email);

        if (existingUser !== undefined) {
            throw new Error(
                'El correo electrónico ya está registrado'
            );
        }

        const salt = randomBytes(16).toString('hex');

        const passwordHash = pbkdf2Sync(
            password,
            salt,
            100000,
            64,
            'sha512'
        ).toString('hex');

        const passwordStored = `${salt}:${passwordHash}`;

        const user = new User(
            id,
            name,
            email,
            passwordStored
        );

        this.repository.save(user);

        return user;
    }
}