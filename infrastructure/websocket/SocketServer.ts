
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { JwtService } from '../security/JwtService';
import { MongoAuctionRepository } from '../repositories/MongoAuctionRepository';

let io: Server | null = null;

export function initializeSocketServer(
    httpServer: HttpServer
): Server {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    });

    const jwtService = new JwtService();
    const auctionRepository = new MongoAuctionRepository();

    // Autenticación antes de permitir la conexión.
    io.use((socket, next) => {
        try {
            const authToken = socket.handshake.auth?.token;
            const authorization =
                socket.handshake.headers.authorization;

            const token =
                typeof authToken === 'string'
                    ? authToken
                    : typeof authorization === 'string' &&
                      authorization.startsWith('Bearer ')
                        ? authorization.slice(7)
                        : undefined;

            if (!token) {
                return next(new Error('Token no proporcionado'));
            }

            const user = jwtService.verifyToken(token);
            socket.data.user = user;

            next();
        } catch {
            next(new Error('Token inválido o expirado'));
        }
    });

    io.on('connection', (socket) => {
        const user = socket.data.user as {
            userId: number;
            email: string;
        };

        // Sala privada del usuario autenticado.
        socket.join(`user:${user.userId}`);

        console.log(
            `Usuario ${user.userId} conectado: ${socket.id}`
        );

        // Suscripción a una subasta existente.
        socket.on('auction:join', async (auctionId: number | string) => {
            const id = Number(auctionId);

            if (!Number.isInteger(id) || id <= 0) {
                socket.emit('auction:error', {
                    message: 'ID de subasta inválido'
                });
                return;
            }

            try {
                const auction = await auctionRepository.getById(id);

                if (!auction) {
                    socket.emit('auction:error', {
                        message: 'La subasta no existe'
                    });
                    return;
                }

                await socket.join(`auction:${id}`);

                socket.emit('auction:joined', {
                    auctionId: id
                });

                console.log(
                    `Usuario ${user.userId} ingresó a la subasta ${id}`
                );
            } catch (error) {
                console.error(
                    'Error al consultar la subasta:',
                    error
                );

                socket.emit('auction:error', {
                    message: 'No fue posible suscribirse a la subasta'
                });
            }
        });

        socket.on('auction:leave', (auctionId: number | string) => {
            const id = Number(auctionId);

            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            socket.leave(`auction:${id}`);
        });

        socket.on('disconnect', () => {
            console.log(
                `Usuario ${user.userId} desconectado`
            );
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error(
            'El servidor Socket.IO no ha sido inicializado'
        );
    }

    return io;
}
