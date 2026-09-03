import { Request, Response } from 'express';

import { CreateUser } from '../application/use-cases/CreateUser';
import { LoginUser } from '../application/use-cases/LoginUser';

import { InMemoryUserRepository } from '../infrastructure/repositories/InMemoryUserRepository';

const userRepository =
    new InMemoryUserRepository();

export const registerUser = (
    request: Request,
    response: Response
): void => {

    const {
        name,
        email,
        password
    } = request.body;

    try {

        const createUser =
            new CreateUser(userRepository);

        const user = createUser.execute(
            userRepository.getAll().length + 1,
            name,
            email,
            password
        );

        response.status(201).json({
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email.getValue()
            }
        });

    } catch (error) {

        response.status(400).json({
            ok: false,
            message: error instanceof Error
                ? error.message
                : 'No fue posible registrar el usuario'
        });
    }
};

export const loginUser = (
    request: Request,
    response: Response
): void => {

    const {
        email,
        password
    } = request.body;

    try {

        const loginUser =
            new LoginUser(userRepository);

        const user = loginUser.execute(
            email,
            password
        );

        response.status(200).json({
            ok: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email.getValue()
            }
        });

    } catch (error) {

        response.status(401).json({
            ok: false,
            message: error instanceof Error
                ? error.message
                : 'Correo electrónico o contraseña incorrectos'
        });
    }
};