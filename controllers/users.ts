
import { Request, Response } from 'express';

import { HttpError } from '../application/errors/HttpError';
import { JwtService } from '../infrastructure/security/JwtService';
import { CreateUser } from '../application/use-cases/CreateUser';
import { LoginUser } from '../application/use-cases/LoginUser';
import { InMemoryUserRepository } from '../infrastructure/repositories/InMemoryUserRepository';

const userRepository = new InMemoryUserRepository();

export const registerUser = (
    request: Request,
    response: Response
): void => {
    const { name, email, password } = request.body;

    try {
        const createUser = new CreateUser(userRepository);

        const user = createUser.execute(
            name,
            email,
            password
        );

        console.log('Usuario registrado:', user.id);

        response.status(201).json({
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email.getValue()
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new HttpError(
                400,
                'USER_REGISTRATION_ERROR',
                error.message
            );
        }

        throw error;
    }
};

export const loginUser = (
    request: Request,
    response: Response
): void => {
    const { email, password } = request.body;

    const jwtService = new JwtService();
    const loginUserUseCase = new LoginUser(
        userRepository,
        jwtService
    );

    const { user, token } = loginUserUseCase.execute(
        email,
        password
    );

    console.log('Inicio de sesión exitoso:', user.id);

    response.status(200).json({
        ok: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email.getValue(),
            token
        }
    });
};
