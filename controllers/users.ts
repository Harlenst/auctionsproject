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
            new CreateUser(
                userRepository
            );

        // RN-22: correo único.
        const user =
            createUser.execute(
                userRepository.getAll().length + 1,
                name,
                email,
                password
            );

        console.log(
            'Usuario registrado:',
            user.id
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
            code: 'USER_REGISTRATION_ERROR',
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
            new LoginUser(
                userRepository
            );

        // RNF-16: las contraseñas no se almacenan en texto plano.
        const user =
            loginUser.execute(
                email,
                password
            );

        console.log(
            'Inicio de sesión exitoso:',
            user.id
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
            code: 'INVALID_CREDENTIALS',
            message: error instanceof Error
                ? error.message
                : 'Correo electrónico o contraseña incorrectos'
        });
    }
};